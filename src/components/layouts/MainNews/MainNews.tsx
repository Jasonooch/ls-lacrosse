// src/app/components/MainNewsGrid.tsx
import MainNewsCard from '../../cards/MainNewsCard';
import styles from './MainNews.module.css';

interface Post {
  id: string;
  title: string;
  slug: string;
  heroImage?: {
    url?: string | null;
    alt?: string;
  };
  publishedAt?: string;
}

interface MainNewsProps {
  posts: Post[];
}

const MainNews = ({ posts }: MainNewsProps) => {
  if (!posts || posts.length === 0) {
    return <div className={styles.grid}><p className="text-center col-span-full">No news yet.</p></div>;
  }

  return (
    <div className={styles.grid}>
      {posts.map((post, index) => (
        <MainNewsCard
          key={post.id}
          title={post.title}
          slug={post.slug}
          heroImage={post.heroImage}
          publishedAt={post.publishedAt}
          isMain={index === 0}
        />
      ))}
    </div>
  );
};

export default MainNews;
