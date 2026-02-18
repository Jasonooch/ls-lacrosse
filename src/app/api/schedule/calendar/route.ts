import { NextRequest, NextResponse } from 'next/server'
import { getSeasonGames } from '@/lib/api/games/games'
import { buildIcsContent } from '@/lib/calendar'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const seasonId = searchParams.get('seasonId') ?? undefined

  const games = await getSeasonGames({ seasonId })

  if (!games.length) {
    return new NextResponse('No games found for this season', { status: 404 })
  }

  const ics = buildIcsContent(games)
  const filename = `ls-lacrosse-schedule${seasonId ? `-${seasonId}` : ''}.ics`

  return new NextResponse(ics, {
    headers: {
      'Content-Type': 'text/calendar; charset=utf-8',
      'Content-Disposition': `attachment; filename="${filename}"`,
    },
  })
}
