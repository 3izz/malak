"use client";

import * as React from "react"
import { GlassIconReveal } from "@/components/ui/liquid-glass-logo-reveal"
import { MARK_SVG, Wordmark } from "./wordmark"
import { cn } from "@/lib/utils"
import { tokenHex, useReducedMotion, useThemeKey } from "./motion"

export interface MalakLoaderProps {
  /** Called once the loader has fully left (after its exit fade) or was skipped. */
  onDone?: () => void
  /** Fill the parent instead of covering the viewport (for previews and embedded stages). */
  contained?: boolean
  /** Interface language for the skip control and the live-region text. */
  lang?: "ar" | "en"
  /** Mark colour: champagne foil (default) or the theme's mauve. */
  tone?: "foil" | "primary"
  /** Force the non-WebGL fallback (it is also used automatically when WebGL2 is unavailable). */
  disableWebGL?: boolean
  /** Stay on screen after the reveal instead of exiting (showcase only). */
  persist?: boolean
  className?: string
}

/* Timeline (ms). Whole thing stays inside duration-loader (2600ms) plus a 360ms exit fade. */
const REVEAL_TUNING = { glide: 1.0, present: 1.25, startZoom: 2.1, response: 0.38, sheen: 0.8, lightTurn: 0.7 }
const WORDMARK_AT = 1250
const EXIT_AT = 2350
const EXIT_MS = 360
const REDUCED_EXIT_AT = 700

export function MalakLoader({ onDone, contained, lang = "ar", tone = "foil", disableWebGL, persist, className }: MalakLoaderProps) {
  const reduce = useReducedMotion()
  const themeKey = useThemeKey()
  const [phase, setPhase] = React.useState<"reveal" | "word" | "exit" | "gone">(reduce ? "word" : "reveal")
  const done = React.useRef(false)

  const colors = React.useMemo(() => ({
    bg: tokenHex("--background", "#eff1f5"),
    mark: tone === "foil" ? tokenHex("--foil", "#8a6327") : tokenHex("--primary", "#8839ef"),
    plate: tokenHex("--card", "#ffffff"),
  }), [tone, themeKey])
  const darkGround = React.useMemo(() => {
    const v = parseInt(colors.bg.slice(1), 16)
    return 0.2126 * ((v >> 16) & 255) + 0.7152 * ((v >> 8) & 255) + 0.0722 * (v & 255) < 128
  }, [colors.bg])

  const finish = React.useCallback(() => {
    if (done.current) return
    done.current = true
    setPhase("exit")
    window.setTimeout(() => { setPhase("gone"); onDone?.() }, reduce ? 200 : EXIT_MS)
  }, [onDone, reduce])

  React.useEffect(() => {
    const t: number[] = []
    if (reduce) {
      setPhase("word")
      if (!persist) t.push(window.setTimeout(finish, REDUCED_EXIT_AT))
    } else {
      t.push(window.setTimeout(() => setPhase((p) => (p === "reveal" ? "word" : p)), WORDMARK_AT))
      if (!persist) t.push(window.setTimeout(finish, EXIT_AT))
    }
    const key = (e: KeyboardEvent) => { if (e.key === "Escape") finish() }
    window.addEventListener("keydown", key)
    return () => { t.forEach(clearTimeout); window.removeEventListener("keydown", key) }
  }, [reduce, persist, finish])

  if (phase === "gone") return null
  const skip = lang === "ar" ? "تخطّي" : "Skip"
  return (
    <div className={cn("mk-loader", contained && "mk-loader-contained", className)} data-phase={phase}
      dir={lang === "ar" ? "rtl" : "ltr"} role="status" aria-live="polite" aria-label={lang === "ar" ? "جارٍ تحميل مَلَك" : "Loading MALAK"}
      onClick={finish}>
      <div className="mk-loader-stage">
        {reduce ? (
          <span className="mk-loader-still" aria-hidden />
        ) : (
          <GlassIconReveal
            className="mk-loader-glass"
            logo={MARK_SVG}
            label="MALAK"
            look={darkGround ? "dark" : "light"}
            background={colors.bg}
            logoColor={colors.mark}
            plateColor={colors.plate}
            iconPlate={false}
            tileSize={200}
            logoScale={0.62}
            finalScale={0.78}
            loop={false}
            disableWebGL={disableWebGL}
            tuning={darkGround ? { ...REVEAL_TUNING, halo: 0.6 } : REVEAL_TUNING}
          />
        )}
      </div>
      <Wordmark className="mk-loader-word" noMark size={contained ? 18 : 22} tone="ink" />
      <button type="button" className="mk-loader-skip" onClick={(e) => { e.stopPropagation(); finish() }}>{skip}</button>
    </div>
  )
}
