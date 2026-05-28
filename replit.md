# Bhavya's Desk

An immersive, interactive desk-based portfolio web application. Visitors explore Bhavya's personality, projects, achievements, and thoughts by clicking on objects placed on a virtual desk — no traditional navbar, just exploration.

## Run & Operate

- `pnpm --filter @workspace/bhavyas-desk run dev` — run the desk app (frontend only, no backend needed)
- `pnpm --filter @workspace/api-server run dev` — run the API server (port 5000)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Frontend: React + Vite + Framer Motion + Tailwind CSS
- Fonts: Playfair Display (serif), DM Sans (sans), JetBrains Mono (mono)
- No backend required for the portfolio desk experience

## Where things live

- `artifacts/bhavyas-desk/src/pages/Desk.tsx` — main desk layout with object positioning
- `artifacts/bhavyas-desk/src/components/desk/` — all interactive desk objects
- `artifacts/bhavyas-desk/src/index.css` — warm walnut desk palette + Google Fonts

## Desk Objects

| Component | Location | Interaction |
|-----------|----------|-------------|
| `StickyNotes.tsx` | Top-left | Click to edit, double-click to complete |
| `Achievements.tsx` | Top-center | Click polaroid to expand |
| `Clock.tsx` | Top-right | Live real-time display |
| `Laptop.tsx` | Center | Click to open project browser |
| `Books.tsx` | Right side | Click book spine to open journal |
| `Phone.tsx` | Bottom-right | Tap to wake, shows contacts |
| `Papers.tsx` | Bottom-center | Click to read full essay |
| `Pen.tsx` | Center-bottom | Click to enable freehand scribble mode |
| `WaterBottle.tsx` | Bottom-left | Decorative, wobble on hover |

## Product

A cinematic portfolio where every element is a window into the creator's world — projects live in the laptop, thoughts in the books and papers, achievements in polaroid frames, contacts in the phone. No scrolling, just exploration.

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._

## Gotchas

- The desk is frontend-only (no API calls, no backend needed for core experience)
- Sticky note edits persist only in component state (not localStorage yet)
- The scribble canvas is cleared on page refresh
- Screenshot tool may capture before stagger animations complete — reduce delays for static captures

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
