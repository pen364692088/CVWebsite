# Assets Sources Documentation

This file tracks the current source-of-truth media used by the **Ashen Archive** redesign.

## Real source assets

Original external source files used for the first rebuild:

- Resume PDF:
  `D:\成绩单\Resume\ZhouyuLiao-software-developer-resume.pdf`

- Resume DOCX:
  `D:\成绩单\Resume\ZhouyuLiao-software-developer-resume.docx`

- CV image directory:
  `D:\成绩单\CV\300ppi`

- Work collection video:
  `D:\成绩单\CV\Work Collection of TA.mp4`

## Imported project assets

Copied into the repository for stable build-time usage:

### Resume

- `public/resume/zhouyu-liao-software-developer-resume.pdf`
- `public/resume/preview-cover.jpg`
- `public/resume/preview-page-2.jpg`
- `public/resume/preview-page-3.jpg`

### Featured artifact

- `public/media/work-collection-of-ta.mp4`
- `public/artifacts/ember-reel-cover.jpg`
- `public/artifacts/ember-reel-frame-1.jpg`
- `public/artifacts/ember-reel-frame-2.jpg`
- `public/artifacts/ember-reel-frame-3.jpg`

### Supporting artifact placeholders

- `public/artifacts/ritual-pipeline.svg`
- `public/artifacts/mobile-systems.svg`

These placeholders are intentionally replaceable and are only used for the semi-real supporting artifacts.

## Design assets

### Theme tokens

Theme source of truth:

- [`styles/theme.css`](/mnt/d/Project/AIProject/MyProject/CVWebsite/styles/theme.css)

Core tokens:

- near-black background
- charcoal surfaces
- bone white typography
- dark gold accents
- ember orange highlights
- rust red secondary accent

### Typography

Configured in:

- [`app/layout.tsx`](/mnt/d/Project/AIProject/MyProject/CVWebsite/app/layout.tsx)

Current font pairing:

- `Cormorant Garamond`
- `IBM Plex Sans`

## Build output

- Framework: Next.js App Router
- Build command: `npm run build`
- Export output: `out/`
- Deployment target: GitHub Pages under `/CVWebsite/`

## Verification

- Static export verification script:
  [`scripts/verify-static-export.mjs`](/mnt/d/Project/AIProject/MyProject/CVWebsite/scripts/verify-static-export.mjs)

- Local link check script:
  [`scripts/linkcheck-local.sh`](/mnt/d/Project/AIProject/MyProject/CVWebsite/scripts/linkcheck-local.sh)
