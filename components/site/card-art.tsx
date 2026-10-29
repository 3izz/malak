"use client";

import { InvitationCard } from "@/components/malak/invitation-card";
import { BusinessCard } from "@/components/malak/business-card";
import { CardLang, Template, sampleBiz, sampleInvite } from "@/lib/data";
import { useApp } from "@/lib/store";

/** Renders a template with sample content (gallery, home, category tiles). */
export function TemplateArt({ template, width = 220, lang, tilt = true }: { template: Template; width?: number | "fill"; lang?: CardLang; tilt?: boolean }) {
  const { lang: ui } = useApp();
  const l = lang ?? (template.languages.includes(ui) ? ui : template.languages.includes("both") ? "both" : template.languages[0]);
  if (template.kind === "business")
    return <BusinessCard content={sampleBiz()} design={template.biz!} lang={l} width={width} tilt={tilt} />;
  return <InvitationCard content={sampleInvite(template.category)} design={template.invite!} lang={l} width={width} tilt={tilt} />;
}

/** Renders the customer's current draft. */
export function DraftArt({ width = 320, watermark, envelope, tilt = true }: { width?: number | "fill"; watermark?: boolean; envelope?: boolean; tilt?: boolean }) {
  const { draft, kind, inviteDesign, bizDesign } = useApp();
  if (kind === "business")
    return <BusinessCard content={draft.biz} design={bizDesign} lang={draft.cardLang} width={width} watermark={watermark} tilt={tilt} />;
  return <InvitationCard content={draft.invite} design={inviteDesign} lang={draft.cardLang} width={width} watermark={watermark} envelope={envelope} tilt={tilt} />;
}
