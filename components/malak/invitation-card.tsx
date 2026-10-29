"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { CardLang, DEMO_DATE, InviteContent, InviteDesign } from "@/lib/data";
import { MARK_PATHS } from "./wordmark";
import { useReducedMotion } from "./motion";

export interface InvitationCardProps {
  content: InviteContent;
  design: InviteDesign;
  lang: CardLang;
  watermark?: boolean;
  tilt?: boolean;
  envelope?: boolean;
  /** Rendered width in px; or "fill" to take the parent's width. */
  width?: number | "fill";
  className?: string;
  label?: string;
}

const fmtDate = (iso: string, l: "ar" | "en") => {
  if (!iso) return "";
  const d = new Date(iso + "T12:00:00");
  if (isNaN(d.getTime())) return iso;
  const s = d.toLocaleDateString(l === "ar" ? "ar-JO" : "en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
  return iso === DEMO_DATE ? `${s} ${l === "ar" ? "(تاريخ تجريبي)" : "(demo date)"}` : s;
};
const fmtTime = (hm: string, l: "ar" | "en") => {
  if (!hm) return "";
  const [h, m] = hm.split(":").map(Number);
  const d = new Date(2000, 0, 1, h, m);
  return d.toLocaleTimeString(l === "ar" ? "ar-JO" : "en-GB", { hour: "numeric", minute: "2-digit", hour12: true });
};

function QR() {
  const cells: React.ReactNode[] = [];
  for (let y = 0; y < 15; y++) for (let x = 0; x < 15; x++) {
    if ((x < 4 && y < 4) || (x > 10 && y < 4) || (x < 4 && y > 10)) continue;
    if ((x * 7 + y * 13 + x * y) % 5 < 2) cells.push(<rect key={x + "-" + y} x={x * 2} y={y * 2} width={2} height={2} />);
  }
  const f = (x: number, y: number) => (
    <g key={"f" + x + y}><rect x={x} y={y} width={7} height={7} fill="none" strokeWidth={1} stroke="currentColor" /><rect x={x + 2} y={y + 2} width={3} height={3} /></g>
  );
  return (
    <svg viewBox="-0.5 -0.5 31 31" className="mk-inv-qr" aria-hidden>
      <g fill="currentColor">{cells}{f(0, 0)}{f(23, 0)}{f(0, 23)}</g>
    </svg>
  );
}

/** An olive sprig: a curved stem with alternating leaves along it. */
function Sprig({ className }: { className: string }) {
  const leaves = Array.from({ length: 9 }, (_, i) => {
    const tt = (i + 1) / 10;
    const x = 8 + tt * 104, y = 52 - 44 * Math.pow(tt, 0.9);
    const side = i % 2 ? 1 : -1;
    return <ellipse key={i} cx={x + side * 3} cy={y + side * -3} rx={7.5 - tt * 3} ry={2.3} transform={`rotate(${-22 + side * 38} ${x + side * 3} ${y - side * 3})`} className="leaf" />;
  });
  return (
    <svg className={className} viewBox="0 0 120 60" aria-hidden>
      <path d="M8 52C40 40 70 22 114 8" fill="none" />
      {leaves}
    </svg>
  );
}

function FrameArt({ frame }: { frame: InviteDesign["frame"] }) {
  if (frame === "none") return null;
  if (frame === "arch")
    return (
      <svg className="mk-inv-frame" viewBox="0 0 100 140" preserveAspectRatio="none" aria-hidden>
        <path d="M8 134V40a42 34 0 0 1 84 0v94z" fill="none" vectorEffect="non-scaling-stroke" />
        <path d="M11 131V41a39 31 0 0 1 78 0v90z" fill="none" vectorEffect="non-scaling-stroke" opacity=".5" />
      </svg>
    );
  if (frame === "double")
    return (
      <svg className="mk-inv-frame" viewBox="0 0 100 140" preserveAspectRatio="none" aria-hidden>
        <rect x="5" y="5" width="90" height="130" fill="none" vectorEffect="non-scaling-stroke" />
        <rect x="8" y="8" width="84" height="124" fill="none" vectorEffect="non-scaling-stroke" />
      </svg>
    );
  if (frame === "floral")
    return (
      <>
        <Sprig className="mk-inv-sprig mk-inv-sprig-top" />
        <Sprig className="mk-inv-sprig mk-inv-sprig-bottom" />
      </>
    );
  // geometric: eight-point stars in the corners and a fine rule
  const star = "M0-10L2.9-7 7.1-7.1 7-2.9 10 0 7 2.9 7.1 7.1 2.9 7 0 10-2.9 7-7.1 7.1-7 2.9-10 0-7-2.9-7.1-7.1-2.9-7z";
  return (
    <svg className="mk-inv-frame mk-inv-frame-geo" viewBox="0 0 100 140" preserveAspectRatio="none" aria-hidden>
      <rect x="6" y="6" width="88" height="128" fill="none" vectorEffect="non-scaling-stroke" />
      {[[6, 6], [94, 6], [6, 134], [94, 134]].map(([x, y], i) => (
        <path key={i} d={star} transform={`translate(${x} ${y}) scale(.7 .5)`} className="geo-star" vectorEffect="non-scaling-stroke" />
      ))}
    </svg>
  );
}

export function InvitationCard({ content, design, lang, watermark, tilt = true, envelope, width = 300, className, label }: InvitationCardProps) {
  const reduce = useReducedMotion();
  const ref = React.useRef<HTMLDivElement>(null);
  const live = tilt && !reduce;
  const ar = lang !== "en", en = lang !== "ar", both = lang === "both";
  const A = content.ar, E = content.en;
  const single = !(ar ? A.nameB : E.nameB);

  const onMove = (e: React.PointerEvent) => {
    if (!live || e.pointerType === "touch" || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
    ref.current.style.setProperty("--mk-ry", (x * 14).toFixed(2) + "deg");
    ref.current.style.setProperty("--mk-rx", (-y * 12).toFixed(2) + "deg");
    ref.current.style.setProperty("--mk-gx", (50 + x * 60).toFixed(1) + "%");
    ref.current.dataset.lifted = "true";
  };
  const onLeave = () => {
    if (!ref.current) return;
    ref.current.style.setProperty("--mk-ry", "0deg");
    ref.current.style.setProperty("--mk-rx", "0deg");
    delete ref.current.dataset.lifted;
  };

  const names = (t: typeof A, l: "ar" | "en", sub = false) => (
    <p className={cn("mk-inv-names", l === "en" && "mk-inv-names-en", sub && "mk-inv-names-sub")} lang={l} dir={l === "ar" ? "rtl" : "ltr"}>
      <span>{t.nameA}</span>
      {t.nameB && <><span className="mk-inv-amp">{l === "ar" ? "و" : "&"}</span><span>{t.nameB}</span></>}
    </p>
  );

  const w = width === "fill" ? "100%" : width + "px";
  const card = (
    <div ref={ref} className={cn("mk-inv", "mk-inv-" + design.palette, "mk-inv-font-" + design.font, single && "mk-inv-single", envelope && "mk-inv-in-env")}
      style={{ ["--mk-inv-w" as string]: w }} onPointerMove={onMove} onPointerLeave={onLeave}
      role="img" aria-label={label ?? (ar ? `${A.nameA}${A.nameB ? " و " + A.nameB : ""}` : `${E.nameA}${E.nameB ? " & " + E.nameB : ""}`)}>
      <div className="mk-inv-paper">
        <FrameArt frame={design.frame} />
        <div className="mk-inv-content">
          <svg viewBox="0 0 48 60" className="mk-inv-orn" aria-hidden><path d={MARK_PATHS.star} /></svg>
          {ar && <p className="mk-inv-msg" lang="ar" dir="rtl">{A.message}</p>}
          {lang === "en" && <p className="mk-inv-msg" lang="en">{E.message}</p>}
          {ar && names(A, "ar")}
          {en && names(E, "en", both)}
          <span className="mk-inv-rule" aria-hidden />
          <p className="mk-inv-line" lang={ar ? "ar" : "en"}>{fmtDate(content.date, ar ? "ar" : "en")}</p>
          {content.time && <p className="mk-inv-line" lang={ar ? "ar" : "en"}>{fmtTime(content.time, ar ? "ar" : "en")}</p>}
          {ar && A.venue && <p className="mk-inv-line mk-inv-venue" lang="ar" dir="rtl">{A.venue}</p>}
          {en && E.venue && <p className="mk-inv-line mk-inv-venue" lang="en">{E.venue}</p>}
          {(ar ? A.address : E.address) && !both && <p className="mk-inv-line mk-inv-addr" lang={ar ? "ar" : "en"}>{ar ? A.address : E.address}</p>}
          {content.qr && <QR />}
        </div>
        <span className="mk-inv-sheen" aria-hidden />
        {watermark && <span className="mk-inv-watermark" aria-hidden><span>معاينة · PREVIEW</span></span>}
      </div>
    </div>
  );
  if (!envelope) return <div className={cn("mk-inv-stage", className)} style={width === "fill" ? { display: "block", padding: 0 } : undefined}>{card}</div>;
  return (
    <div className={cn("mk-inv-stage mk-env", className)} style={{ ["--mk-inv-w" as string]: w }}>
      <span className="mk-env-back" aria-hidden />
      {card}
      <span className="mk-env-front" aria-hidden />
    </div>
  );
}
