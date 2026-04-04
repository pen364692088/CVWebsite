# Ashen Archive Specification

## Product goal

Build a dark fantasy + abyss museum portfolio for **Zhouyu Liao**, focused on:

- runtime systems
- governance and tooling
- identity / memory architecture
- atmosphere-led public presentation

The site must feel curated and atmospheric without becoming heavy, noisy, or fragile on mobile.

## Scope

In scope:

- single-page multilingual portfolio
- static export with GitHub Pages compatibility
- localized routes for `en`, `zh-CN`, `ja`, and `ko`
- three public-safe real artifacts
- one sigil-based reading controller
- one scene-led abyss hero with layered atmosphere
- lightweight dossier entry
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
- Content source: local TypeScript data files
- Media source: local assets under `public/`

## Information architecture

The locale page is a single scrollable experience with this fixed order:

1. Hero
2. Reading Ritual
3. About / Character Dossier
4. Core Disciplines
5. Artifacts of Work
6. Contact / Dossier

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
- scene motif:
  - giant moon
  - abyss castle / towers
  - dragon trace
  - ember foreground
  - altar-like project cards
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
- one layered scene-first hero with restrained parallax
- artifact cards open accessible modal details
- sigil controller supports:
  - mouse
  - touch
  - keyboard
- reduced motion must remain functional

## Data and content rules

- all core UI is localized across all 4 languages
- artifact data lives in `data/artifacts.ts`
- profile and resume routes live in `data/profile.ts`
- atmosphere layers and particle presets live in `data/atmosphere.ts`
- no content should be hardcoded inside components if it is likely to change later
- LinkedIn can remain reserved/unavailable until a verified public URL exists
- asset provenance lives in `docs/assets-manifest.md`

## Acceptance criteria

- the first impression reads as dark fantasy + modern minimal, not cyberpunk
- the first impression is led by a scene-first abyss hero, not a generic card grid
- the site builds to `out/` successfully
- all four locale routes export successfully
- root locale gateway redirects correctly
- the sigil controller reorders and reframes artifacts without gating content
- responsive layouts work at desktop, tablet, and mobile widths
- contact and dossier actions are visible and usable
- documentation clearly explains running, editing content, adding artifacts, and adjusting theme tokens
