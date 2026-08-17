# Home Fashionista Rising 2026 — Patna

A standalone, mobile-first digital invitation for Mukesh & Company’s annual multi-brand home-fashion conference in Patna. The experience opens with the Cormorant Garamond host wordmark remembered from the Ranchi invitation, then uses a dark fashion-campaign art direction, a real-time rising textile surface and intentionally minimal English.

## Event

- **Date:** 8 September 2026
- **Time:** 11:00 AM onwards
- **Venue:** Crystal Hall (9 to 9), Nutan Tower, Bandar Bagicha, Dakbanglow Road, Patna – 800001
- **Featured brands:** Florida, Boutique Living, Layers, Welspun and SPACES

## Project shape

- `lib/event.ts` is the single editable source for event facts, contacts, maps and brand details.
- `components/SeasonBookHero.tsx` contains the cinematic invitation opening.
- `components/FabricScene.tsx` renders the textile and stages content from measured cloth speed.
- `components/clothSimulation.ts` owns the fixed-step particle grid, structural/shear/bend constraints, lift impulse, damping and settle detection. Reduced motion and unavailable WebGL fall back to the complete finished still.
- `components/RsvpForm.tsx` prepares the WhatsApp RSVP locally without storing guest information.
- `app/calendar/route.ts` produces the downloadable calendar event.
- `public/brands/` contains verified brand assets plus optically cropped transparent ivory treatments for the dark logo field; SPACES retains its authentic multicolour mark.
- `public/textile-hero-v2.png` and `public/og.png` are the generated luxury textile hero and matching social-sharing card.
- `references/` preserves the supplied poster, screenshot and Ranchi project learnings.

## Local use

```bash
npm install
npm run dev
npm run lint
npm test
```

The production build uses vinext and the Sites-compatible Vite configuration supplied with the project.

## Provisional details

The RSVP recipient is currently Mukesh Agarwal. The map action uses the supplied postal address, and the calendar reserves nine hours from 11:00 AM to cover lunch and dinner. These remain easy to update in `lib/event.ts` when the final RSVP number, map pin or closing time is confirmed.

Deployment is intentionally withheld until the design is approved.
