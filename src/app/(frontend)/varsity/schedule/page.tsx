import PageTitle from '@/components/ui/PageTitle/PageTitle';
import ScheduleGameCard from '@/components/cards/ScheduleGameCard/ScheduleGameCard';
import SeasonSelector from '@/components/ui/season-selector';
import { getSeasonGames } from '@/lib/api/games/games';
import { Button } from '@/components/ui/button';
import { Calendar } from 'lucide-react';
import { getPayload } from 'payload';
import config from '@payload-config';
import { getEasternYear } from '@/lib/date-time';
import Link from 'next/link';
type SeasonOption = {
  id: number
  year: string
}

type Props = {
  searchParams: Promise<{
    year?: string;
  }>;
};

async function getSeasons() {
  const payload = await getPayload({ config });

  const result = await payload.find({
    collection: 'games',
    depth: 1,
    limit: 100,
    where: { _status: { equals: 'published' } },
    select: { season: true, date: true },
  });

  const seasonMap = new Map<number, SeasonOption>();
  for (const game of result.docs) {
    const season = game.season as unknown as { id: number; year?: string } | number;
    const seasonId = typeof season === 'object' && season !== null ? season.id : (season as number);
    if (seasonId && !seasonMap.has(seasonId)) {
      const year = (typeof season === 'object' && season?.year) ? season.year : getEasternYear(game.date as string);
      seasonMap.set(seasonId, { id: seasonId, year });
    }
  }

  return Array.from(seasonMap.values()).sort((a, b) => b.year.localeCompare(a.year));
}

export async function generateMetadata({ searchParams }: Props) {
  // Parallel fetch - params and seasons are independent
  const [params, seasons] = await Promise.all([
    searchParams,
    getSeasons()
  ]);

  const selectedSeason = seasons.find(s => s.year === params.year) || seasons[0];
  const selectedYear = selectedSeason?.year || '2025';

  return {
    title: `${selectedYear} Varsity Schedule`,
  };
}

export default async function VarsitySchedulePage({ searchParams }: Props) {
  // Parallel fetch - params and seasons are independent
  const [params, seasons] = await Promise.all([
    searchParams,
    getSeasons()
  ]);

  // Find season by year or default to most recent
  const selectedSeason = seasons.find(s => s.year === params.year) || seasons[0];
  const selectedYear = selectedSeason?.year || '2025';

  // Fetch games for selected season (dependent on selected season, can't parallelize)
  const games = await getSeasonGames({ seasonId: selectedSeason?.id?.toString() });

  const pageTitle = `${selectedYear} Varsity Schedule`;

  return (
      <section className="pb-[var(--section-padding)]">
        <div className="container">
          <div className="pt-[var(--item-gap)] flex flex-col gap-y-6">
            <PageTitle>{pageTitle}</PageTitle>
            {/* Header with Title and Dropdown */}
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
              <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
                <Link href={`/api/schedule/calendar?seasonId=${selectedSeason?.id}`}>
                  <Button size="lg" className='font-bold'>
                    <Calendar /> Add to Calendar
                  </Button>
                </Link>
              </div>
              {seasons.length > 0 && (
                <SeasonSelector 
                  seasons={seasons} 
                  currentYear={selectedYear}
                />
              )}
            </div>

            {/* Games List */}
            <div className='flex flex-col gap-y-[1rem]'>
              {games.length > 0 ? (
                games.map((game) => (
                  <ScheduleGameCard
                    key={game.id}
                    opponentName={game.opponent.name}
                    opponentLogo={game.opponent.logo?.url}
                    location={game.location}
                    gameDate={game.date}
                    lsFinal={game.lsFinal}
                    opponentFinal={game.opponentFinal}
                    slug={game.slug}
                    gameType={game.gameType}
                  />
                ))
              ) : (
                <p className="text-gray-500 text-center py-8">
                  No games scheduled yet
                </p>
              )}
            </div>
          </div>
        </div>
      </section>
  );
}
