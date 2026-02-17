# External Integrations

**Analysis Date:** 2026-02-14

## APIs & External Services

**Headless CMS:**
- Payload CMS (v3.68.4)
  - Purpose: Content management for posts, games, rosters, seasons
  - SDK/Client: `@payloadcms/next` (Next.js integration), `@payloadcms/richtext-lexical` (content editing)
  - Endpoint: `https://ls-lacrosse-payload.jasonorlando14.workers.dev/api`
  - Authentication: Currently public API (no auth tokens visible in code)

**Builder.io:**
- Service: Page builder / visual content creation
- Purpose: Used for visual content management on under-construction pages
- SDK: `NEXT_PUBLIC_BUILDER_API_KEY` env var
- API Key: 55390d7f7962458b86a22d81eba953b3 (public key)
- Integration: Referenced in `.env`

**Image CDN:**
- DivHunt
  - URL: `https://global.divhunt.com`
  - Purpose: Hosting external images (team photos, backgrounds)
  - Configured in Next.js image remote patterns

## Data Storage

**Database:**
- Type: Headless (managed by Payload CMS backend)
- Connection: Via REST API to `ls-lacrosse-payload.jasonorlando14.workers.dev`
- Client: Native fetch API (no ORM visible; direct HTTP calls)

**File Storage:**
- Primary: Payload CMS media library (accessed via API)
- Images served from: `https://ls-lacrosse-payload.jasonorlando14.workers.dev` (media URLs)

**Caching:**
- Next.js ISR (Incremental Static Regeneration): `revalidate: 60` seconds for API calls
- Cache strategy: Re-validate every 60 seconds for posts, games, and rosters

## Authentication & Identity

**Auth Provider:**
- Status: None detected
- Implementation: Payload CMS API appears to be public (no auth headers in fetch calls)
- Notes: Potential security consideration if API should require authentication

## Monitoring & Observability

**Error Tracking:**
- Status: None detected

**Logs:**
- Approach: Console.log statements throughout API calls
  - Example: `console.log('🔍 API URL:', url)` in `lib/api/posts/posts.ts`
  - Example: `console.log('📦 Returned docs:', ...)` in posts API
  - Example: `console.log('🏃 Games API URL:', url)` in `lib/api/games/games.ts`
  - Used for debugging API interactions

## CI/CD & Deployment

**Hosting:**
- Platform: Cloudflare Workers (backend at `*.workers.dev` domain)
- Frontend: Inferred to be Vercel or Next.js standalone server
- Image remote patterns indicate production URLs already configured

**CI Pipeline:**
- Status: None detected in codebase

## Environment Configuration

**Required env vars:**
- `NEXT_PUBLIC_BUILDER_API_KEY=55390d7f7962458b86a22d81eba953b3` - Builder.io public API key

**Optional env vars:**
- None identified

**Secrets location:**
- `.env` file (local development)
- Likely deployed to hosting platform environment variables (Vercel/Cloudflare)

## API Endpoints (Payload CMS Backend)

**Base URL:** `https://ls-lacrosse-payload.jasonorlando14.workers.dev/api`

**Posts Collection:**
- Endpoint: `/posts`
- Query parameters: `depth`, `sort`, `limit`, `page`, `where` filters
- Parameters:
  - `where[slug][equals]` - Filter by post slug
  - `where[slug][not_equals]` - Exclude specific slug
  - `where[_status][equals]` - Filter by publication status
  - Sort: `-publishedAt` (descending)
- File: `lib/api/posts/posts.ts`

**Games Collection:**
- Endpoint: `/games`
- Query parameters: `depth`, `sort`, `limit`, `page`, `where` filters
- Parameters:
  - `where[season][equals]` - Filter by season ID
  - `where[gameType][equals]` - Filter by varsity/jv/etc
  - `where[date][greater_than]` - Future games
  - `where[date][less_than]` - Past games
  - `where[_status][equals]` - Filter by publication status
  - Sort: `date` or `-date` (ascending/descending)
- File: `lib/api/games/games.ts`
- Convenience functions:
  - `getNextGame()` - Get upcoming game
  - `getSeasonGames()` - Get all games for a season

**Rosters Collection:**
- Endpoint: `/rosters`
- Query parameters: `depth`, `limit`, `page`, `sort`, `where` filters
- Parameters:
  - `where[season][equals]` - Filter by season
  - Sort: `-createdAt` (most recent first)
- File: `lib/api/rosters/rosters.ts`
- Convenience functions:
  - `getRosterBySeason()` - Get roster for specific season
  - `getLatestRoster()` - Get most recent roster
  - `getRosterSeasons()` - Get all available seasons

**Swiper/Carousel Data:**
- Endpoint: `/swiper` (inferred from `lib/api/swiper/swiper.ts`)
- Purpose: Carousel/slider content
- File: `lib/api/swiper/swiper.ts`

## Response Caching Strategy

**All API calls use Next.js ISR:**
```typescript
const res = await fetch(url, {
  next: { revalidate: 60 },  // Re-validate every 60 seconds
});
```

Applies to: Posts, Games, Rosters, Swiper data

## Data Flow

**Typical request flow:**
1. Client requests page (e.g., `/varsity/schedule`)
2. Server-side component calls API function (e.g., `getGames()`)
3. API function constructs query URL with filters
4. Fetch call made to Payload CMS endpoint with ISR cache
5. Response parsed and returned as typed objects
6. Component renders with data

## Webhooks & Callbacks

**Incoming:**
- None detected

**Outgoing:**
- None detected

**Note:** Payload CMS backend may have webhooks configured but they are not visible in frontend code

---

*Integration audit: 2026-02-14*
