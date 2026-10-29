"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Eye, Hourglass, MapPin, Music2, Phone, ShieldCheck, Truck, Wallet, Sparkles } from "lucide-react";
import { Header } from "@/components/site/header";
import { Footer } from "@/components/site/footer";
import { ButtonLink, Eyebrow, Section } from "@/components/site/ui";
import { TemplateArt } from "@/components/site/card-art";
import { HowStory } from "@/components/site/how-story";
import { PhoneMock } from "@/components/einvite/einvite";
import { EInviteData, sampleEInvite } from "@/lib/einvite";
import { CountUp, Reveal, RevealWords, SmoothScroll, VelocityRibbon, easeOut, onScrollFrame, progressOf, span, useScrollVar } from "@/components/site/scroll-fx";
import { InvitationCard } from "@/components/malak/invitation-card";
import { BusinessCard } from "@/components/malak/business-card";
import { useReducedMotion } from "@/components/malak/motion";
import { CATEGORIES, CategoryId, TEMPLATES, Template, sampleBiz, sampleInvite, tpl } from "@/lib/data";
import { PRICING } from "@/lib/price";
import { useApp } from "@/lib/store";
import { jod } from "@/lib/utils";

function HeroArt() {
  const reduce = useReducedMotion();
  const ref = React.useRef<HTMLDivElement>(null);
  const move = (e: React.PointerEvent) => {
    if (reduce || e.pointerType === "touch" || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    ref.current.style.setProperty("--px", ((e.clientX - r.left) / r.width - 0.5).toFixed(3));
    ref.current.style.setProperty("--py", ((e.clientY - r.top) / r.height - 0.5).toFixed(3));
  };
  const reset = () => { ref.current?.style.setProperty("--px", "0"); ref.current?.style.setProperty("--py", "0"); };
  const layer = (depth: number, base: string): React.CSSProperties => ({
    transform: `${base} translate3d(calc(var(--px, 0) * ${depth}px), calc(var(--py, 0) * ${depth}px), 0)`,
    transition: "transform 700ms cubic-bezier(0.2, 0.8, 0.2, 1.05)",
  });
  // Three nested layers per card: scroll exit (fx-fly-*), load entrance (fx-deal-in), pointer parallax (layer()).
  return (
    <div ref={ref} onPointerMove={move} onPointerLeave={reset} className="relative mx-auto h-[420px] w-full max-w-[520px] select-none sm:h-[520px]" aria-hidden>
      <div className="fx-fly-back absolute start-[2%] top-[6%] hidden sm:block">
        <div className="fx-deal-in" style={{ ["--d" as string]: "250ms" }}>
          <div style={layer(-14, "rotate(-9deg)")}>
            <InvitationCard content={sampleInvite("engagement")} design={{ palette: "midnight", frame: "geometric", font: "amiri" }} lang="ar" width={210} tilt={false} />
          </div>
        </div>
      </div>
      <div className="fx-fly-main absolute inset-x-0 top-[2%] flex origin-top scale-[.84] justify-center sm:scale-100">
        <div className="fx-deal-in" style={{ ["--d" as string]: "80ms" }}>
          <div style={layer(22, "")}>
            <InvitationCard content={sampleInvite("wedding")} design={{ palette: "ivory", frame: "arch", font: "ruqaa" }} lang="ar" width={240} envelope tilt />
          </div>
        </div>
      </div>
      <div className="fx-fly-biz absolute bottom-[2%] end-0 origin-bottom scale-[.84] sm:scale-100">
        <div className="fx-deal-in" style={{ ["--d" as string]: "420ms" }}>
          <div style={layer(34, "rotate(6deg)")}>
            <BusinessCard content={sampleBiz()} design={{ palette: "stone", layout: "split" }} lang="both" width={230} tilt={false} />
          </div>
        </div>
      </div>
    </div>
  );
}

/** "Your cards come to you, your e-invitation goes to everyone": explains the free e-invitation, with a live demo. */
function EInviteTeaser({ h2 }: { h2: string }) {
  const { t } = useApp();
  // Built after mount: the sample date is relative to today, which differs between build time and the visit.
  const [demo, setDemo] = React.useState<EInviteData | null>(null);
  React.useEffect(() => setDemo(sampleEInvite()), []);
  const steps = [
    t("صمّم بطاقتك بالأسماء والموعد والقاعة.", "Design your card with names, date and venue."),
    t("اطلبها مطبوعة توصلك لبيتك — أو إلكترونية فقط.", "Order it printed and delivered — or e-invitation only."),
    t("فورًا بيوصلك رابط دعوتك الإلكترونية، وبتبعته لضيوفك على واتساب.", "You instantly get your e-invitation link to send on WhatsApp."),
  ];
  const features = [
    { icon: Music2, label: t("أغنية زفة بتشتغل لما يفتحوها", "A wedding song plays as it opens") },
    { icon: Hourglass, label: t("عدّاد لحد يوم الحفل", "A countdown to the big day") },
    { icon: MapPin, label: t("موقع القاعة بكبسة وحدة", "The venue on a map, in one tap") },
    { icon: Phone, label: t("اتصال وواتساب للاستفسار", "Call or WhatsApp for questions") },
  ];
  return (
    <Section className="relative overflow-hidden">
      <div className="container grid items-center gap-12 lg:grid-cols-[1fr_auto] lg:gap-20">
        <div>
          <Reveal fx="rule"><Eyebrow>{t("مجانًا مع كل دعوة", "Free with every invitation")}</Eyebrow></Reveal>
          <RevealWords text={t("بطاقتك بتوصلك… ودعوتك بتوصل للكل", "Your cards come to you. Your invitation reaches everyone.")} className={h2} />
          <Reveal fx="up" delay={150}>
            <p className="mt-4 max-w-[36rem] text-[16px] leading-8 text-subtle">{t("مع كل دعوة بتطلبها، بنعملك تلقائيًا دعوة إلكترونية بنفس التصميم: رابط بيفتحه الضيف، بيشوف الظرف بينفتح، وبتشتغل أغنية الزفة.", "With every invitation you order, we automatically make a matching e-invitation: a link guests open to an envelope that unseals as the song begins.")}</p>
          </Reveal>
          <ol className="mt-8 space-y-4">
            {steps.map((s, i) => (
              <Reveal as="li" key={i} fx="up" delay={250 + i * 120} className="flex items-start gap-4">
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-foil font-mono text-[13px] text-foil">{i + 1}</span>
                <span className="pt-1 text-[15px] leading-7">{s}</span>
              </Reveal>
            ))}
          </ol>
          <div className="mt-8 grid gap-x-6 gap-y-3 sm:grid-cols-2">
            {features.map((f, i) => (
              <Reveal key={i} fx="draw" delay={500 + i * 100} className="flex items-center gap-3 text-[14px]">
                <f.icon size={20} strokeWidth={1.5} className="shrink-0 text-foil" />{f.label}
              </Reveal>
            ))}
          </div>
          <Reveal fx="up" delay={700} className="mt-9 flex flex-wrap items-center gap-3">
            <ButtonLink href="/invite/#demo" variant="primary" next className="fx-shine">{t("جرّب الدعوة التجريبية", "Try the sample invitation")}</ButtonLink>
            <ButtonLink href="/design/type/">{t("صمّم دعوتك", "Design yours")}</ButtonLink>
          </Reveal>
          <p className="mt-3 text-[12px] text-subtle">{t("الأسماء والأرقام بالمثال وهمية، للشرح فقط.", "Names and numbers in the sample are made up.")}</p>
        </div>
        <Reveal fx="scale" className="relative mx-auto">
          <div className="absolute -start-24 top-16 hidden rotate-[-10deg] lg:block" aria-hidden>
            <InvitationCard content={sampleInvite("engagement")} design={{ palette: "midnight", frame: "geometric", font: "amiri" }} lang="ar" width={170} tilt={false} />
          </div>
          {demo ? <PhoneMock data={demo} scale={0.66} className="relative" /> : <div className="ei-phone relative" style={{ ["--s" as string]: 0.66 }} />}
          <p className="mt-4 text-center text-[13px] text-subtle">{t("جرّبها هون 👆 اضغط على الظرف", "Try it 👆 tap the envelope")}</p>
        </Reveal>
      </div>
    </Section>
  );
}

/** Featured designs: on wide screens they start as one stacked deck and fan out into the row as you scroll. */
function FeaturedDeck({ items, onPick }: { items: Template[]; onPick: (id: string) => void }) {
  const { t } = useApp();
  const reduce = useReducedMotion();
  const box = React.useRef<HTMLDivElement>(null);
  const cards = React.useRef<(HTMLButtonElement | null)[]>([]);
  React.useEffect(() => {
    if (reduce) return;
    const wide = window.matchMedia("(min-width: 1024px)");
    return onScrollFrame(() => {
      const el = box.current;
      if (!el) return;
      const on = wide.matches;
      const e = easeOut(span(progressOf(el, "through"), 0.08, 0.42));
      const mid = (items.length - 1) / 2, cx = el.offsetWidth / 2;
      cards.current.forEach((c, i) => {
        if (!c) return;
        if (!on) { c.style.transform = ""; c.style.zIndex = ""; return; }
        const k = 1 - e, off = i - mid;
        const dx = (cx - (c.offsetLeft + c.offsetWidth / 2)) * k;
        c.style.transform = `translate3d(${dx}px, ${k * 90 + Math.abs(off) * k * 10}px, 0) rotate(${off * 7 * k}deg)`;
        c.style.zIndex = String(Math.round(10 - Math.abs(off) * 2));
      });
    });
  }, [items.length, reduce]);
  return (
    <div ref={box} className="relative -mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-4 md:mx-0 md:grid md:grid-cols-3 md:gap-8 md:overflow-visible md:px-0 lg:grid-cols-6">
      {items.map((f, i) => (
        <button key={f.id} ref={(n) => { cards.current[i] = n; }} onClick={() => onPick(f.id)}
          className="fx-deck-card focus-ring group w-[200px] shrink-0 snap-start text-start md:w-auto">
          <Reveal fx="up" delay={i * 90} className="lg:![transform:none] lg:!opacity-100 lg:![filter:none]">
            <div className="grid h-[250px] place-items-center rounded bg-muted/50 transition-[background-color,box-shadow,transform] duration-500 ease-paper group-hover:-translate-y-2 group-hover:bg-muted group-hover:shadow-lift">
              <div style={{ width: f.kind === "business" ? "86%" : "56%" }}><TemplateArt template={f} width="fill" tilt={false} /></div>
            </div>
            <div className="mt-3 flex items-baseline justify-between gap-2">
              <span className="font-semibold">{t(f.name.ar, f.name.en)}</span>
              {f.tier === "premium" && <span className="rounded-xs bg-foil-soft px-1.5 py-0.5 text-[11px] font-semibold text-foil">{t("مميّز", "Premium")}</span>}
            </div>
            <span className="text-[13px] text-subtle">{t(CATEGORIES.find((c) => c.id === f.category)!.name.ar, CATEGORIES.find((c) => c.id === f.category)!.name.en)}</span>
          </Reveal>
        </button>
      ))}
    </div>
  );
}

export default function Home() {
  const { t, lang, chooseCategory, chooseTemplate } = useApp();
  const router = useRouter();
  const start = (c: CategoryId) => { chooseCategory(c); router.push("/design/template/"); };
  const featured = ["w-noor", "w-ward", "e-qamar", "w-layali", "bz-amman", "bz-petra"].map((id) => tpl(id)!);
  const hero = useScrollVar<HTMLElement>("exit");
  const cats = useScrollVar<HTMLDivElement>("through");
  const h2 = lang === "ar" ? "mt-2 text-[28px] font-bold leading-snug md:text-[40px]" : "mt-2 font-display text-[34px] font-medium leading-[1.05] md:text-[52px]";

  return (
    <>
      <SmoothScroll />
      <Header />
      <main>
        {/* Hero */}
        <section ref={hero} className="fx-hero grain relative overflow-hidden border-b border-border">
          <div className="container grid items-center gap-6 py-10 md:py-16 lg:grid-cols-[1.05fr_1fr] lg:gap-12">
            <div className="fx-hero-copy space-y-6">
              <div className="fx-in" style={{ ["--d" as string]: "0ms" }}><Eyebrow>{t("استوديو دعوات وبطاقات · عمّان", "Invitation & card studio · Amman")}</Eyebrow></div>
              <RevealWords as="h1" onLoad delay={120} text={t("دعوتك، على ورقٍ يليق بها.", "Invitations, set in paper.")}
                className={lang === "ar" ? "font-arabic text-[36px] font-bold leading-[1.35] md:text-[52px]" : "font-display text-[44px] font-medium leading-[1.02] tracking-[-0.01em] md:text-[68px]"} />
              <p className="fx-in max-w-[34rem] text-[16px] leading-7 text-subtle md:text-[17px]" style={{ ["--d" as string]: "520ms" }}>
                {t("صمّم بطاقتك بدقائق، عاينها قبل الطباعة، ثم اختر الطباعة الفاخرة أو التسليم الرقمي للمشاركة.",
                  "Design your card in minutes, preview it before printing, then choose fine print or a digital card to share.")}
              </p>
              <div className="fx-in flex flex-wrap gap-3" style={{ ["--d" as string]: "640ms" }}>
                <ButtonLink href="/design/type/" variant="primary" next className="fx-shine">{t("صمّم بطاقتك", "Create your card")}</ButtonLink>
                <ButtonLink href="/design/template/">{t("استكشف التصاميم", "Explore designs")}</ButtonLink>
              </div>
              <ul className="fx-in flex flex-wrap gap-x-6 gap-y-2 text-[13px] text-subtle" style={{ ["--d" as string]: "760ms" }}>
                <li className="flex items-center gap-2"><Sparkles size={15} strokeWidth={1.5} className="text-foil" />{t("ابدأ بدون حساب", "No account to start")}</li>
                <li className="flex items-center gap-2"><Eye size={15} strokeWidth={1.5} className="text-foil" />{t("معاينة قبل الطباعة", "Proof before print")}</li>
                <li className="flex items-center gap-2"><Truck size={15} strokeWidth={1.5} className="text-foil" />{t("توصيل لكل المحافظات", "Delivery across Jordan")}</li>
              </ul>
            </div>
            <HeroArt />
          </div>
          <span className="fx-scroll-cue" aria-hidden><span /></span>
        </section>

        <VelocityRibbon items={lang === "ar"
          ? ["زفاف", "خطوبة", "كتب كتاب", "تخرّج", "عيد ميلاد", "مولود جديد", "بطاقات أعمال", "شكر"]
          : ["Weddings", "Engagements", "Katb kitab", "Graduations", "Birthdays", "Newborns", "Business cards", "Thank-you"]}
          className={lang === "ar" ? "" : "fx-ribbon-en"} />

        {/* How it works (pinned scroll scene) */}
        <HowStory />

        {/* Free e-invitation with every order */}
        <EInviteTeaser h2={h2} />

        {/* Categories */}
        <Section className="border-y border-border bg-card/60 grain">
          <div className="container">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <Reveal fx="rule"><Eyebrow>{t("ابدأ من نوع البطاقة", "Start with the card")}</Eyebrow></Reveal>
                <RevealWords text={t("لكل مناسبة ورقها", "Every occasion, its own paper")} className={h2} />
              </div>
              <Reveal fx="fade" delay={300}><ButtonLink href="/design/type/" variant="ghost" next>{t("كل الأنواع", "All card types")}</ButtonLink></Reveal>
            </div>
            <div ref={cats} className="mt-10 grid gap-6 md:grid-cols-3">
              {CATEGORIES.filter((c) => c.primary).map((c, i) => {
                const sample = TEMPLATES.find((x) => x.category === c.id)!;
                return (
                  <Reveal key={c.id} fx="deal" delay={i * 140}>
                    <button onClick={() => start(c.id)} className="fx-cat focus-ring group flex w-full flex-col overflow-hidden rounded border border-border bg-background text-start transition-shadow duration-500 hover:shadow-lift">
                      <div className="relative grid h-[260px] place-items-center overflow-hidden bg-muted/60">
                        <span className="fx-cat-glow" aria-hidden />
                        <div className="fx-par" style={{ ["--k" as string]: `${70 + i * 30}px` }}>
                          <div className="w-full max-w-[280px] transition-transform duration-700 ease-paper group-hover:-translate-y-2 group-hover:rotate-[-2deg] group-hover:scale-[1.05] [&_.mk-inv-stage]:mx-auto [&_.mk-inv-stage]:block [&_.mk-inv]:max-w-full">
                            <TemplateArt template={sample} width={sample.kind === "business" ? 230 : 160} tilt={false} />
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-1 items-end justify-between gap-3 p-5">
                        <div>
                          <h3 className="text-[18px] font-semibold">{t(c.name.ar, c.name.en)}</h3>
                          <p className="mt-1 text-[14px] text-subtle">{t(c.blurb.ar, c.blurb.en)}</p>
                        </div>
                        <span className="shrink-0 font-mono text-[13px] text-subtle">{t("من", "from")} {jod(c.from, lang)}</span>
                      </div>
                    </button>
                  </Reveal>
                );
              })}
            </div>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <span className="text-[14px] text-subtle">{t("مناسبات أخرى:", "More occasions:")}</span>
              {CATEGORIES.filter((c) => !c.primary).map((c, i) => (
                <Reveal key={c.id} fx="scale" delay={200 + i * 60}>
                  <button onClick={() => start(c.id)} className="focus-ring rounded-xs border border-border-strong px-3 py-2 text-[13px] transition-colors hover:border-foreground hover:bg-card">{t(c.name.ar, c.name.en)}</button>
                </Reveal>
              ))}
            </div>
          </div>
        </Section>

        {/* Featured templates */}
        <Section className="overflow-hidden">
          <div className="container">
            <Reveal fx="rule"><Eyebrow>{t("الأكثر طلبًا", "Most chosen")}</Eyebrow></Reveal>
            <RevealWords text={t("تصاميم مختارة", "Featured designs")} className={h2} />
          </div>
          <div className="container mt-8">
            <FeaturedDeck items={featured} onPick={(id) => { chooseTemplate(id); router.push("/design/customize/"); }} />
          </div>
        </Section>

        {/* Pricing teaser */}
        <Section className="border-y border-border">
          <div className="container grid gap-10 lg:grid-cols-[1fr_2fr]">
            <div>
              <Reveal fx="rule"><Eyebrow>{t("الأسعار", "Pricing")}</Eyebrow></Reveal>
              <RevealWords text={t("واضحة من البداية", "Clear from the start")} className={h2} />
              <Reveal fx="up" delay={200}><p className="mt-3 text-[15px] leading-7 text-subtle">{t("السعر يتحدّث مباشرة وأنت تختار الكمية والورق واللمسة النهائية. الأسعار هنا تقديرية للنموذج الأولي.", "The estimate updates live as you choose quantity, paper and finish. Prices shown are prototype estimates.")}</p></Reveal>
            </div>
            <div className="grid gap-px overflow-hidden border border-border bg-border sm:grid-cols-3">
              {[
                { ar: "دعوة رقمية", en: "Digital invitation", v: PRICING.invite.digital, note: t("رابط وصورة للمشاركة", "Link and image to share") },
                { ar: "دعوات مطبوعة", en: "Printed invitations", v: PRICING.invite.paper[0].perCard, note: t("للبطاقة، مع الظرف حسب الاختيار", "per card, envelope optional") },
                { ar: "بطاقات أعمال", en: "Business cards", v: PRICING.business.paper[0].perCard, note: t("للبطاقة، من ١٠٠ بطاقة", "per card, from 100") },
              ].map((p, i) => (
                <Reveal key={i} fx="up" delay={i * 120} className="fx-price relative bg-card p-6">
                  <p className="text-[14px] text-subtle">{t(p.ar, p.en)}</p>
                  <p className="mt-3 font-mono text-[22px] font-medium tabular-nums">{t("من", "from")} <CountUp value={p.v} format={(n) => jod(n, lang)} /></p>
                  <p className="mt-1 text-[13px] text-subtle">{p.note}</p>
                </Reveal>
              ))}
            </div>
          </div>
        </Section>

        {/* Trust */}
        <Section>
          <div className="container">
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { icon: Truck, ar: ["توصيل داخل الأردن", "خلال ٣–٥ أيام عمل لكل المحافظات."], en: ["Delivery in Jordan", "3–5 working days to every governorate."] },
                { icon: Eye, ar: ["لا طباعة قبل موافقتك", "تعتمد النسخة النهائية بنفسك."], en: ["Nothing prints unapproved", "You sign off the final proof yourself."] },
                { icon: Wallet, ar: ["دفع مريح", "كليك أو الدفع عند الاستلام."], en: ["Easy payment", "CliQ or cash on delivery."] },
                { icon: ShieldCheck, ar: ["مسودتك محفوظة", "ارجع لتصميمك في أي وقت."], en: ["Your draft is kept", "Come back to your design any time."] },
              ].map((x, i) => (
                <div key={i} className="group flex gap-4">
                  <Reveal fx="draw" delay={i * 160} className="shrink-0">
                    <x.icon size={26} strokeWidth={1.4} className="mt-0.5 text-foil transition-transform duration-300 group-hover:scale-110" />
                  </Reveal>
                  <Reveal fx="up" delay={i * 160 + 120}>
                    <h3 className="font-semibold">{lang === "ar" ? x.ar[0] : x.en[0]}</h3>
                    <p className="mt-1 text-[14px] leading-6 text-subtle">{lang === "ar" ? x.ar[1] : x.en[1]}</p>
                  </Reveal>
                </div>
              ))}
            </div>
            <Reveal fx="scale" className="mt-16 flex flex-col items-start justify-between gap-6 border-t border-border pt-10 md:flex-row md:items-center">
              <p data-text={t("جاهز نبدأ بطاقتك؟", "Ready to begin your card?")} className={"fx-foil-text " + (lang === "ar" ? "text-[28px] font-bold md:text-[40px]" : "font-display text-[36px] font-medium md:text-[52px]")}>{t("جاهز نبدأ بطاقتك؟", "Ready to begin your card?")}</p>
              <ButtonLink href="/design/type/" variant="primary" next className="fx-shine">{t("صمّم بطاقتك", "Create your card")}</ButtonLink>
            </Reveal>
          </div>
        </Section>
      </main>
      <Footer />
    </>
  );
}
