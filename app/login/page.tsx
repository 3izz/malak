"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import * as React from "react";
import { Eye, EyeOff, ArrowLeft, ArrowRight } from "lucide-react";
import { Header } from "@/components/site/header";
import { Button, Checkbox, Field, Notice, Segmented } from "@/components/malak/controls";
import { InvitationCard } from "@/components/malak/invitation-card";
import { BusinessCard } from "@/components/malak/business-card";
import { Wordmark } from "@/components/malak/wordmark";
import { sampleBiz, sampleInvite } from "@/lib/data";
import { useApp } from "@/lib/store";

type Mode = "signin" | "signup";
const DEMO_OTP = "123456";

export default function LoginPage() {
  const { t, lang, signIn, user, signOut } = useApp();
  const router = useRouter();
  const [mode, setMode] = React.useState<Mode>("signin");
  const [via, setVia] = React.useState<"phone" | "email">("phone");
  const [method, setMethod] = React.useState<"password" | "otp">("password");
  const [name, setName] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [show, setShow] = React.useState(false);
  const [otpSent, setOtpSent] = React.useState(false);
  const [otp, setOtp] = React.useState("");
  const [remember, setRemember] = React.useState(true);
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [status, setStatus] = React.useState<"idle" | "busy" | "done" | "forgot">("idle");
  const [next, setNext] = React.useState("/");

  React.useEffect(() => {
    const n = new URLSearchParams(window.location.search).get("next");
    if (n === "checkout") setNext("/design/checkout/");
  }, []);

  const phoneOk = () => /^7[789]\d{7}$/.test(phone.replace(/\D/g, "").replace(/^0/, ""));
  const validate = (forOtpSend = false) => {
    const e: Record<string, string> = {};
    if (mode === "signup" && name.trim().length < 2) e.name = t("اكتب اسمك.", "Enter your name.");
    if (via === "phone" && !phoneOk()) e.phone = t("رقم أردني من ٩ خانات يبدأ بـ 77 أو 78 أو 79.", "A 9-digit Jordanian mobile starting 77, 78 or 79.");
    if (via === "email" && !/^\S+@\S+\.\S+$/.test(email)) e.email = t("اكتب بريدًا إلكترونيًا صحيحًا.", "Enter a valid email address.");
    if (!forOtpSend) {
      if (method === "password" && password.length < 6) e.password = t("كلمة المرور ٦ أحرف على الأقل.", "Password must be at least 6 characters.");
      if (method === "otp" && otp !== DEMO_OTP) e.otp = otpSent ? t("الرمز غير صحيح. في النموذج استخدم 123456.", "That code is wrong. In this prototype use 123456.") : t("أرسل الرمز أولًا.", "Send the code first.");
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };
  const sendOtp = () => { if (validate(true)) { setOtpSent(true); setErrors({}); } };
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setStatus("busy");
    setTimeout(() => {
      const id = via === "phone" ? "+962 " + phone : email;
      signIn(name.trim() || (lang === "ar" ? "سارة" : "Sara"), id);
      setStatus("done");
      setTimeout(() => router.push(next), 1100);
    }, 800);
  };

  const Arrow = lang === "ar" ? ArrowLeft : ArrowRight;

  return (
    <>
      <Header />
      <main className="grid min-h-[calc(100vh-64px)] lg:grid-cols-2">
        {/* Brand panel */}
        <aside className="grain relative hidden overflow-hidden border-e border-border bg-muted/50 lg:block" aria-hidden>
          <div className="absolute inset-0 grid place-items-center">
            <div className="relative h-[520px] w-[460px]">
              <div className="absolute start-0 top-6 rotate-[-8deg]"><InvitationCard content={sampleInvite("wedding")} design={{ palette: "blush", frame: "floral", font: "ruqaa" }} lang="ar" width={230} tilt={false} /></div>
              <div className="absolute end-0 top-0 rotate-[5deg]"><InvitationCard content={sampleInvite("engagement")} design={{ palette: "midnight", frame: "arch", font: "amiri" }} lang="ar" width={230} /></div>
              <div className="absolute bottom-0 start-16 rotate-[-3deg]"><BusinessCard content={sampleBiz()} design={{ palette: "ivory", layout: "minimal" }} lang="en" width={260} tilt={false} /></div>
            </div>
          </div>
          <p className="absolute bottom-8 start-8 max-w-xs text-[15px] leading-7 text-subtle">{t("تصاميمك محفوظة على جهازك. سجّل الدخول لمزامنتها والرجوع لها من أي مكان.", "Your designs are kept on this device. Sign in to sync them and pick up anywhere.")}</p>
        </aside>

        <div className="flex items-start justify-center px-4 py-10 md:items-center md:py-16">
          <div className="w-full max-w-[420px] animate-fade-up">
            <Wordmark size={18} className="mb-8" />
            {user && status !== "done" ? (
              <div className="space-y-4">
                <h1 className="text-[26px] font-semibold">{t(`أهلًا ${user.name}`, `Welcome, ${user.name}`)}</h1>
                <p className="text-subtle">{t("أنت مسجّل الدخول على هذا الجهاز (محاكاة).", "You're signed in on this device (simulated).")}</p>
                <div className="flex gap-3"><Link href="/design/type/" className="mk-btn mk-btn-primary">{t("ابدأ التصميم", "Start designing")}</Link><Button onClick={signOut}>{t("تسجيل الخروج", "Log out")}</Button></div>
              </div>
            ) : (
              <>
                <h1 className="text-[26px] font-semibold md:text-[30px]">{mode === "signin" ? t("تسجيل الدخول", "Log in") : t("إنشاء حساب", "Create an account")}</h1>
                <p className="mt-2 text-[15px] text-subtle">{t("أهلًا فيك في مَلَك.", "Welcome to MALAK.")}</p>

                <form onSubmit={submit} noValidate className="mt-8 space-y-5">
                  <Segmented label={t("طريقة الدخول", "Sign-in with")} value={via} onChange={(v) => { setVia(v as "phone" | "email"); setErrors({}); }}
                    options={[{ value: "phone", label: t("رقم الهاتف", "Phone") }, { value: "email", label: t("البريد الإلكتروني", "Email") }]} className="w-full" />
                  {mode === "signup" && <Field label={t("الاسم", "Name")} value={name} error={errors.name} onChange={(e) => setName(e.target.value)} autoComplete="name" />}
                  {via === "phone"
                    ? <Field label={t("رقم الهاتف", "Phone number")} prefix="+962" dir="ltr" inputMode="tel" placeholder="79 123 4567" value={phone} error={errors.phone} onChange={(e) => setPhone(e.target.value)} autoComplete="tel-national" />
                    : <Field label={t("البريد الإلكتروني", "Email")} type="email" dir="ltr" placeholder="name@example.com" value={email} error={errors.email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" />}

                  <Segmented size="sm" label={t("التحقق", "Verify with")} value={method} onChange={(v) => { setMethod(v as "password" | "otp"); setErrors({}); }}
                    options={[{ value: "password", label: t("كلمة المرور", "Password") }, { value: "otp", label: t("رمز لمرة واحدة", "One-time code") }]} />

                  {method === "password" ? (
                    <div className="relative">
                      <Field label={t("كلمة المرور", "Password")} type={show ? "text" : "password"} dir="ltr" value={password} error={errors.password} onChange={(e) => setPassword(e.target.value)} autoComplete={mode === "signin" ? "current-password" : "new-password"} />
                      <button type="button" onClick={() => setShow(!show)} aria-label={show ? t("إخفاء كلمة المرور", "Hide password") : t("إظهار كلمة المرور", "Show password")}
                        className="focus-ring absolute end-2 top-[34px] grid h-9 w-9 place-items-center rounded-sm text-subtle hover:text-foreground">{show ? <EyeOff size={17} /> : <Eye size={17} />}</button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {!otpSent ? (
                        <Button onClick={sendOtp} full>{t("أرسل الرمز", "Send code")}</Button>
                      ) : (
                        <>
                          <Notice tone="prototype">{t("محاكاة: لم يُرسل أي رمز حقيقي. استخدم 123456.", "Simulated: no real code was sent. Use 123456.")}</Notice>
                          <Field label={t("رمز التحقق", "Verification code")} dir="ltr" inputMode="numeric" maxLength={6} value={otp} error={errors.otp} onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))} autoComplete="one-time-code" className="[&_input]:font-mono [&_input]:tracking-[.4em]" />
                        </>
                      )}
                    </div>
                  )}

                  <div className="flex items-center justify-between gap-3">
                    <Checkbox label={t("تذكّرني", "Remember me")} checked={remember} onChange={(e) => setRemember(e.target.checked)} />
                    {mode === "signin" && <button type="button" onClick={() => setStatus("forgot")} className="focus-ring text-[13px] font-semibold text-primary underline-offset-4 hover:underline">{t("نسيت كلمة المرور؟", "Forgot password?")}</button>}
                  </div>
                  {status === "forgot" && <Notice tone="info">{t("في النسخة الحقيقية بنرسل رابط إعادة تعيين. هنا هي محاكاة فقط.", "In the live product we'd send a reset link. This is a simulation.")}</Notice>}
                  {status === "done" && <Notice tone="success" title={t("تم تسجيل الدخول", "You're signed in")}>{t("محاكاة محلية — جارٍ تحويلك…", "Local simulation — taking you on…")}</Notice>}
                  {Object.keys(errors).length > 0 && <p className="sr-only" role="alert">{t("في أخطاء بالنموذج", "The form has errors")}</p>}

                  <Button type="submit" variant="primary" full loading={status === "busy"} disabled={status === "done"}>
                    {mode === "signin" ? t("دخول", "Log in") : t("إنشاء الحساب", "Create account")}
                  </Button>
                </form>

                <p className="mt-6 text-center text-[14px] text-subtle">
                  {mode === "signin" ? t("ما عندك حساب؟ ", "New to MALAK? ") : t("عندك حساب؟ ", "Have an account? ")}
                  <button onClick={() => { setMode(mode === "signin" ? "signup" : "signin"); setErrors({}); setStatus("idle"); }} className="focus-ring font-semibold text-primary underline-offset-4 hover:underline">
                    {mode === "signin" ? t("أنشئ حسابًا", "Create an account") : t("سجّل الدخول", "Log in")}
                  </button>
                </p>
                <div className="mt-8 border-t border-border pt-6">
                  <Link href="/design/type/" className="focus-ring group flex items-center justify-between rounded-sm text-[14px]">
                    <span><span className="block font-semibold">{t("ابدأ التصميم بدون حساب", "Start designing without an account")}</span><span className="text-subtle">{t("وسجّل الدخول عند الطلب لحفظ عملك ومزامنته.", "Sign in at checkout to save and sync your work.")}</span></span>
                    <Arrow size={18} className="shrink-0 text-subtle transition-transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      </main>
    </>
  );
}
