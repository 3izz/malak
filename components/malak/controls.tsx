"use client";

import * as React from "react"
import { AlertIcon, ArrowIcon, CheckIcon, InfoIcon, SpinnerIcon, StarIcon } from "./icons"
import { cn } from "@/lib/utils"

/* ---------- Button ---------- */
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "foil"
  size?: "md" | "sm"
  /** Adds a direction-aware arrow after the label (flips in RTL) that nudges on hover/focus. */
  next?: boolean
  loading?: boolean
  full?: boolean
}
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "secondary", size = "md", next, loading, full, className, children, disabled, ...p }, ref) => (
    <button ref={ref} type="button" className={cn("mk-btn", "mk-btn-" + variant, "mk-btn-" + size, full && "mk-btn-full", className)}
      disabled={disabled || loading} aria-busy={loading || undefined} {...p}>
      {loading && <SpinnerIcon size={16} />}
      <span>{children}</span>
      {next && !loading && <ArrowIcon size={18} />}
    </button>
  ))
Button.displayName = "Button"

/* ---------- Field ---------- */
export interface FieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
  hint?: string
  error?: string
  /** Fixed leading text inside the field, e.g. "+962". Sits on the inline-start side. */
  prefix?: string
  multiline?: boolean
}
export const Field = React.forwardRef<HTMLInputElement, FieldProps>(({ label, hint, error, prefix, multiline, id, className, dir, ...p }, ref) => {
  const auto = React.useId()
  const fid = id || auto
  const desc = error ? fid + "-err" : hint ? fid + "-hint" : undefined
  const common = { id: fid, "aria-invalid": !!error || undefined, "aria-describedby": desc, dir, className: "mk-field-input" }
  return (
    <div className={cn("mk-field", error && "mk-field-error", className)}>
      <label htmlFor={fid} className="mk-field-label">{label}</label>
      <div className="mk-field-box" dir={dir}>
        {prefix && <span className="mk-field-prefix">{prefix}</span>}
        {multiline ? <textarea {...(common as any)} {...(p as any)} rows={3} /> : <input ref={ref} {...common} {...p} />}
      </div>
      {error ? <p id={fid + "-err"} className="mk-field-msg mk-field-msg-error"><AlertIcon size={14} />{error}</p>
        : hint ? <p id={fid + "-hint"} className="mk-field-msg">{hint}</p> : null}
    </div>
  )
})
Field.displayName = "Field"

/* ---------- Checkbox ---------- */
export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> { label: React.ReactNode }
export function Checkbox({ label, className, id, ...p }: CheckboxProps) {
  const auto = React.useId()
  return (
    <label className={cn("mk-check", className)} htmlFor={id || auto}>
      <input type="checkbox" id={id || auto} {...p} />
      <span className="mk-check-box" aria-hidden><CheckIcon size={14} /></span>
      <span className="mk-check-label">{label}</span>
    </label>
  )
}

/* ---------- Segmented ---------- */
export interface SegmentedOption { value: string; label: React.ReactNode; ariaLabel?: string }
export interface SegmentedProps { options: SegmentedOption[]; value: string; onChange?: (v: string) => void; label: string; size?: "md" | "sm"; className?: string }
export function Segmented({ options, value, onChange, label, size = "md", className }: SegmentedProps) {
  const refs = React.useRef<(HTMLButtonElement | null)[]>([])
  const idx = Math.max(0, options.findIndex((o) => o.value === value))
  const move = (e: React.KeyboardEvent) => {
    const rtl = getComputedStyle(e.currentTarget).direction === "rtl"
    const fwd = rtl ? "ArrowLeft" : "ArrowRight", back = rtl ? "ArrowRight" : "ArrowLeft"
    let n = idx
    if (e.key === fwd || e.key === "ArrowDown") n = (idx + 1) % options.length
    else if (e.key === back || e.key === "ArrowUp") n = (idx - 1 + options.length) % options.length
    else return
    e.preventDefault(); onChange?.(options[n].value); refs.current[n]?.focus()
  }
  return (
    <div role="radiogroup" aria-label={label} className={cn("mk-seg", "mk-seg-" + size, className)} onKeyDown={move}
      style={{ ["--mk-seg-n" as any]: options.length, ["--mk-seg-i" as any]: idx }}>
      <span className="mk-seg-thumb" aria-hidden />
      {options.map((o, i) => (
        <button key={o.value} ref={(el) => { refs.current[i] = el }} type="button" role="radio" aria-checked={o.value === value}
          aria-label={o.ariaLabel} tabIndex={o.value === value ? 0 : -1} className="mk-seg-opt" onClick={() => onChange?.(o.value)}>{o.label}</button>
      ))}
    </div>
  )
}

/* ---------- Notice ---------- */
export interface NoticeProps extends React.HTMLAttributes<HTMLDivElement> { tone?: "prototype" | "info" | "success" | "error"; title?: string }
export function Notice({ tone = "info", title, className, children, ...p }: NoticeProps) {
  const Icon = tone === "error" ? AlertIcon : tone === "success" ? CheckIcon : tone === "prototype" ? StarIcon : InfoIcon
  return (
    <div role={tone === "error" ? "alert" : "status"} className={cn("mk-notice", "mk-notice-" + tone, className)} {...p}>
      <Icon size={18} className="mk-notice-icon" />
      <div>{title && <p className="mk-notice-title">{title}</p>}<div className="mk-notice-body">{children}</div></div>
    </div>
  )
}
