import type { Config } from "tailwindcss";

const v = (name: string) => `var(--${name})`;

export default {
  darkMode: ["class"],
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    container: { center: true, padding: { DEFAULT: "1rem", md: "2rem" }, screens: { "2xl": "1240px" } },
    extend: {
      colors: {
        background: v("background"),
        foreground: v("foreground"),
        card: { DEFAULT: v("card"), foreground: v("card-foreground") },
        popover: { DEFAULT: v("popover"), foreground: v("popover-foreground") },
        primary: { DEFAULT: v("primary"), foreground: v("primary-foreground"), soft: v("primary-soft") },
        secondary: { DEFAULT: v("secondary"), foreground: v("secondary-foreground") },
        muted: { DEFAULT: v("muted"), foreground: v("muted-foreground") },
        subtle: v("subtle-foreground"),
        accent: { DEFAULT: v("accent"), foreground: v("accent-foreground") },
        destructive: { DEFAULT: v("destructive"), foreground: v("destructive-foreground") },
        success: v("success"),
        border: v("border"),
        "border-strong": v("border-strong"),
        input: v("input"),
        ring: v("ring"),
        foil: { DEFAULT: v("foil"), soft: v("foil-soft"), on: v("on-foil") },
        paper: { DEFAULT: v("paper"), ink: v("paper-ink") },
      },
      borderRadius: { none: "0", xs: "2px", sm: "4px", DEFAULT: "0.35rem", md: "0.35rem", lg: "0.35rem", card: "10px" },
      fontFamily: {
        sans: ["Montserrat", "Tajawal", "system-ui", "sans-serif"],
        arabic: ["Tajawal", "Montserrat", "system-ui", "sans-serif"],
        display: ['"Cormorant Garamond"', "Amiri", "Georgia", "serif"],
        amiri: ["Amiri", '"Cormorant Garamond"', "serif"],
        ruqaa: ['"Aref Ruqaa"', '"Cormorant Garamond"', "serif"],
        mono: ['"Fira Code"', "ui-monospace", "monospace"],
      },
      boxShadow: { sm: v("shadow-sm"), lg: v("shadow-lg"), paper: v("shadow-paper"), lift: v("shadow-lift"), focus: v("focus-ring") },
      transitionTimingFunction: { out: "cubic-bezier(0.22, 1, 0.36, 1)", paper: "cubic-bezier(0.2, 0.8, 0.2, 1.05)" },
      keyframes: {
        "fade-up": { from: { opacity: "0", transform: "translateY(12px)" }, to: { opacity: "1", transform: "none" } },
      },
      animation: { "fade-up": "fade-up 480ms cubic-bezier(0.22, 1, 0.36, 1) both" },
    },
  },
  plugins: [],
} satisfies Config;
