# Red Bull — Company Profile (concept)

Single-page company profile built with Next.js 16, React Three Fiber and GSAP.
Unofficial concept for design/portfolio purposes; not affiliated with Red Bull GmbH.

## Run

```bash
npm install
npm run dev      # http://localhost:3000
npm run build && npm start
```

## How it works

- `src/components/three/` — one fixed WebGL canvas behind the page.
  - `Can.tsx` builds the can from lathe geometry; the label, roughness/metalness map and
    condensation normal map are painted at runtime on canvases (`label.ts`), so there are no 3D assets to load.
  - `Scene.tsx` — `Rig` moves the can between poses anchored to `[data-can="…"]` sections
    (`data-can-mobile` overrides the anchor on phones). Edit `DESKTOP` / `MOBILE` poses to re-choreograph.
  - Rendering pauses while the opaque `[data-solid]` block covers the viewport.
- `src/lib/variants.ts` — editions shown in "The range"; colours drive both the can label and the page accent.
- `src/lib/store.ts` — tiny shared store between the DOM and the 3D scene.
- Smooth scrolling via Lenis, synced to GSAP ScrollTrigger. `prefers-reduced-motion` disables
  smooth scroll, scrubbing, pinning and idle motion.

Company figures: [Red Bull company profile](https://www.redbull.com/int-en/energydrink/company-profile) (2025).
