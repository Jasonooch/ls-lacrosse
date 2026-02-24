// app/page.tsx
export const revalidate = 60;

import Image from "next/image";
import { Suspense } from 'react';
import MainNews from "@/components/layouts/MainNews/MainNews";
import NextGameCard from '@/components/cards/NextGameCard';
import Banner from "@/public/images/Banner.webp";
import WematinLogo from "@/public/images/WematinLogo.png";
import NewsLink from "@/components/cards/NewsLink/NewsLink";
import { getPosts } from '@/lib/api/posts';
import { getNextGame } from '@/lib/api/games/games';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import styles from './page.module.css';

async function NextGameSection() {
  const game = await getNextGame();
  return <NextGameCard game={game} />;
}

// Main page component
export default async function Home() {
  const postsData = await getPosts({
    limit: 12,
    select: { id: true, title: true, slug: true, heroImage: true, publishedAt: true },
  });

  const latestPosts = postsData.docs.slice(0, 4);   // For grid
  const morePosts = postsData.docs.slice(4, 12);    // For list

  return (
    <>
        {/* News Grid */}
        <section>
          <div className="container pt-[var(--space-m)]">
            <MainNews posts={latestPosts} />
          </div>
        </section>

        {/* More News + Upcoming Events */}
        <section className='pt-[var(--space-m)]'>
          <div className="container">
            <div className={styles.grid}>
              {/* left side */}
              <div>
                <h2 className={styles.heading}>More News</h2>
                <div className="flex flex-col">
                {morePosts.length > 0 ? (
            morePosts.map((post) => (
              <NewsLink key={post.id} post={post} />
            ))
          ) : (
                    <p className="text-gray-500 py-4">No additional news available</p>
                  )}
                </div>
                <Link href='/news'>
                  <Button
                  className='rounded-none font-bold text-[14px] w-full py-5'
                  >News Archive
                  </Button>
                </Link>
              </div>
              
              {/* right side */}
              <div className='flex flex-col gap-y-[var(--space-s)]'>
                <h2 className={styles.heading}>Upcoming Events</h2>
                <Suspense fallback={<div className="w-full h-48 bg-gray-100 rounded-lg animate-pulse" />}>
                  <NextGameSection />
                </Suspense>
              </div>
            </div>
          </div>
        </section>

         {/* Banner Section */}
        <section className='pt-[var(--space-m)] pb-[var(--space-xl)]'>
          <div className="container">
            <div className="relative">
              <div className={styles.mediaWrapper}>
                <Image src={Banner} alt="banner" className={styles.backgroundImage} />
              </div>
              <div className={styles.logoWrapper}>
                <Image src={WematinLogo} alt="Wematin Logo" height={80} className={styles.logo} priority={false} />
              </div>
            </div>
          </div>
        </section>
    </>
  );
}