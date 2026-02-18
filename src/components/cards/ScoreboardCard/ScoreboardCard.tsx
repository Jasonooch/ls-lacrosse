import Image from 'next/image';
import styles from './ScoreboardCard.module.css';
import type { Game } from '@/lib/api/games/games';
import { Card } from '@/components/ui/card';
import { formatInEasternTime } from '@/lib/date-time';

interface ScoreboardCardProps {
  game: Game;
}

export default function ScoreboardCard({
  game,
}: ScoreboardCardProps) {
  const dateObj = new Date(game.date);
  const formattedDate = formatInEasternTime(game.date, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
  
  // Determine if game has already happened
  const now = new Date();
  const isFinal = dateObj < now;
  
  // Get status: "Final" if past, or time if future
  const status = isFinal 
    ? 'Final' 
    : formatInEasternTime(game.date, {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      });
  
  // Get scores, defaulting to 0 if not available
  const lsScore = game.lsFinal ?? 0;
  const opponentScore = game.opponentFinal ?? 0;

  return (
    <Card className={`${styles.card} gap-2 py-0`}>
      
      {/* Top Section - Date Info */}
      <div className={styles.dateInfo}>
        <div className={styles.date}>{formattedDate}</div>
        <div className={styles.divider}>/</div>
        <div className={styles.status}>{status}</div>
      </div>

      {/* Bottom Section - Outcome */}
      <div className={styles.outcome}>
        
        {/* Left Side - Team Info */}
        <div className={styles.teamInfo}>
          <div className={styles.logoWrapper}>
            <Image
              src={game.opponent.logo?.url || '/images/logo.png'}
              alt={game.opponent.logo?.alt || `${game.opponent.name} logo`}
              width={40}
              height={32}
              className={styles.logo}
            />
          </div>
          {/* Left Side - Team Name */}
          <div className={styles.namesWrap}>
            <div className={styles.teamName}>LS</div>
            <div className={styles.opponentWrapper}>
              <span className={styles.vs}>vs</span>
              <span className={styles.opponentName}>{game.opponent.name}</span>
            </div>
          </div>
        </div>

        {/* Right Side - Scores */}
        <div className={styles.scoreWrapper}>
          <div className={styles.score}>{lsScore}</div>
          <div className={styles.opponentScore}>{opponentScore}</div>
        </div>
      </div>
    </Card>
  );
}
