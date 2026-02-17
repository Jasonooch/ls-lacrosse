import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import PageTitle from '@/components/ui/PageTitle/PageTitle'
import { Button } from '@/components/ui/button'
import { getGameBySlug } from '@/lib/api/games/games'
import { formatInEasternTime } from '@/lib/date-time'

type Props = {
  params: Promise<{ slug: string }>
}

export default async function GameDetailsPage({ params }: Props) {
  const { slug } = await params
  const game = await getGameBySlug(slug)

  if (!game) {
    notFound()
  }

  const formattedDate = formatInEasternTime(game.date, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
  const formattedTime = formatInEasternTime(game.date, {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  })

  const opponentLogoUrl = game.opponent.logo?.url
  const isHomeGame = game.location === 'LSRHS'

  return (
    <section className="pb-[var(--section-padding)]">
      <div className="container">
        <div className="flex flex-col gap-8 pt-[var(--item-gap)]">
          <PageTitle>Game Details</PageTitle>

          <div className="rounded-[var(--radius)] border border-gray-200 p-6 md:p-8">
            <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
              <div className="flex items-center gap-4">
                {opponentLogoUrl ? (
                  <Image
                    src={opponentLogoUrl}
                    alt={game.opponent.logo?.alt || `${game.opponent.name} logo`}
                    width={90}
                    height={90}
                    className="h-auto w-[90px]"
                  />
                ) : (
                  <Image src="/images/logo.png" alt="LS logo" width={90} height={90} />
                )}

                <div className="flex flex-col">
                  <span className="text-sm uppercase tracking-wide text-gray-500">
                    {isHomeGame ? 'Home' : 'Away'}
                  </span>
                  <h1 className="text-2xl font-semibold text-[var(--primary)]">
                    {isHomeGame ? 'vs' : 'at'} {game.opponent.name}
                  </h1>
                </div>
              </div>

              {game.gameType && (
                <span className="inline-flex w-fit rounded-full bg-gray-100 px-3 py-1 text-sm capitalize text-gray-700">
                  {game.gameType.replace('-', ' ')}
                </span>
              )}
            </div>

            <div className="mt-8 grid gap-4 md:grid-cols-3">
              <div className="rounded-lg bg-gray-50 p-4">
                <p className="text-xs uppercase tracking-wide text-gray-500">Date</p>
                <p className="mt-1 font-medium text-[var(--primary)]">{formattedDate}</p>
              </div>
              <div className="rounded-lg bg-gray-50 p-4">
                <p className="text-xs uppercase tracking-wide text-gray-500">Time</p>
                <p className="mt-1 font-medium text-[var(--primary)]">{formattedTime}</p>
              </div>
              <div className="rounded-lg bg-gray-50 p-4">
                <p className="text-xs uppercase tracking-wide text-gray-500">Location</p>
                <p className="mt-1 font-medium text-[var(--primary)]">{game.location}</p>
              </div>
            </div>

            {(game.lsFinal !== undefined || game.opponentFinal !== undefined) && (
              <div className="mt-6 rounded-lg border border-gray-200 p-4">
                <p className="text-xs uppercase tracking-wide text-gray-500">Final Score</p>
                <p className="mt-1 text-lg font-semibold text-[var(--primary)]">
                  LS {game.lsFinal ?? '-'} - {game.opponentFinal ?? '-'} {game.opponent.name}
                </p>
              </div>
            )}

            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/varsity/schedule">
                <Button size="lg" className="font-bold">
                  Back to Schedule
                </Button>
              </Link>
              {game.livestreamLink && (
                <Link href={game.livestreamLink} target="_blank" rel="noopener noreferrer">
                  <Button size="lg" variant="outline" className="font-bold">
                    Watch Stream
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
