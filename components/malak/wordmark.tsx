"use client";

import * as React from "react"
import { cn } from "@/lib/utils"

/** The MALAK mark: an invitation arch holding a four-point guiding star (مَلَك, "angel"). viewBox 48×60. */
export const MARK_PATHS = {
  arch: "M6 58V26a18 18 0 0 1 36 0v32",
  star: "M24 18c.9 11 2 13.6 10 16-8 2.4-9.1 5-10 16-.9-11-2-13.6-10-16 8-2.4 9.1-5 10-16z",
}
/** Solid version of the mark (arch as a filled band) for raster/SDF use, e.g. the glass loader. */
export const MARK_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 60"><path d="${MARK_PATHS.arch}" fill="none" stroke="#ffffff" stroke-width="3.2"/><path d="${MARK_PATHS.star}" fill="#ffffff"/></svg>`

export interface MarkProps extends React.SVGProps<SVGSVGElement> { size?: number; title?: string }
export function Mark({ size = 32, title, className, ...p }: MarkProps) {
  return (
    <svg viewBox="0 0 48 60" width={(size * 48) / 60} height={size} className={cn("mk-mark", className)}
      role={title ? "img" : undefined} aria-hidden={title ? undefined : true} {...p}>
      {title && <title>{title}</title>}
      <path d={MARK_PATHS.arch} fill="none" stroke="currentColor" strokeWidth={2.4} />
      <path d={MARK_PATHS.star} fill="currentColor" />
    </svg>
  )
}

export interface WordmarkProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Which names to set: Latin MALAK, Arabic مَلَك, or both (default). */
  script?: "both" | "en" | "ar"
  /** Cap height driver in px for the Latin name. */
  size?: number
  /** "foil" sets the mark in foil; "ink" keeps everything foreground. */
  tone?: "foil" | "ink"
  /** Hide the mark and set type only. */
  noMark?: boolean
  href?: string
}
export function Wordmark({ script = "both", size = 22, tone = "foil", noMark, href, className, style, ...p }: WordmarkProps) {
  const inner = (
    <>
      {!noMark && <Mark size={size * 1.5} className="mk-wordmark-mark" />}
      {script !== "ar" && <span className="mk-wordmark-en" lang="en">MALAK</span>}
      {script === "both" && <span className="mk-wordmark-sep" aria-hidden />}
      {script !== "en" && <span className="mk-wordmark-ar" lang="ar">مَلَك</span>}
    </>
  )
  const props = {
    className: cn("mk-wordmark", "mk-wordmark-" + tone, className),
    style: { ["--mk-wm" as any]: size + "px", ...style },
    "aria-label": "MALAK",
    ...p,
  }
  return href ? <a href={href} {...(props as any)}>{inner}</a> : <span {...props}>{inner}</span>
}
