// lib/api/games.ts

import { getPayload } from 'payload'
import config from '@payload-config'

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
 * Convenience function: Get the next upcoming game
 */
export async function getNextGame({
  seasonId,
  gameType,
}: {
  seasonId?: string;
  gameType?: string;
} = {}): Promise<Game | null> {
  const result = await getGames({
    futureOnly: true,
    gameType,
    seasonId,
    limit: 1,
    sortDirection: 'asc',
  })

  return result.docs[0] || null
}

/**
 * Convenience function: Get all games for a season
 */
export async function getSeasonGames({
  seasonId,
  gameType,
}: {
  seasonId?: string;
  gameType?: string;
}): Promise<Game[]> {
  const result = await getGames({
    seasonId,
    gameType,
    limit: 100,
    sortDirection: 'asc',
  })

  return result.docs
}

/**
 * Convenience function: Get a single game by slug
 */
export async function getGameBySlug(slug: string): Promise<Game | null> {
  const result = await getGames({
    slug,
    limit: 1,
    publishedOnly: true,
  })

  return result.docs[0] || null
}
