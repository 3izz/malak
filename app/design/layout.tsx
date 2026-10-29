"use client";

import { usePathname, useRouter } from "next/navigation";
import * as React from "react";
import { Header } from "@/components/site/header";
import { JourneyStepper } from "@/components/ui/stepper";
import { useApp } from "@/lib/store";

import { STEP_ROUTES } from "@/lib/routes";

export default function DesignLayout({ children }: { children: React.ReactNode }) {
  const path = usePathname() || "";
  const router = useRouter();
  const { lang, draft } = useApp();
  const idx = STEP_ROUTES.findIndex((r) => path.replace(/\/?$/, "/").endsWith(r));
  const step = idx + 1;
  return (
    <>
      <Header />
      {step > 0 && (
        <div className="border-b border-border bg-background">
          <div className="container py-4">
            <JourneyStepper value={step} reached={Math.max(draft.reached, step)} lang={lang} onValueChange={(s) => router.push(STEP_ROUTES[s - 1])} />
          </div>
        </div>
      )}
      <main className="pb-28 md:pb-16">{children}</main>
    </>
  );
}
