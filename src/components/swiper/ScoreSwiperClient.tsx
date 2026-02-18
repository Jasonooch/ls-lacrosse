'use client'

import dynamic from 'next/dynamic'
import type { Game } from '@/lib/api/games/games'

const ScoreSwiper = dynamic(() => import('./ScoreSwiper'), { ssr: false })

export default function ScoreSwiperClient({ games }: { games: Game[] }) {
  return <ScoreSwiper games={games} />
}
