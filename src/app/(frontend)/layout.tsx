import type { Metadata } from 'next'
import './globals.css'
import Footer from '@/components/blocks/Footer'
import Header from '@/components/blocks/Header'
import MobileNav from '@/components/blocks/MobileNav'
import ScoreSwiperClient from '@/components/swiper/ScoreSwiperClient'
import { getSeasonGames } from '@/lib/api/games/games'
import { getPayload } from 'payload'
import config from '@payload-config'
import { getEasternYear } from '@/lib/date-time'

export const metadata: Metadata = {
  title: 'LS Lacrosse',
  description:
    'Official website for LS Lacrosse - Stay updated with game schedules, team rosters, news, and achievements.',
}

async function getMostRecentSeasonGames() {
  const payload = await getPayload({ config })
  const result = await payload.find({
    collection: 'games',
    depth: 1,
    limit: 100,
    where: { _status: { equals: 'published' } },
    select: { season: true, date: true },
  })

  // Find the most recent season year
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
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const games = await getMostRecentSeasonGames()

  return (
    <html lang="en">
      <body className="antialiased">
        {games.length > 0 && (
          <div className="hidden md:block">
            <ScoreSwiperClient games={games} />
          </div>
        )}
        <Header />
        <MobileNav />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  )
}
