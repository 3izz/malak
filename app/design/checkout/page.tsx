"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import * as React from "react";
import { Banknote, CreditCard, Smartphone, Check } from "lucide-react";
import { FlowNav, StepIntro } from "@/components/site/flow-nav";
import { PriceSummary } from "@/components/site/price-summary";
import { DraftArt } from "@/components/site/card-art";
import { Checkbox, Field, Notice } from "@/components/malak/controls";
import { useApp } from "@/lib/store";
import { cn } from "@/lib/utils";

const CITIES = [["amman", "عمّان", "Amman"], ["irbid", "إربد", "Irbid"], ["zarqa", "الزرقاء", "Zarqa"], ["salt", "السلط", "Salt"], ["madaba", "مادبا", "Madaba"], ["aqaba", "العقبة", "Aqaba"], ["karak", "الكرك", "Karak"]] as const;

export default function CheckoutPage() {
  const { t, lang, user, print, kind, reach, placeOrder } = useApp();
  const router = useRouter();
  React.useEffect(() => reach(6), [reach]);
  const [f, setF] = React.useState({ name: user?.name ?? "", phone: "", email: "", city: "amman", address: "" });
  const [pay, setPay] = React.useState<"cliq" | "cod" | "card">("cliq");
  const [approved, setApproved] = React.useState(false);
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [busy, setBusy] = React.useState(false);
  const printed = print.delivery === "print";

  const validate = () => {
    const e: Record<string, string> = {};
    if (f.name.trim().length < 2) e.name = t("اكتب الاسم الكامل.", "Enter your full name.");
    if (!/^7[789]\d{7}$/.test(f.phone.replace(/\D/g, "").replace(/^0/, ""))) e.phone = t("رقم أردني من ٩ خانات يبدأ بـ 77 أو 78 أو 79.", "A 9-digit Jordanian mobile starting 77, 78 or 79.");
    if (f.email && !/^\S+@\S+\.\S+$/.test(f.email)) e.email = t("تأكّد من البريد الإلكتروني.", "Check the email address.");
    if (printed && f.address.trim().length < 6) e.address = t("نحتاج عنوان التوصيل.", "We need a delivery address.");
    if (!approved) e.proof = t("لازم توافق على النسخة النهائية قبل الطلب.", "Please approve the final proof first.");
    setErrors(e);
    return Object.keys(e).length === 0;
  };
  const submit = () => {
    if (!validate()) return;
    setBusy(true);
    setTimeout(() => {
      const city = CITIES.find((c) => c[0] === f.city)!;
      placeOrder({ contact: { name: f.name, phone: "+962 " + f.phone, city: lang === "ar" ? city[1] : city[2] }, payment: pay, delivery: print.delivery });
      router.push("/design/confirmation/");
    }, 900);
  };

  const pays = [
    { v: "cliq" as const, icon: Smartphone, ar: ["كليك CliQ", "تحويل فوري عبر الاسم المستعار (محاكاة)."], en: ["CliQ", "Instant transfer to our alias (simulated)."] },
    { v: "cod" as const, icon: Banknote, ar: ["الدفع عند الاستلام", printed ? "ادفع نقدًا للمندوب." : "غير متاح للنسخة الرقمية."], en: ["Cash on delivery", printed ? "Pay the courier in cash." : "Not available for digital."] },
    { v: "card" as const, icon: CreditCard, ar: ["بطاقة بنكية", "للعرض فقط — لا نطلب بيانات بطاقة."], en: ["Bank card", "Display only — no card details are collected."] },
  ];

  return (
    <div className="container py-8 md:py-12">
      <StepIntro eyebrow={t("الخطوة ٦", "Step 6")} title={t("أكمل الطلب", "Checkout")} />
      <Notice tone="prototype" className="mt-6" title={t("نموذج أولي — لن يتم تنفيذ طلب حقيقي", "Prototype — no real order will be placed")}>
        {t("الدفع والطباعة والتوصيل كلها محاكاة. لا تُدخل بيانات بطاقة بنكية.", "Payment, printing and delivery are simulated. Do not enter bank card details.")}
      </Notice>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_360px]">
        <div className="space-y-10">
          {!user && (
            <Notice tone="info">
              {t("تقدر تكمل بدون حساب. ", "You can continue as a guest. ")}
              <Link href="/login/?next=checkout" className="font-semibold text-primary underline underline-offset-4">{t("سجّل الدخول", "Log in")}</Link>
              {t(" لحفظ تصميمك ومزامنته.", " to save and sync your design.")}
            </Notice>
          )}
          <section className="space-y-4">
            <h2 className="text-[18px] font-semibold">{t("بيانات التواصل", "Contact details")}</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label={t("الاسم الكامل", "Full name")} value={f.name} error={errors.name} onChange={(e) => setF({ ...f, name: e.target.value })} autoComplete="name" />
              <Field label={t("رقم الهاتف", "Phone number")} prefix="+962" dir="ltr" inputMode="tel" placeholder="79 123 4567" value={f.phone} error={errors.phone} onChange={(e) => setF({ ...f, phone: e.target.value })} autoComplete="tel-national" />
              <Field label={t("البريد الإلكتروني (اختياري)", "Email (optional)")} type="email" dir="ltr" value={f.email} error={errors.email} onChange={(e) => setF({ ...f, email: e.target.value })} autoComplete="email" />
              <div className="mk-field">
                <label htmlFor="city" className="mk-field-label">{t("المدينة", "City")}</label>
                <div className="mk-field-box"><select id="city" value={f.city} onChange={(e) => setF({ ...f, city: e.target.value })} className="mk-field-input bg-transparent">{CITIES.map(([v, a, e]) => <option key={v} value={v}>{lang === "ar" ? a : e}</option>)}</select></div>
              </div>
            </div>
            {printed && <Field label={t("عنوان التوصيل", "Delivery address")} placeholder={t("المنطقة، الشارع، رقم البناية", "Area, street, building number")} value={f.address} error={errors.address} onChange={(e) => setF({ ...f, address: e.target.value })} />}
          </section>

          <section className="space-y-4">
            <h2 className="text-[18px] font-semibold">{t("طريقة الدفع", "Payment method")}</h2>
            <div role="radiogroup" aria-label={t("طريقة الدفع", "Payment method")} className="grid gap-3 sm:grid-cols-3">
              {pays.map((p) => {
                const on = pay === p.v, off = p.v === "cod" && !printed;
                return (
                  <button key={p.v} role="radio" aria-checked={on} disabled={off} onClick={() => setPay(p.v)}
                    className={cn("focus-ring relative flex flex-col gap-2 rounded border p-4 text-start transition-colors disabled:opacity-50", on ? "border-primary bg-primary-soft" : "border-border-strong bg-card hover:border-foreground")}>
                    <p.icon size={22} strokeWidth={1.5} className={on ? "text-primary" : "text-foil"} />
                    <span className="font-semibold">{lang === "ar" ? p.ar[0] : p.en[0]}</span>
                    <span className="text-[13px] leading-5 text-subtle">{lang === "ar" ? p.ar[1] : p.en[1]}</span>
                    {on && <Check size={16} className="absolute end-3 top-3 text-primary" />}
                  </button>
                );
              })}
            </div>
            {pay === "card" && <Notice tone="prototype">{t("في النسخة الحقيقية تنتقل لصفحة دفع آمنة من مزوّد الدفع. هنا لا يوجد أي حقل لبيانات البطاقة.", "In the live product you'd move to the payment provider's secure page. There are no card fields here.")}</Notice>}
          </section>

          <section className="space-y-3 rounded border border-border bg-card p-5">
            <h2 className="text-[18px] font-semibold">{t("اعتماد النسخة النهائية", "Final proof approval")}</h2>
            <Checkbox checked={approved} onChange={(e) => setApproved(e.target.checked)}
              label={t("راجعت الأسماء والتاريخ والمكان والتهجئة، وأوافق على طباعة/إرسال البطاقة كما تظهر في المعاينة.", "I've checked names, date, venue and spelling, and approve the card exactly as shown in the proof.")} />
            {errors.proof && <p className="mk-field-msg mk-field-msg-error">{errors.proof}</p>}
          </section>
        </div>

        <aside className="space-y-5 lg:sticky lg:top-24 lg:self-start">
          <div className="grid place-items-center rounded border border-border bg-muted/50 py-6">
            <div style={{ width: kind === "business" ? 260 : 160 }}><DraftArt width="fill" tilt={false} watermark /></div>
          </div>
          <PriceSummary title={t("ملخّص الطلب", "Order summary")} />
          {Object.keys(errors).length > 0 && <Notice tone="error" title={t("في معلومات ناقصة", "Some details need attention")}>{t("صحّح الحقول المعلّمة بالأحمر.", "Fix the fields marked in red.")}</Notice>}
        </aside>
      </div>
      <FlowNav back="/design/print/" onNext={submit} disabled={busy} nextLabel={busy ? t("جارٍ التأكيد…", "Confirming…") : t("تأكيد الطلب (محاكاة)", "Place order (simulated)")} showPrice />
    </div>
  );
}
