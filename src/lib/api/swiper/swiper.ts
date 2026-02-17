import { getPayload } from 'payload'
import config from '@payload-config'
import { getGames } from '../games/games'

export interface Season {
  id: number;
  year: string;
}

// Get games data for the swiper (most recent season)
export async function getSwiperGames() {
  const mostRecentSeason = await getMostRecentSeason()

  return await getGames({
    limit: 25,
    publishedOnly: true,
    seasonId: mostRecentSeason?.id?.toString(),
    sortDirection: 'asc',
  })
}

// Extract unique seasons from games data and get the most recent one
async function getMostRecentSeason(): Promise<Season | null> {
  const payload = await getPayload({ config })

  const result = await payload.find({
    collection: 'games',
    depth: 1,
    limit: 100,
    where: { _status: { equals: 'published' } },
    select: { season: true, date: true },
  })

  const seasonMap = new Map<number, Season>()
  for (const game of result.docs) {
    const season = game.season as unknown as { id: number } | number
    const seasonId = typeof season === 'object' && season !== null ? season.id : (season as number)
    if (seasonId && !seasonMap.has(seasonId)) {
      const year = new Date(game.date as string).getFullYear().toString()
      seasonMap.set(seasonId, { id: seasonId, year })
    }
  }

  const seasons = Array.from(seasonMap.values()).sort((a, b) => b.year.localeCompare(a.year))
  return seasons[0] || null
}
