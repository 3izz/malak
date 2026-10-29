"use client";

import Link from "next/link";
import * as React from "react";
import { PenLine } from "lucide-react";
import { DraftArt } from "@/components/site/card-art";
import { FlowNav, StepIntro } from "@/components/site/flow-nav";
import { Segmented, Notice } from "@/components/malak/controls";
import { CATEGORIES, FONTS, FRAMES, LAYOUTS, PALETTES } from "@/lib/data";
import { useApp } from "@/lib/store";
import { cn } from "@/lib/utils";

function Sprig() {
  return (
    <svg viewBox="0 0 140 60" className="h-auto w-[120px] md:w-[160px]" aria-hidden>
      <path d="M4 54C40 44 80 26 136 6" fill="none" stroke="#6b5a3e" strokeWidth="1.2" />
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <g key={i} transform={`translate(${18 + i * 20} ${48 - i * 8}) rotate(${-24 + i * 2})`} fill="#8a7a56" opacity=".85">
          <path d="M0 0c6-8 14-9 18-6-4 6-11 8-18 6z" /><path d="M0 0c-2-9 2-16 7-18 1 7-2 14-7 18z" />
        </g>
      ))}
    </svg>
  );
}

export default function PreviewPage() {
  const { t, draft, kind, template, inviteDesign, bizDesign, reach } = useApp();
  const [mode, setMode] = React.useState<"flat" | "mockup">("flat");
  React.useEffect(() => reach(4), [reach]);
  const c = CATEGORIES.find((x) => x.id === (template?.category ?? draft.category));
  const pal = PALETTES.find((p) => p.id === (kind === "invite" ? inviteDesign.palette : bizDesign.palette));

  const rows: [string, string][] = [
    [t("النوع", "Type"), c ? t(c.name.ar, c.name.en) : "—"],
    [t("التصميم", "Design"), template ? t(template.name.ar, template.name.en) : "—"],
    [t("اللغة", "Language"), draft.cardLang === "ar" ? t("عربي", "Arabic") : draft.cardLang === "en" ? t("إنجليزي", "English") : t("ثنائي اللغة", "Bilingual")],
    [t("لون الورق", "Paper colour"), pal ? t(pal.name.ar, pal.name.en) : "—"],
    kind === "invite"
      ? [t("الخط والإطار", "Type & frame"), `${t(FONTS.find((f) => f.id === inviteDesign.font)!.name.ar, FONTS.find((f) => f.id === inviteDesign.font)!.name.en)} · ${t(FRAMES.find((f) => f.id === inviteDesign.frame)!.name.ar, FRAMES.find((f) => f.id === inviteDesign.frame)!.name.en)}`]
      : [t("التخطيط", "Layout"), t(LAYOUTS.find((l) => l.id === bizDesign.layout)!.name.ar, LAYOUTS.find((l) => l.id === bizDesign.layout)!.name.en)],
  ];

  return (
    <div className="container py-8 md:py-12">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <StepIntro eyebrow={t("الخطوة ٤", "Step 4")} title={t("راجع المعاينة", "Review your proof")} sub={t("دقّق الأسماء والتاريخ والقاعة. العلامة المائية لا تظهر على النسخة النهائية.", "Check names, date and venue. The watermark does not appear on the final card.")} />
        <Segmented label={t("طريقة العرض", "View")} value={mode} onChange={(v) => setMode(v as "flat" | "mockup")}
          options={[{ value: "flat", label: t("التصميم مسطّح", "Flat artwork") }, { value: "mockup", label: t("على الطاولة", "On the table") }]} />
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_340px]">
        <div className={cn("relative grid min-h-[480px] place-items-center overflow-hidden rounded border border-border transition-colors duration-500 md:min-h-[640px]",
          mode === "flat" ? "bg-muted/50" : "bg-[#cfc5b6] dark:bg-[#3a352f]")}>
          {mode === "flat" ? (
            <div key="flat" className="animate-fade-up w-[min(80vw,340px)] py-8" style={kind === "business" ? { width: "min(90vw, 520px)" } : undefined}>
              <DraftArt width="fill" watermark tilt={false} />
            </div>
          ) : (
            <div key="mock" className="grain absolute inset-0 animate-fade-up" style={{ backgroundColor: "transparent" }}>
              <div className="absolute inset-0 grid place-items-center [perspective:1600px]">
                <div className="relative [transform:rotateX(18deg)] [transform-style:preserve-3d]">
                  {kind === "invite" ? (
                    <>
                      <div className="absolute -start-24 top-16 hidden rotate-[-12deg] opacity-95 md:block"><DraftArt width={220} tilt={false} /></div>
                      <DraftArt width={260} envelope watermark />
                    </>
                  ) : (
                    <div className="relative">
                      <div className="absolute start-6 top-6 rotate-[8deg]"><DraftArt width={320} tilt={false} /></div>
                      <div className="relative rotate-[-4deg]"><DraftArt width={320} watermark /></div>
                    </div>
                  )}
                </div>
              </div>
              <div className="absolute bottom-6 end-6 rotate-[-8deg]"><Sprig /></div>
              <div className="absolute start-0 top-10 h-3 w-40 rotate-[-4deg] bg-[#b48a7d]/70 dark:bg-[#8a6a5e]/70" aria-hidden />
            </div>
          )}
        </div>

        <aside className="space-y-5">
          <div className="rounded border border-border bg-card p-5">
            <h2 className="font-semibold">{t("ملخّص التصميم", "Design summary")}</h2>
            <dl className="mt-4 divide-y divide-border text-[14px]">
              {rows.map(([k, v]) => (
                <div key={k} className="flex justify-between gap-4 py-2.5"><dt className="text-subtle">{k}</dt><dd className="text-end font-medium">{v}</dd></div>
              ))}
            </dl>
            <Link href="/design/customize/" className="mk-btn mk-btn-secondary mk-btn-sm mt-4"><PenLine size={15} /><span>{t("رجوع للتعديل", "Edit design")}</span></Link>
          </div>
          <Notice tone="info">{t("ستعتمد النسخة النهائية قبل إتمام الطلب — لا شيء يُطبع بدون موافقتك.", "You'll approve the final proof at checkout — nothing prints without your sign-off.")}</Notice>
        </aside>
      </div>
      <FlowNav back="/design/customize/" next="/design/print/" nextLabel={t("خيارات الطباعة", "Print options")} />
    </div>
  );
}
