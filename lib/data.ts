export type Lang = "ar" | "en";
export type Bi = { ar: string; en: string };
export type CategoryId = "wedding" | "engagement" | "business" | "graduation" | "birthday" | "newborn" | "thankyou";
export type Kind = "invite" | "business";
export type Palette = "ivory" | "blush" | "sage" | "midnight" | "terracotta" | "stone";
export type Frame = "arch" | "double" | "floral" | "geometric" | "none";
export type CardFont = "ruqaa" | "amiri" | "garamond";
export type BizLayout = "split" | "centered" | "band" | "minimal";
export type Style = "classic" | "modern" | "floral" | "minimal" | "geometric";
export type CardLang = "ar" | "en" | "both";

export interface Category { id: CategoryId; kind: Kind; name: Bi; blurb: Bi; primary: boolean; from: number }
export const CATEGORIES: Category[] = [
  { id: "wedding", kind: "invite", primary: true, from: 12, name: { ar: "دعوة زفاف", en: "Wedding invitation" }, blurb: { ar: "بطاقات زفاف مطبوعة على ورق فاخر أو رقمية للواتساب", en: "Printed on fine stock, or digital for WhatsApp" } },
  { id: "engagement", kind: "invite", primary: true, from: 12, name: { ar: "خطوبة وكتب كتاب", en: "Engagement & katb kitab" }, blurb: { ar: "دعوات أنيقة لليلة الخطوبة وكتب الكتاب", en: "Elegant cards for the engagement and katb kitab" } },
  { id: "business", kind: "business", primary: true, from: 6, name: { ar: "بطاقة أعمال", en: "Business card" }, blurb: { ar: "بطاقات عمل ثنائية اللغة بطباعة دقيقة", en: "Bilingual business cards, crisply printed" } },
  { id: "graduation", kind: "invite", primary: false, from: 10, name: { ar: "تخرّج", en: "Graduation" }, blurb: { ar: "احتفل بالإنجاز", en: "Celebrate the milestone" } },
  { id: "birthday", kind: "invite", primary: false, from: 8, name: { ar: "عيد ميلاد", en: "Birthday" }, blurb: { ar: "دعوات مرحة وأنيقة", en: "Playful, still refined" } },
  { id: "newborn", kind: "invite", primary: false, from: 8, name: { ar: "مولود جديد", en: "Newborn" }, blurb: { ar: "أهلًا بالضيف الصغير", en: "Welcome the little one" } },
  { id: "thankyou", kind: "invite", primary: false, from: 6, name: { ar: "بطاقة شكر", en: "Thank-you card" }, blurb: { ar: "كلمة شكر تبقى", en: "Thanks that lasts" } },
];
export const cat = (id?: CategoryId) => CATEGORIES.find((c) => c.id === id);

export interface InviteDesign { palette: Palette; frame: Frame; font: CardFont }
export interface BizDesign { palette: Palette; layout: BizLayout }
export interface Template {
  id: string; category: CategoryId; kind: Kind; name: Bi; style: Style; color: Palette;
  languages: CardLang[]; tier: "standard" | "premium"; designFee: number; popular: number;
  invite?: InviteDesign; biz?: BizDesign;
}

const T = (t: Omit<Template, "kind" | "designFee"> & { kind?: Kind }): Template => ({
  kind: t.category === "business" ? "business" : "invite",
  designFee: t.tier === "premium" ? 5 : 0, ...t,
});

export const TEMPLATES: Template[] = [
  T({ id: "w-noor", category: "wedding", name: { ar: "نور", en: "Noor" }, style: "classic", color: "ivory", languages: ["ar", "both"], tier: "standard", popular: 98, invite: { palette: "ivory", frame: "arch", font: "ruqaa" } }),
  T({ id: "w-layali", category: "wedding", name: { ar: "ليالي", en: "Layali" }, style: "geometric", color: "midnight", languages: ["ar", "en", "both"], tier: "premium", popular: 91, invite: { palette: "midnight", frame: "geometric", font: "amiri" } }),
  T({ id: "w-ward", category: "wedding", name: { ar: "ورد", en: "Ward" }, style: "floral", color: "blush", languages: ["ar", "en", "both"], tier: "premium", popular: 88, invite: { palette: "blush", frame: "floral", font: "ruqaa" } }),
  T({ id: "w-zaitoun", category: "wedding", name: { ar: "زيتون", en: "Zaitoun" }, style: "floral", color: "sage", languages: ["ar", "both"], tier: "standard", popular: 80, invite: { palette: "sage", frame: "floral", font: "amiri" } }),
  T({ id: "w-atelier", category: "wedding", name: { ar: "أتيليه", en: "Atelier" }, style: "minimal", color: "stone", languages: ["en", "both"], tier: "standard", popular: 72, invite: { palette: "stone", frame: "none", font: "garamond" } }),
  T({ id: "e-mithaq", category: "engagement", name: { ar: "ميثاق", en: "Mithaq" }, style: "classic", color: "ivory", languages: ["ar", "both"], tier: "standard", popular: 86, invite: { palette: "ivory", frame: "double", font: "amiri" } }),
  T({ id: "e-qamar", category: "engagement", name: { ar: "قمر", en: "Qamar" }, style: "geometric", color: "midnight", languages: ["ar", "en", "both"], tier: "premium", popular: 84, invite: { palette: "midnight", frame: "arch", font: "ruqaa" } }),
  T({ id: "e-hinna", category: "engagement", name: { ar: "حنّة", en: "Hinna" }, style: "modern", color: "terracotta", languages: ["ar", "en"], tier: "standard", popular: 70, invite: { palette: "terracotta", frame: "none", font: "ruqaa" } }),
  T({ id: "g-qubba", category: "graduation", name: { ar: "قبّعة", en: "Cap" }, style: "modern", color: "midnight", languages: ["ar", "en", "both"], tier: "standard", popular: 60, invite: { palette: "midnight", frame: "double", font: "garamond" } }),
  T({ id: "b-shamaa", category: "birthday", name: { ar: "شمعة", en: "Candle" }, style: "modern", color: "terracotta", languages: ["ar", "en"], tier: "standard", popular: 55, invite: { palette: "terracotta", frame: "arch", font: "garamond" } }),
  T({ id: "n-hamsa", category: "newborn", name: { ar: "همسة", en: "Hamsa" }, style: "floral", color: "sage", languages: ["ar", "en", "both"], tier: "standard", popular: 58, invite: { palette: "sage", frame: "arch", font: "amiri" } }),
  T({ id: "t-shukr", category: "thankyou", name: { ar: "شكر", en: "Shukran" }, style: "minimal", color: "blush", languages: ["ar", "en", "both"], tier: "standard", popular: 50, invite: { palette: "blush", frame: "none", font: "ruqaa" } }),
  T({ id: "bz-amman", category: "business", name: { ar: "عمّان", en: "Amman" }, style: "classic", color: "midnight", languages: ["ar", "en", "both"], tier: "premium", popular: 90, biz: { palette: "midnight", layout: "split" } }),
  T({ id: "bz-wadi", category: "business", name: { ar: "وادي", en: "Wadi" }, style: "minimal", color: "ivory", languages: ["en", "both"], tier: "standard", popular: 82, biz: { palette: "ivory", layout: "minimal" } }),
  T({ id: "bz-petra", category: "business", name: { ar: "البترا", en: "Petra" }, style: "modern", color: "terracotta", languages: ["ar", "en", "both"], tier: "standard", popular: 79, biz: { palette: "terracotta", layout: "band" } }),
  T({ id: "bz-dana", category: "business", name: { ar: "ضانا", en: "Dana" }, style: "modern", color: "sage", languages: ["ar", "both"], tier: "standard", popular: 66, biz: { palette: "sage", layout: "centered" } }),
  T({ id: "bz-lulu", category: "business", name: { ar: "لؤلؤ", en: "Lulu" }, style: "classic", color: "stone", languages: ["en", "both"], tier: "premium", popular: 61, biz: { palette: "stone", layout: "split" } }),
  T({ id: "bz-rum", category: "business", name: { ar: "رم", en: "Rum" }, style: "geometric", color: "blush", languages: ["ar", "en"], tier: "standard", popular: 57, biz: { palette: "blush", layout: "centered" } }),
];
export const tpl = (id?: string) => TEMPLATES.find((t) => t.id === id);

export const STYLES: { id: Style; name: Bi }[] = [
  { id: "classic", name: { ar: "كلاسيكي", en: "Classic" } }, { id: "modern", name: { ar: "عصري", en: "Modern" } },
  { id: "floral", name: { ar: "زهري", en: "Floral" } }, { id: "minimal", name: { ar: "بسيط", en: "Minimal" } },
  { id: "geometric", name: { ar: "زخرفة هندسية", en: "Geometric" } },
];
export const PALETTES: { id: Palette; name: Bi; swatch: string; ink: string }[] = [
  { id: "ivory", name: { ar: "عاجي", en: "Ivory" }, swatch: "#fbf8f2", ink: "#8a6327" },
  { id: "blush", name: { ar: "وردي فاتح", en: "Blush" }, swatch: "#ecd3cc", ink: "#7a4b3f" },
  { id: "sage", name: { ar: "زيتي فاتح", en: "Sage" }, swatch: "#c9d3c0", ink: "#4b5a43" },
  { id: "terracotta", name: { ar: "طين", en: "Terracotta" }, swatch: "#e3b9a0", ink: "#7d3b22" },
  { id: "stone", name: { ar: "حجري", en: "Stone" }, swatch: "#e4e1da", ink: "#4d5160" },
  { id: "midnight", name: { ar: "كحلي", en: "Midnight" }, swatch: "#1f2440", ink: "#c9a66b" },
];
export const FRAMES: { id: Frame; name: Bi }[] = [
  { id: "arch", name: { ar: "قوس", en: "Arch" } }, { id: "double", name: { ar: "إطار مزدوج", en: "Double rule" } },
  { id: "floral", name: { ar: "أغصان", en: "Sprigs" } }, { id: "geometric", name: { ar: "نجمة ثمانية", en: "Eight-point" } },
  { id: "none", name: { ar: "بدون", en: "None" } },
];
export const FONTS: { id: CardFont; name: Bi; sample: string }[] = [
  { id: "ruqaa", name: { ar: "رقعة", en: "Ruqaa" }, sample: "محمد و سارة" },
  { id: "amiri", name: { ar: "أميري", en: "Amiri" }, sample: "محمد و سارة" },
  { id: "garamond", name: { ar: "غاراموند", en: "Garamond" }, sample: "Mohammad & Sara" },
];
export const LAYOUTS: { id: BizLayout; name: Bi }[] = [
  { id: "split", name: { ar: "مقسوم", en: "Split" } }, { id: "centered", name: { ar: "متوسّط", en: "Centred" } },
  { id: "band", name: { ar: "شريط", en: "Band" } }, { id: "minimal", name: { ar: "بسيط", en: "Minimal" } },
];

/* ---------- Content ---------- */
export const DEMO_DATE = "2026-06-12";
export interface InviteText { nameA: string; nameB: string; message: string; venue: string; address: string }
export interface InviteContent { ar: InviteText; en: InviteText; date: string; time: string; qr: boolean }
export interface BizContent { ar: { name: string; title: string; company: string }; en: { name: string; title: string; company: string }; phone: string; email: string; website: string }

export function sampleInvite(c: CategoryId = "wedding"): InviteContent {
  const base = { date: DEMO_DATE, time: "20:00", qr: true };
  const venue = { ar: { venue: "قاعة الماسة – عمّان", address: "شارع الملكة رانيا، عمّان" }, en: { venue: "Al Masa Hall – Amman", address: "Queen Rania St, Amman" } };
  const pair = { ar: { nameA: "محمد أحمد", nameB: "سارة خالد" }, en: { nameA: "Mohammad Ahmad", nameB: "Sara Khaled" } };
  const msg: Record<string, Bi> = {
    wedding: { ar: "بكل الحب ندعوكم لمشاركتنا فرحة زفافنا", en: "Together with their families, invite you to celebrate their wedding" },
    engagement: { ar: "يسعدنا حضوركم حفل كتب الكتاب", en: "We would love you to join us for our katb kitab" },
    graduation: { ar: "ندعوكم لمشاركتنا فرحة التخرّج", en: "Please join us to celebrate a graduation" },
    birthday: { ar: "تعالوا نحتفل بعيد الميلاد", en: "Come celebrate a birthday with us" },
    newborn: { ar: "نحمد الله على سلامة المولود ونتشرّف بزيارتكم", en: "Our little one has arrived — come say hello" },
    thankyou: { ar: "شكرًا من القلب لمشاركتكم فرحتنا", en: "Thank you, from our hearts, for sharing our joy" },
  };
  const single: Partial<Record<CategoryId, { ar: string; en: string }>> = {
    graduation: { ar: "لين خالد", en: "Leen Khaled" }, birthday: { ar: "يزن ٧ سنوات", en: "Yazan turns 7" },
    newborn: { ar: "المولود آدم", en: "Baby Adam" },
  };
  const s = single[c];
  const m = msg[c] ?? msg.wedding;
  return {
    ...base,
    ar: { ...(s ? { nameA: s.ar, nameB: "" } : pair.ar), message: m.ar, ...venue.ar },
    en: { ...(s ? { nameA: s.en, nameB: "" } : pair.en), message: m.en, ...venue.en },
  };
}
export const sampleBiz = (): BizContent => ({
  ar: { name: "سارة خالد", title: "مديرة التصميم", company: "استوديو الماسة" },
  en: { name: "Sara Khaled", title: "Design Director", company: "Al Masa Studio" },
  phone: "+962 79 123 4567", email: "sara@almasa.jo", website: "almasa.jo",
});
