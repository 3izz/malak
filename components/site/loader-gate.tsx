"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import { MalakLoader } from "@/components/malak/loader";
import { useApp } from "@/lib/store";

/** Shows the MALAK loader once per browser session, on whichever page the visitor lands (except a guest's e-invitation). */
export function LoaderGate() {
  const { lang, ready } = useApp();
  const [show, setShow] = React.useState(false);
  const guest = (usePathname() || "").startsWith("/invite");
  React.useEffect(() => {
    try {
      if (!sessionStorage.getItem("malak:intro")) setShow(true);
    } catch { /* storage blocked: skip the intro */ }
  }, []);
  // The boot script sets data-intro to hold page entrance animations until the loader is gone.
  const done = React.useCallback(() => {
    try { sessionStorage.setItem("malak:intro", "1"); } catch {}
    document.documentElement.removeAttribute("data-intro");
    setShow(false);
  }, []);
  if (!show || !ready || guest) return null;
  return <MalakLoader lang={lang} onDone={done} />;
}
