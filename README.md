# MALAK | مَلَك — Frontend prototype

نموذج أولي تفاعلي لموقع مَلَك لتصميم دعوات الأعراس والمناسبات وبطاقات الأعمال.
عربي افتراضيًا (RTL) مع إنجليزي (LTR)، وضع فاتح وداكن (Catppuccin Latte / Mocha).

> Prototype only — login, OTP, payment, printing and order tracking are simulated locally. No backend.

## النشر على GitHub Pages

1. اعمل مستودع جديد على GitHub (مثلًا `malak`).
2. ارفع محتوى هذا المجلد للمستودع على فرع `main`:
   ```bash
   git init
   git add .
   git commit -m "MALAK prototype"
   git branch -M main
   git remote add origin https://github.com/<username>/malak.git
   git push -u origin main
   ```
3. بالمستودع: **Settings → Pages → Build and deployment → Source: GitHub Actions**.
4. انتظر دقيقتين لحد ما يخلص الـ workflow (تبويب **Actions**)، والموقع بيصير على:
   `https://<username>.github.io/malak/`

الـ workflow (`.github/workflows/deploy.yml`) يضبط مسار الموقع تلقائيًا حسب اسم المستودع، فما في داعي تعدّل أي إعداد. إذا سمّيت المستودع `<username>.github.io` بينشر على الجذر مباشرة.

## Run locally

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # static export into ./out
npm start          # serve ./out
```

Node 18.17+ (20 recommended).

## Routes

| Route | Screen |
| --- | --- |
| `/` | Landing: hero, how it works, card types, featured designs, pricing teaser, trust, footer |
| `/login/` | Phone (+962) / email, password or OTP (demo code `123456`), remember me, forgot password, create account |
| `/design/type/` | 1 · Choose card type (wedding, engagement / katb kitab, business + more occasions) |
| `/design/template/` | 2 · Gallery: 12 invitation + 6 business templates, filters (category, style, colour, language, price tier), search, sort |
| `/design/customize/` | 3 · Guided editor with live preview, undo, restore sample, auto-saved draft |
| `/design/preview/` | 4 · Watermarked proof, flat or on-the-table mockup |
| `/design/print/` | 5 · Digital vs printed, quantity, paper, finish, envelope, live JOD estimate |
| `/design/checkout/` | 6 · Contact, simulated payment choices, final proof approval |
| `/design/confirmation/` | Simulated confirmation + tracking ("Prototype — no real order placed") |

## Structure

- `app/` — routes (Next.js App Router, static export)
- `components/ui/stepper.tsx` — the supplied stepper, restyled (diamond indicators, RTL rail)
- `components/ui/liquid-glass-logo-reveal.tsx` — the supplied glass reveal, MALAK mark, token colours, `disableWebGL` fallback
- `components/malak/` — loader, wordmark, invitation & business card artwork, controls
- `components/site/` — header, footer, flow navigation, price summary
- `lib/data.ts` — typed mock data (categories, templates, palettes, sample content)
- `lib/price.ts` — **illustrative** JOD prices; replace with the project brief's price list
- `lib/store.tsx` — language, theme, draft, simulated user and order (localStorage)
- `app/globals.css` — MALAK design tokens + component styles (from the MALAK design system)

## Prototype assumptions

- Prices are illustrative placeholders, labelled "Prototype estimate" everywhere.
- The location QR is a drawn pattern, not a scannable code.
- Interface icons use lucide-react (ISC) with hover/focus motion as a stand-in for the 21st.dev animated-icon collection.
- Glass reveal shader and spring timeline: zanwei/glass-icon-reveal (MIT), via 21st.dev. Stepper API: 21st.dev / origin-ui stepper.
- Fonts are self-hosted via @fontsource (OFL): Tajawal, Montserrat, Cormorant Garamond, Amiri, Aref Ruqaa, Fira Code.
