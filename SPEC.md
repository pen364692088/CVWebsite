# Personal Website Specification (Astro)

## Scope
Build and maintain a static personal website using Astro for professional presentation and simple discoverability.

In scope:
- Public pages for Home, About, Projects, Resume, and Contact.
- Responsive layout for desktop and mobile.
- Static-first rendering with minimal client-side JavaScript.
- Basic visual polish (light animations, transitions, accessible typography).
- Deployment to GitHub Pages as the primary host.

Out of scope:
- Authentication, user accounts, admin dashboard, or CMS.
- Server-side APIs, databases, or dynamic backends.
- Collecting or storing sensitive personal data.

## Assumptions
- The repository is an Astro project (or will be initialized as one).
- Content is maintained manually in source files.
- Resume is provided as a downloadable/static file or external link.
- Contact can be simple mailto/social links (no backend form processing required).
- Deployment should stay low-cost and low-maintenance.

## Architecture Decisions
- Framework: Astro for static site generation and content-focused pages.
- Rendering strategy: Static by default; avoid SSR unless clearly required later.
- JavaScript policy: Minimal JS only for small, non-critical animations/interactions.
- Styling: Keep CSS maintainable and lightweight; avoid heavy UI frameworks.
- Content organization: Modular page sections/components for Home/About/Projects/Resume/Contact.

## Content Modules
### 1) Home
- Intro/hero section with name, role, and short value statement.
- Quick links to Projects and Contact.

### 2) About
- Short bio, background, and relevant skills/technologies.

### 3) Projects (Cards)
- Card-based list of selected projects.
- Each card includes title, short description, tech stack, and link(s).

### 4) Resume (Link)
- Dedicated section/page with clear link to resume (PDF or external profile).

### 5) Contact
- Contact methods such as email, GitHub, and LinkedIn.
- No backend-required contact processing in this phase.

## Security Constraints
- Never commit secrets (API keys, tokens, credentials) to the repository.
- Use public-safe environment variables only if needed for build metadata.
- Do not introduce destructive automation/commands in project scripts.
- Keep dependencies minimal and maintained to reduce attack surface.
- Validate external links and avoid untrusted embedded third-party scripts.

## Acceptance Criteria
- Astro-based static site structure exists and builds successfully.
- All five content modules are present and navigable.
- Projects are displayed as cards with consistent structure.
- Resume link is visible and functional.
- Contact section includes at least one working method.
- Site is responsive on common mobile and desktop viewport sizes.
- Animations (if any) are subtle, optional, and do not block content.
- No secrets are present in tracked files.
- Deployment instructions include GitHub Pages as primary path and Cloudflare Pages fallback.

## Deployment Plan
### Primary: GitHub Pages
1. Build Astro site for static output.
2. Configure repository Pages settings for deployment branch/artifact.
3. Add CI workflow (if needed) to build and publish on push to main branch.
4. Verify public URL, routing behavior, and static assets.

### Fallback: Cloudflare Pages (Only if GitHub Pages is blocked)
1. Connect repository to Cloudflare Pages.
2. Configure Astro build command and output directory.
3. Deploy and validate routes/assets.
4. Point custom domain (optional) after successful verification.

## Risks and Mitigations
- Risk: Overuse of JS hurts performance.
  - Mitigation: Keep animations CSS-first and load JS only when necessary.
- Risk: Incomplete project metadata makes cards inconsistent.
  - Mitigation: Define a simple project card schema and enforce required fields.
- Risk: Hosting constraints or Pages limitations.
  - Mitigation: Use Cloudflare Pages as explicitly documented fallback.
