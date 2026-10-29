"use client";

import { useRouter } from "next/navigation";
import * as React from "react";

export default function DesignIndex() {
  const router = useRouter();
  React.useEffect(() => { router.replace("/design/type/"); }, [router]);
  return null;
}
