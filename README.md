# Ashen Archive

Scene-led dark fantasy portfolio site for **Zhouyu Liao**, rebuilt with **Next.js App Router**, **TypeScript**, **Tailwind CSS**, and **Motion**.  
The production target remains **GitHub Pages** under the `/CVWebsite/` base path with static export.

## Tech stack

- Next.js App Router
- React 19
- TypeScript
- Tailwind CSS
- Motion

## Local development

```bash
npm install
npm run dev
```

Open `http://localhost:3000/CVWebsite`.

## Build and verification

```bash
npm run lint
npm run typecheck
npm run build
npm run verify:static
```

Optional local link check after build:

```bash
npm run verify:links
```

## Project structure

- `app/`: App Router entrypoints and locale routing
- `components/`: reusable UI and interactive client components
- `sections/`: single-page content sections
- `data/`: dictionaries, artifact data, and profile data
- `lib/`: locale and site helpers
- `styles/`: theme tokens
- `public/`: replaceable media assets, resume previews, and artifact media

## Multi-language routing

Supported locales:

- `en`
- `zh-CN`
- `ja`
- `ko`

Routing behavior:

- `/CVWebsite/` is a lightweight locale gateway
- the gateway checks local storage first
- if no saved choice exists, it reads browser language
- it then redirects to `/CVWebsite/<locale>/`

## Replacing content and media

### Update contact information

Edit [`data/profile.ts`](/mnt/d/Project/AIProject/MyProject/CVWebsite/data/profile.ts).

This file controls:

- email
- GitHub
- LinkedIn availability
- resume download path

### Replace dossier files

Current dossier assets live in:

- `public/resume/zhouyu-liao-software-developer-resume.pdf`

The current UI keeps this entry lightweight. If you publish a studio-safe dossier later, keep the path stable or update `data/profile.ts`.

### Replace artifact media

Current artifact visuals live in:

- `public/artifacts/egocore-cover.jpg`
- `public/artifacts/egocore-diagram.jpg`
- `public/artifacts/ashen-archive-cover.jpg`
- `public/artifacts/ashen-archive-diagram.jpg`
- `public/artifacts/openemotion-cover.jpg`
- `public/artifacts/openemotion-diagram.jpg`
- `public/hero/abyss-hero-matte.jpg`
- `public/atmosphere/*`

Asset provenance and generation notes are tracked in `docs/assets-manifest.md`.

### Add or edit projects

Edit [`data/artifacts.ts`](/mnt/d/Project/AIProject/MyProject/CVWebsite/data/artifacts.ts).

Each artifact defines:

- `slug`
- `featured`
- `cover`
- `media`
- localized `content`

To add a new project:

1. add media files under `public/artifacts/` or `public/media/`
2. add a new artifact object in `data/artifacts.ts`
3. provide localized copy for all 4 locales

## Theme customization

### Colors and visual tokens

Edit [`styles/theme.css`](/mnt/d/Project/AIProject/MyProject/CVWebsite/styles/theme.css).

Core tokens include:

- `--night`
- `--surface`
- `--mist`
- `--ivory`
- `--gold`
- `--ember`
- `--rust`

### Fonts

Edit [`app/layout.tsx`](/mnt/d/Project/AIProject/MyProject/CVWebsite/app/layout.tsx).

The current setup uses:

- `Cormorant Garamond` for display
- `IBM Plex Sans` for body text

## Deploy to GitHub Pages

1. Push to `main`
2. Enable GitHub Pages with **GitHub Actions** as the source
3. The workflow at `.github/workflows/deploy.yml` installs dependencies, builds the static export, and publishes `out/`

## Notes

- `next.config.mjs` is configured for `output: "export"` and `basePath: "/CVWebsite"`
- public asset references that are not handled by `next/link` use the helper in [`lib/site.ts`](/mnt/d/Project/AIProject/MyProject/CVWebsite/lib/site.ts)
- the homepage is built around a scene-first abyss hero with layered parallax, ritual project cards, and a DOM-based sigil filter
- keep atmosphere restrained: one main scene, a few overlay layers, and hover states that reinforce the archive language instead of turning the page into a demo
