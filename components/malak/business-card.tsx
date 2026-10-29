"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { BizContent, BizDesign, CardLang } from "@/lib/data";
import { MARK_PATHS } from "./wordmark";
import { useReducedMotion } from "./motion";

export interface BusinessCardProps {
  content: BizContent;
  design: BizDesign;
  lang: CardLang;
  width?: number | "fill";
  tilt?: boolean;
  watermark?: boolean;
  className?: string;
}

/** A business card front at 85 × 55 mm proportions. Print colours, fixed across UI themes. */
export function BusinessCard({ content, design, lang, width = 340, tilt = true, watermark, className }: BusinessCardProps) {
  const reduce = useReducedMotion();
  const ref = React.useRef<HTMLDivElement>(null);
  const ar = lang !== "en", en = lang !== "ar";
  const A = content.ar, E = content.en;

  const onMove = (e: React.PointerEvent) => {
    if (!tilt || reduce || e.pointerType === "touch" || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
    ref.current.style.setProperty("--mk-ry", (x * 16).toFixed(2) + "deg");
    ref.current.style.setProperty("--mk-rx", (-y * 14).toFixed(2) + "deg");
    ref.current.style.setProperty("--mk-gx", (50 + x * 60).toFixed(1) + "%");
    ref.current.dataset.lifted = "true";
  };
  const onLeave = () => {
    if (!ref.current) return;
    ref.current.style.setProperty("--mk-ry", "0deg");
    ref.current.style.setProperty("--mk-rx", "0deg");
    delete ref.current.dataset.lifted;
  };

  const identity = (
    <div className="mk-biz-id">
      {ar && <p className="mk-biz-name" lang="ar" dir="rtl">{A.name}</p>}
      {en && <p className={cn("mk-biz-name mk-biz-name-en", ar && "mk-biz-sub")} lang="en">{E.name}</p>}
      {ar && <p className="mk-biz-title" lang="ar" dir="rtl">{A.title}</p>}
      {en && <p className="mk-biz-title" lang="en">{E.title}</p>}
    </div>
  );
  const contact = (
    <ul className="mk-biz-contact" dir="ltr">
      {content.phone && <li>{content.phone}</li>}
      {content.email && <li>{content.email}</li>}
      {content.website && <li>{content.website}</li>}
    </ul>
  );
  const brand = (
    <div className="mk-biz-brand">
      <svg viewBox="0 0 48 60" className="mk-biz-mark" aria-hidden><path d={MARK_PATHS.arch} fill="none" /><path d={MARK_PATHS.star} className="fill" /></svg>
      <span lang={ar ? "ar" : "en"}>{ar ? A.company : E.company}</span>
      {ar && en && <span lang="en" className="mk-biz-company-en">{E.company}</span>}
    </div>
  );

  return (
    <div className={cn("mk-inv-stage", className)} style={width === "fill" ? { display: "block", padding: 0 } : undefined}>
      <div ref={ref} className={cn("mk-inv mk-biz", "mk-inv-" + design.palette, "mk-biz-l-" + design.layout)}
        style={{ ["--mk-inv-w" as string]: width === "fill" ? "100%" : width + "px" }}
        onPointerMove={onMove} onPointerLeave={onLeave} role="img"
        aria-label={`${ar ? A.name : E.name} — ${ar ? A.company : E.company}`}>
        <div className="mk-inv-paper mk-biz-paper">
          {design.layout === "split" && <><div className="mk-biz-panel">{brand}</div><div className="mk-biz-main">{identity}{contact}</div></>}
          {design.layout === "band" && <><div className="mk-biz-band">{brand}</div><div className="mk-biz-main">{identity}{contact}</div></>}
          {design.layout === "centered" && <div className="mk-biz-main mk-biz-center">{brand}{identity}{contact}</div>}
          {design.layout === "minimal" && <div className="mk-biz-main mk-biz-min">{identity}<div className="mk-biz-foot">{contact}{brand}</div></div>}
          <span className="mk-inv-sheen" aria-hidden />
          {watermark && <span className="mk-inv-watermark" aria-hidden><span>معاينة · PREVIEW</span></span>}
        </div>
      </div>
    </div>
  );
}
