import type { Game } from '@/lib/api/games/games'

// Games don't store an end time, so we assume a 2-hour duration
const GAME_DURATION_MS = 2 * 60 * 60 * 1000

function fmtIcs(d: Date): string {
  return d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '')
}

function gameTitle(game: Game): string {
  const isHome = game.location === 'LSRHS'
  return `LS Lacrosse ${isHome ? 'vs' : 'at'} ${game.opponent.name}`
}

export function buildGoogleCalUrl(game: Game): string {
  const start = new Date(game.date)
  const end = new Date(start.getTime() + GAME_DURATION_MS)

  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: gameTitle(game),
    dates: `${fmtIcs(start)}/${fmtIcs(end)}`,
    location: game.location || '',
    details: game.livestreamLink ? `Livestream: ${game.livestreamLink}` : '',
  })

  return `https://calendar.google.com/calendar/render?${params}`
}

export function buildIcsContent(games: Game | Game[]): string {
  const list = Array.isArray(games) ? games : [games]

  const events = list.map((game) => {
    const start = new Date(game.date)
    const end = new Date(start.getTime() + GAME_DURATION_MS)
    const description = game.livestreamLink ? `Livestream: ${game.livestreamLink}` : ''

    return [
      'BEGIN:VEVENT',
      `UID:${game.id}@ls-lacrosse`,
      `DTSTART:${fmtIcs(start)}`,
      `DTEND:${fmtIcs(end)}`,
      `SUMMARY:${gameTitle(game)}`,
      game.location ? `LOCATION:${game.location}` : '',
      description ? `DESCRIPTION:${description}` : '',
      'END:VEVENT',
    ]
      .filter(Boolean)
      .join('\r\n')
  })

  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//LS Lacrosse//Schedule//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    ...events,
    'END:VCALENDAR',
  ].join('\r\n')
}
