// lib/api/games.ts

import { getPayload } from 'payload'
import config from '@payload-config'
import { unstable_cache } from 'next/cache'
import { getEasternYear } from '@/lib/date-time'

export type SeasonOption = {
  id: number;
  year: string;
};

// Shared Game type
export type Game = {
  id: string;
  slug: string;
  date: string; // ISO string
  opponent: {
    name: string;
    logo?: {
      url?: string | null;
      alt?: string;
    };
  };
  season: {
    id: number;
    year: string;
  };
  location: string;
  livestreamLink?: string | null;
  gameType?: string; // e.g., "varsity", "jv"
  lsFinal?: number;
  opponentFinal?: number;
};

/**
 * Reusable function for fetching games
 *
 * Examples:
 * - Get all games for a season: getGames({ seasonId: "1" })
 * - Get next varsity game: getGames({ futureOnly: true, gameType: "varsity", limit: 1 })
 * - Get past games: getGames({ pastOnly: true, seasonId: "1" })
 */
export async function getGames({
  limit = 50,
  page = 1,
  seasonId,
  slug,
  gameType,
  futureOnly,
  pastOnly,
  sortDirection = 'asc',
  publishedOnly = true,
}: {
  limit?: number;
  page?: number;
  seasonId?: string;
  slug?: string;
  gameType?: string;
  futureOnly?: boolean;
  pastOnly?: boolean;
  sortDirection?: 'asc' | 'desc';
  publishedOnly?: boolean;
} = {}): Promise<{
  docs: Game[];
  totalDocs?: number;
  totalPages?: number;
  hasNextPage?: boolean;
  hasPrevPage?: boolean;
}> {
  const payload = await getPayload({ config })

  const where: Record<string, unknown> = {}

  if (slug) where.slug = { equals: slug }
  if (seasonId) where.season = { equals: parseInt(seasonId, 10) }
  if (gameType) where.gameType = { equals: gameType }
  if (futureOnly) where.date = { greater_than: new Date().toISOString() }
  if (pastOnly) where.date = { less_than: new Date().toISOString() }
  if (publishedOnly) where._status = { equals: 'published' }

  const result = await payload.find({
    collection: 'games',
    depth: 2,
    sort: sortDirection === 'desc' ? '-date' : 'date',
    limit,
    page,
    where,
  })

  return {
    docs: result.docs as unknown as Game[],
    totalDocs: result.totalDocs,
    totalPages: result.totalPages,
    hasNextPage: result.hasNextPage,
    hasPrevPage: result.hasPrevPage,
  }
}

/**
 * Cached: Get the next upcoming game
 */
export async function getNextGame({
  seasonId,
  gameType,
}: {
  seasonId?: string;
  gameType?: string;
} = {}): Promise<Game | null> {
  return unstable_cache(
    async () => {
      const result = await getGames({
        futureOnly: true,
        gameType,
        seasonId,
        limit: 1,
        sortDirection: 'asc',
      })
      return result.docs[0] || null
    },
    ['next-game', seasonId ?? 'none', gameType ?? 'none'],
    { revalidate: 300, tags: ['games'] },
  )()
}

/**
 * Cached: Get all games for a season
 */
export async function getSeasonGames({
  seasonId,
  gameType,
}: {
  seasonId?: string;
  gameType?: string;
}): Promise<Game[]> {
  return unstable_cache(
    async () => {
      const result = await getGames({
        seasonId,
        gameType,
        limit: 100,
        sortDirection: 'asc',
      })
      return result.docs
    },
    ['season-games', seasonId ?? 'none', gameType ?? 'none'],
    { revalidate: 300, tags: ['games'] },
  )()
}

/**
 * Cached: Get a single game by slug
 */
export async function getGameBySlug(slug: string): Promise<Game | null> {
  return unstable_cache(
    async () => {
      const result = await getGames({
        slug,
        limit: 1,
        publishedOnly: true,
      })
      return result.docs[0] || null
    },
    ['game-by-slug', slug],
    { revalidate: 3600, tags: ['games'] },
  )()
}

/**
 * Cached: Get all distinct seasons from published games (used in season selector)
 */
export const getSeasons = unstable_cache(
  async (): Promise<SeasonOption[]> => {
    const payload = await getPayload({ config })
    const result = await payload.find({
      collection: 'games',
      depth: 1,
      limit: 100,
      where: { _status: { equals: 'published' } },
      select: { season: true, date: true },
    })

    const seasonMap = new Map<number, SeasonOption>()
    for (const game of result.docs) {
      const season = game.season as unknown as { id: number; year?: string } | number
      const seasonId = typeof season === 'object' && season !== null ? season.id : (season as number)
      if (seasonId && !seasonMap.has(seasonId)) {
        const year = typeof season === 'object' && season?.year ? season.year : getEasternYear(game.date as string)
        seasonMap.set(seasonId, { id: seasonId, year })
      }
    }

    return Array.from(seasonMap.values()).sort((a, b) => b.year.localeCompare(a.year))
  },
  ['game-seasons'],
  { revalidate: 300, tags: ['games'] },
)

/**
 * Cached: Get games for the most recent season (used in layout score ticker)
 */
export const getMostRecentSeasonGames = unstable_cache(
  async () => {
    const payload = await getPayload({ config })
    const result = await payload.find({
      collection: 'games',
      depth: 1,
      limit: 100,
      where: { _status: { equals: 'published' } },
      select: { season: true, date: true },
    })

    let latestYear = ''
    let latestSeasonId: number | null = null
    for (const game of result.docs) {
      const season = game.season as unknown as { id: number; year?: string } | number
      const seasonId = typeof season === 'object' && season !== null ? season.id : (season as number)
      const year = typeof season === 'object' && season?.year ? season.year : getEasternYear(game.date as string)
      if (year > latestYear) {
        latestYear = year
        latestSeasonId = seasonId
      }
    }

    if (!latestSeasonId) return []
    return getSeasonGames({ seasonId: String(latestSeasonId) })
  },
  ['games-layout'],
  { revalidate: 300, tags: ['games'] },
)
