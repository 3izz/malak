"use client";

import { useRouter } from "next/navigation";
import * as React from "react";
import { Check } from "lucide-react";
import { TemplateArt } from "@/components/site/card-art";
import { FlowNav, StepIntro } from "@/components/site/flow-nav";
import { CATEGORIES, CategoryId, TEMPLATES } from "@/lib/data";
import { useApp } from "@/lib/store";
import { cn, jod } from "@/lib/utils";

export default function TypePage() {
  const { t, lang, draft, chooseCategory, reach } = useApp();
  const router = useRouter();
  React.useEffect(() => reach(1), [reach]);
  const pick = (c: CategoryId) => { chooseCategory(c); router.push("/design/template/"); };
  const primary = CATEGORIES.filter((c) => c.primary), more = CATEGORIES.filter((c) => !c.primary);

  return (
    <div className="container py-8 md:py-12">
      <StepIntro eyebrow={t("الخطوة ١", "Step 1")} title={t("شو حابب تصمّم؟", "What are you making?")} sub={t("اختر نوع البطاقة، وبنعرض لك التصاميم المناسبة لها.", "Choose a card type and we'll show the designs made for it.")} />
      <div className="mt-8 grid gap-5 md:grid-cols-3">
        {primary.map((c, i) => {
          const sample = TEMPLATES.filter((x) => x.category === c.id);
          const selected = draft.category === c.id;
          return (
            <button key={c.id} onClick={() => pick(c.id)} aria-pressed={selected}
              className={cn("focus-ring group relative flex flex-col overflow-hidden rounded border bg-card text-start transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg animate-fade-up",
                selected ? "border-primary" : "border-border")} style={{ animationDelay: `${i * 70}ms` }}>
              <div className="relative grid h-[240px] place-items-center overflow-hidden bg-muted/60 md:h-[280px]">
                <div className="absolute transition-transform duration-500 ease-paper ltr:translate-x-6 rtl:-translate-x-6 rotate-6 opacity-90 group-hover:rotate-[10deg]">
                  <TemplateArt template={sample[1] ?? sample[0]} width={c.kind === "business" ? 210 : 130} tilt={false} />
                </div>
                <div className="relative transition-transform duration-500 ease-paper ltr:-translate-x-6 rtl:translate-x-6 -rotate-3 group-hover:-translate-y-2 group-hover:-rotate-6">
                  <TemplateArt template={sample[0]} width={c.kind === "business" ? 220 : 145} tilt={false} />
                </div>
              </div>
              <div className="flex items-end justify-between gap-3 p-5">
                <div>
                  <h2 className="text-[18px] font-semibold">{t(c.name.ar, c.name.en)}</h2>
                  <p className="mt-1 text-[14px] text-subtle">{t(c.blurb.ar, c.blurb.en)}</p>
                </div>
                <span className="shrink-0 font-mono text-[12px] text-subtle">{t("من", "from")} {jod(c.from, lang)}</span>
              </div>
              {selected && <span className="absolute end-3 top-3 grid h-7 w-7 place-items-center rounded-xs bg-primary text-primary-foreground"><Check size={16} /></span>}
            </button>
          );
        })}
      </div>
      <h2 className="mt-12 text-[18px] font-semibold">{t("مناسبات أخرى", "More occasions")}</h2>
      <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4">
        {more.map((c) => (
          <button key={c.id} onClick={() => pick(c.id)} aria-pressed={draft.category === c.id}
            className={cn("focus-ring group flex items-center gap-3 rounded border bg-card p-3 text-start transition-colors hover:border-foreground", draft.category === c.id ? "border-primary" : "border-border")}>
            <div className="h-[70px] w-[50px] shrink-0 overflow-hidden"><div className="origin-top-left scale-[.42] rtl:origin-top-right"><TemplateArt template={TEMPLATES.find((x) => x.category === c.id)!} width={120} tilt={false} /></div></div>
            <div><p className="font-semibold">{t(c.name.ar, c.name.en)}</p><p className="text-[12px] text-subtle">{t(c.blurb.ar, c.blurb.en)}</p></div>
          </button>
        ))}
      </div>
      <FlowNav back="/" next="/design/template/" nextLabel={t("التصاميم", "See designs")} disabled={!draft.category} />
    </div>
  );
}
