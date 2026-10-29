"use client";

import * as React from "react";
import { Eye, PenLine, Printer } from "lucide-react";
import { InvitationCard } from "@/components/malak/invitation-card";
import { MARK_PATHS } from "@/components/malak/wordmark";
import { useReducedMotion } from "@/components/malak/motion";
import { InviteDesign, sampleInvite } from "@/lib/data";
import { useApp } from "@/lib/store";
import { Eyebrow, Section } from "./ui";
import { RevealWords, easeInOut, easeOut, onScrollFrame, progressOf, span } from "./scroll-fx";

const STEPS = [
  { icon: PenLine, ar: ["اختر وخصّص", "اختر تصميمًا ثم عدّل الأسماء والتاريخ والقاعة والألوان — والمعاينة تتحدّث فورًا."], en: ["Choose & personalise", "Pick a design, then edit names, date, venue and colours — the preview updates as you type."] },
  { icon: Eye, ar: ["عاينها بالتفصيل", "شوف البطاقة كأنها بين إيديك: مسطّحة أو داخل الظرف، قبل أي طباعة."], en: ["Proof it properly", "See it flat or tucked in its envelope, exactly as it will print — before anything is printed."] },
  { icon: Printer, ar: ["اطبع وشارك", "ورق فاخر وتذهيب يوصلك لباب البيت، ومعه دعوة إلكترونية بأغنية تبعتها لضيوفك على واتساب."], en: ["Print & share", "Fine paper and foil delivered to your door, plus an e-invitation with a song to send on WhatsApp."] },
];

/** Designs flicked past in step one; the last (FINAL) is the one that gets proofed and posted. */
const DECK: InviteDesign[] = [
  { palette: "midnight", frame: "geometric", font: "amiri" },
  { palette: "blush", frame: "floral", font: "ruqaa" },
  { palette: "sage", frame: "double", font: "amiri" },
];
const FINAL: InviteDesign = { palette: "ivory", frame: "arch", font: "ruqaa" };
const DECK_TILT = [0, 3, -3];

function StaticHow() {
  const { t, lang } = useApp();
  return (
    <Section id="how" className="scroll-mt-16">
      <div className="container">
        <Eyebrow>{t("كيف تعمل؟", "How it works")}</Eyebrow>
        <h2 className="mt-2 text-[26px] font-semibold leading-tight md:text-[32px]">{t("ثلاث خطوات، والبطاقة جاهزة", "Three steps to a finished card")}</h2>
        <ol className="mt-10 grid gap-px overflow-hidden border border-border bg-border md:grid-cols-3">
          {STEPS.map((s, i) => (
            <li key={i} className="bg-card p-6 md:p-8">
              <div className="flex items-center gap-3">
                <span className="mk-step-indicator" data-state="active" style={{ width: 34, height: 34 }}>
                  <span className="mk-step-indicator-face"><span>{i + 1}</span></span>
                </span>
                <s.icon size={20} strokeWidth={1.5} className="text-foil" />
              </div>
              <h3 className="mt-5 text-[18px] font-semibold">{lang === "ar" ? s.ar[0] : s.en[0]}</h3>
              <p className="mt-2 text-[15px] leading-7 text-subtle">{lang === "ar" ? s.ar[1] : s.en[1]}</p>
            </li>
          ))}
        </ol>
      </div>
    </Section>
  );
}

/** "How it works" as a pinned scene: flick through designs → proof under crop marks → seal it in an envelope. */
export function HowStory() {
  const reduce = useReducedMotion();
  const { t, lang } = useApp();
  const root = React.useRef<HTMLElement>(null);
  const stage = React.useRef<HTMLDivElement>(null);
  const peels = React.useRef<(HTMLDivElement | null)[]>([]);
  const hero = React.useRef<HTMLDivElement>(null);
  const sheen = React.useRef<HTMLSpanElement>(null);
  const marks = React.useRef<SVGSVGElement>(null);
  const envParts = React.useRef<(HTMLSpanElement | null)[]>([]);
  const flap = React.useRef<HTMLSpanElement>(null);
  const seal = React.useRef<HTMLSpanElement>(null);
  const scene = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (reduce) return;
    return onScrollFrame(() => {
      const el = root.current, st = stage.current, card = hero.current;
      if (!el || !st || !card) return;
      const p = progressOf(el, "pin");
      const s0 = span(p, 0.02, 0.3), s1 = span(p, 0.36, 0.62), s2 = span(p, 0.68, 0.97);
      el.style.setProperty("--p", p.toFixed(4));
      el.dataset.step = String(p < 0.33 ? 0 : p < 0.66 ? 1 : 2);

      // 1 · flick through the deck: each design peels off to alternating sides.
      peels.current.forEach((d, i) => {
        if (!d) return;
        const k = easeInOut(span(s0, i * 0.27, i * 0.27 + 0.42));
        const side = i % 2 ? 1 : -1;
        d.style.transform = `translate3d(${side * k * 118}%, ${-k * 14}%, 0) rotate(${DECK_TILT[i] + side * k * 18}deg) rotateY(${-side * k * 40}deg)`;
        d.style.opacity = String(1 - span(k, 0.55, 1));
      });

      // 2 · proof: the card lifts, rocks under the light, crop marks draw in around it.
      const H = card.offsetHeight, stageH = st.offsetHeight;
      const bell = Math.sin(s1 * Math.PI);
      const home = (stageH - H) / 2 - stageH * 0.06, inside = stageH - H * 1.03;
      // 3 · post: envelope rises, card drops in, flap closes, seal stamps, the whole thing settles.
      const rise = easeOut(span(s2, 0, 0.32));
      const drop = easeInOut(span(s2, 0.28, 0.64));
      const shut = easeInOut(span(s2, 0.64, 0.8));
      const stamp = span(s2, 0.8, 0.92);
      const settle = easeOut(span(s2, 0.9, 1));

      const y = home + (inside - home) * drop;
      card.style.transform = `translate3d(0, ${y}px, 0) scale(${1 + 0.12 * bell}) rotateY(${-24 * Math.sin(s1 * Math.PI * 2)}deg) rotateX(${9 * bell}deg)`;
      if (sheen.current) {
        sheen.current.style.opacity = bell.toFixed(3);
        sheen.current.style.transform = `translateX(${-60 + s1 * 160}%)`;
      }
      if (marks.current) {
        const ink = String(1 - easeOut(span(s1, 0, 0.45)));
        marks.current.querySelectorAll<SVGElement>("path, circle").forEach((m) => { m.style.strokeDashoffset = ink; });
        marks.current.style.opacity = String((1 - span(s2, 0, 0.2)) * (s1 > 0 ? 1 : 0));
        marks.current.style.transform = `translate3d(0, ${home}px, 0) scale(${1 + 0.12 * bell})`;
      }
      // Envelope pieces are separate layers so the card can slip between back and front.
      envParts.current.forEach((part) => {
        if (!part) return;
        part.style.transform = `translate3d(0, ${(1 - rise) * 118}%, 0)`;
        part.style.opacity = span(s2, 0, 0.12).toFixed(3);
      });
      if (flap.current) flap.current.style.transform = `rotateX(${180 - 180 * shut}deg)`;
      el.dataset.flap = shut > 0.5 ? "shut" : "open";
      if (seal.current) {
        seal.current.style.opacity = String(stamp > 0 ? 1 : 0);
        seal.current.style.transform = `translate(-50%, -50%) scale(${2.2 - 1.2 * easeOut(stamp)}) rotate(${(1 - stamp) * -40}deg)`;
      }
      if (scene.current) scene.current.style.transform = `translate3d(0, ${-settle * 14}px, 0) rotate(${-settle * 4}deg)`;
    });
  }, [reduce]);

  if (reduce) return <StaticHow />;

  const nums = lang === "ar" ? ["١", "٢", "٣"] : ["01", "02", "03"];
  return (
    <section id="how" ref={root} className="fx-story relative" data-step="0" data-flap="open">
      <div className="fx-story-pin">
        <div className="container grid h-full items-center gap-4 lg:grid-cols-[1fr_1.1fr] lg:gap-12">
          <div className="fx-story-copy">
            <Eyebrow>{t("كيف تعمل؟", "How it works")}</Eyebrow>
            <RevealWords text={t("ثلاث خطوات، والبطاقة جاهزة", "Three steps to a finished card")}
              className={lang === "ar" ? "mt-2 text-[24px] font-bold leading-snug md:text-[40px]" : "mt-2 font-display text-[30px] font-medium leading-[1.05] md:text-[52px]"} />
            <div className="relative mt-6 md:mt-10">
              <span className="fx-rail" aria-hidden><span /></span>
              <ol className="space-y-1 md:space-y-4">
                {STEPS.map((s, i) => (
                  <li key={i} className="fx-step">
                    <span className="fx-step-dot" aria-hidden />
                    <div className="flex items-center gap-3">
                      <s.icon size={18} strokeWidth={1.5} className="fx-step-icon text-foil" />
                      <h3 className="text-[17px] font-semibold md:text-[20px]">{lang === "ar" ? s.ar[0] : s.en[0]}</h3>
                    </div>
                    <p className="fx-step-body text-[14px] leading-6 text-subtle md:text-[15px] md:leading-7">{lang === "ar" ? s.ar[1] : s.en[1]}</p>
                  </li>
                ))}
              </ol>
            </div>
          </div>

          <div className="fx-story-stage-wrap">
            <div className="fx-nums" aria-hidden>{nums.map((n, i) => <span key={i} className={lang === "ar" ? "font-amiri" : "font-display"}>{n}</span>)}</div>
            <div ref={stage} className="fx-stage" aria-hidden>
              <div ref={scene} className="fx-scene">
                <span ref={(n) => { envParts.current[0] = n; }} className="fx-env fx-env-back" />
                <span ref={(n) => { envParts.current[1] = n; }} className="fx-env fx-env-flap-wrap"><span ref={flap} className="fx-env-flap" /></span>
                <div className="fx-clip">
                  <svg ref={marks} className="fx-marks" viewBox="0 0 100 140" preserveAspectRatio="none">
                    {["M-4 0H-14M0-4V-14", "M104 0H114M100-4V-14", "M-4 140H-14M0 144V154", "M104 140H114M100 144V154"].map((d, i) => (
                      <path key={i} d={d} pathLength={1} vectorEffect="non-scaling-stroke" />
                    ))}
                    <circle cx="50" cy="-9" r="3.5" pathLength={1} vectorEffect="non-scaling-stroke" />
                    <path d="M44-9H56M50-15V-3" pathLength={1} vectorEffect="non-scaling-stroke" />
                  </svg>
                  <div ref={hero} className="fx-card">
                    <InvitationCard content={sampleInvite("wedding")} design={FINAL} lang="ar" width="fill" tilt={false} />
                    <span className="fx-card-sheen"><span ref={sheen} /></span>
                    {DECK.map((d, i) => (
                      <div key={i} ref={(n) => { peels.current[i] = n; }} className="fx-peel" style={{ zIndex: DECK.length - i, transform: `rotate(${DECK_TILT[i]}deg)` }}>
                        <InvitationCard content={sampleInvite(i === 2 ? "engagement" : "wedding")} design={d} lang="ar" width="fill" tilt={false} />
                      </div>
                    ))}
                  </div>
                </div>
                <span ref={(n) => { envParts.current[2] = n; }} className="fx-env fx-env-front" />
                <span ref={(n) => { envParts.current[3] = n; }} className="fx-env fx-seal-wrap">
                  <span ref={seal} className="fx-seal">
                    <svg viewBox="0 0 48 60"><path d={MARK_PATHS.arch} fill="none" stroke="currentColor" strokeWidth="3.2" /><path d={MARK_PATHS.star} fill="currentColor" /></svg>
                  </span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
