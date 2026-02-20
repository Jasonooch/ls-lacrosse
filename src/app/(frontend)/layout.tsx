import type { Metadata } from 'next'
import './globals.css'
import Footer from '@/components/blocks/Footer'
import Header from '@/components/blocks/Header'
import MobileNav from '@/components/blocks/MobileNav'
import ScoreSwiperClient from '@/components/swiper/ScoreSwiperClient'
import { getMostRecentSeasonGames } from '@/lib/api/games/games'
import { Analytics } from '@vercel/analytics/next'
import { SpeedInsights } from '@vercel/speed-insights/next'

export const metadata: Metadata = {
  title: 'LS Lacrosse',
  description:
    'Official website for LS Lacrosse - Stay updated with game schedules, team rosters, news, and achievements.',
  icons: {
    icon: '/images/favicon.png',
    apple: '/images/favicon.png',
  },
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
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
