"use client";

import Link from "next/link";
import * as React from "react";
import { Check, Copy, ExternalLink, MessageCircle, Music2, Package, Smartphone } from "lucide-react";
import { Checkbox, Field, Notice } from "@/components/malak/controls";
import { PhoneMock } from "./einvite";
import { EInviteExtras, EVENT_TITLE, inviteLink, isPast } from "@/lib/einvite";
import { useApp } from "@/lib/store";

/** "Your order = a card that comes to you + an e-invitation you send": the two halves, side by side. */
export function OrderExplainer({ digital }: { digital: boolean }) {
  const { t } = useApp();
  const items = [
    !digital && { icon: Package, title: t("بطاقتك المطبوعة", "Your printed cards"), body: t("بتنطبع على ورق فاخر وبتوصلك لباب البيت خلال ٣–٥ أيام.", "Printed on fine paper and delivered to your door in 3–5 days.") },
    { icon: Smartphone, title: t("دعوتك الإلكترونية", "Your e-invitation"), body: t("رابط بتبعته لضيوفك على واتساب: بيفتحوا الظرف، بتشتغل الأغنية، وبيشوفوا الموعد والموقع.", "A link you send on WhatsApp: guests open the envelope, the song plays, and they see the date and map.") },
  ].filter(Boolean) as { icon: typeof Package; title: string; body: string }[];
  return (
    <div className="rounded border border-border bg-card p-5">
      <p className="text-[13px] font-semibold text-foil">{digital ? t("شو رح يوصلك؟", "What you'll get") : t("طلبك فيه شغلتين:", "Your order comes in two parts:")}</p>
      <div className={digital ? "mt-3" : "mt-3 grid gap-4 sm:grid-cols-[1fr_auto_1fr] sm:items-center"}>
        {items.map((x, i) => (
          <React.Fragment key={i}>
            {i > 0 && <span className="hidden text-[22px] font-light text-foil sm:block" aria-hidden>+</span>}
            <div className="flex gap-3">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-sm bg-foil-soft text-foil"><x.icon size={20} strokeWidth={1.6} /></span>
              <div><p className="font-semibold">{x.title}</p><p className="mt-0.5 text-[14px] leading-6 text-subtle">{x.body}</p></div>
            </div>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

/** Settings and live preview of the e-invitation, shown in the print step for invitations. */
export function EInviteSettings({ digital }: { digital: boolean }) {
  const { t, einvite, update } = useApp();
  const x = einvite.extras;
  const set = (p: Partial<EInviteExtras>) => update({ einvite: { ...x, ...p } });
  return (
    <section className="rounded border bg-card p-5 md:p-6" style={{ borderColor: "color-mix(in oklab, var(--foil) 45%, transparent)" }} aria-labelledby="ei-settings">
      <div className="flex flex-wrap items-center gap-2">
        <h2 id="ei-settings" className="text-[20px] font-semibold">{t("دعوتك الإلكترونية", "Your e-invitation")}</h2>
        <span className="rounded-xs bg-foil-soft px-2 py-0.5 text-[12px] font-semibold text-foil">{digital ? t("هي طلبك", "This is your order") : t("مجانًا مع طلبك", "Free with your order")}</span>
      </div>
      <p className="mt-1 text-[14px] leading-6 text-subtle">{t("نفس تصميم بطاقتك ونفس الأسماء والموعد — جرّبها هون: اضغط على الظرف.", "Same design, names and date as your card — try it here: tap the envelope.")}</p>

      <div className="mt-6 grid items-start gap-8 md:grid-cols-[auto_1fr]">
        <div className="mx-auto">
          <PhoneMock data={einvite} scale={0.6} />
          <Link href="/invite/" target="_blank" className="mk-btn mk-btn-ghost mk-btn-sm mt-3 w-full"><ExternalLink size={15} /><span>{t("افتحها بصفحة كاملة", "Open full page")}</span></Link>
        </div>
        <div className="space-y-5">
          {isPast(einvite) && (
            <Notice tone="info" title={t("التاريخ بالماضي", "The date has passed")}>
              {t("عدّاد الحفل بيشتغل لما تحط تاريخ مناسبتك الحقيقي من خطوة «خصّص البطاقة».", "The countdown starts once you set your real date in the Customize step.")}
            </Notice>
          )}
          <div className="rounded-sm border border-border bg-background p-4">
            <Checkbox checked={x.music} onChange={(e) => set({ music: e.target.checked })}
              label={<span><span className="flex items-center gap-1.5 font-semibold"><Music2 size={15} className="text-foil" />{t("أغنية زفة", "Wedding song")}</span>
                <span className="mt-0.5 block text-[13px] text-subtle">{t("بتشتغل أول ما الضيف يفتح الظرف، وفي زر لإيقافها.", "Starts when a guest opens the envelope, with a button to pause it.")}</span></span>} />
          </div>
          <fieldset className="space-y-4">
            <legend className="mb-1 font-semibold">{t("رقم للاستفسار", "Contact for questions")}</legend>
            <p className="text-[13px] leading-5 text-subtle">{t("بيظهر بالدعوة مع زر اتصال وواتساب. اتركه فاضي إذا ما بدك.", "Shown with call and WhatsApp buttons. Leave empty to hide it.")}</p>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label={t("الاسم", "Name")} value={x.contactName} placeholder={t("مثلًا: أحمد (أخو العريس)", "e.g. Ahmad (groom's brother)")} onChange={(e) => set({ contactName: e.target.value })} />
              <Field label={t("رقم الهاتف", "Phone number")} dir="ltr" inputMode="tel" value={x.contactPhone} placeholder="079 123 4567" onChange={(e) => set({ contactPhone: e.target.value })} />
            </div>
          </fieldset>
          <Field label={t("رابط الموقع على خرائط جوجل (اختياري)", "Google Maps link (optional)")} dir="ltr" inputMode="url" value={x.mapUrl} placeholder="https://maps.app.goo.gl/…"
            onChange={(e) => set({ mapUrl: e.target.value.trim() })}
            error={x.mapUrl && !/^https:\/\//i.test(x.mapUrl) ? t("الرابط لازم يبلّش بـ https://", "The link must start with https://") : undefined}
            hint={t("إذا ما حطيت رابط، زر الخريطة بيدوّر على اسم القاعة.", "Without a link, the map button searches for the venue name.")} />
          <p className="rounded-sm bg-muted/60 px-4 py-3 text-[13px] leading-6 text-subtle">
            {t("بعد تأكيد الطلب بيوصلك رابط الدعوة الإلكترونية، وبتقدر تبعته لضيوفك على واتساب بكبسة وحدة.", "Once you confirm the order you get the e-invitation link, ready to send on WhatsApp in one tap.")}
          </p>
        </div>
      </div>
    </section>
  );
}

/** Order confirmation: the e-invitation link, ready to copy, send on WhatsApp or open. */
export function EInviteShare() {
  const { t, einvite } = useApp();
  const [copied, setCopied] = React.useState(false);
  const [link, setLink] = React.useState("");
  React.useEffect(() => setLink(inviteLink(einvite)), [einvite]);
  const ui = einvite.lang === "en" ? "en" : "ar";
  const c = einvite.content[ui];
  const names = [c.nameA, c.nameB].filter(Boolean).join(ui === "ar" ? " و " : " & ");
  const message = ui === "ar"
    ? `💌 ${EVENT_TITLE[einvite.category].ar} — ${names}\nيسعدنا حضوركم، افتحوا الدعوة من هون:\n${link}`
    : `💌 ${EVENT_TITLE[einvite.category].en} — ${names}\nWe'd love you to be there. Open the invitation:\n${link}`;
  const copy = async () => {
    try { await navigator.clipboard.writeText(link); setCopied(true); setTimeout(() => setCopied(false), 2200); } catch { /* clipboard blocked */ }
  };
  return (
    <section className="rounded border-2 bg-card p-5 md:p-6" style={{ borderColor: "var(--foil)" }} aria-labelledby="ei-share">
      <p className="mk-eyebrow">{t("دعوتك الإلكترونية جاهزة 🎉", "Your e-invitation is ready 🎉")}</p>
      <h2 id="ei-share" className="mt-1 text-[22px] font-semibold">{t("ابعث الرابط لضيوفك", "Send the link to your guests")}</h2>
      <p className="mt-1 text-[14px] leading-6 text-subtle">{t("بيفتحوا الظرف، بتشتغل الأغنية، وبيشوفوا العدّاد والموقع ورقم الاستفسار.", "They open the envelope, the song plays, and they see the countdown, map and contact.")}</p>
      <div className="mt-4 flex gap-2">
        <input readOnly value={link} dir="ltr" aria-label={t("رابط الدعوة", "Invitation link")} onFocus={(e) => e.currentTarget.select()}
          className="min-w-0 flex-1 rounded-sm border border-border-strong bg-background px-3 font-mono text-[12px] text-subtle" />
        <button type="button" onClick={copy} className="mk-btn mk-btn-secondary shrink-0">{copied ? <Check size={16} /> : <Copy size={16} />}<span>{copied ? t("انتسخ", "Copied") : t("نسخ", "Copy")}</span></button>
      </div>
      <div className="mt-3 grid gap-2 sm:grid-cols-2">
        <a href={`https://wa.me/?text=${encodeURIComponent(message)}`} target="_blank" rel="noopener noreferrer" className="mk-btn mk-btn-primary"><MessageCircle size={17} /><span>{t("ابعثها على واتساب", "Send on WhatsApp")}</span></a>
        <a href={link || undefined} target="_blank" rel="noopener noreferrer" className="mk-btn mk-btn-secondary"><ExternalLink size={16} /><span>{t("افتح الدعوة", "Open the invitation")}</span></a>
      </div>
    </section>
  );
}
