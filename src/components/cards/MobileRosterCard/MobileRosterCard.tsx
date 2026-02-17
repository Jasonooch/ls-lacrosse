import styles from './MobileRosterCard.module.css';
import { Card } from '@/components/ui/card';

interface MobileRosterCardProps {
  jerseyNumber: number | string;
  fullName: string;
  position: string;
  graduationYear: string;
}

const MobileRosterCard = ({
  jerseyNumber,
  fullName,
  position,
  graduationYear,
}: MobileRosterCardProps) => {
  return (
    <Card className={styles.card}>
      <div className={styles.numberContainer}>
        <span className={styles.number}>{jerseyNumber}</span>
      </div>
      <div className={styles.details}>
        <h3 className={styles.name}>{fullName}</h3>
        <div className={styles.infoRow}>
          <span className={styles.position}>{position}</span>
          <span className={styles.separator}></span>
          <span className={styles.graduationYear}>{graduationYear}</span>
        </div>
      </div>
    </Card>
  );
};

export default MobileRosterCard;
