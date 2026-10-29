"use client";

import * as React from "react";
import { Check, Printer, Smartphone } from "lucide-react";
import { DraftArt } from "@/components/site/card-art";
import { Chip } from "@/components/site/ui";
import { FlowNav, StepIntro } from "@/components/site/flow-nav";
import { PriceSummary } from "@/components/site/price-summary";
import { EInviteSettings, OrderExplainer } from "@/components/einvite/einvite-settings";
import { PRICING, PrintChoice } from "@/lib/price";
import { useApp } from "@/lib/store";
import { cn, jod } from "@/lib/utils";

export default function PrintPage() {
  const { t, lang, kind, print, update, reach } = useApp();
  React.useEffect(() => reach(5), [reach]);
  const P = PRICING[kind];
  const set = (p: Partial<PrintChoice>) => update({ print: { ...print, ...p } });

  const Option = ({ group, id, name, extra }: { group: "paper" | "finish" | "envelope"; id: string; name: string; extra: number }) => {
    const on = print[group] === id;
    return (
      <button type="button" role="radio" aria-checked={on} onClick={() => set({ [group]: id } as Partial<PrintChoice>)}
        className={cn("focus-ring flex min-h-[56px] items-center justify-between gap-3 rounded-xs border bg-card px-4 text-start transition-colors", on ? "border-primary bg-primary-soft" : "border-border-strong hover:border-foreground")}>
        <span className="flex items-center gap-3">
          <span className={cn("grid h-5 w-5 place-items-center rounded-full border", on ? "border-primary bg-primary text-primary-foreground" : "border-border-strong")}>{on && <Check size={12} strokeWidth={3} />}</span>
          <span className="font-medium">{name}</span>
        </span>
        <span className="font-mono text-[12px] text-subtle">{extra ? `+${jod(extra, lang)} ${t("للبطاقة", "/card")}` : t("مشمول", "included")}</span>
      </button>
    );
  };

  return (
    <div className="container py-8 md:py-12">
      {kind === "invite"
        ? <StepIntro eyebrow={t("الخطوة ٥", "Step 5")} title={t("الطباعة والدعوة الإلكترونية", "Print & e-invitation")} sub={t("اختر إذا بدك بطاقات مطبوعة توصلك لبيتك — وبكل الحالات بتوصلك دعوة إلكترونية بأغنية تبعتها لضيوفك.", "Choose whether you want printed cards delivered — either way you get an e-invitation with a song to send to guests.")} />
        : <StepIntro eyebrow={t("الخطوة ٥", "Step 5")} title={t("اختر الطباعة", "Print options")} sub={t("رقمية للمشاركة على واتساب، أو مطبوعة على ورق فاخر وتوصل لبيتك.", "Digital to share on WhatsApp, or printed on fine stock and delivered.")} />}
      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_360px]">
        <div className="space-y-8">
          <div role="radiogroup" aria-label={t("طريقة التسليم", "Delivery")} className="grid gap-3 sm:grid-cols-2">
            {(kind === "invite" ? [
              { v: "print", icon: Printer, ar: ["مطبوعة + دعوة إلكترونية", "بطاقات على ورق فاخر بتوصلك لبيتك، ومعها دعوة إلكترونية بأغنية — مجانًا."], en: ["Printed + e-invitation", "Cards on fine paper delivered to you, plus an e-invitation with a song — free."] },
              { v: "digital", icon: Smartphone, ar: ["دعوة إلكترونية فقط", `بدون طباعة: رابط دعوة بأغنية تبعته على واتساب — ${jod(P.digital, "ar")}.`], en: ["E-invitation only", `No printing: an invitation link with a song for WhatsApp — ${jod(P.digital, "en")}.`] },
            ] as const : [
              { v: "print", icon: Printer, ar: ["مطبوعة", "ورق، لمسات نهائية وأظرف، توصيل داخل الأردن."], en: ["Printed", "Paper, finishes and envelopes, delivered in Jordan."] },
              { v: "digital", icon: Smartphone, ar: ["رقمية", `صورة عالية الدقة ورابط للمشاركة — ${jod(P.digital, "ar")}.`], en: ["Digital", `High-res image and a share link — ${jod(P.digital, "en")}.`] },
            ] as const).map((d) => {
              const on = print.delivery === d.v;
              return (
                <button key={d.v} role="radio" aria-checked={on} onClick={() => set({ delivery: d.v })}
                  className={cn("focus-ring group flex gap-4 rounded border p-5 text-start transition-colors", on ? "border-primary bg-primary-soft" : "border-border-strong bg-card hover:border-foreground")}>
                  <d.icon size={24} strokeWidth={1.5} className={cn("shrink-0 transition-transform duration-300 group-hover:-translate-y-0.5", on ? "text-primary" : "text-foil")} />
                  <span><span className="block font-semibold">{lang === "ar" ? d.ar[0] : d.en[0]}</span><span className="mt-1 block text-[14px] leading-6 text-subtle">{lang === "ar" ? d.ar[1] : d.en[1]}</span></span>
                </button>
              );
            })}
          </div>

          {kind === "invite" && <OrderExplainer digital={print.delivery === "digital"} />}

          {print.delivery === "print" ? (
            <div className="animate-fade-up space-y-8">
              <fieldset>
                <legend className="mb-3 font-semibold">{t("الكمية", "Quantity")}</legend>
                <div className="flex flex-wrap gap-2">{P.qty.map((q) => <Chip key={q} selected={print.qty === q} onClick={() => set({ qty: q })} className="min-w-[72px] justify-center font-mono">{q}</Chip>)}</div>
              </fieldset>
              <fieldset><legend className="mb-3 font-semibold">{t("الورق", "Paper")}</legend>
                <div role="radiogroup" className="grid gap-2">{P.paper.map((o) => <Option key={o.id} group="paper" id={o.id} name={t(o.name.ar, o.name.en)} extra={o.perCard} />)}</div>
              </fieldset>
              <fieldset><legend className="mb-3 font-semibold">{t("اللمسة النهائية", "Finish")}</legend>
                <div role="radiogroup" className="grid gap-2">{P.finish.map((o) => <Option key={o.id} group="finish" id={o.id} name={t(o.name.ar, o.name.en)} extra={o.perCard} />)}</div>
              </fieldset>
              {kind === "invite" && (
                <fieldset><legend className="mb-3 font-semibold">{t("الظرف", "Envelope")}</legend>
                  <div role="radiogroup" className="grid gap-2 sm:grid-cols-2">{P.envelope.map((o) => <Option key={o.id} group="envelope" id={o.id} name={t(o.name.ar, o.name.en)} extra={o.perCard} />)}</div>
                </fieldset>
              )}
            </div>
          ) : kind === "invite" ? null : (
            <div className="animate-fade-up rounded border border-border bg-card p-6 text-[15px] leading-7 text-subtle">
              {t("بعد الموافقة على النسخة النهائية بتوصلك صورة PNG عالية الدقة ورابط خاص تشاركه مع ضيوفك. (محاكاة في النموذج الأولي)", "Once you approve the proof you get a high-res PNG and a private link to share with guests. (Simulated in this prototype.)")}
            </div>
          )}

          {kind === "invite" && <EInviteSettings digital={print.delivery === "digital"} />}
        </div>
        <aside className="space-y-5 lg:sticky lg:top-24 lg:self-start">
          <div className="hidden place-items-center rounded border border-border bg-muted/50 py-6 lg:grid">
            <div style={{ width: kind === "business" ? 280 : 180 }}><DraftArt width="fill" tilt={false} /></div>
          </div>
          <PriceSummary />
        </aside>
      </div>
      <FlowNav back="/design/preview/" next="/design/checkout/" nextLabel={t("أكمل الطلب", "Checkout")} showPrice />
    </div>
  );
}
