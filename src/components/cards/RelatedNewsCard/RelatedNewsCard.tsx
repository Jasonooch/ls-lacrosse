import Image from 'next/image';
import Link from 'next/link';
import styles from '@/components/cards/RelatedNewsCard/RelatedNewsCard.module.css';
import { getCmsMediaUrl } from '@/lib/cms-url';

interface RelatedNewsCardProps {
  post: {
    title: string;
    slug: string;
    publishedAt?: string;
    heroImage?: {
      url: string;
      alt?: string;
    };
  };
}

const RelatedNewsCard: React.FC<RelatedNewsCardProps> = ({ post }) => {
  const formattedDate = post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : '';

  const imageUrl =
    getCmsMediaUrl(post.heroImage?.url) ||
    'https://global.divhunt.com/8b56dae8a68ea38be0b7b58252778780_148686.webp';

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
