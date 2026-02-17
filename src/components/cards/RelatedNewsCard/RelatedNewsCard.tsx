import Image from 'next/image';
import Link from 'next/link';
import styles from '@/components/cards/RelatedNewsCard/RelatedNewsCard.module.css';
import { formatInEasternTime } from '@/lib/date-time';

interface RelatedNewsCardProps {
  post: {
    title: string;
    slug: string;
    publishedAt?: string;
    heroImage?: {
      url?: string | null;
      alt?: string;
    };
  };
}

const RelatedNewsCard = ({ post }: RelatedNewsCardProps) => {
  const formattedDate = post.publishedAt
    ? formatInEasternTime(post.publishedAt, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : '';

  const imageUrl = post.heroImage?.url || '/images/logo.png';

  const imageAlt = post.heroImage?.alt || post.title;

  return (
    <Link href={`/news/${post.slug}`} className={styles.main}>
      <Image
        className={styles.image}
        src={imageUrl}
        alt={imageAlt}
        width={60}
        height={60}
      />
      <div className={styles.content}>
        <h3 className={styles.heading}>{post.title}</h3>
        <p className={styles.date}>{formattedDate}</p>
      </div>
    </Link>
  );
};

export default RelatedNewsCard;
