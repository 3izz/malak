"use client";

import * as React from "react"


/** True when the visitor asked the OS for less motion. Re-renders if that changes. */
export function useReducedMotion() {
  const q = "(prefers-reduced-motion: reduce)"
  const [reduce, setReduce] = React.useState(false)
  React.useEffect(() => {
    const m = window.matchMedia(q)
    const on = () => setReduce(m.matches)
    on()
    m.addEventListener("change", on)
    return () => m.removeEventListener("change", on)
  }, [])
  return reduce
}

/** Resolve a CSS custom property (any colour syntax, oklch included) to #rrggbb via a 1×1 canvas. */
export function tokenHex(name: string, fallback: string, el: Element = document.documentElement) {
  const raw = getComputedStyle(el).getPropertyValue(name).trim()
  if (!raw) return fallback
  try {
    const probe = document.createElement("span")
    probe.style.color = `var(${name})`
    probe.style.display = "none"
    el.appendChild(probe)
    const css = getComputedStyle(probe).color
    probe.remove()
    const c = document.createElement("canvas")
    c.width = c.height = 1
    const ctx = c.getContext("2d", { willReadFrequently: true })!
    ctx.fillStyle = "#000"
    ctx.fillStyle = css
    ctx.fillRect(0, 0, 1, 1)
    const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data
    return "#" + [r, g, b].map((v) => v.toString(16).padStart(2, "0")).join("")
  } catch {
    return fallback
  }
}

/** Re-resolve token colours whenever the theme attribute on <html> changes. */
export function useThemeKey() {
  const [key, setKey] = React.useState(0)
  React.useEffect(() => {
    const mo = new MutationObserver(() => setKey((k) => k + 1))
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme", "class", "style"] })
    return () => mo.disconnect()
  }, [])
  return key
}
