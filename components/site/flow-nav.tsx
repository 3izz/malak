"use client";

import Link from "next/link";
import * as React from "react";
import { Button } from "@/components/malak/controls";
import { ArrowIcon } from "@/components/malak/icons";
import { useApp } from "@/lib/store";
import { cn, jod } from "@/lib/utils";

/** Back / continue bar. Sticky at the bottom on phones (one-handed), inline on desktop. */
export function FlowNav({ back, next, onNext, nextLabel, disabled, showPrice, className }: {
  back?: string; next?: string; onNext?: () => void; nextLabel?: string; disabled?: boolean; showPrice?: boolean; className?: string;
}) {
  const { t, price, lang } = useApp();
  const label = nextLabel ?? t("التالي", "Continue");
  return (
    <div className={cn("fixed inset-x-0 bottom-0 z-30 border-t border-border bg-background/95 shadow-lg backdrop-blur md:static md:mt-10 md:border-0 md:bg-transparent md:shadow-none md:backdrop-blur-none", className)}>
      <div className="container flex items-center gap-3 py-3 md:px-0">
        {back ? <Link href={back} className="mk-btn mk-btn-ghost">{t("رجوع", "Back")}</Link> : <span />}
        {showPrice && (
          <div className="ms-auto text-end leading-tight md:hidden">
            <p className="font-mono text-[15px] font-medium">{jod(price.total, lang)}</p>
            <p className="text-[11px] text-subtle">{t("تقدير تجريبي", "Prototype estimate")}</p>
          </div>
        )}
        <div className={cn(showPrice ? "" : "ms-auto")}>
          {onNext ? (
            <Button variant="primary" next disabled={disabled} onClick={onNext}>{label}</Button>
          ) : next ? (
            <Link href={next} aria-disabled={disabled} className={cn("mk-btn mk-btn-primary", disabled && "pointer-events-none opacity-50")}>
              <span>{label}</span><ArrowIcon size={18} />
            </Link>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export function StepIntro({ eyebrow, title, sub }: { eyebrow: string; title: string; sub?: string }) {
  return (
    <div className="animate-fade-up">
      <p className="mk-eyebrow">{eyebrow}</p>
      <h1 className="mt-2 text-[26px] font-semibold leading-tight md:text-[32px]">{title}</h1>
      {sub && <p className="mt-2 max-w-2xl text-[15px] leading-7 text-subtle">{sub}</p>}
    </div>
  );
}
