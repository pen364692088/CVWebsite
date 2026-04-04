# Ashen Archive

Dark fantasy inspired portfolio site for **Zhouyu Liao**, rebuilt with **Next.js App Router**, **TypeScript**, **Tailwind CSS**, and **Motion**.  
The production target remains **GitHub Pages** under the `/CVWebsite/` base path with static export.

## Tech stack

- Next.js App Router
- React 19
- TypeScript
- Tailwind CSS
- Motion
- Three.js
- React Three Fiber

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

### Replace resume files

Current resume assets live in:

- `public/resume/zhouyu-liao-software-developer-resume.pdf`
- `public/resume/preview-cover.jpg`
- `public/resume/preview-page-2.jpg`
- `public/resume/preview-page-3.jpg`

Replace these files while keeping the same paths if you want the current UI to keep working without code changes.

### Replace artifact media

Featured artifact media lives in:

- `public/media/work-collection-of-ta.mp4`
- `public/artifacts/ember-reel-cover.jpg`
- `public/artifacts/ember-reel-frame-1.jpg`
- `public/artifacts/ember-reel-frame-2.jpg`
- `public/artifacts/ember-reel-frame-3.jpg`

Supporting artifact visuals currently use:

- `public/artifacts/ritual-pipeline.svg`
- `public/artifacts/mobile-systems.svg`

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
- `next.config.mjs` also transpiles `three` for the controlled relic scene
- public asset references that are not handled by `next/link` use the helper in [`lib/site.ts`](/mnt/d/Project/AIProject/MyProject/CVWebsite/lib/site.ts)
- the site uses exactly one controlled R3F / Three.js scene for the relic band
- do not expand this into multiple canvases, free-camera navigation, or full-page particle backgrounds by default
