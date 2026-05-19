# MyFastRx Clone (Next.js 14)

A pixel-style clone of [myfastrx.com](https://www.myfastrx.com/) — colors, layout, sections — including the
4-step onboarding/approval flow inspired by `checkout.myfastrx.com/onboard/`.

## Stack
- **Next.js 14** (App Router) + **TypeScript**
- **TailwindCSS** for styling (brand blue `#2563EB`)
- **lucide-react** for icons
- 100% client-side onboarding form (no backend required to view/demo)

## Pages
| Route | Description |
|-------|-------------|
| `/` | Home — hero, how it works, treatments, FAQ |
| `/weight-loss` | GLP-1 program detail — Semaglutide / Tirzepatide pricing & FAQ |
| `/about` | About page |
| `/faq` | Full FAQ |
| `/contact-us` | Contact form |
| `/onboard` | 4-step approval flow (state → demographics → medical → plan + account) |

## Getting started

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Onboard flow structure

The wizard has 4 progress steps with a thin progress bar + numbered dots, matching the
reference screenshot:

1. **Tell us about you** — state, name, email, phone, SMS consent (transactional + marketing checkboxes).
2. **Health basics** — sex, DOB, height (ft/in), weight, goal weight. BMI auto-calculated.
3. **Medical history** — diagnosed conditions (multi-select with "None of the above"), current meds, allergies, pregnancy.
4. **Treatment & account** — pick Semaglutide ($99) or Tirzepatide ($179), plan length (1/3/6/12 mo), password, consent.

Submission shows a confirmation screen ("you're all set"). Wire this up to your backend / Stripe
later by replacing the `setDone(true)` call in `app/onboard/page.tsx`.

## Brand tokens
| Token | Value |
|-------|-------|
| `brand` | `#2563EB` |
| `brand-dark` | `#1D4ED8` |
| `brand-50` / `brand-100` | tinted backgrounds |
| `ink` / `ink-soft` / `ink-muted` | `#0F172A` / `#334155` / `#64748B` |

Edit `tailwind.config.ts` to rebrand.

## Notes
- All copy and pricing in FAQs is from the public marketing site for layout/parity reference. Replace
  with your own legal/medical copy before any production use.
- This project is intended as a **design + structure scaffold**, not a production telehealth system.
  Production deployment requires HIPAA-compliant infrastructure, eRx integration, and licensed providers.
