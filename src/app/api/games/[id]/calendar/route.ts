import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { buildIcsContent } from '@/lib/calendar'
import type { Game } from '@/lib/api/games/games'

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params
  const payload = await getPayload({ config })

  let game: Game
  try {
    game = (await payload.findByID({
      collection: 'games',
      id,
      depth: 2,
    })) as unknown as Game
  } catch {
    return new NextResponse('Game not found', { status: 404 })
  }

  const ics = buildIcsContent(game)
  const filename = `${game.slug || id}.ics`

  return new NextResponse(ics, {
    headers: {
      'Content-Type': 'text/calendar; charset=utf-8',
      'Content-Disposition': `attachment; filename="${filename}"`,
    },
  })
}
