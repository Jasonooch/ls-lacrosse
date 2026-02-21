// app/news/[slug]/page.tsx
export const revalidate = 3600;

import Image from 'next/image';
import { notFound } from 'next/navigation';
import HeadingUnderline from '@/components/ui/HeadingUnderline/HeadingUnderline';
import RichTextComponent from '@/components/RichText';
import NextGameCard from '@/components/cards/NextGameCard';
import Link from 'next/link';
import styles from './newsPage.module.css';
import RelatedNewsCard from '@/components/cards/RelatedNewsCard/RelatedNewsCard';
import { Button } from '@/components/ui/button';

import { getPosts } from '@/lib/api/posts';
import { getNextGame } from '@/lib/api/games/games'; // ← Only need this one
import { formatInEasternTime } from '@/lib/date-time';
import { NEWS_BLUR_DATA_URL } from '@/lib/image';

export async function generateStaticParams() {
  const data = await getPosts({ limit: 200, select: { slug: true } });
  return data.docs.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const data = await getPosts({ limit: 1, slug });
  const post = data.docs[0];
  return { title: post?.title ?? 'News' };
}

export default async function SinglePostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  // Parallel fetches: main post + related posts + next game
  const [mainPostData, relatedData, nextGame] = await Promise.all([
    // 1. Main post by slug
    getPosts({ limit: 1, slug: slug }),

    // 2. Related: latest 4 excluding current
    getPosts({ limit: 4, excludeSlug: slug, select: { id: true, title: true, slug: true, heroImage: true, publishedAt: true } }),

    // 3. Next game - using NEW API
    getNextGame(), // ← Changed from getNextVarsityGame()
  ]);

  const post = mainPostData.docs[0];
  if (!post) notFound();

  const relatedPosts = relatedData.docs; // No need to slice, already fetching 4

  const formattedDate = post.publishedAt
    ? formatInEasternTime(post.publishedAt, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : 'No date';

  const heroImageUrl = post.heroImage?.url || null;

  const heroImageAlt = post.heroImage?.alt || post.title;

  return (
    <section className={styles.main}>
      <div className="container">
        <div className={styles.grid}>
          {/* Main Content Column */}
          <div className={styles.storyWrap}>
            <div className="relative">
              {/* Hero Image */}
              {heroImageUrl ? (
                <div className={styles.heroImage}>
                  <Image
                    src={heroImageUrl}
                    alt={heroImageAlt}
                    fill
                    sizes="(max-width: 768px) 100vw, 66vw"
                    placeholder="blur"
                    blurDataURL={NEWS_BLUR_DATA_URL}
                    style={{
                      objectFit: 'cover',
                      objectPosition: post.heroImage?.focalX != null && post.heroImage?.focalY != null
                        ? `${post.heroImage.focalX}% ${post.heroImage.focalY}%`
                        : '50% 25%',
                    }}
                    priority
                  />
                  <div className={styles.attribution}>
                    <span className="text-white font-bold text-[0.75rem] p-y-4">Photo By: {post.photoAttribution || 'Unknown'}</span>
                  </div>
                </div>
              ) : (
                <div className="h-[29rem] bg-gray-300 flex items-center justify-center">
                  <span className="text-gray-600">No hero image</span>
                </div>
              )}

              {/* Title + Date + Content */}
              <div className={styles.contentWrap}>
                <div className={styles.headingWrap}>
                  <h1 className={styles.heading}>{post.title}</h1>
                  <p className='text-[14px]'>{formattedDate}</p>
                </div>

                <RichTextComponent content={post.content} className="px-4 md:px-0 pb-8 leading-relaxed" />
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className={styles.sidebarWrap}>
            {/* Dynamic Next Game Card */}
            <div className="mb-[var(--space-xs)]">
              <NextGameCard game={nextGame} />
            </div>

            {/* Related News Section */}
            <div className={styles.relatedWrap}>
              <HeadingUnderline>Related News</HeadingUnderline>
              <div className="flex flex-col gap-y-4">
                {relatedPosts.map((relatedPost) => (
                  <RelatedNewsCard key={relatedPost.id} post={relatedPost} />
                ))}
              </div>

              <div className="w-full flex gap-y-3 items-start flex-row justify-around">
                <Link href="/news">
                  <Button>All News</Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
