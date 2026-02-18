import styles from './MobileNewsCard.module.css';
import Image from 'next/image';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { formatInEasternTime } from '@/lib/date-time';

interface MobileNewsCardProps {
  title: string;
  slug: string;
  heroImage?: {
    url?: string;
    alt?: string;
    focalX?: number | null;
    focalY?: number | null;
  };
  publishedAt: string;
}

export default function MobileNewsCard({
  title,
  slug,
  heroImage,
  publishedAt,
}: MobileNewsCardProps) {
  const monthDay = publishedAt
    ? formatInEasternTime(publishedAt, { month: 'long', day: 'numeric' })
    : '';
  const year = publishedAt
    ? formatInEasternTime(publishedAt, { year: 'numeric' })
    : '';

  const imageUrl = heroImage?.url || null;

  const imageAlt = heroImage?.alt || title;

  return (
    <Card className={styles.card}>
      <Link href={`/news/${slug}`}>
        <div className={styles.flexWrap}>
          <div className={styles.imageWrap}>
            {imageUrl ? (
              <Image
                className={styles.image}
                fill
                src={imageUrl}
                alt={imageAlt}
                sizes="(max-width: 768px) 75px, 75px"
                style={{
                  objectPosition: heroImage?.focalX != null && heroImage?.focalY != null
                    ? `${heroImage.focalX}% ${heroImage.focalY}%`
                    : 'center',
                }}
              />
            ) : (
              <div className={styles.placeholderImage}></div>
            )}
          </div>
          <div className={styles.contentWrap}>
            <h2 className={styles.title}>{title}</h2>
            <div className={styles.playerInfo}>
              <div className={styles.monthContainer}>
                <span className={styles.month}>{monthDay}</span>
              </div>
              <div className={styles.yearContainer}>
                <span className={styles.year}>{year}</span>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </Card>
  );
};
