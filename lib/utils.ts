import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Format a JOD amount with three decimals, Latin digits (as Jordanian price tags do). */
export function jod(n: number, lang: "ar" | "en") {
  const v = n.toFixed(3);
  return lang === "ar" ? `${v} د.أ` : `${v} JOD`;
}
