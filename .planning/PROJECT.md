# LS Lacrosse - Unified Team Website

## What This Is

A unified Next.js web application for a high school lacrosse team that consolidates a PayloadCMS backend and public-facing frontend into a single Cloudflare Workers deployment. Parents and fans can view game schedules with scores, team rosters, blog posts about games, and historical records — all managed through a headless CMS admin panel.

## Core Value

Parents and fans can easily access current team information and game results in one place, while administrators manage all content through a simple CMS interface without needing code changes or redeployments.

## Requirements

### Validated

**From existing Payload backend:**
- ✓ PayloadCMS 3.76 backend with admin panel — existing
- ✓ Cloudflare D1 (SQLite) database integration — existing
- ✓ Cloudflare R2 storage for media/images — existing
- ✓ Collections: Games, Players, Rosters, Coaches, CoachingStaff, Opponents, Level, Years, Posts, Users, Media — existing
- ✓ Content management through Payload admin — existing
- ✓ API routes for data access — existing

**From existing frontend:**
- ✓ Next.js 16 App Router architecture — existing
- ✓ Shadcn/ui component library integration — existing
- ✓ Tailwind CSS v4 styling system — existing
- ✓ TypeScript strict mode — existing
- ✓ Responsive layout foundation — existing
- ✓ UI components: Button, HeadingUnderline, EventCardSidebar — existing

### Active

**Project consolidation:**
- [ ] Merge frontend code into Payload project's `src/app/(frontend)/` structure
- [ ] Migrate all frontend pages (schedule, roster, news, history) into unified app
- [ ] Configure unified Cloudflare Workers deployment
- [ ] Set up single build/deploy pipeline

**Frontend integration:**
- [ ] Connect schedule page to Games collection data
- [ ] Connect roster page to Players/Rosters collection data
- [ ] Connect news/blog to Posts collection with rich text rendering
- [ ] Connect history page to Years collection for past seasons
- [ ] Implement dynamic data fetching from Payload collections

**Content features:**
- [ ] Game schedule display with scores
- [ ] Roster tables by level (varsity, JV, etc.)
- [ ] Blog post listing and individual post pages
- [ ] Historical season records view

**Infrastructure:**
- [ ] Deploy unified app to Cloudflare Workers
- [ ] Configure environment variables for single deployment
- [ ] Remove Vercel deployment for frontend
- [ ] Verify D1/R2 connections work in unified setup

### Out of Scope

- OAuth/social login — not needed for public site
- Real-time score updates — static updates sufficient
- Player statistics tracking — historical records only
- Mobile app — web-first approach
- Multi-team/multi-sport expansion — single team focus
- Advanced analytics/dashboards — basic views sufficient
- Moving away from Cloudflare — cost-effective choice locked in
- Redesigning existing shadcn components — preserve current design

## Context

**Current state:**
Two separate projects managed independently:
1. **ls-lacrosse-payload**: PayloadCMS backend on Cloudflare Workers (D1 + R2)
2. **ls-lacrosse-test-main**: Next.js frontend on Vercel

**Pain points:**
- Duplicate hosting costs (Cloudflare + Vercel)
- Manual syncing of changes between projects
- Complexity of managing two deployments
- Confusion about which project to update

**Target audience:**
- Primary: Parents of players checking game results and team news
- Secondary: Fans following the high school lacrosse program
- No recruiting focus (high school level)

**Content workflow:**
Once deployed, content updates happen through Payload admin panel without code changes. Minimal redeployments needed after initial launch.

## Constraints

- **Timeline**: Complete consolidation this week — urgent
- **Tech stack**: Must use PayloadCMS (backend) and shadcn components (frontend) — non-negotiable
- **Hosting**: Cloudflare Workers only — cost-effective for low-traffic site
- **Budget**: Keep costs minimal — high school team site with low traffic
- **Framework**: Next.js required — Payload runs on Next.js
- **Component library**: Shadcn/ui already integrated — preserve existing components

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Deploy unified app to Cloudflare Workers | Significantly cheaper than dual hosting (Cloudflare + Vercel), Payload already configured for Cloudflare | — Pending |
| Merge frontend into Payload's Next.js app | Payload already uses Next.js, allows single deployment, shared types automatically available | — Pending |
| Keep existing Payload collections as-is | Backend data model is solid, no need to restructure | — Pending |
| Preserve shadcn component library | Recently migrated frontend to shadcn, modern accessible components | — Pending |
| Project name: ls-lacrosse | Simple, clear identifier, avoids "test-main" placeholder name | — Pending |

---
*Last updated: 2026-02-14 after initialization*
