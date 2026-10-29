import type { Kind } from "./data";
import type { Bi } from "./data";

/* Illustrative prototype prices in JOD. Replace with the project brief's price list before launch. */
export type Delivery = "digital" | "print";
export interface PrintChoice { delivery: Delivery; qty: number; paper: string; finish: string; envelope: string }

type Opt = { id: string; name: Bi; note?: Bi; perCard: number };
export const PRICING: Record<Kind, { digital: number; qty: number[]; paper: Opt[]; finish: Opt[]; envelope: Opt[] }> = {
  invite: {
    digital: 12,
    qty: [50, 100, 150, 200, 300],
    paper: [
      { id: "smooth", name: { ar: "ناعم ٣٠٠ غم", en: "Smooth 300gsm" }, perCard: 0.45 },
      { id: "linen", name: { ar: "كتّان مُحبّب", en: "Textured linen" }, perCard: 0.6 },
      { id: "cotton", name: { ar: "قطن ٣٥٠ غم", en: "Cotton 350gsm" }, perCard: 0.7 },
    ],
    finish: [
      { id: "matte", name: { ar: "مطفي", en: "Matte" }, perCard: 0 },
      { id: "foil", name: { ar: "تذهيب", en: "Gold foil" }, perCard: 0.3 },
      { id: "emboss", name: { ar: "نقش بارز", en: "Embossed" }, perCard: 0.35 },
    ],
    envelope: [
      { id: "none", name: { ar: "بدون ظرف", en: "No envelope" }, perCard: 0 },
      { id: "kraft", name: { ar: "كرافت", en: "Kraft" }, perCard: 0.1 },
      { id: "ivory", name: { ar: "عاجي", en: "Ivory" }, perCard: 0.12 },
      { id: "lined", name: { ar: "مبطّن", en: "Lined" }, perCard: 0.35 },
    ],
  },
  business: {
    digital: 6,
    qty: [100, 250, 500, 1000],
    paper: [
      { id: "smooth", name: { ar: "ناعم ٣٥٠ غم", en: "Smooth 350gsm" }, perCard: 0.09 },
      { id: "cotton", name: { ar: "قطن ٤٠٠ غم", en: "Cotton 400gsm" }, perCard: 0.14 },
    ],
    finish: [
      { id: "matte", name: { ar: "مطفي", en: "Matte" }, perCard: 0 },
      { id: "foil", name: { ar: "تذهيب", en: "Gold foil" }, perCard: 0.06 },
      { id: "emboss", name: { ar: "نقش بارز", en: "Embossed" }, perCard: 0.08 },
    ],
    envelope: [{ id: "none", name: { ar: "بدون", en: "None" }, perCard: 0 }],
  },
};
export const DELIVERY_FEE = 3;

export function defaultPrint(kind: Kind): PrintChoice {
  const p = PRICING[kind];
  return { delivery: "print", qty: p.qty[1], paper: p.paper[0].id, finish: p.finish[0].id, envelope: p.envelope[kind === "invite" ? 2 : 0].id };
}

export interface Line { label: Bi; amount: number }
export function estimate(kind: Kind, c: PrintChoice, designFee: number) {
  const p = PRICING[kind];
  const lines: Line[] = [];
  if (designFee) lines.push({ label: { ar: "تصميم مميّز", en: "Premium design" }, amount: designFee });
  if (c.delivery === "digital") {
    lines.push(kind === "invite"
      ? { label: { ar: "دعوة إلكترونية بأغنية", en: "E-invitation with song" }, amount: p.digital }
      : { label: { ar: "نسخة رقمية للمشاركة", en: "Digital card for sharing" }, amount: p.digital });
  } else {
    const pick = (list: Opt[], id: string) => list.find((o) => o.id === id) ?? list[0];
    const paper = pick(p.paper, c.paper), finish = pick(p.finish, c.finish), env = pick(p.envelope, c.envelope);
    lines.push({ label: { ar: `طباعة ${c.qty} بطاقة · ${paper.name.ar}`, en: `${c.qty} cards · ${paper.name.en}` }, amount: c.qty * paper.perCard });
    if (finish.perCard) lines.push({ label: { ar: `لمسة: ${finish.name.ar}`, en: `Finish: ${finish.name.en}` }, amount: c.qty * finish.perCard });
    if (env.perCard) lines.push({ label: { ar: `أظرف ${env.name.ar}`, en: `${env.name.en} envelopes` }, amount: c.qty * env.perCard });
    lines.push({ label: { ar: "توصيل داخل الأردن", en: "Delivery within Jordan" }, amount: DELIVERY_FEE });
    // Every printed invitation also gets its e-invitation, at no charge.
    if (kind === "invite") lines.push({ label: { ar: "دعوة إلكترونية بأغنية", en: "E-invitation with song" }, amount: 0 });
  }
  return { lines, total: lines.reduce((s, l) => s + l.amount, 0) };
}
