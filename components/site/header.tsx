"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import * as React from "react";
import { Menu, Moon, Sun, UserRound, X } from "lucide-react";
import { Wordmark } from "@/components/malak/wordmark";
import { Segmented } from "@/components/malak/controls";
import { CATEGORIES, CategoryId } from "@/lib/data";
import { useApp } from "@/lib/store";
import { cn } from "@/lib/utils";
import { ScrollMeter } from "./scroll-fx";

export function LangToggle({ size = "sm" }: { size?: "sm" | "md" }) {
  const { lang, setLang, t } = useApp();
  return (
    <Segmented size={size} label={t("اللغة", "Language")} value={lang} onChange={(v) => setLang(v as "ar" | "en")}
      options={[{ value: "ar", label: "ع", ariaLabel: "العربية" }, { value: "en", label: "EN", ariaLabel: "English" }]} />
  );
}

export function ThemeToggle() {
  const { dark, setDark, t } = useApp();
  return (
    <button type="button" onClick={() => setDark(!dark)} aria-label={dark ? t("الوضع الفاتح", "Light theme") : t("الوضع الداكن", "Dark theme")}
      className="focus-ring group grid h-10 w-10 place-items-center rounded-sm text-foreground hover:bg-muted">
      {dark ? <Sun size={19} strokeWidth={1.5} className="transition-transform duration-500 group-hover:rotate-90" />
            : <Moon size={19} strokeWidth={1.5} className="transition-transform duration-300 group-hover:-rotate-12" />}
    </button>
  );
}

export function Header() {
  const { t, chooseCategory, user, lang } = useApp();
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const go = (c: CategoryId) => { chooseCategory(c); setOpen(false); router.push("/design/template/"); };
  const primary = CATEGORIES.filter((c) => c.primary);

  React.useEffect(() => {
    if (!open) return;
    const k = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, [open]);

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <ScrollMeter />
      <div className="container flex h-16 items-center gap-4">
        <Link href="/" className="focus-ring -m-1 rounded-sm p-1" aria-label="MALAK — home">
          <span className="hidden sm:inline"><Wordmark size={lang === "ar" ? 16 : 17} /></span>
          <span className="sm:hidden"><Wordmark size={15} script={lang === "ar" ? "ar" : "en"} /></span>
        </Link>
        <nav className="ms-6 hidden items-center gap-1 lg:flex" aria-label={t("الأقسام", "Sections")}>
          {primary.map((c) => (
            <button key={c.id} onClick={() => go(c.id)} className="focus-ring rounded-sm px-3 py-2 text-[14px] text-subtle transition-colors hover:text-foreground">
              {t(c.name.ar, c.name.en)}
            </button>
          ))}
          <Link href="/#how" className="focus-ring rounded-sm px-3 py-2 text-[14px] text-subtle transition-colors hover:text-foreground">{t("كيف تعمل؟", "How it works")}</Link>
        </nav>
        <div className="ms-auto flex items-center gap-1 sm:gap-2">
          <LangToggle />
          <ThemeToggle />
          <Link href="/login/" className="focus-ring hidden items-center gap-2 rounded-sm border border-border-strong px-3 py-2 text-[13px] font-semibold hover:border-foreground sm:inline-flex">
            <UserRound size={16} strokeWidth={1.5} />
            {user ? user.name : t("تسجيل الدخول", "Log in")}
          </Link>
          <button className="focus-ring grid h-10 w-10 place-items-center rounded-sm lg:hidden" onClick={() => setOpen(true)} aria-label={t("القائمة", "Menu")} aria-expanded={open}>
            <Menu size={20} strokeWidth={1.5} />
          </button>
        </div>
      </div>

      {/* Mobile sheet */}
      <div className={cn("fixed inset-0 z-50 overflow-hidden lg:hidden", open ? "visible" : "invisible")} aria-hidden={!open}>
        <div className={cn("absolute inset-0 bg-black/40 transition-opacity duration-300", open ? "opacity-100" : "opacity-0")} onClick={() => setOpen(false)} />
        <div role="dialog" aria-modal="true" aria-label={t("القائمة", "Menu")}
          className={cn("absolute inset-y-0 end-0 flex w-[min(340px,86vw)] flex-col gap-1 border-s border-border bg-background p-4 shadow-lg transition-transform duration-300 ease-out",
            open ? "translate-x-0" : "ltr:translate-x-full rtl:-translate-x-full")}>
          <div className="mb-4 flex items-center justify-between">
            <Wordmark size={15} />
            <button className="focus-ring grid h-10 w-10 place-items-center rounded-sm" onClick={() => setOpen(false)} aria-label={t("إغلاق", "Close")}><X size={20} strokeWidth={1.5} /></button>
          </div>
          {CATEGORIES.map((c) => (
            <button key={c.id} onClick={() => go(c.id)} className="focus-ring flex min-h-[48px] items-center justify-between rounded-sm px-3 text-start text-[15px] hover:bg-muted">
              <span>{t(c.name.ar, c.name.en)}</span>
              {!c.primary && <span className="text-[12px] text-subtle">{t("مناسبات أخرى", "More occasions")}</span>}
            </button>
          ))}
          <Link href="/#how" onClick={() => setOpen(false)} className="focus-ring flex min-h-[48px] items-center rounded-sm px-3 text-[15px] hover:bg-muted">{t("كيف تعمل؟", "How it works")}</Link>
          <Link href="/login/" onClick={() => setOpen(false)} className="mk-btn mk-btn-secondary mt-auto">{user ? user.name : t("تسجيل الدخول", "Log in")}</Link>
        </div>
      </div>
    </header>
  );
}
