"use client";

/*
 * Stepper primitives adapted from the 21st.dev / origin-ui stepper (stepper.tsx): same API
 * (Stepper, StepperItem, StepperTrigger, StepperIndicator, StepperTitle, StepperDescription,
 * StepperSeparator), restyled for MALAK — diamond indicators, a hairline rail that fills toward
 * the reading direction, RTL-aware, no lucide / radix dependency.
 */
import * as React from "react"
import { createContext, useContext } from "react"
import { CheckIcon, SpinnerIcon } from "@/components/malak/icons"
import { cn } from "@/lib/utils"

type StepState = "active" | "completed" | "inactive" | "loading"
type StepperContextValue = { activeStep: number; setActiveStep: (s: number) => void; orientation: "horizontal" | "vertical" }
type StepItemContextValue = { step: number; state: StepState; isDisabled: boolean; isLoading: boolean }
const StepperContext = createContext<StepperContextValue | undefined>(undefined)
const StepItemContext = createContext<StepItemContextValue | undefined>(undefined)
export const useStepper = () => { const c = useContext(StepperContext); if (!c) throw new Error("useStepper must be used within a Stepper"); return c }
export const useStepItem = () => { const c = useContext(StepItemContext); if (!c) throw new Error("useStepItem must be used within a StepperItem"); return c }

export interface StepperProps extends React.HTMLAttributes<HTMLDivElement> {
  defaultValue?: number; value?: number; onValueChange?: (v: number) => void; orientation?: "horizontal" | "vertical"
}
export const Stepper = React.forwardRef<HTMLDivElement, StepperProps>(
  ({ defaultValue = 0, value, onValueChange, orientation = "horizontal", className, ...props }, ref) => {
    const [internal, setInternal] = React.useState(defaultValue)
    const setActiveStep = React.useCallback((s: number) => { if (value === undefined) setInternal(s); onValueChange?.(s) }, [value, onValueChange])
    const activeStep = value ?? internal
    return (
      <StepperContext.Provider value={{ activeStep, setActiveStep, orientation }}>
        <div ref={ref} className={cn("mk-stepper", className)} data-orientation={orientation} {...props} />
      </StepperContext.Provider>
    )
  })
Stepper.displayName = "Stepper"

export interface StepperItemProps extends React.HTMLAttributes<HTMLDivElement> { step: number; completed?: boolean; disabled?: boolean; loading?: boolean }
export const StepperItem = React.forwardRef<HTMLDivElement, StepperItemProps>(
  ({ step, completed = false, disabled = false, loading = false, className, children, ...props }, ref) => {
    const { activeStep } = useStepper()
    const state: StepState = completed || step < activeStep ? "completed" : activeStep === step ? "active" : "inactive"
    const isLoading = loading && step === activeStep
    return (
      <StepItemContext.Provider value={{ step, state, isDisabled: disabled, isLoading }}>
        <div ref={ref} className={cn("mk-step", className)} data-state={state} {...(isLoading ? { "data-loading": true } : {})} {...props}>{children}</div>
      </StepItemContext.Provider>
    )
  })
StepperItem.displayName = "StepperItem"

export interface StepperTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> { asChild?: boolean }
export const StepperTrigger = React.forwardRef<HTMLButtonElement, StepperTriggerProps>(({ asChild = false, className, children, ...props }, ref) => {
  const { setActiveStep, activeStep } = useStepper()
  const { step, isDisabled, state } = useStepItem()
  if (asChild) return <div className={cn("mk-step-trigger", className)}>{children}</div>
  return (
    <button ref={ref} type="button" className={cn("mk-step-trigger", className)} onClick={() => setActiveStep(step)}
      disabled={isDisabled} aria-current={step === activeStep ? "step" : undefined} data-state={state} {...props}>{children}</button>
  )
})
StepperTrigger.displayName = "StepperTrigger"

export interface StepperIndicatorProps extends React.HTMLAttributes<HTMLDivElement> { asChild?: boolean }
export const StepperIndicator = React.forwardRef<HTMLDivElement, StepperIndicatorProps>(({ asChild = false, className, children, ...props }, ref) => {
  const { state, step, isLoading } = useStepItem()
  return (
    <div ref={ref} className={cn("mk-step-indicator", className)} data-state={state} {...props}>
      <span className="mk-step-indicator-face">
        {asChild ? children : (
          <>
            <span className="mk-step-num">{step}</span>
            <CheckIcon size={15} className="mk-step-check" />
            {isLoading && <SpinnerIcon size={14} className="mk-step-spin" />}
          </>
        )}
      </span>
    </div>
  )
})
StepperIndicator.displayName = "StepperIndicator"

export const StepperTitle = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(({ className, ...p }, ref) => <h3 ref={ref} className={cn("mk-step-title", className)} {...p} />)
StepperTitle.displayName = "StepperTitle"
export const StepperDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(({ className, ...p }, ref) => <p ref={ref} className={cn("mk-step-desc", className)} {...p} />)
StepperDescription.displayName = "StepperDescription"
export const StepperSeparator = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, ...p }, ref) => (
  <div ref={ref} className={cn("mk-step-sep", className)} aria-hidden {...p}><span className="mk-step-sep-fill" /></div>
))
StepperSeparator.displayName = "StepperSeparator"

/* ---------- The six-step MALAK journey ---------- */
export const JOURNEY_STEPS = [
  { ar: "اختر نوع البطاقة", en: "Choose card type" },
  { ar: "اختر التصميم", en: "Choose a template" },
  { ar: "خصّص البطاقة", en: "Customize" },
  { ar: "راجع المعاينة", en: "Preview" },
  { ar: "اختر الطباعة", en: "Print options" },
  { ar: "أكمل الطلب", en: "Checkout" },
]

export interface JourneyStepperProps extends Omit<React.HTMLAttributes<HTMLElement>, "onChange"> {
  /** Current step, 1–6. */
  value: number
  onValueChange?: (step: number) => void
  /** Furthest step the customer has reached; later steps are disabled. Defaults to `value`. */
  reached?: number
  lang?: "ar" | "en"
  /** Show a spinner in the active indicator (e.g. while a simulated save runs). */
  loading?: boolean
}
export function JourneyStepper({ value, onValueChange, reached, lang = "ar", loading, className, ...p }: JourneyStepperProps) {
  const max = Math.max(reached ?? value, value)
  const label = (i: number) => JOURNEY_STEPS[i - 1][lang]
  const of = lang === "ar" ? `الخطوة ${value} من ${JOURNEY_STEPS.length}` : `Step ${value} of ${JOURNEY_STEPS.length}`
  return (
    <nav className={cn("mk-journey", className)} dir={lang === "ar" ? "rtl" : "ltr"} lang={lang}
      aria-label={lang === "ar" ? "خطوات التصميم" : "Design steps"} {...p}>
      <Stepper value={value} onValueChange={onValueChange}>
        {JOURNEY_STEPS.map((_, i) => {
          const step = i + 1
          return (
            <StepperItem key={step} step={step} disabled={step > max} loading={loading} className="mk-journey-item">
              <StepperTrigger aria-label={`${step}. ${label(step)}`}>
                <StepperIndicator />
                <StepperTitle className="mk-journey-title">{label(step)}</StepperTitle>
              </StepperTrigger>
              {step < JOURNEY_STEPS.length && <StepperSeparator />}
            </StepperItem>
          )
        })}
      </Stepper>
      <p className="mk-journey-caption" aria-live="polite"><span>{of}</span> · <strong>{label(value)}</strong></p>
    </nav>
  )
}
