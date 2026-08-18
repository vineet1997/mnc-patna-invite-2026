# Home Fashionista Rising 2026 — Patna

A standalone, mobile-first digital invitation for Mukesh & Company’s annual multi-brand home-fashion conference in Patna. The experience opens with the Cormorant Garamond host wordmark remembered from the Ranchi invitation, then uses a dark fashion-campaign art direction, a real-time rising textile surface and intentionally minimal English.

## Event

- **Date:** 8 September 2026
- **Time:** 11:00 AM onwards
- **Venue:** Crystal Hall (9 to 9), Nutan Tower, Bandar Bagicha, Patna – 800001
- **Featured brands:** Florida, Boutique Living, Layers, Welspun and SPACES

## Project shape

- `lib/event.ts` is the single editable source for event facts, contacts, maps and brand details.
- `components/SeasonBookHero.tsx` contains the cinematic invitation opening.
- `components/FabricScene.tsx` renders the textile and stages content from measured cloth speed.
- `components/clothSimulation.ts` owns the fixed-step particle grid, structural/shear/bend constraints, lift impulse, damping and settle detection. Reduced motion and unavailable WebGL fall back to the complete finished still.
- `components/RsvpForm.tsx` prepares the WhatsApp RSVP locally without storing guest information.
- `app/calendar/route.ts` produces the downloadable calendar event.
- `public/brands/` contains verified brand assets plus optically cropped transparent ivory treatments for the dark logo field; SPACES retains its authentic multicolour mark.
- `public/textile-hero-v2.png` is the animated textile source. `public/og.jpg` is the 1200 × 630, WhatsApp-sized social card.
- `output/print/` contains the 300 DPI physical invitation card and its lightweight review preview. Its QR opens the deployed invitation.
- `scripts/generate-invitation-assets.mjs` reproducibly typesets both cards with Cormorant Garamond and verifies the same event URL used by the QR.
- `references/` preserves the supplied poster, screenshot, Ranchi project learnings and the reusable [working principles](references/2026-08-17-working-principles.md).

## Local use

```bash
npm install
npm run dev
npm run generate:assets
npm run lint
npm test
npm run build:vercel
```

The default production build uses vinext and the Sites-compatible Vite configuration supplied with the project. Vercel uses the native Next.js build selected in `vercel.json`.

## Provisional details

The RSVP recipient is currently Mukesh Agarwal. The map action uses the supplied postal address, and the calendar reserves nine hours from 11:00 AM to cover lunch and dinner. These remain easy to update in `lib/event.ts` when the final RSVP number, map pin or closing time is confirmed.

The production invitation is deployed through the connected Vercel project.
