"use client";

import { useApp } from "@/lib/store";
import { jod } from "@/lib/utils";

export function PriceSummary({ title }: { title?: string }) {
  const { t, lang, price } = useApp();
  return (
    <div className="rounded border border-border bg-card p-5">
      <div className="flex items-baseline justify-between gap-3">
        <h2 className="font-semibold">{title ?? t("التقدير", "Estimate")}</h2>
        <span className="rounded-xs bg-foil-soft px-1.5 py-0.5 text-[11px] font-semibold text-foil">{t("تقدير تجريبي", "Prototype estimate")}</span>
      </div>
      <ul className="mt-4 space-y-2.5 text-[14px]">
        {price.lines.map((l, i) => (
          <li key={i} className="flex justify-between gap-4"><span className="text-subtle">{t(l.label.ar, l.label.en)}</span>{l.amount ? <span className="shrink-0 font-mono">{jod(l.amount, lang)}</span> : <span className="shrink-0 rounded-xs bg-foil-soft px-1.5 text-[12px] font-semibold text-foil">{t("مجانًا", "Free")}</span>}</li>
        ))}
      </ul>
      <div className="mt-4 flex items-baseline justify-between border-t border-border pt-4">
        <span className="font-semibold">{t("المجموع", "Total")}</span>
        <span key={price.total} className="animate-fade-up font-mono text-[22px] font-medium">{jod(price.total, lang)}</span>
      </div>
      <p className="mt-2 text-[12px] leading-5 text-subtle">{t("أسعار توضيحية للنموذج الأولي، قبل اعتماد قائمة الأسعار النهائية.", "Illustrative prototype prices, pending the final price list.")}</p>
    </div>
  );
}
