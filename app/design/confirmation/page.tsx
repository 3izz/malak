"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import * as React from "react";
import { DraftArt } from "@/components/site/card-art";
import { PhoneMock } from "@/components/einvite/einvite";
import { EInviteShare } from "@/components/einvite/einvite-settings";
import { Notice } from "@/components/malak/controls";
import { Stepper, StepperDescription, StepperIndicator, StepperItem, StepperSeparator, StepperTitle, StepperTrigger } from "@/components/ui/stepper";
import { useApp } from "@/lib/store";
import { jod } from "@/lib/utils";

export default function ConfirmationPage() {
  const { t, lang, order, kind, einvite, resetDraft } = useApp();
  const router = useRouter();
  if (!order) {
    return (
      <div className="container py-16 text-center">
        <p className="text-[18px] font-semibold">{t("ما في طلب لعرضه بعد.", "There's no order to show yet.")}</p>
        <Link href="/design/type/" className="mk-btn mk-btn-primary mt-6">{t("ابدأ التصميم", "Start designing")}</Link>
      </div>
    );
  }
  const digital = order.delivery === "digital";
  const ready = digital && kind === "invite";
  const steps = ready
    ? [[t("استلمنا طلبك", "Order received"), t("الآن", "Just now")], [t("اعتمدت النسخة النهائية", "Proof approved"), t("الآن", "Just now")], [t("دعوتك الإلكترونية جاهزة", "E-invitation ready"), t("الآن", "Just now")]]
    : digital
    ? [[t("استلمنا طلبك", "Order received"), t("الآن", "Just now")], [t("اعتمدت النسخة النهائية", "Proof approved"), t("الآن", "Just now")], [t("تجهيز الملف الرقمي", "Preparing your digital card"), t("خلال ساعة", "Within the hour")], [t("أُرسل الرابط", "Link sent"), t("بانتظار", "Pending")]]
    : [[t("استلمنا طلبك", "Order received"), t("الآن", "Just now")], [t("اعتمدت النسخة النهائية", "Proof approved"), t("الآن", "Just now")], [t("قيد الطباعة", "Printing"), t("١–٢ يوم عمل", "1–2 working days")], [t("مع المندوب", "Out for delivery"), t("بانتظار", "Pending")], [t("تم التوصيل", "Delivered"), t("٣–٥ أيام عمل", "3–5 working days")]];
  const first = order.contact.name.split(" ")[0];
  const placed = new Date(order.placedAt).toLocaleString(lang === "ar" ? "ar-JO" : "en-GB", { dateStyle: "medium", timeStyle: "short" });

  return (
    <div className="container py-10 md:py-16">
      <Notice tone="prototype" title={t("نموذج أولي — لم يتم تنفيذ طلب حقيقي", "Prototype — no real order placed")}>
        {t("هذه صفحة تأكيد وتتبّع تجريبية. لم يُخصم أي مبلغ ولن تتم أي طباعة أو توصيل.", "This is a simulated confirmation and tracking page. Nothing was charged, printed or shipped.")}
      </Notice>
      <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_420px]">
        <div className="animate-fade-up">
          <p className="mk-eyebrow">{t("تم تأكيد الطلب", "Order confirmed")}</p>
          <h1 className={lang === "ar" ? "mt-2 text-[32px] font-bold leading-snug" : "mt-2 font-display text-[44px] font-medium leading-tight"}>{kind !== "invite" ? t(`شكرًا ${first}، بطاقتك بالطريق.`, `Thank you, ${first}. Your card is on its way.`)
            : digital ? t(`شكرًا ${first}، دعوتك الإلكترونية جاهزة.`, `Thank you, ${first}. Your e-invitation is ready.`)
            : t(`شكرًا ${first}، بطاقاتك بالطريق — ودعوتك الإلكترونية جاهزة.`, `Thank you, ${first}. Your cards are on their way — and your e-invitation is ready.`)}</h1>
          <dl className="mt-6 grid max-w-lg grid-cols-2 gap-4 text-[14px]">
            <div><dt className="text-subtle">{t("رقم الطلب", "Order number")}</dt><dd className="font-mono text-[16px]">{order.number}</dd></div>
            <div><dt className="text-subtle">{t("المجموع التقديري", "Estimated total")}</dt><dd className="font-mono text-[16px]">{jod(order.total, lang)}</dd></div>
            <div><dt className="text-subtle">{t("التاريخ", "Placed")}</dt><dd>{placed}</dd></div>
            <div><dt className="text-subtle">{t("التسليم", "Delivery")}</dt><dd>{digital ? t("رقمي", "Digital") : `${t("مطبوع", "Printed")} · ${order.contact.city}`}</dd></div>
          </dl>

          {kind === "invite" && <div className="mt-8"><EInviteShare /></div>}

          <h2 className="mt-10 text-[18px] font-semibold">{digital ? t("حالة الطلب", "Order status") : t("تتبّع البطاقات المطبوعة", "Track your printed cards")}</h2>
          <div className="mt-5" dir={lang === "ar" ? "rtl" : "ltr"}>
            <Stepper value={ready ? steps.length + 1 : 3} orientation="vertical">
              {steps.map(([title, when], i) => (
                <StepperItem key={i} step={i + 1} loading={!ready && i === 2} className="relative items-start">
                  <StepperTrigger asChild>
                    <div className="flex items-center gap-3">
                      <StepperIndicator />
                      <div><StepperTitle>{title}</StepperTitle><StepperDescription>{when}</StepperDescription></div>
                    </div>
                  </StepperTrigger>
                  {i < steps.length - 1 && <StepperSeparator />}
                </StepperItem>
              ))}
            </Stepper>
          </div>
          <div className="mt-10 flex flex-wrap gap-3">
            <button className="mk-btn mk-btn-primary" onClick={() => { resetDraft(); router.push("/design/type/"); }}>{t("صمّم بطاقة جديدة", "Design another card")}</button>
            <Link href="/" className="mk-btn mk-btn-secondary">{t("الرئيسية", "Home")}</Link>
          </div>
        </div>
        <div className="grain grid place-items-center gap-6 self-start rounded border border-border bg-muted/50 py-10">
          {kind === "invite"
            ? <><PhoneMock data={einvite} scale={0.62} /><p className="px-6 text-center text-[13px] text-subtle">{t("هيك رح يشوفها ضيوفك — اضغط على الظرف لتجرّبها.", "This is what guests see — tap the envelope to try it.")}</p></>
            : <div style={{ width: 340 }}><DraftArt width="fill" /></div>}
        </div>
      </div>
    </div>
  );
}
