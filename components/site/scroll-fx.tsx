"use client";

import * as React from "react";
import Lenis from "lenis";
import { cn } from "@/lib/utils";
import { useReducedMotion } from "@/components/malak/motion";

/* ---------- one shared, rAF-throttled scroll/resize loop ---------- */

type Tick = () => void;
const ticks = new Set<Tick>();
let queued = false;
const flush = () => { queued = false; ticks.forEach((t) => t()); };
const queue = () => { if (!queued) { queued = true; requestAnimationFrame(flush); } };

/** Run `fn` on every scroll/resize frame (and once now). */
export function onScrollFrame(fn: Tick) {
  if (!ticks.size) {
    window.addEventListener("scroll", queue, { passive: true });
    window.addEventListener("resize", queue);
  }
  ticks.add(fn);
  queue();
  return () => {
    ticks.delete(fn);
    if (!ticks.size) { window.removeEventListener("scroll", queue); window.removeEventListener("resize", queue); }
  };
}

export const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
/** Map v from [a, b] to [0, 1], clamped. */
export const span = (v: number, a: number, b: number) => clamp01((v - a) / (b - a));
export const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
export const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

/**
 * How far an element has travelled through the viewport, 0 → 1.
 * - "through": top enters the bottom edge → bottom leaves the top edge.
 * - "pin": top reaches the top edge → bottom reaches the bottom edge (for sticky scenes).
 * - "exit": element at rest → its bottom leaves the top edge.
 */
export function progressOf(el: HTMLElement, mode: "through" | "pin" | "exit") {
  const r = el.getBoundingClientRect(), vh = window.innerHeight;
  if (mode === "pin") return clamp01(-r.top / Math.max(1, r.height - vh));
  if (mode === "exit") return clamp01(-r.top / Math.max(1, r.height));
  return clamp01((vh - r.top) / (vh + r.height));
}

/** Writes the element's scroll progress to its `--p` custom property. */
export function useScrollVar<T extends HTMLElement>(mode: "through" | "pin" | "exit" = "through") {
  const ref = React.useRef<T>(null);
  const reduce = useReducedMotion();
  React.useEffect(() => {
    const el = ref.current;
    if (!el || reduce) return;
    return onScrollFrame(() => el.style.setProperty("--p", progressOf(el, mode).toFixed(4)));
  }, [mode, reduce]);
  return ref;
}

/* ---------- reveal on enter ---------- */

const seen = (el: Element, cb: () => void, margin = "0px 0px -12% 0px") => {
  const io = new IntersectionObserver((es) => {
    if (es.some((e) => e.isIntersecting)) { cb(); io.disconnect(); }
  }, { rootMargin: margin, threshold: 0.12 });
  io.observe(el);
  return () => io.disconnect();
};

type RevealFx = "up" | "deal" | "rule" | "draw" | "fade" | "scale";
/** Plays its entrance (`data-fx`) once the element scrolls into view; `delay` in ms. */
export function Reveal({ as: Tag = "div", fx = "up", delay = 0, className, style, children, ...rest }: {
  as?: React.ElementType; fx?: RevealFx; delay?: number; className?: string; style?: React.CSSProperties; children?: React.ReactNode;
} & React.HTMLAttributes<HTMLElement>) {
  const ref = React.useRef<HTMLElement>(null);
  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // Give stroked icons a unit path length so CSS can draw them in.
    if (fx === "draw") el.querySelectorAll("svg :is(path, line, polyline, circle, rect)").forEach((p) => p.setAttribute("pathLength", "1"));
    return seen(el, () => { el.dataset.in = ""; });
  }, [fx]);
  return <Tag ref={ref} data-reveal={fx} className={className} style={{ ...style, ["--d" as string]: `${delay}ms` }} {...rest}>{children}</Tag>;
}

/** A heading whose words rise one by one out of a mask. */
export function RevealWords({ as: Tag = "h2", text, className, delay = 0, onLoad }: {
  as?: React.ElementType; text: string; className?: string; delay?: number; onLoad?: boolean;
}) {
  const ref = React.useRef<HTMLElement>(null);
  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (onLoad) { el.dataset.in = ""; return; }
    return seen(el, () => { el.dataset.in = ""; });
  }, [text, onLoad]);
  const words = text.split(" ");
  return (
    <Tag ref={ref} data-reveal="words" className={className} aria-label={text}>
      {words.map((w, i) => (
        <React.Fragment key={i}>
          <span className="fx-word" aria-hidden><span style={{ ["--d" as string]: `${delay + i * 70}ms` }}>{w}</span></span>
          {i < words.length - 1 && " "}
        </React.Fragment>
      ))}
    </Tag>
  );
}

/** Counts up to `value` when it scrolls into view. */
export function CountUp({ value, format, className }: { value: number; format: (n: number) => string; className?: string }) {
  const ref = React.useRef<HTMLSpanElement>(null);
  const reduce = useReducedMotion();
  const [n, setN] = React.useState(value);
  React.useEffect(() => {
    const el = ref.current;
    if (!el || reduce) { setN(value); return; }
    setN(0);
    let raf = 0;
    const stop = seen(el, () => {
      const t0 = performance.now(), dur = 1400;
      const step = (now: number) => {
        const k = clamp01((now - t0) / dur);
        if (k < 1) { setN(value * (1 - Math.pow(2, -10 * k))); raf = requestAnimationFrame(step); } else setN(value);
      };
      raf = requestAnimationFrame(step);
    });
    return () => { stop(); cancelAnimationFrame(raf); };
  }, [value, reduce]);
  return <span ref={ref} className={className}>{format(n)}</span>;
}

/* ---------- page-level pieces ---------- */

/** Inertial smooth scrolling for the page it is mounted on. */
export function SmoothScroll() {
  const reduce = useReducedMotion();
  React.useEffect(() => {
    if (reduce) return;
    const lenis = new Lenis({ autoRaf: true, anchors: { offset: -64 }, lerp: 0.09, allowNestedScroll: true });
    return () => lenis.destroy();
  }, [reduce]);
  return null;
}

/** Thin foil line under the header that fills as the page is read. */
export function ScrollMeter() {
  const ref = React.useRef<HTMLSpanElement>(null);
  React.useEffect(() => onScrollFrame(() => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    ref.current?.style.setProperty("--p", (max > 0 ? clamp01(window.scrollY / max) : 0).toFixed(4));
  }), []);
  return <span ref={ref} className="fx-meter" aria-hidden />;
}

/** A calligraphic ribbon that drifts on its own and surges/leans with scroll speed. */
export function VelocityRibbon({ items, className }: { items: string[]; className?: string }) {
  const ref = React.useRef<HTMLDivElement>(null);
  const track = React.useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  React.useEffect(() => {
    const el = ref.current, tr = track.current;
    if (!el || !tr || reduce) return;
    let raf = 0, x = 0, v = 0, last = window.scrollY, on = false;
    const rtl = () => document.documentElement.dir === "rtl";
    const loop = () => {
      const y = window.scrollY, dy = y - last;
      last = y;
      v += (dy - v) * 0.12;
      // x runs from 0 to -half and wraps; the second copy of the row hides the seam.
      const half = tr.scrollWidth / 2;
      x -= 0.6 + Math.abs(v) * 0.35;
      if (half && x <= -half) x += half;
      // Arabic drifts rightward, with the reading direction.
      const tx = rtl() ? -half - x : x;
      const lean = Math.max(-12, Math.min(12, -v * 0.35)) * (rtl() ? -1 : 1);
      tr.style.transform = `translate3d(${tx}px,0,0) skewX(${lean}deg)`;
      if (on) raf = requestAnimationFrame(loop);
    };
    const io = new IntersectionObserver(([e]) => {
      on = e.isIntersecting;
      cancelAnimationFrame(raf);
      if (on) { last = window.scrollY; raf = requestAnimationFrame(loop); }
    });
    io.observe(el);
    return () => { io.disconnect(); cancelAnimationFrame(raf); };
  }, [reduce]);
  const row = items.map((s, i) => (
    <React.Fragment key={i}>
      <span className="fx-ribbon-word">{s}</span>
      <svg viewBox="-10 -10 20 20" className="fx-ribbon-star" aria-hidden><path d="M0-10C.7-1.6 1.6-.7 10 0 1.6.7.7 1.6 0 10-.7 1.6-1.6.7-10 0-1.6-.7-.7-1.6 0-10z" /></svg>
    </React.Fragment>
  ));
  return (
    <div ref={ref} className={cn("fx-ribbon", className)} dir="ltr" aria-hidden>
      <div ref={track} className="fx-ribbon-track">{row}{row}</div>
    </div>
  );
}
