"use client";

import * as React from "react";
import { Check, Search, SlidersHorizontal, X } from "lucide-react";
import { TemplateArt } from "@/components/site/card-art";
import { Chip } from "@/components/site/ui";
import { FlowNav, StepIntro } from "@/components/site/flow-nav";
import { CATEGORIES, CardLang, CategoryId, PALETTES, Palette, STYLES, Style, TEMPLATES } from "@/lib/data";
import { PRICING } from "@/lib/price";
import { useApp } from "@/lib/store";
import { cn, jod } from "@/lib/utils";

type Sort = "popular" | "price" | "name";

export default function TemplatePage() {
  const { t, lang, draft, chooseTemplate, update, reach } = useApp();
  React.useEffect(() => reach(2), [reach]);
  const [catF, setCatF] = React.useState<CategoryId | "all">("all");
  const [styles, setStyles] = React.useState<Style[]>([]);
  const [colors, setColors] = React.useState<Palette[]>([]);
  const [langF, setLangF] = React.useState<CardLang | "any">("any");
  const [tier, setTier] = React.useState<"any" | "standard" | "premium">("any");
  const [q, setQ] = React.useState("");
  const [sort, setSort] = React.useState<Sort>("popular");
  const [panel, setPanel] = React.useState(false);

  // Start on the category chosen in step 1.
  React.useEffect(() => { if (draft.category) setCatF(draft.category); }, [draft.category]);

  const toggle = <T,>(list: T[], v: T, set: (l: T[]) => void) => set(list.includes(v) ? list.filter((x) => x !== v) : [...list, v]);
  const fromPrice = (id: string) => { const tp = TEMPLATES.find((x) => x.id === id)!; return PRICING[tp.kind].digital + tp.designFee; };

  const list = TEMPLATES.filter((tp) =>
    (catF === "all" || tp.category === catF) &&
    (!styles.length || styles.includes(tp.style)) &&
    (!colors.length || colors.includes(tp.color)) &&
    (langF === "any" || tp.languages.includes(langF)) &&
    (tier === "any" || tp.tier === tier) &&
    (!q.trim() || (tp.name.ar + " " + tp.name.en).toLowerCase().includes(q.trim().toLowerCase())),
  ).sort((a, b) => sort === "popular" ? b.popular - a.popular : sort === "price" ? fromPrice(a.id) - fromPrice(b.id) : t(a.name.ar, a.name.en).localeCompare(t(b.name.ar, b.name.en), lang));

  const active = styles.length + colors.length + (langF !== "any" ? 1 : 0) + (tier !== "any" ? 1 : 0);
  const clear = () => { setStyles([]); setColors([]); setLangF("any"); setTier("any"); setQ(""); };
  const sig = [catF, styles.join(), colors.join(), langF, tier, q, sort].join("|");

  const filters = (
    <div className="space-y-6">
      <fieldset>
        <legend className="mb-2 text-[13px] font-semibold">{t("الأسلوب", "Style")}</legend>
        <div className="flex flex-wrap gap-2">{STYLES.map((s) => <Chip key={s.id} selected={styles.includes(s.id)} onClick={() => toggle(styles, s.id, setStyles)}>{t(s.name.ar, s.name.en)}</Chip>)}</div>
      </fieldset>
      <fieldset>
        <legend className="mb-2 text-[13px] font-semibold">{t("اللون", "Colour")}</legend>
        <div className="flex flex-wrap gap-2">{PALETTES.map((p) => <Chip key={p.id} swatch={p.swatch} selected={colors.includes(p.id)} onClick={() => toggle(colors, p.id, setColors)}>{t(p.name.ar, p.name.en)}</Chip>)}</div>
      </fieldset>
      <fieldset>
        <legend className="mb-2 text-[13px] font-semibold">{t("لغة البطاقة", "Card language")}</legend>
        <div className="flex flex-wrap gap-2">
          {([["any", "الكل", "Any"], ["ar", "عربي", "Arabic"], ["en", "إنجليزي", "English"], ["both", "ثنائي اللغة", "Bilingual"]] as const).map(([v, a, e]) =>
            <Chip key={v} selected={langF === v} onClick={() => setLangF(v)}>{t(a, e)}</Chip>)}
        </div>
      </fieldset>
      <fieldset>
        <legend className="mb-2 text-[13px] font-semibold">{t("فئة السعر", "Price tier")}</legend>
        <div className="flex flex-wrap gap-2">
          {([["any", "الكل", "Any"], ["standard", "أساسي", "Standard"], ["premium", "مميّز (+٥ د.أ)", "Premium (+5 JOD)"]] as const).map(([v, a, e]) =>
            <Chip key={v} selected={tier === v} onClick={() => setTier(v)}>{t(a, e)}</Chip>)}
        </div>
      </fieldset>
      {active > 0 && <button onClick={clear} className="focus-ring text-[13px] font-semibold text-primary underline-offset-4 hover:underline">{t("مسح الفلاتر", "Clear filters")}</button>}
    </div>
  );

  return (
    <div className="container py-8 md:py-12">
      <StepIntro eyebrow={t("الخطوة ٢", "Step 2")} title={t("اختر التصميم", "Choose a design")} sub={t("كل تصميم قابل للتعديل: الأسماء، الألوان، الخط والإطار.", "Every design is editable: names, colours, typeface and frame.")} />

      {/* Category tabs */}
      <div className="-mx-4 mt-8 flex gap-1 overflow-x-auto border-b border-border px-4 md:mx-0 md:px-0" role="tablist" aria-label={t("الفئة", "Category")}>
        {[{ id: "all" as const, name: { ar: "الكل", en: "All" } }, ...CATEGORIES].map((c) => (
          <button key={c.id} role="tab" aria-selected={catF === c.id} onClick={() => setCatF(c.id)}
            className={cn("focus-ring relative shrink-0 px-3 py-3 text-[14px] transition-colors", catF === c.id ? "font-semibold text-foreground" : "text-subtle hover:text-foreground")}>
            {t(c.name.ar, c.name.en)}
            <span className={cn("absolute inset-x-2 -bottom-px h-[2px] bg-primary transition-transform duration-300", catF === c.id ? "scale-x-100" : "scale-x-0")} />
          </button>
        ))}
      </div>

      <div className="mt-6 grid gap-8 lg:grid-cols-[260px_1fr]">
        <aside className="hidden lg:block">{filters}</aside>
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <label className="relative min-w-0 flex-1 basis-56">
              <span className="sr-only">{t("ابحث عن تصميم", "Search designs")}</span>
              <Search size={16} className="pointer-events-none absolute start-3 top-1/2 -translate-y-1/2 text-subtle" />
              <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={t("ابحث بالاسم… مثل «نور»", "Search by name… e.g. “Noor”")}
                className="focus-ring h-11 w-full rounded-sm border border-border-strong bg-card ps-9 pe-3 text-[14px] placeholder:text-subtle" />
            </label>
            <button onClick={() => setPanel(true)} className="mk-btn mk-btn-secondary lg:hidden"><SlidersHorizontal size={16} /><span>{t("الفلاتر", "Filters")}{active ? ` (${active})` : ""}</span></button>
            <label className="flex items-center gap-2 text-[13px] text-subtle">
              {t("ترتيب", "Sort")}
              <select value={sort} onChange={(e) => setSort(e.target.value as Sort)} className="focus-ring h-11 rounded-sm border border-border-strong bg-card px-2 text-[14px] text-foreground">
                <option value="popular">{t("الأكثر طلبًا", "Most chosen")}</option>
                <option value="price">{t("السعر: الأقل أولًا", "Price: low to high")}</option>
                <option value="name">{t("الاسم", "Name")}</option>
              </select>
            </label>
          </div>
          <p className="mt-4 text-[13px] text-subtle" aria-live="polite">{t(`${list.length} تصميم`, `${list.length} designs`)}</p>

          {list.length === 0 ? (
            <div className="mt-6 rounded border border-dashed border-border-strong p-10 text-center">
              <p className="font-semibold">{t("ما في تصاميم بهالفلاتر", "No designs match these filters")}</p>
              <button onClick={clear} className="mk-btn mk-btn-secondary mt-4">{t("مسح الفلاتر", "Clear filters")}</button>
            </div>
          ) : (
            <ul key={sig} className="mt-4 grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 xl:grid-cols-4">
              {list.map((tp, i) => {
                const selected = draft.templateId === tp.id;
                const c = CATEGORIES.find((x) => x.id === tp.category)!;
                return (
                  <li key={tp.id} className="animate-fade-up" style={{ animationDelay: `${Math.min(i, 8) * 45}ms` }}>
                    <button onClick={() => { chooseTemplate(tp.id); }} aria-pressed={selected}
                      className="focus-ring group block w-full rounded text-start">
                      <div className={cn("relative grid aspect-[4/5] place-items-center overflow-hidden rounded border bg-muted/50 transition-colors group-hover:bg-muted", selected ? "border-primary ring-1 ring-primary" : "border-transparent")}>
                        <div className="w-[78%] transition-transform duration-500 ease-paper group-hover:-translate-y-1" style={tp.kind === "business" ? { width: "88%" } : { width: "62%" }}>
                          <TemplateArt template={tp} width="fill" tilt={false} />
                        </div>
                        {selected && <span className="absolute end-2 top-2 grid h-7 w-7 place-items-center rounded-xs bg-primary text-primary-foreground"><Check size={16} /></span>}
                        {tp.tier === "premium" && <span className="absolute start-2 top-2 rounded-xs bg-foil-soft px-1.5 py-0.5 text-[11px] font-semibold text-foil">{t("مميّز", "Premium")}</span>}
                      </div>
                      <div className="mt-3 flex items-baseline justify-between gap-2">
                        <span className="font-semibold">{t(tp.name.ar, tp.name.en)}</span>
                        <span className="font-mono text-[12px] text-subtle">{t("من", "from")} {jod(fromPrice(tp.id), lang)}</span>
                      </div>
                      <p className="text-[12px] text-subtle">{t(c.name.ar, c.name.en)} · {tp.languages.map((l) => l === "ar" ? t("عربي", "AR") : l === "en" ? t("إنجليزي", "EN") : t("ثنائي", "AR/EN")).join(" · ")}</p>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>

      {/* Mobile filter sheet */}
      <div className={cn("fixed inset-0 z-50 overflow-hidden lg:hidden", panel ? "visible" : "invisible")}>
        <div className={cn("absolute inset-0 bg-black/40 transition-opacity", panel ? "opacity-100" : "opacity-0")} onClick={() => setPanel(false)} />
        <div role="dialog" aria-modal="true" aria-label={t("الفلاتر", "Filters")}
          className={cn("absolute inset-x-0 bottom-0 max-h-[85vh] overflow-y-auto rounded-t border-t border-border bg-background p-5 shadow-lg transition-transform duration-300", panel ? "translate-y-0" : "translate-y-full")}>
          <div className="mb-5 flex items-center justify-between">
            <p className="text-[18px] font-semibold">{t("الفلاتر", "Filters")}</p>
            <button onClick={() => setPanel(false)} className="focus-ring grid h-10 w-10 place-items-center rounded-sm" aria-label={t("إغلاق", "Close")}><X size={20} /></button>
          </div>
          {filters}
          <button onClick={() => setPanel(false)} className="mk-btn mk-btn-primary mk-btn-full mt-6">{t(`عرض ${list.length} تصميم`, `Show ${list.length} designs`)}</button>
        </div>
      </div>

      <FlowNav back="/design/type/" next="/design/customize/" disabled={!draft.templateId} nextLabel={t("خصّص البطاقة", "Customize")} />
    </div>
  );
}
