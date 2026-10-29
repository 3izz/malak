"use client";

import Link from "next/link";
import * as React from "react";
import { ArrowLeft, Check, Copy, Eye, Sparkles } from "lucide-react";
import { EInvite } from "@/components/einvite/einvite";
import { EInviteData, decodeEInvite, inviteLink, sampleEInvite } from "@/lib/einvite";
import { useApp } from "@/lib/store";

type Mode = "guest" | "demo" | "owner";

/**
 * The page guests open. `/invite/#<payload>` is a shared invitation, `/invite/#demo` is the sample with fictional names,
 * and plain `/invite/` previews the visitor's own draft.
 */
export default function InvitePage() {
  const { ready, einvite, kind, t } = useApp();
  const [hash, setHash] = React.useState<string | null>(null);
  const [copied, setCopied] = React.useState(false);
  React.useEffect(() => {
    const read = () => setHash(window.location.hash.slice(1));
    read();
    window.addEventListener("hashchange", read);
    return () => window.removeEventListener("hashchange", read);
  }, []);

  let mode: Mode = "owner", data: EInviteData | null = null;
  if (hash === null || (!hash && !ready)) data = null;
  else if (hash === "demo") { mode = "demo"; data = sampleEInvite(); }
  else if (hash) { mode = "guest"; data = decodeEInvite(hash) ?? sampleEInvite(); }
  else if (kind === "invite") data = einvite;
  else { mode = "demo"; data = sampleEInvite(); }

  React.useEffect(() => {
    if (!data) return;
    const c = data.content[data.lang === "en" ? "en" : "ar"];
    document.title = [c.nameA, c.nameB].filter(Boolean).join(data.lang === "en" ? " & " : " و ") + " — " + (data.lang === "en" ? "Invitation" : "دعوة");
  }, [data]);

  if (!data) return <div className="min-h-screen bg-background" />;

  const copy = async () => {
    try { await navigator.clipboard.writeText(inviteLink(einvite)); setCopied(true); setTimeout(() => setCopied(false), 2200); } catch { /* clipboard blocked */ }
  };

  return (
    <>
      {mode !== "guest" && (
        <div className="fixed inset-x-0 top-0 z-[60] border-b border-border bg-background/95 backdrop-blur" dir={t("rtl", "ltr")}>
          <div className="mx-auto flex max-w-[640px] items-center gap-3 px-4 py-2.5 text-[13px]">
            {mode === "demo" ? <Sparkles size={16} className="shrink-0 text-foil" /> : <Eye size={16} className="shrink-0 text-foil" />}
            <p className="min-w-0 flex-1 leading-5">
              {mode === "demo"
                ? t("دعوة تجريبية للشرح — الأسماء والأرقام وهمية.", "Sample invitation — the names and numbers are made up.")
                : t("معاينة دعوتك الإلكترونية — هيك رح يشوفها ضيوفك.", "Previewing your e-invitation — this is what guests will see.")}
            </p>
            {mode === "demo"
              ? <Link href="/design/type/" className="mk-btn mk-btn-primary mk-btn-sm shrink-0">{t("صمّم دعوتك", "Make yours")}</Link>
              : <>
                  <button type="button" onClick={copy} className="mk-btn mk-btn-secondary mk-btn-sm shrink-0">{copied ? <Check size={15} /> : <Copy size={15} />}<span>{copied ? t("انتسخ", "Copied") : t("انسخ الرابط", "Copy link")}</span></button>
                  <Link href="/design/print/" className="mk-btn mk-btn-ghost mk-btn-sm shrink-0" aria-label={t("رجوع للتصميم", "Back to design")}><ArrowLeft size={16} className="rtl:-scale-x-100" /></Link>
                </>}
          </div>
        </div>
      )}
      <EInvite data={data} className={mode !== "guest" ? "pt-12" : undefined} />
    </>
  );
}
