import Link from 'next/link';
import Image from 'next/image';
import styles from './NextGameCard.module.css';
import HeadingUnderline from '../../ui/HeadingUnderline/HeadingUnderline';
import { Button } from '../../ui/button';
import { Card, CardContent } from '../../ui/card';
import { Clock } from 'lucide-react';
import { ArrowRight } from 'lucide-react';
import { getCmsMediaUrl } from '@/lib/cms-url';



interface Game {
  date: string; // ISO date string, e.g., "2025-12-20T19:00:00.000Z"
  opponent: {
    name: string;
    logo?: {
      url: string;
      alt?: string;
    };
  };
  location: string; // e.g., "LSRHS" or away location
  livestreamLink?: string | null;
  slug?: string; // for linking to game page if needed
}

interface NextGameCardProps {
  game: Game | null; // Allow null for loading/no game state
}

export default function NextGameCard({ game }: NextGameCardProps) {
  if (!game) {
    return (
      <Card className="text-center">
        <CardContent className="pt-6">
          <h2 className={styles.fallbackTitle}>
            Next Game
          </h2>
          <p className="text-gray-600 mt-4">No upcoming game scheduled.</p>
        </CardContent>
      </Card>
    );
  }

  const dateObj = new Date(game.date);
  const monthDay = new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: 'numeric',
  }).format(dateObj);
  const time = new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  }).format(dateObj);
  const isHome = game.location === 'LSRHS';

  const opponentLogoUrl = getCmsMediaUrl(game.opponent.logo?.url) || null;

  return (
    <Card className="w-full">
      <CardContent className="pt-8 px-8 pb-8 flex flex-col gap-6">
        {/* Heading */}
        <HeadingUnderline>Next Game</HeadingUnderline>

        {/* Main Content */}
        <div className={styles.flexWrap}>
        {/* Opponent Logo */}
        <div className="flex-shrink-0">
          {opponentLogoUrl ? (
            <Image
              src={opponentLogoUrl}
              alt={game.opponent.logo?.alt || `${game.opponent.name} logo`}
              width={200}
              height={60}
              className={styles.logo}
            />
          ) : (
            <div className="h-15 w-32 bg-gray-200 rounded flex items-center justify-center">
              <span className="text-gray-500 text-sm">No logo</span>
            </div>
          )}
        </div>

        {/* Opponent Line */}
        <div className={styles.textWrap}>
          <div className={styles.vs}>
            <span className="mx-1 font-[16px]">
              {isHome ? 'vs.' : 'at'}
            </span>
            <span className="text-[16px]">{game.opponent.name}</span>
          </div>
          <span className={styles.date}>
            {monthDay}
          </span>
        </div>
     

      {/* Match Details */}
        {/* Date & Time */}
        <div className={styles.timeWrap}>
          <Clock />
          <span>{time}</span>
        </div>
         </div>

        {/* Buttons */}
        <div className={styles.btnWrap}>
          {/* Info Button */}
          {game.slug && (
            <Link href={`/games/${game.slug}`} className="inline-flex">
              <Button 
                size="lg"
                className='w-[9rem] h-[3rem] font-bold px-4'>
                Info
              </Button>
            </Link>
          )}

          {/* Watch Stream Button */}
          {game.livestreamLink && (
            <Link
              href={game.livestreamLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex"
            >
              <Button 
              size="lg"
                  className='w-[9rem] h-[3rem] font-bold px-4'
                >
                Watch
              </Button>
            </Link>
          )}
        </div>

        {/* Full Schedule Link */}
        <Link
          href="/varsity/schedule"
          className={styles.scheduleLink}
        >
          <span className={styles.scheduleTitle}>Full Schedule</span>
          <ArrowRight className={styles.icon} />
        </Link>
      </CardContent>
    </Card>
  );
}
