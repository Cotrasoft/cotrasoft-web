# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Cotrasoft is a landing page for a Colombian developer cooperative ("Cooperativa de Desarrolladores"). Built with React + TypeScript + Vite, styled with Tailwind CSS v4, and deployed to Cloudflare Workers. The site is entirely in **Spanish**.

## Commands

```bash
pnpm dev              # Start dev server (Vite)
pnpm build            # Type-check + build (tsc -b && vite build)
pnpm lint             # ESLint
pnpm preview          # Preview production build locally
pnpm deploy:prod      # Deploy to cotrasoft.co via Cloudflare Workers
pnpm deploy:staging   # Deploy to staging.cotrasoft.co
```

## Architecture

**Single-page app with no router.** Navigation uses anchor links to scroll between sections (`#beneficios`, `#unete`, etc.).

### Active page sections (rendered in App.tsx):
`Navbar` → `Hero` → `Benefits` → `CTA`

### Dormant components (exist in src/components/ but commented out in App.tsx):
`Features`, `Stats`, `Projects`

### Key tech choices:
- **Tailwind CSS v4** — configured via `@tailwindcss/vite` plugin (no `tailwind.config.js`). Theme colors and custom utilities are defined in `src/index.css` using `@theme` and `@utility` directives.
- **framer-motion** — used for scroll-triggered animations and page transitions across all components.
- **react-intersection-observer** — triggers animations when elements scroll into view.
- **Dark mode** — toggled via state in App.tsx, detected from system preferences on mount.

### Custom Tailwind utilities (defined in index.css):
`glass-card`, `gradient-text`, `btn-primary`, `section-padding`, `card-hover`, `animate-float`

### Deployment:
- Cloudflare Workers with static asset serving (`worker.js` + `wrangler.json`)
- `worker.js` handles `/api/*` routes (stub) and delegates everything else to static assets
- SPA fallback configured via `not_found_handling: "single-page-application"`
- Production domain: `cotrasoft.co` | Staging: `staging.cotrasoft.co`

## Style Conventions

- All user-facing text must be in **Spanish**
- Use Tailwind utility classes; custom CSS only when Tailwind can't express it
- Animations use framer-motion `motion.div` with `whileInView` for scroll reveals
- Glass-morphism pattern: `backdrop-blur` + semi-transparent backgrounds (see `glass-card` utility)
- Color palette: primary (blue `#3b82f6`), secondary (purple `#8b5cf6`), accent (cyan `#06b6d4`)
