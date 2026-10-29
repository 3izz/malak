"use client";

import Link from "next/link";
import { Wordmark } from "@/components/malak/wordmark";
import { useApp } from "@/lib/store";

export function Footer() {
  const { t } = useApp();
  return (
    <footer className="border-t border-border">
      <div className="container grid gap-8 py-12 md:grid-cols-[1.4fr_1fr_1fr]">
        <div className="space-y-3">
          <Wordmark size={16} />
          <p className="max-w-sm text-[14px] leading-6 text-subtle">
            {t("استوديو أردني لتصميم الدعوات وبطاقات الأعمال — صمّمها بدقائق، وعاينها قبل الطباعة.", "A Jordanian studio for invitations and business cards — design in minutes, preview before you print.")}
          </p>
        </div>
        <nav className="space-y-2 text-[14px]" aria-label={t("روابط", "Links")}>
          <Link className="block text-subtle hover:text-foreground" href="/design/type/">{t("ابدأ التصميم", "Start designing")}</Link>
          <Link className="block text-subtle hover:text-foreground" href="/design/template/">{t("التصاميم", "Designs")}</Link>
          <Link className="block text-subtle hover:text-foreground" href="/login/">{t("تسجيل الدخول", "Log in")}</Link>
        </nav>
        <p className="text-[13px] leading-6 text-subtle">
          {t("نموذج أولي للعرض فقط — لا يتم تنفيذ طلبات أو دفعات حقيقية.", "Showcase prototype — no real orders or payments are processed.")}
          <br />© 2026 MALAK
        </p>
      </div>
    </footer>
  );
}
