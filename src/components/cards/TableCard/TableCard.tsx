import styles from './TableCard.module.css';
import { Card } from '@/components/ui/card';

interface TableCardProps {
  className?: string;
}

const TableCard = ({ className }: TableCardProps) => {
  return (
    <Card className="overflow-hidden p-0">
      <table className={`${styles.card} ${className || ''}`}>
      <thead>
        <tr className={styles.headerRow}>
          <th className={styles.heading}>2025</th>
        </tr>
      </thead>
      <tbody className={styles.contentRow}>
        <tr className={styles.row}>
          <td className={styles.labelCell}>Record</td>
          <td className={styles.dataCell}>15-5</td>
        </tr>
        <tr className={styles.row}>
          <td className={styles.labelCell}>Outcome</td>
          <td className={styles.dataCell}>State-Semifinals</td>
        </tr>
        <tr className={styles.row}>
          <td className={styles.labelCell}>Captains</td>
          <td className={styles.dataCell}>John Herlihy, Kyle Smith, Matt Ward</td>
        </tr>
        <tr className={styles.row}>
          <td className={styles.labelCell}>Coach</td>
          <td className={styles.dataCell}>Brian Vona</td>
        </tr>
          <tr className={styles.row}>
          <td className={styles.labelCell}>Asst. Coaches</td>
          <td className={styles.dataCell}>Jason Orlando, Hayden Frey, Rick Clark, Steve Marrow</td>
        </tr>
      </tbody>
    </table>
    </Card>
  );
};

export default TableCard;
