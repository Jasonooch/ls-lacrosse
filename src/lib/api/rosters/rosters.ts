// lib/api/rosters.ts

import { getPayload } from 'payload'
import config from '@payload-config'

// Raw API response types
interface ApiGraduationYear {
  id: number;
  year: string;
  updatedAt: string;
  createdAt: string;
}

interface ApiPlayer {
  id: string;
  fullName: string;
  position: string;
  jerseyNumber?: number;
  graduationYear?: ApiGraduationYear | string | number;
}

interface NestedPlayer {
  player: ApiPlayer;
}

interface ApiRoster {
  id: string;
  season: string | number | ApiGraduationYear | null;
  players: (ApiPlayer | NestedPlayer)[];
}

// Player type (flattened for easy use)
export type Player = {
  id: string;
  fullName: string;
  position: string;
  jerseyNumber?: number;
  graduationYear: string; // e.g., "2026"
};

// Roster type (one season document)
export type Roster = {
  id: string;
  season: string; // e.g., "2025"
  players: Player[];
};

/**
 * Reusable function for fetching rosters
 */
export async function getRosters({
  limit = 50,
  page = 1,
  season,
  sort = '-createdAt',
}: {
  limit?: number;
  page?: number;
  season?: string;
  sort?: string;
} = {}): Promise<{
  docs: Roster[];
  totalDocs?: number;
  totalPages?: number;
  hasNextPage?: boolean;
  hasPrevPage?: boolean;
}> {
  const payload = await getPayload({ config })

  const where: Record<string, unknown> = {}
  if (season) where.season = { equals: season }

  const result = await payload.find({
    collection: 'rosters',
    depth: 2,
    sort,
    limit,
    page,
    where,
  })

  const rawDocs = result.docs as unknown as ApiRoster[]

  // Season ID to year mapping
  const seasonYearMap: Record<number, string> = {
    1: '2025',
    2: '2026',
    3: '2027',
    4: '2028',
  }

  // Flatten the nested player relation
  const flattenedDocs = rawDocs.map((doc: ApiRoster) => {
    const rawSeason = doc.season
    let seasonYear = '-'
    if (typeof rawSeason === 'number') {
      seasonYear = seasonYearMap[rawSeason] || String(rawSeason)
    } else if (typeof rawSeason === 'string') {
      seasonYear = rawSeason
    } else if (rawSeason && typeof rawSeason === 'object' && 'year' in rawSeason) {
      seasonYear = rawSeason.year
    }

    return {
      ...doc,
      season: seasonYear,
      players: (doc.players || []).map((p: ApiPlayer | NestedPlayer) => {
        const player = 'player' in p ? p.player : p

        const graduationYearMap: Record<number, string> = {
          1: '2025',
          2: '2026',
          3: '2027',
          4: '2028',
        }

        let graduationYear = '-'
        if (player.graduationYear) {
          if (typeof player.graduationYear === 'object' && 'year' in player.graduationYear) {
            graduationYear = player.graduationYear.year
          } else if (typeof player.graduationYear === 'string') {
            graduationYear = player.graduationYear
          } else if (typeof player.graduationYear === 'number') {
            graduationYear = graduationYearMap[player.graduationYear] || String(player.graduationYear)
          }
        }

        return {
          id: player.id,
          fullName: player.fullName,
          position: player.position || '-',
          jerseyNumber: player.jerseyNumber,
          graduationYear,
        }
      }),
    }
  })

  return {
    docs: flattenedDocs,
    totalDocs: result.totalDocs,
    totalPages: result.totalPages,
    hasNextPage: result.hasNextPage,
    hasPrevPage: result.hasPrevPage,
  }
}

/**
 * Get roster for a specific season
 */
export async function getRosterBySeason(season: string): Promise<Roster | null> {
  const result = await getRosters({ season, limit: 1 })
  return result.docs[0] || null
}

/**
 * Get the latest roster (most recently created/updated)
 */
export async function getLatestRoster(): Promise<Roster | null> {
  const result = await getRosters({ limit: 1, sort: '-createdAt' })
  return result.docs[0] || null
}

/**
 * Get all available seasons (for dropdown)
 */
export async function getRosterSeasons(): Promise<string[]> {
  const result = await getRosters({ limit: 50, sort: '-season' })
  return result.docs.map((roster) => roster.season).filter(Boolean)
}
