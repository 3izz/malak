"use client";

import Link from "next/link";
import * as React from "react";
import { cn } from "@/lib/utils";
import { ArrowIcon } from "@/components/malak/icons";

type V = "primary" | "secondary" | "ghost" | "foil";
export function ButtonLink({ href, variant = "secondary", size = "md", next, full, className, children, onClick }: {
  href: string; variant?: V; size?: "md" | "sm"; next?: boolean; full?: boolean; className?: string; children: React.ReactNode; onClick?: () => void;
}) {
  return (
    <Link href={href} onClick={onClick} className={cn("mk-btn", "mk-btn-" + variant, "mk-btn-" + size, full && "mk-btn-full", className)}>
      <span>{children}</span>
      {next && <ArrowIcon size={18} />}
    </Link>
  );
}

export function Section({ id, className, children }: { id?: string; className?: string; children: React.ReactNode }) {
  return <section id={id} className={cn("py-12 md:py-24", className)}>{children}</section>;
}

export function Eyebrow({ children, className }: { children: React.ReactNode; className?: string }) {
  return <p className={cn("mk-eyebrow", className)}>{children}</p>;
}

/** Chip-like toggle used for filters and curated choices: crisp corners, never pills. */
export function Chip({ selected, onClick, children, className, swatch, ...rest }: {
  selected?: boolean; onClick?: () => void; children: React.ReactNode; className?: string; swatch?: string;
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button type="button" aria-pressed={selected} onClick={onClick}
      className={cn(
        "focus-ring inline-flex min-h-[38px] items-center gap-2 rounded-xs border px-3 text-[13px] font-medium transition-colors duration-150",
        selected ? "border-primary bg-primary-soft text-foreground" : "border-border-strong bg-card text-subtle hover:border-foreground hover:text-foreground",
        className)}
      {...rest}>
      {swatch && <span className="h-4 w-4 shrink-0 rounded-xs border border-black/15" style={{ background: swatch }} aria-hidden />}
      {children}
    </button>
  );
}

export function Panel({ className, children }: { className?: string; children: React.ReactNode }) {
  return <div className={cn("rounded border border-border bg-card p-4 shadow-sm md:p-6", className)}>{children}</div>;
}
