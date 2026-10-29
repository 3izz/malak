"use client";

import * as React from "react";
import { Check, CircleCheck, RotateCcw, Undo2 } from "lucide-react";
import { DraftArt } from "@/components/site/card-art";
import { Chip } from "@/components/site/ui";
import { FlowNav } from "@/components/site/flow-nav";
import { Checkbox, Field, Segmented } from "@/components/malak/controls";
import {
  BizContent, CardLang, DEMO_DATE, FONTS, FRAMES, InviteContent, LAYOUTS, PALETTES, TEMPLATES,
  sampleBiz, sampleInvite,
} from "@/lib/data";
import { Draft, useApp } from "@/lib/store";
import { cn } from "@/lib/utils";

type Snap = Pick<Draft, "invite" | "biz" | "inviteDesign" | "bizDesign" | "cardLang">;
type Tab = "content" | "details" | "style";

export default function CustomizePage() {
  const { t, lang, draft, update, template, kind, inviteDesign, bizDesign, chooseTemplate, reach } = useApp();
  const [tab, setTab] = React.useState<Tab>("content");
  const [history, setHistory] = React.useState<Snap[]>([]);
  const lastPush = React.useRef(0);
  const [saving, setSaving] = React.useState(false);

  // Arriving without a template (e.g. a deep link): use the most chosen design of the category.
  React.useEffect(() => {
    if (!draft.templateId) {
      const first = TEMPLATES.filter((x) => !draft.category || x.category === draft.category).sort((a, b) => b.popular - a.popular)[0];
      chooseTemplate(first.id);
    }
    reach(3);
  }, [draft.templateId, draft.category, chooseTemplate, reach]);

  const snap = (): Snap => ({ invite: draft.invite, biz: draft.biz, inviteDesign: draft.inviteDesign, bizDesign: draft.bizDesign, cardLang: draft.cardLang });
  const change = (patch: Partial<Draft>) => {
    const now = Date.now();
    if (now - lastPush.current > 700) setHistory((h) => [...h.slice(-29), snap()]);
    lastPush.current = now;
    update(patch);
    setSaving(true);
  };
  React.useEffect(() => { if (!saving) return; const id = setTimeout(() => setSaving(false), 650); return () => clearTimeout(id); }, [saving, draft.savedAt]);

  const undo = () => setHistory((h) => { if (!h.length) return h; update(h[h.length - 1]); return h.slice(0, -1); });
  const restore = () => {
    setHistory((h) => [...h, snap()]);
    update({ invite: sampleInvite(draft.category ?? template?.category), biz: sampleBiz(), inviteDesign: template?.invite, bizDesign: template?.biz });
  };

  const inv = draft.invite, biz = draft.biz;
  const setInv = (p: Partial<InviteContent>) => change({ invite: { ...inv, ...p } });
  const setInvL = (l: "ar" | "en", p: Partial<InviteContent["ar"]>) => change({ invite: { ...inv, [l]: { ...inv[l], ...p } } });
  const setBiz = (p: Partial<BizContent>) => change({ biz: { ...biz, ...p } });
  const setBizL = (l: "ar" | "en", p: Partial<BizContent["ar"]>) => change({ biz: { ...biz, [l]: { ...biz[l], ...p } } });

  const showAr = draft.cardLang !== "en", showEn = draft.cardLang !== "ar";
  const single = kind === "invite" && !sampleInvite(draft.category).ar.nameB;
  const savedTime = draft.savedAt ? new Date(draft.savedAt).toLocaleTimeString(lang === "ar" ? "ar-JO" : "en-GB", { hour: "numeric", minute: "2-digit" }) : "";

  const langBlock = (l: "ar" | "en") => (
    <div key={l} className="space-y-4" lang={l} dir={l === "ar" ? "rtl" : "ltr"}>
      {draft.cardLang === "both" && <p className="mk-eyebrow">{l === "ar" ? "النص العربي" : "English text"}</p>}
      {kind === "invite" ? (
        <>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label={single ? (l === "ar" ? "الاسم" : "Name") : (l === "ar" ? "اسم العريس" : "Groom’s name")} value={inv[l].nameA} onChange={(e) => setInvL(l, { nameA: e.target.value })} />
            {!single && <Field label={l === "ar" ? "اسم العروس" : "Bride’s name"} value={inv[l].nameB} onChange={(e) => setInvL(l, { nameB: e.target.value })} />}
          </div>
          <Field multiline label={l === "ar" ? "نص الدعوة" : "Invitation wording"} value={inv[l].message} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInvL(l, { message: e.target.value })}
            hint={l === "ar" ? "سطر أو سطرين يكفوا." : "One or two lines reads best."} />
        </>
      ) : (
        <>
          <Field label={l === "ar" ? "الاسم" : "Name"} value={biz[l].name} onChange={(e) => setBizL(l, { name: e.target.value })} />
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label={l === "ar" ? "المسمّى الوظيفي" : "Job title"} value={biz[l].title} onChange={(e) => setBizL(l, { title: e.target.value })} />
            <Field label={l === "ar" ? "الشركة" : "Company"} value={biz[l].company} onChange={(e) => setBizL(l, { company: e.target.value })} />
          </div>
        </>
      )}
    </div>
  );

  const allowed: CardLang[] = template?.languages ?? ["ar", "en", "both"];
  const content = (
    <div className="space-y-6">
      <div className="space-y-2">
        <p className="text-[13px] font-semibold">{t("لغة البطاقة", "Card language")}</p>
        <Segmented label={t("لغة البطاقة", "Card language")} value={draft.cardLang} onChange={(v) => change({ cardLang: v as CardLang })}
          options={allowed.map((v) => ({ value: v, label: v === "ar" ? t("عربي", "Arabic") : v === "en" ? t("إنجليزي", "English") : t("ثنائي اللغة", "Bilingual") }))} />
      </div>
      {showAr && langBlock("ar")}
      {showEn && langBlock("en")}
    </div>
  );

  const details = kind === "invite" ? (
    <div className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field type="date" label={t("التاريخ", "Date")} value={inv.date} onChange={(e) => setInv({ date: e.target.value })} dir="ltr"
          hint={inv.date === DEMO_DATE ? t("تاريخ تجريبي — غيّره لتاريخ مناسبتك.", "Demo date — change it to yours.") : undefined} />
        <Field type="time" label={t("الوقت", "Time")} value={inv.time} onChange={(e) => setInv({ time: e.target.value })} dir="ltr" />
      </div>
      {showAr && <div className="grid gap-4 sm:grid-cols-2" lang="ar" dir="rtl">
        <Field label="القاعة" value={inv.ar.venue} onChange={(e) => setInvL("ar", { venue: e.target.value })} />
        <Field label="العنوان" value={inv.ar.address} onChange={(e) => setInvL("ar", { address: e.target.value })} />
      </div>}
      {showEn && <div className="grid gap-4 sm:grid-cols-2" lang="en" dir="ltr">
        <Field label="Venue" value={inv.en.venue} onChange={(e) => setInvL("en", { venue: e.target.value })} />
        <Field label="Address" value={inv.en.address} onChange={(e) => setInvL("en", { address: e.target.value })} />
      </div>}
      <Checkbox label={t("إظهار رمز QR لموقع القاعة (رمز توضيحي في النموذج)", "Show a location QR code (illustrative in this prototype)")} checked={inv.qr} onChange={(e) => setInv({ qr: e.target.checked })} />
    </div>
  ) : (
    <div className="space-y-4" dir="ltr">
      <Field label={t("الهاتف", "Phone")} value={biz.phone} inputMode="tel" onChange={(e) => setBiz({ phone: e.target.value })} />
      <Field label={t("البريد الإلكتروني", "Email")} type="email" value={biz.email} onChange={(e) => setBiz({ email: e.target.value })} />
      <Field label={t("الموقع الإلكتروني", "Website")} value={biz.website} onChange={(e) => setBiz({ website: e.target.value })} />
    </div>
  );

  const style = (
    <div className="space-y-6">
      {kind === "invite" && (
        <fieldset>
          <legend className="mb-2 text-[13px] font-semibold">{t("الخط", "Typeface")}</legend>
          <div className="grid grid-cols-3 gap-2">
            {FONTS.map((f) => (
              <button key={f.id} onClick={() => change({ inviteDesign: { ...inviteDesign, font: f.id } })} aria-pressed={inviteDesign.font === f.id}
                className={cn("focus-ring rounded-xs border bg-card px-2 py-3 text-center transition-colors", inviteDesign.font === f.id ? "border-primary bg-primary-soft" : "border-border-strong hover:border-foreground")}>
                <span className={cn("block text-[20px] leading-8", f.id === "ruqaa" ? "font-ruqaa" : f.id === "amiri" ? "font-amiri" : "font-display")} lang={f.id === "garamond" ? "en" : "ar"}>{f.id === "garamond" ? "Aa" : "أب"}</span>
                <span className="text-[12px] text-subtle">{t(f.name.ar, f.name.en)}</span>
              </button>
            ))}
          </div>
        </fieldset>
      )}
      <fieldset>
        <legend className="mb-2 text-[13px] font-semibold">{t("لون الورق", "Paper colour")}</legend>
        <div className="flex flex-wrap gap-2">
          {PALETTES.map((p) => {
            const cur = kind === "invite" ? inviteDesign.palette : bizDesign.palette;
            return (
              <button key={p.id} onClick={() => change(kind === "invite" ? { inviteDesign: { ...inviteDesign, palette: p.id } } : { bizDesign: { ...bizDesign, palette: p.id } })}
                aria-pressed={cur === p.id} aria-label={t(p.name.ar, p.name.en)} title={t(p.name.ar, p.name.en)}
                className={cn("focus-ring relative grid h-12 w-12 place-items-center rounded-xs border transition-transform hover:-translate-y-0.5", cur === p.id ? "border-primary ring-1 ring-primary" : "border-border-strong")}
                style={{ background: p.swatch }}>
                <span className="h-3 w-3 rotate-45 rounded-[1px]" style={{ background: p.ink }} />
                {cur === p.id && <Check size={14} className="absolute -end-1.5 -top-1.5 rounded-xs bg-primary p-0.5 text-primary-foreground" />}
              </button>
            );
          })}
        </div>
      </fieldset>
      <fieldset>
        <legend className="mb-2 text-[13px] font-semibold">{kind === "invite" ? t("الإطار والزخرفة", "Frame & ornament") : t("التخطيط", "Layout")}</legend>
        <div className="flex flex-wrap gap-2">
          {kind === "invite"
            ? FRAMES.map((f) => <Chip key={f.id} selected={inviteDesign.frame === f.id} onClick={() => change({ inviteDesign: { ...inviteDesign, frame: f.id } })}>{t(f.name.ar, f.name.en)}</Chip>)
            : LAYOUTS.map((f) => <Chip key={f.id} selected={bizDesign.layout === f.id} onClick={() => change({ bizDesign: { ...bizDesign, layout: f.id } })}>{t(f.name.ar, f.name.en)}</Chip>)}
        </div>
      </fieldset>
    </div>
  );

  const tabs: { id: Tab; ar: string; en: string }[] = [
    { id: "content", ar: "النص", en: "Text" }, { id: "details", ar: kind === "invite" ? "الموعد والمكان" : "التواصل", en: kind === "invite" ? "When & where" : "Contact" }, { id: "style", ar: "الشكل", en: "Look" },
  ];

  return (
    <div className="container py-6 md:py-10">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="mk-eyebrow">{t("الخطوة ٣", "Step 3")}</p>
          <h1 className="mt-1 text-[24px] font-semibold md:text-[30px]">{t("خصّص البطاقة", "Customize your card")} <span className="text-subtle">· {template ? t(template.name.ar, template.name.en) : ""}</span></h1>
        </div>
        <div className="flex w-full flex-wrap items-center gap-1 sm:w-auto">
          <span className="me-auto flex basis-full items-center gap-1.5 py-1 text-[12px] text-subtle sm:me-2 sm:basis-auto" aria-live="polite">
            <CircleCheck size={15} className={saving ? "animate-pulse text-subtle" : "text-success"} />
            {saving ? t("جارٍ الحفظ…", "Saving…") : savedTime ? t(`المسودة محفوظة على هذا الجهاز · ${savedTime}`, `Draft saved on this device · ${savedTime}`) : t("المسودة تُحفظ تلقائيًا", "Drafts save automatically")}
          </span>
          <button onClick={undo} disabled={!history.length} className="mk-btn mk-btn-ghost mk-btn-sm"><Undo2 size={16} /><span>{t("تراجع", "Undo")}</span></button>
          <button onClick={restore} className="mk-btn mk-btn-ghost mk-btn-sm"><RotateCcw size={16} /><span>{t("استعادة النموذج", "Restore sample")}</span></button>
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(380px,460px)_1fr] lg:gap-10">
        {/* Preview: first on phones, end column on desktop */}
        <div className="order-first lg:order-last">
          <div className="grain grid min-h-[300px] place-items-center rounded border border-border bg-muted/50 px-2 py-6 md:min-h-[560px] lg:sticky lg:top-24">
            <div className="w-[min(62vw,260px)] md:w-[360px]" style={kind === "business" ? { width: "min(92vw, 460px)" } : undefined}>
              <DraftArt width="fill" />
            </div>
            <p className="mt-4 text-center text-[12px] text-subtle">{t("حرّك المؤشر فوق البطاقة لرؤية الملمس", "Move over the card to see the paper catch the light")}</p>
          </div>
        </div>

        <div>
          <div role="tablist" aria-label={t("أقسام التحرير", "Editor sections")} className="grid grid-cols-3 border-b border-border">
            {tabs.map((x) => (
              <button key={x.id} role="tab" id={"tab-" + x.id} aria-selected={tab === x.id} aria-controls={"panel-" + x.id} onClick={() => setTab(x.id)}
                className={cn("focus-ring relative min-h-[48px] px-2 text-[14px] transition-colors", tab === x.id ? "font-semibold text-foreground" : "text-subtle hover:text-foreground")}>
                {t(x.ar, x.en)}
                <span className={cn("absolute inset-x-3 -bottom-px h-[2px] bg-primary transition-transform duration-300", tab === x.id ? "scale-x-100" : "scale-x-0")} />
              </button>
            ))}
          </div>
          <div role="tabpanel" id={"panel-" + tab} aria-labelledby={"tab-" + tab} key={tab} className="animate-fade-up pt-6">
            {tab === "content" ? content : tab === "details" ? details : style}
          </div>
        </div>
      </div>

      <FlowNav back="/design/template/" next="/design/preview/" nextLabel={t("المعاينة", "Preview")} />
    </div>
  );
}
