# CVWebsite

A static portfolio/CV website built with Astro and ready for GitHub Pages.

## Local development

```bash
npm install
npm run dev
```

Open `http://localhost:4321/CVWebsite`.

## Production build

```bash
npm run build
npm run preview
```

## Deploy (GitHub Pages)

1. Push to `main`.
2. In GitHub repository settings, enable **Pages** with **GitHub Actions** as source.
3. The workflow at `.github/workflows/deploy.yml` builds and deploys automatically.

## Link check command

Use the base-path-aware local verification flow:

```bash
npm run verify:local
```

(Equivalent to build + a linkinator run against a temporary `/CVWebsite/`-mirrored tree so absolute links match GitHub Pages base path.)

## Notes

- Update `src/pages/resume.astro` and add `public/cv.pdf` with your real CV.
- Replace placeholder contact links and email in `src/pages/contact.astro`.
