"use client";

import * as React from "react";
import { CalendarPlus, MapPin, MessageCircle, Music2, Phone, VolumeX } from "lucide-react";
import { InvitationCard } from "@/components/malak/invitation-card";
import { MARK_PATHS } from "@/components/malak/wordmark";
import { useReducedMotion } from "@/components/malak/motion";
import { Reveal } from "@/components/site/scroll-fx";
import { EInviteData, EVENT_TITLE, SONG_SRC, calendarUrl, eventStart, mapsUrl, waNumber } from "@/lib/einvite";
import { cn } from "@/lib/utils";

const BLESSING = { ar: "بارك الله لهما وبارك عليهما وجمع بينهما في خير", en: "May God bless them and unite them in goodness" };

function Seal({ className }: { className?: string }) {
  return (
    <span className={cn("ei-seal", className)} aria-hidden>
      <svg viewBox="0 0 48 60"><path d={MARK_PATHS.arch} fill="none" stroke="currentColor" strokeWidth="3.2" /><path d={MARK_PATHS.star} fill="currentColor" /></svg>
    </span>
  );
}

/** Corner ornament for the framed panel: two rules meeting at an eight-point star. */
function Corner({ className }: { className: string }) {
  return (
    <svg className={cn("ei-corner", className)} viewBox="0 0 60 60" aria-hidden>
      <path d="M2 58V2h56" fill="none" />
      <path d="M8 58V8h50" fill="none" opacity=".5" />
      <path d="M8 1.5l1.6 4.9 4.9 1.6-4.9 1.6L8 14.5 6.4 9.6 1.5 8l4.9-1.6z" className="fill" />
    </svg>
  );
}

function useCountdown(target: Date) {
  const [now, setNow] = React.useState<number | null>(null);
  React.useEffect(() => { setNow(Date.now()); const id = setInterval(() => setNow(Date.now()), 1000); return () => clearInterval(id); }, []);
  if (now === null) return null;
  const gap = Math.max(0, target.getTime() - now);
  return { done: gap === 0, d: Math.floor(gap / 864e5), h: Math.floor(gap / 36e5) % 24, m: Math.floor(gap / 6e4) % 60, s: Math.floor(gap / 1e3) % 60 };
}

/**
 * The guest-facing e-invitation: a sealed envelope that opens (and starts the song) on tap, then the invitation,
 * a countdown, the venue on a map and a contact. `embedded` renders it inside a phone mock-up instead of full page.
 */
export function EInvite({ data, embedded, className }: { data: EInviteData; embedded?: boolean; className?: string }) {
  const reduce = useReducedMotion();
  const ui: "ar" | "en" = data.lang === "en" ? "en" : "ar";
  const t = (ar: string, en: string) => (ui === "ar" ? ar : en);
  const c = data.content[ui];
  const [phase, setPhase] = React.useState<"closed" | "opening" | "open">("closed");
  const [playing, setPlaying] = React.useState(false);
  const audio = React.useRef<HTMLAudioElement>(null);
  const fade = React.useRef(0);

  const play = React.useCallback(() => {
    const a = audio.current;
    if (!a) return;
    a.volume = 0;
    a.play().then(() => {
      // Ease the song in rather than blasting it.
      cancelAnimationFrame(fade.current);
      const t0 = performance.now();
      const step = (now: number) => { a.volume = Math.min(0.85, ((now - t0) / 2500) * 0.85); if (a.volume < 0.85) fade.current = requestAnimationFrame(step); };
      fade.current = requestAnimationFrame(step);
    }).catch(() => {});
  }, []);
  React.useEffect(() => () => { cancelAnimationFrame(fade.current); audio.current?.pause(); }, []);

  const open = () => {
    if (phase !== "closed") return;
    setPhase("opening");
    if (data.extras.music) play();
    window.setTimeout(() => setPhase("open"), reduce ? 200 : 2300);
  };
  const toggle = () => { const a = audio.current; if (!a) return; if (a.paused) play(); else a.pause(); };

  const start = eventStart(data);
  const cd = useCountdown(start);
  const day = start.toLocaleDateString(ui === "ar" ? "ar-JO" : "en-GB", { weekday: "long" });
  const date = start.toLocaleDateString(ui === "ar" ? "ar-JO" : "en-GB", { day: "numeric", month: "long", year: "numeric" });
  const time = start.toLocaleTimeString(ui === "ar" ? "ar-JO" : "en-GB", { hour: "numeric", minute: "2-digit", hour12: true });
  const couple = !!c.nameB;
  const blessing = couple && (data.category === "wedding" || data.category === "engagement");
  const phone = data.extras.contactPhone.trim();
  const wa = waNumber(phone);

  return (
    <div className={cn("ei", "mk-inv-" + data.design.palette, className)} data-embedded={embedded || undefined} data-phase={phase}
      lang={ui} dir={ui === "ar" ? "rtl" : "ltr"}>
      {data.extras.music && <audio ref={audio} src={SONG_SRC} loop preload={embedded ? "none" : "auto"} onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)} />}

      <div className="ei-scroll" data-lenis-prevent>
        <div className="ei-page">
          <div className="ei-hero">
            <div className="ei-hero-card">
              <InvitationCard content={data.content} design={data.design} lang={data.lang} width="fill" tilt={!embedded} />
            </div>
            <p className="ei-scroll-hint">{t("مرّر للأسفل لتفاصيل الدعوة", "Scroll for the details")}</p>
          </div>

          <Reveal fx="up" className="ei-frame">
            <Corner className="tl" /><Corner className="tr" /><Corner className="bl" /><Corner className="br" />
            {blessing && <p className="ei-blessing"><span aria-hidden>✦</span>{BLESSING[ui]}<span aria-hidden>✦</span></p>}
            <h1 className="ei-title">{EVENT_TITLE[data.category][ui]}</h1>
            {c.message && <p className="ei-message">{c.message}</p>}
            <p className="ei-names">
              <span>{c.nameA}</span>
              {couple && <><span className="ei-amp" aria-hidden>{ui === "ar" ? "و" : "&"}</span><span>{c.nameB}</span></>}
            </p>
            {data.lang === "both" && <p className="ei-names-sub" lang="en" dir="ltr">{[data.content.en.nameA, data.content.en.nameB].filter(Boolean).join(" & ")}</p>}
            <div className="ei-divider" aria-hidden><span /><i /><span /></div>
            <dl className="ei-when">
              <div><dt>{t("اليوم", "Day")}</dt><dd>{day}</dd></div>
              <div><dt>{t("الوقت", "Time")}</dt><dd>{time}</dd></div>
              <div><dt>{t("التاريخ", "Date")}</dt><dd>{date}</dd></div>
            </dl>
            {c.venue && <p className="ei-venue">{c.venue}</p>}
            {c.address && <p className="ei-address">{c.address}</p>}
          </Reveal>

          <Reveal fx="up" className="ei-card">
            <h2 className="ei-card-title">{t("باقي على الحفل", "Counting down")}</h2>
            {cd && (cd.done
              ? <p className="ei-done">{blessing ? t("بارك الله لهما 🎉", "Congratulations 🎉") : t("شكرًا لحضوركم 🎉", "Thank you for coming 🎉")}</p>
              : <div className="ei-count">
                  {[[cd.d, t("يوم", "days")], [cd.h, t("ساعة", "hrs")], [cd.m, t("دقيقة", "min")], [cd.s, t("ثانية", "sec")]].map(([n, l], i) => (
                    <div key={i} className="ei-count-box"><span className="ei-count-num">{n}</span><span className="ei-count-lbl">{l}</span></div>
                  ))}
                </div>)}
            <p className="ei-date-line">{day}{t("، ", ", ")}{date}<span>{t(`تبدأ الساعة ${time}`, `Starts at ${time}`)}</span></p>
            <a className="ei-btn ei-btn-outline" href={calendarUrl(data, ui)} target="_blank" rel="noopener noreferrer"><CalendarPlus size={18} strokeWidth={1.6} />{t("أضف الموعد للتقويم", "Add to calendar")}</a>
          </Reveal>

          <Reveal fx="up" className="ei-card">
            <h2 className="ei-card-title">{t("الموقع", "Location")}</h2>
            {c.venue && <p className="ei-card-strong">{c.venue}</p>}
            {c.address && <p className="ei-card-sub">{c.address}</p>}
            <a className="ei-btn" href={mapsUrl(data, ui)} target="_blank" rel="noopener noreferrer"><MapPin size={18} strokeWidth={1.6} />{t("افتح الموقع على الخريطة", "Open in maps")}</a>
          </Reveal>

          {phone && (
            <Reveal fx="up" className="ei-card">
              <h2 className="ei-card-title">{t("للاستفسار", "Questions?")}</h2>
              {data.extras.contactName && <p className="ei-card-strong">{data.extras.contactName}</p>}
              <p className="ei-tel" dir="ltr">{phone}</p>
              <div className="ei-btn-row">
                <a className="ei-btn" href={`tel:${phone.replace(/[^\d+]/g, "")}`}><Phone size={17} strokeWidth={1.6} />{t("اتصال", "Call")}</a>
                <a className="ei-btn ei-btn-outline" href={`https://wa.me/${wa}`} target="_blank" rel="noopener noreferrer"><MessageCircle size={17} strokeWidth={1.6} />{t("واتساب", "WhatsApp")}</a>
              </div>
            </Reveal>
          )}

          <footer className="ei-footer">
            <p>{t("بحضوركم تكتمل فرحتنا", "Your presence completes our joy")}</p>
            <span>{t("صُمّمت عبر مَلَك", "Made with MALAK")}</span>
          </footer>
        </div>
      </div>

      {/* Cover: the sealed envelope. Tapping it opens the invitation and starts the song. */}
      {phase !== "open" && (
        <div className="ei-cover">
          <p className="ei-cover-kicker">{t("دعوة خاصة لكم", "You're invited")}</p>
          <p className="ei-cover-names">{c.nameA}{couple && <><span className="ei-amp"> {ui === "ar" ? "و" : "&"} </span>{c.nameB}</>}</p>
          <button type="button" className="ei-env" onClick={open} aria-label={t("افتح الدعوة", "Open the invitation")}>
            <span className="ei-env-back" />
            <span className="ei-env-card">
              <InvitationCard content={data.content} design={data.design} lang={data.lang} width="fill" tilt={false} />
            </span>
            <span className="ei-env-front" />
            <span className="ei-env-flap" />
            <Seal />
          </button>
          <p className="ei-tap"><span className="ei-tap-dot" aria-hidden />{t("اضغط على الظرف لفتح الدعوة", "Tap the envelope to open")}</p>
          {data.extras.music && <p className="ei-cover-music"><Music2 size={14} strokeWidth={1.8} />{t("الدعوة فيها أغنية — علّي الصوت", "This invitation plays a song — turn the sound up")}</p>}
        </div>
      )}

      {data.extras.music && phase === "open" && (
        <button type="button" className="ei-music" data-playing={playing || undefined} onClick={toggle}
          aria-label={playing ? t("إيقاف الأغنية", "Pause the song") : t("تشغيل الأغنية", "Play the song")}>
          {playing ? <span className="ei-eq" aria-hidden><i /><i /><i /><i /></span> : <VolumeX size={18} strokeWidth={1.7} />}
        </button>
      )}
    </div>
  );
}

/** A phone outline that shows an e-invitation at phone size, scaled to fit. */
export function PhoneMock({ data, className, scale = 0.64 }: { data: EInviteData; className?: string; scale?: number }) {
  return (
    <div className={cn("ei-phone", className)} style={{ ["--s" as string]: scale }}>
      <span className="ei-phone-notch" aria-hidden />
      <div className="ei-phone-screen">
        <EInvite data={data} embedded />
      </div>
    </div>
  );
}
