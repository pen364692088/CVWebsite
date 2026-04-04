# Ashen Archive Specification

## Product goal

Build a dark fantasy + modern minimal personal portfolio for **Zhouyu Liao**, focused on:

- Unity systems
- technical art
- VFX / shader work
- playable fragments

The site must feel curated and atmospheric without becoming heavy, noisy, or fragile on mobile.

## Scope

In scope:

- single-page multilingual portfolio
- static export with GitHub Pages compatibility
- localized routes for `en`, `zh-CN`, `ja`, and `ko`
- one featured artifact with real media
- two supporting artifacts with semi-real content
- one sigil-based reading controller
- one controlled realtime relic band across Hero / Disciplines / Reading Sigils
- resume preview + PDF download
- direct contact routes

Out of scope:

- CMS
- authentication
- database or backend APIs
- server-side form submission
- multi-canvas 3D scenes
- free-camera WebGL exploration
- any direct imitation of an existing game IP

## Architecture

- Framework: Next.js App Router
- Rendering: static export via `output: "export"`
- Base path: `/CVWebsite`
- Styling: Tailwind CSS + custom theme tokens
- Animation: Motion
- Realtime stage: Three.js + React Three Fiber
- Content source: local TypeScript data files
- Media source: local assets under `public/`

## Information architecture

The locale page is a single scrollable experience with this fixed order:

1. Hero
2. About / Character Dossier
3. Core Disciplines
4. Artifacts of Work
5. Light the Fire
6. Contact / Resume

The root route `/CVWebsite/` acts as a locale gateway:

- use saved locale if present
- otherwise read browser language
- redirect to one of:
  - `/CVWebsite/en/`
  - `/CVWebsite/zh-CN/`
  - `/CVWebsite/ja/`
  - `/CVWebsite/ko/`

## Visual direction

- mood: solemn, cold, restrained, mysterious
- palette emphasis:
  - near-black and deep charcoal
  - bone white and fog gray
  - dark gold and ember orange accents
- typography split:
  - serif display for atmosphere
  - clean sans-serif for readability
- motion:
  - reveal
  - subtle parallax
  - slow glow
  - low-frequency hover response

## Interaction requirements

- sticky header with anchor navigation
- language switcher with saved preference
- one sticky / inline realtime relic stage tied to section phase and active sigil
- artifact cards open accessible modal details
- featured video is user-initiated, not autoplayed
- sigil controller supports:
  - mouse
  - touch
  - keyboard
- reduced motion must remain functional

## Data and content rules

- all core UI is localized across all 4 languages
- artifact data lives in `data/artifacts.ts`
- profile and resume routes live in `data/profile.ts`
- no content should be hardcoded inside components if it is likely to change later
- LinkedIn can remain reserved/unavailable until a verified public URL exists

## Acceptance criteria

- the first impression reads as dark fantasy + modern minimal, not cyberpunk
- the first impression is led by a realtime relic, not a static threshold image
- the site builds to `out/` successfully
- all four locale routes export successfully
- root locale gateway redirects correctly
- the relic stage responds to section phase and active sigil
- responsive layouts work at desktop, tablet, and mobile widths
- contact and resume actions are visible and usable
- documentation clearly explains running, editing content, adding artifacts, and adjusting theme tokens
