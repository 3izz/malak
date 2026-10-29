import { CardLang, CategoryId, CATEGORIES, FRAMES, FONTS, InviteContent, InviteDesign, PALETTES, sampleInvite } from "./data";

/** Extras that only the e-invitation needs (the printed card doesn't show them). */
export interface EInviteExtras { music: boolean; contactName: string; contactPhone: string; mapUrl: string }
/** Everything a guest's e-invitation page needs. It travels inside the share link, so the site needs no server. */
export interface EInviteData { category: CategoryId; lang: CardLang; design: InviteDesign; content: InviteContent; extras: EInviteExtras }

export const SONG_SRC = `${process.env.NEXT_PUBLIC_BASE_PATH || ""}/audio/zaffa.mp3`;

/** Placeholder contact for demos and new drafts; the names across the sample invitation are fictional. */
export const sampleExtras = (lang: CardLang = "ar"): EInviteExtras => ({
  music: true, contactName: lang === "en" ? "Ahmad" : "أحمد", contactPhone: "+962 79 123 4567", mapUrl: "",
});
/** The demo is always ~40 days away so its countdown is live. */
export const sampleEInvite = (): EInviteData => {
  const d = new Date(Date.now() + 40 * 864e5);
  const date = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  return { category: "wedding", lang: "ar", design: { palette: "ivory", frame: "arch", font: "ruqaa" }, content: { ...sampleInvite("wedding"), date }, extras: sampleExtras() };
};
/** True when the event date is already behind us (e.g. a draft still on the sample date). */
export const isPast = (d: EInviteData) => eventStart(d).getTime() < Date.now();

/* ---------- share link: base64url(JSON) in the URL hash ---------- */

const b64 = (s: string) => {
  let bin = "";
  new TextEncoder().encode(s).forEach((b) => { bin += String.fromCharCode(b); });
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
};
const unb64 = (s: string) => new TextDecoder().decode(Uint8Array.from(atob(s.replace(/-/g, "+").replace(/_/g, "/")), (c) => c.charCodeAt(0)));

export function encodeEInvite(d: EInviteData) {
  const txt = (l: "ar" | "en") => { const x = d.content[l]; return [x.nameA, x.nameB, x.message, x.venue, x.address]; };
  return b64(JSON.stringify({
    v: 1, k: d.category, l: d.lang, d: [d.design.palette, d.design.frame, d.design.font], dt: d.content.date, tm: d.content.time,
    ...(d.lang !== "en" && { a: txt("ar") }), ...(d.lang !== "ar" && { e: txt("en") }),
    m: d.extras.music ? 1 : 0, cn: d.extras.contactName, cp: d.extras.contactPhone, mp: d.extras.mapUrl,
  }));
}

const str = (v: unknown, max = 200) => (typeof v === "string" ? v.slice(0, max) : "");
const oneOf = <T extends string>(v: unknown, list: readonly T[], fallback: T): T => (list.includes(v as T) ? (v as T) : fallback);

/** Parses a share-link payload. Anything malformed falls back to the sample; links are only kept if they are https. */
export function decodeEInvite(hash: string): EInviteData | null {
  try {
    const o = JSON.parse(unb64(hash));
    const base = sampleEInvite();
    const category = oneOf(o.k, CATEGORIES.map((c) => c.id), "wedding");
    const lang = oneOf<CardLang>(o.l, ["ar", "en", "both"], "ar");
    const sample = sampleInvite(category);
    const txt = (arr: unknown): InviteContent["ar"] => {
      const a = Array.isArray(arr) ? arr : [];
      return { nameA: str(a[0], 80), nameB: str(a[1], 80), message: str(a[2], 240), venue: str(a[3], 120), address: str(a[4], 160) };
    };
    const d = Array.isArray(o.d) ? o.d : [];
    const date = /^\d{4}-\d{2}-\d{2}$/.test(o.dt) ? o.dt : sample.date;
    const time = /^\d{2}:\d{2}$/.test(o.tm) ? o.tm : sample.time;
    const map = str(o.mp, 500);
    return {
      category, lang,
      design: {
        palette: oneOf(d[0], PALETTES.map((p) => p.id), base.design.palette),
        frame: oneOf(d[1], FRAMES.map((f) => f.id), base.design.frame),
        font: oneOf(d[2], FONTS.map((f) => f.id), base.design.font),
      },
      content: { date, time, qr: false, ar: o.a ? txt(o.a) : sample.ar, en: o.e ? txt(o.e) : sample.en },
      extras: {
        music: o.m !== 0, contactName: str(o.cn, 60),
        contactPhone: str(o.cp, 24).replace(/[^\d+\s-]/g, ""),
        mapUrl: /^https:\/\//i.test(map) ? map : "",
      },
    };
  } catch {
    return null;
  }
}

export const inviteLink = (d: EInviteData) =>
  `${window.location.origin}${process.env.NEXT_PUBLIC_BASE_PATH || ""}/invite/#${encodeEInvite(d)}`;

/* ---------- helpers for the guest page ---------- */

export const EVENT_TITLE: Record<CategoryId, { ar: string; en: string }> = {
  wedding: { ar: "حفل زفاف", en: "Wedding celebration" },
  engagement: { ar: "حفل خطوبة وكتب كتاب", en: "Engagement & katb kitab" },
  graduation: { ar: "حفل تخرّج", en: "Graduation party" },
  birthday: { ar: "عيد ميلاد", en: "Birthday party" },
  newborn: { ar: "استقبال المولود", en: "Welcoming the baby" },
  thankyou: { ar: "شكر وامتنان", en: "With thanks" },
  business: { ar: "دعوة", en: "Invitation" },
};

export const mapsUrl = (d: EInviteData, l: "ar" | "en") =>
  d.extras.mapUrl || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${d.content[l].venue} ${d.content[l].address}`.trim())}`;

/** Local event start; the page shows the countdown in the guest's own clock, which is fine for a prototype. */
export const eventStart = (d: EInviteData) => {
  const [y, m, day] = d.content.date.split("-").map(Number);
  const [h, min] = (d.content.time || "20:00").split(":").map(Number);
  return new Date(y, m - 1, day, h, min);
};

export function calendarUrl(d: EInviteData, l: "ar" | "en") {
  const s = eventStart(d), e = new Date(s.getTime() + 3 * 3600_000);
  const f = (x: Date) => `${x.getFullYear()}${String(x.getMonth() + 1).padStart(2, "0")}${String(x.getDate()).padStart(2, "0")}T${String(x.getHours()).padStart(2, "0")}${String(x.getMinutes()).padStart(2, "0")}00`;
  const c = d.content[l];
  const title = `${EVENT_TITLE[d.category][l]} — ${[c.nameA, c.nameB].filter(Boolean).join(l === "ar" ? " و " : " & ")}`;
  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&dates=${f(s)}/${f(e)}&ctz=Asia/Amman&location=${encodeURIComponent(`${c.venue} ${c.address}`.trim())}`;
}

/** Jordanian numbers to wa.me form: 07X… / 7X… / +9627X… → 9627X… */
export function waNumber(phone: string) {
  let n = phone.replace(/\D/g, "");
  if (n.startsWith("00")) n = n.slice(2);
  if (n.startsWith("0")) n = "962" + n.slice(1);
  else if (n.length === 9 && n.startsWith("7")) n = "962" + n;
  return n;
}
