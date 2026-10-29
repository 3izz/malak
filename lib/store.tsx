"use client";

import * as React from "react";
import {
  BizContent, CategoryId, CardLang, InviteContent, Lang, Template, BizDesign, InviteDesign,
  cat, sampleBiz, sampleInvite, tpl, TEMPLATES,
} from "./data";
import { defaultPrint, estimate, PrintChoice } from "./price";
import { EInviteData, EInviteExtras, sampleExtras } from "./einvite";

export interface Draft {
  category?: CategoryId;
  templateId?: string;
  invite: InviteContent;
  biz: BizContent;
  inviteDesign?: InviteDesign;
  bizDesign?: BizDesign;
  cardLang: CardLang;
  print?: PrintChoice;
  /** E-invitation settings (song, contact, map); missing on drafts saved before they existed. */
  einvite?: EInviteExtras;
  reached: number;
  savedAt?: number;
}
export interface Order { number: string; placedAt: number; total: number; contact: { name: string; phone: string; city: string }; payment: string; delivery: string }
interface Persisted { draft: Draft; user: { name: string; id: string } | null; order: Order | null }

const KEY = "malak:prototype:v1";
const freshDraft = (): Draft => ({ invite: sampleInvite("wedding"), biz: sampleBiz(), cardLang: "ar", reached: 1 });

interface Ctx {
  ready: boolean;
  lang: Lang; setLang: (l: Lang) => void;
  t: (ar: string, en: string) => string;
  dark: boolean; setDark: (d: boolean) => void;
  draft: Draft; update: (patch: Partial<Draft> | ((d: Draft) => Partial<Draft>)) => void; resetDraft: () => void;
  template?: Template; kind: "invite" | "business";
  inviteDesign: InviteDesign; bizDesign: BizDesign; print: PrintChoice;
  /** The guest-facing e-invitation built from the current draft. */
  einvite: EInviteData;
  price: ReturnType<typeof estimate>;
  chooseCategory: (c: CategoryId) => void;
  chooseTemplate: (id: string) => void;
  reach: (step: number) => void;
  user: Persisted["user"]; signIn: (name: string, id: string) => void; signOut: () => void;
  order: Order | null; placeOrder: (o: Omit<Order, "number" | "placedAt" | "total">) => Order;
}
const AppCtx = React.createContext<Ctx | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = React.useState(false);
  const [lang, setLangState] = React.useState<Lang>("ar");
  const [dark, setDarkState] = React.useState(false);
  const [state, setState] = React.useState<Persisted>({ draft: freshDraft(), user: null, order: null });

  // Hydrate from the attributes the inline head script already set, then from localStorage.
  React.useEffect(() => {
    const html = document.documentElement;
    setLangState(html.lang === "en" ? "en" : "ar");
    setDarkState(html.classList.contains("dark"));
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const p = JSON.parse(raw) as Persisted;
        setState({ draft: { ...freshDraft(), ...p.draft }, user: p.user ?? null, order: p.order ?? null });
      }
    } catch { /* storage unavailable: run in memory */ }
    setReady(true);
  }, []);

  React.useEffect(() => {
    if (!ready) return;
    try { localStorage.setItem(KEY, JSON.stringify(state)); } catch { /* ignore */ }
  }, [state, ready]);

  const setLang = React.useCallback((l: Lang) => {
    setLangState(l);
    const html = document.documentElement;
    html.lang = l; html.dir = l === "ar" ? "rtl" : "ltr";
    try { localStorage.setItem("malak:lang", l); } catch {}
  }, []);
  const setDark = React.useCallback((d: boolean) => {
    setDarkState(d);
    document.documentElement.classList.toggle("dark", d);
    try { localStorage.setItem("malak:theme", d ? "dark" : "light"); } catch {}
  }, []);
  const t = React.useCallback((ar: string, en: string) => (lang === "ar" ? ar : en), [lang]);

  const update: Ctx["update"] = React.useCallback((patch) => {
    setState((s) => {
      const p = typeof patch === "function" ? patch(s.draft) : patch;
      return { ...s, draft: { ...s.draft, ...p, savedAt: Date.now() } };
    });
  }, []);
  const resetDraft = React.useCallback(() => setState((s) => ({ ...s, draft: freshDraft() })), []);

  const draft = state.draft;
  const template = tpl(draft.templateId);
  const kind = template?.kind ?? cat(draft.category)?.kind ?? "invite";
  const inviteDesign = draft.inviteDesign ?? template?.invite ?? { palette: "ivory", frame: "arch", font: "ruqaa" };
  const bizDesign = draft.bizDesign ?? template?.biz ?? { palette: "midnight", layout: "split" };
  const print = draft.print ?? defaultPrint(kind);
  const price = estimate(kind, print, template?.designFee ?? 0);
  const einvite: EInviteData = {
    category: draft.category ?? template?.category ?? "wedding", lang: draft.cardLang, design: inviteDesign, content: draft.invite,
    extras: draft.einvite ?? sampleExtras(draft.cardLang),
  };

  const chooseCategory = React.useCallback((c: CategoryId) => {
    update((d) => {
      const same = d.category === c;
      return {
        category: c,
        templateId: same ? d.templateId : undefined,
        invite: same ? d.invite : sampleInvite(c),
        inviteDesign: same ? d.inviteDesign : undefined, bizDesign: same ? d.bizDesign : undefined,
        print: same ? d.print : undefined,
        reached: Math.max(d.reached, 2),
      };
    });
  }, [update]);
  const chooseTemplate = React.useCallback((id: string) => {
    const tp = tpl(id) ?? TEMPLATES[0];
    update((d) => ({
      templateId: tp.id, category: tp.category, inviteDesign: tp.invite, bizDesign: tp.biz,
      cardLang: tp.languages.includes(d.cardLang) ? d.cardLang : tp.languages[0],
      invite: d.category === tp.category ? d.invite : sampleInvite(tp.category),
      print: d.category === tp.category ? d.print : undefined,
      reached: Math.max(d.reached, 3),
    }));
  }, [update]);
  const reach = React.useCallback((step: number) => {
    setState((s) => (s.draft.reached >= step ? s : { ...s, draft: { ...s.draft, reached: step } }));
  }, []);

  const signIn = React.useCallback((name: string, id: string) => setState((s) => ({ ...s, user: { name, id } })), []);
  const signOut = React.useCallback(() => setState((s) => ({ ...s, user: null })), []);
  const placeOrder: Ctx["placeOrder"] = React.useCallback((o) => {
    const order: Order = { ...o, number: "MLK-" + Math.floor(100000 + Math.random() * 899999), placedAt: Date.now(), total: price.total };
    setState((s) => ({ ...s, order }));
    return order;
  }, [price.total]);

  const value: Ctx = {
    ready, lang, setLang, t, dark, setDark, draft, update, resetDraft, template, kind,
    inviteDesign, bizDesign, print, einvite, price, chooseCategory, chooseTemplate, reach,
    user: state.user, signIn, signOut, order: state.order, placeOrder,
  };
  return <AppCtx.Provider value={value}>{children}</AppCtx.Provider>;
}

export function useApp() {
  const c = React.useContext(AppCtx);
  if (!c) throw new Error("useApp must be used inside AppProvider");
  return c;
}

/** Runs before paint: restores language, direction and theme so there is no flash. */
export const BOOT_SCRIPT = `(function(){try{var l=localStorage.getItem('malak:lang')||'ar';var h=document.documentElement;h.lang=l;h.dir=l==='ar'?'rtl':'ltr';var t=localStorage.getItem('malak:theme');if(t==='dark'||(!t&&window.matchMedia('(prefers-color-scheme: dark)').matches))h.classList.add('dark');}catch(e){}try{var h2=document.documentElement;if(!window.matchMedia('(prefers-reduced-motion: reduce)').matches)h2.setAttribute('data-fx','');if(!sessionStorage.getItem('malak:intro'))h2.setAttribute('data-intro','');}catch(e){}})();`;
