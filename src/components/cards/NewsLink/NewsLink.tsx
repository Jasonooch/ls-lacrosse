import Link from 'next/link';
import styles from '@/components/cards/NewsLink/NewsLink.module.css';

interface NewsLinkProps {
  post: {
    title: string;
    slug: string;
    publishedAt?: string;
  };
}

const NewsLink = ({ post }: NewsLinkProps) => {
  const year = post.publishedAt 
    ? new Date(post.publishedAt).getFullYear() 
    : new Date().getFullYear(); // Fallback to current year if no date

  return (
    <Link href={`/news/${post.slug}`} className={styles.main}>
      <div className={styles.headingWrap}>
        <span className={styles.year}>{year}:</span>
        <span className={styles.title}>{post.title}</span>
      </div>
      <svg 
        className={styles.arrow}
        width="24" 
        height="24" 
        viewBox="0 0 24 24" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        <path 
          d="M9 18L15 12L9 6" 
          stroke="var(--accent)" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        />
      </svg>
    </Link>
  );
};

export default NewsLink;
