// components/cards/ScheduleGameCard/ScheduleGameCard.tsx
import Image from 'next/image';
import Link from 'next/link';
import { MapPin } from 'lucide-react';
import styles from './ScheduleGameCard.module.css';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface ScheduleGameCardProps {
  opponentName: string;
  opponentLogo?: string;
  location: string;
  date: string;
  time?: string;
  lsFinal?: number;
  opponentFinal?: number;
  slug: string;
}

const ScheduleGameCard: React.FC<ScheduleGameCardProps> = ({
  opponentName,
  opponentLogo,
  location,
  date,
  time,
  lsFinal,
  opponentFinal,
  slug,
}) => {
  // 1. Has the game been played?
  const hasScore = lsFinal !== undefined && opponentFinal !== undefined && lsFinal !== null && opponentFinal !== null;

  // 2. Did we win or lose?
  const result: 'W,' | 'L,' | null = hasScore
    ? lsFinal! > opponentFinal!
      ? 'W,'
      : lsFinal! < opponentFinal!
      ? 'L,'
      : null  // tie, if you want to handle it later
    : null;

  // 3. Format the date nicely
  const formattedDate = new Date(date).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });

  return (
     <Card className={styles.main}>
      <div className={styles.logoSection}>
        <div className={styles.logoWrapper}>
          <Image 
          src={opponentLogo || '/images/logo.png'} 
          alt={opponentName}
          fill
          className={styles.logo}
          />
          <div className={location === 'LSRHS' ? styles.locationBadgeHome : styles.locationBadgeAway}>
            {location === 'LSRHS' ? 'vs' : 'at'}
          </div>
        </div>
      </div>
      <div className={styles.detailsWrapper}>
        <span className={styles.opponentName}>{opponentName}</span>
        <div className={styles.locationWrapper}>
          <MapPin size={16} />
          <span className={styles.locationText}>{location}</span>
        </div>
      </div>
      <div className={styles.scoreSection}>
        <div className={styles.scoreWrapper}>
          {hasScore ? (
            <div className={styles.scoreDisplay}>
              <span className={result === 'W,' ? styles.winIndicator : styles.lossIndicator}>
                {result}
              </span>
              <span className={styles.scoreText}>{lsFinal}-{opponentFinal}</span>
            </div>
          ) : (
            <div className={styles.gameTime}>{time || 'TBD'}</div>
          )}
        </div>
        <div className={styles.date}>{formattedDate}</div>
      </div>
      <div className={styles.buttonWrapper}>
        <Link href={`/games/${slug}`}>
          <Button
          size='lg'
          className='font-bold'
          >Game Details</Button>
        </Link>
      </div>
     </Card>
  );
};

export default ScheduleGameCard;
