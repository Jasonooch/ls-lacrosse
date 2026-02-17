# Technology Stack

**Analysis Date:** 2026-02-14

## Languages

**Primary:**
- TypeScript 5.x - All application code, configuration, and build files

**Secondary:**
- JavaScript (ESM) - PostCSS and ESLint configuration files
- CSS - Styling with Tailwind CSS v4

## Runtime

**Environment:**
- Node.js - Server-side runtime (version not explicitly specified, inferred from Next.js 16 compatibility)

**Package Manager:**
- npm
- Lockfile: `package-lock.json` present
- Configuration: `.npmrc` with `legacy-peer-deps=true` flag

## Frameworks

**Core:**
- Next.js 16.0.10 - React framework for server-side rendering and static generation
- React 19.2.1 - UI library
- React DOM 19.2.1 - DOM rendering

**CMS/Content:**
- Payload CMS 3.68.4 - Headless CMS via `@payloadcms/next` integration
- Payload Lexical Rich Text Editor 3.68.5 - Content editing

**UI Components:**
- Radix UI 1.4.3 - Unstyled, accessible component primitives
- shadcn/ui - Pre-built Radix UI + Tailwind components (via components.json configuration)
- Lucide React 0.561.0 - Icon library

**Styling:**
- Tailwind CSS 4.x - Utility-first CSS framework with PostCSS integration
- Class Variance Authority 0.7.1 - Component variant management for shadcn/ui
- clsx 2.1.1 - Conditional className utility
- Tailwind Merge 3.4.0 - Merging Tailwind CSS classes without conflicts

**Carousels/Sliders:**
- Swiper 12.0.3 - Touch-friendly slider/carousel component

**Icons:**
- react-simple-icons 13.8.0 - Brand icon pack

## Key Dependencies

**Critical:**
- @payloadcms/next 3.68.4 - Enables Payload CMS integration with Next.js App Router
- @payloadcms/richtext-lexical 3.68.5 - Rich text editing capability for content
- @radix-ui/* (accordion, dialog, dropdown-menu, navigation-menu, select, slot) - Accessible component foundations

**Infrastructure:**
- next 16.0.10 - Production-ready React framework with built-in API routes, ISR, and image optimization
- react 19.2.1, react-dom 19.2.1 - Latest React release

## Configuration

**Environment:**
- Variables configured via `.env` file (contains `NEXT_PUBLIC_BUILDER_API_KEY`)
- `.npmrc` flag: `legacy-peer-deps=true` to allow peer dependency version mismatches

**Build:**
- `tsconfig.json` - TypeScript compiler configuration with path aliases (`@/*` maps to project root)
- `next.config.ts` - Next.js configuration with image optimization for remote patterns
- `postcss.config.mjs` - PostCSS configuration for Tailwind CSS v4
- `eslint.config.mjs` - ESLint configuration using Next.js built-in rules

**TypeScript:**
- Target: ES2017
- Module: ESNext
- Strict mode enabled
- Path aliases configured: `@/*` → `./*`
- JSX: react-jsx

## Platform Requirements

**Development:**
- Node.js (version inferred from Next.js 16 compatibility)
- npm with legacy peer dependencies support

**Production:**
- Deployed on Cloudflare Workers (evidenced by `ls-lacrosse-payload.jasonorlando14.workers.dev` backend)
- Next.js standalone server or Vercel deployment capable

## Build & Development Scripts

```bash
npm run dev          # Start Next.js dev server (port 3000)
npm run build        # Build for production
npm start            # Start production server
npm run lint         # Run ESLint
```

## Image Processing

- Next.js built-in Image component with optimization
- Remote image patterns configured for:
  - `global.divhunt.com` (external asset CDN)
  - `ls-lacrosse-payload.jasonorlando14.workers.dev` (Payload CMS backend)
- Supported formats: AVIF, WebP (modern format prioritization)

---

*Stack analysis: 2026-02-14*
