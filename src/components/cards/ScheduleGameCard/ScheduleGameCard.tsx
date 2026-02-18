// components/cards/ScheduleGameCard/ScheduleGameCard.tsx
import Image from 'next/image';
import Link from 'next/link';
import { MapPin } from 'lucide-react';
import styles from './ScheduleGameCard.module.css';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { formatInEasternTime } from '@/lib/date-time';

interface ScheduleGameCardProps {
  opponentName: string;
  opponentLogo?: string;
  location: string;
  gameDate: string;
  lsFinal?: number;
  opponentFinal?: number;
  slug: string;
  gameType?: string;
}

const ScheduleGameCard = ({
  opponentName,
  opponentLogo,
  location,
  gameDate,
  lsFinal,
  opponentFinal,
  slug,
  gameType,
}: ScheduleGameCardProps) => {
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
  const formattedDate = formatInEasternTime(gameDate, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
  const formattedTime = formatInEasternTime(gameDate, {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });

  const gameTypeClass =
    gameType === 'playoffs' ? styles.playoff :
    gameType === 'scrimmage' ? styles.scrimmage :
    ''

  const badgeConfig: Record<string, { label: string; cls: string }> = {
    playoffs: { label: 'Playoffs', cls: styles.badgePlayoffs },
    scrimmage: { label: 'Scrimmage', cls: styles.badgeScrimmage },
  }
  const badge = gameType ? badgeConfig[gameType] : null

  return (
     <Card className={`${styles.main} ${gameTypeClass}`}>
      {badge && (
        <span className={`${styles.gameTypeBadge} ${badge.cls}`}>{badge.label}</span>
      )}
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
            <div className={styles.gameTime}>{formattedTime || 'TBD'}</div>
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
