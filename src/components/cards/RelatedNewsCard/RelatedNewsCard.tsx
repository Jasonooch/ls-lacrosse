import Image from 'next/image';
import Link from 'next/link';
import styles from '@/components/cards/RelatedNewsCard/RelatedNewsCard.module.css';
import { formatInEasternTime } from '@/lib/date-time';
import { NEWS_BLUR_DATA_URL } from '@/lib/image';

interface RelatedNewsCardProps {
  post: {
    title: string;
    slug: string;
    publishedAt?: string;
    heroImage?: {
      url?: string | null;
      alt?: string;
      sizes?: {
        micro?: { url?: string | null };
      };
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

  const microUrl = post.heroImage?.sizes?.micro?.url
  const imageUrl = microUrl ?? post.heroImage?.url ?? '/images/logo.png';

  const imageAlt = post.heroImage?.alt || post.title;

  return (
    <Link href={`/news/${post.slug}`} className={styles.main}>
      <Image
        className={styles.image}
        src={imageUrl}
        alt={imageAlt}
        width={60}
        height={60}
        placeholder="blur"
        blurDataURL={NEWS_BLUR_DATA_URL}
        unoptimized={!!microUrl}
      />
      <div className={styles.content}>
        <h3 className={styles.heading}>{post.title}</h3>
        <p className={styles.date}>{formattedDate}</p>
      </div>
    </Link>
  );
};

export default RelatedNewsCard;
