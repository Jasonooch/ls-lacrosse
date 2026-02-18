export const revalidate = 60;

import PageTitle from '@/components/ui/PageTitle/PageTitle';
import { PaginatedTable } from '@/components/tables/PaginatedTable/PaginatedTable';
import { getPosts } from '@/lib/api/posts';
import Link from 'next/link';
import PaginatedMobileNewsList from '@/components/lists/PaginatedMobileNewsList/PaginatedMobileNewsList';
import { getPayload } from 'payload';
import config from '@payload-config';
import type { Year } from '@/types/cms';
import { formatInEasternTime } from '@/lib/date-time';
export default async function Page() {
  const payload = await getPayload({ config });
  const [postsData, yearsResult] = await Promise.all([
    getPosts({
      limit: 100,
      select: { id: true, title: true, slug: true, publishedAt: true, season: true },
    }),
    payload.find({ collection: 'years', limit: 100 }),
  ]);

  const posts = postsData.docs.sort((a, b) => {
    const dateA = a.publishedAt ? new Date(a.publishedAt).getTime() : 0;
    const dateB = b.publishedAt ? new Date(b.publishedAt).getTime() : 0;
    return dateB - dateA;
  });

  const yearsMap = new Map(
    (yearsResult.docs as unknown as Year[]).map((year) => [year.id, year.year])
  );
  
  return (
    <section className='pt-[var(--item-gap)] pb-[var(--section-padding)]'>
        <div className="container">
            <div className="hidden md:flex flex-col gap-[2rem]">
                <PageTitle>News</PageTitle>
                <PaginatedTable
                    columns={[
                        { accessor: 'date', header: 'Date' },
                        { accessor: 'title', header: 'Title' }, 
                        { accessor: 'season', header: 'Season' }
                    ]} 
                    data={posts.map(post => {
                        // Handle season - could be an ID (number) or populated object
                        let seasonDisplay = 'N/A';
                        if (typeof post.season === 'object' && post.season?.year) {
                          seasonDisplay = post.season.year;
                        } else if (typeof post.season === 'number') {
                          seasonDisplay = yearsMap.get(post.season) || 'N/A';
                        }

                        return {
                          date: post.publishedAt ? formatInEasternTime(post.publishedAt, {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          }) : 'N/A',
                          title: post.slug ? (
                            <Link href={`/news/${post.slug}`} className="underline">
                              {post.title || 'N/A'}
                            </Link>
                          ) : (
                            post.title || 'N/A'
                          ),
                          season: seasonDisplay
                        };
                    })}
                    gridTemplate="1fr 2fr 1fr"
                    itemsPerPage={10}
                />
            </div>
            <div className="md:hidden flex flex-col gap-[2rem]">
                <PageTitle>News</PageTitle>
                <PaginatedMobileNewsList posts={posts} itemsPerPage={5} />
            </div>
        </div>
    </section>
  );
}
