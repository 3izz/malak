"use client";

import * as React from "react"
/*
 * MALAK interface glyphs: original 24px line icons, 1.5 stroke, round caps, drawn for this system.
 * In the product, interface icons come from the 21st.dev animated-icon collection (lucide-based);
 * keep each copied set's license header in source. These cover what the components need without
 * a network dependency. Animation is CSS-driven by the parent's state (hover/focus/data-state).
 */
type P = React.SVGProps<SVGSVGElement> & { size?: number }
const base = (size = 20, p: P) => ({
  width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor",
  strokeWidth: 1.5, strokeLinecap: "round" as const, strokeLinejoin: "round" as const, "aria-hidden": true, ...p,
})
export const CheckIcon = ({ size, ...p }: P) => <svg {...base(size, p)} className={"mk-ico mk-ico-check " + (p.className || "")}><path pathLength={1} d="M5 12.5l4.5 4.5L19 7.5" /></svg>
export const SpinnerIcon = ({ size, ...p }: P) => <svg {...base(size, p)} className={"mk-ico mk-ico-spin " + (p.className || "")}><path d="M21 12a9 9 0 1 1-6.2-8.56" /></svg>
export const ArrowIcon = ({ size, ...p }: P) => <svg {...base(size, p)} className={"mk-ico mk-ico-arrow " + (p.className || "")}><path d="M5 12h14M13 6l6 6-6 6" /></svg>
export const AlertIcon = ({ size, ...p }: P) => <svg {...base(size, p)} className={"mk-ico " + (p.className || "")}><path d="M12 3.5l9.5 16.5h-19z" /><path d="M12 10v4.5M12 17.2v.1" /></svg>
export const InfoIcon = ({ size, ...p }: P) => <svg {...base(size, p)} className={"mk-ico " + (p.className || "")}><circle cx="12" cy="12" r="9" /><path d="M12 11v5.5M12 7.8v.1" /></svg>
export const StarIcon = ({ size, ...p }: P) => <svg {...base(size, p)} className={"mk-ico mk-ico-star " + (p.className || "")}><path d="M12 2.5c.5 5.6 1.4 7.6 6.5 9.5-5.1 1.9-6 3.9-6.5 9.5-.5-5.6-1.4-7.6-6.5-9.5 5.1-1.9 6-3.9 6.5-9.5z" /></svg>
