export const revalidate = 60;

import PageTitle from '@/components/ui/PageTitle/PageTitle';
import { getPosts } from '@/lib/api/posts';
import Link from 'next/link';
import MobileNewsCard from '@/components/cards/MobileNewsCard';
import { getPayload } from 'payload';
import config from '@payload-config';
import type { Year } from '@/types/cms';
import { formatInEasternTime } from '@/lib/date-time';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';

export const metadata = { title: 'News' };

const PAGE_SIZE = 10;

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page: pageParam } = await searchParams;
  const currentPage = Math.max(1, Number(pageParam) || 1);

  const payload = await getPayload({ config });
  const [postsData, yearsResult] = await Promise.all([
    getPosts({
      limit: PAGE_SIZE,
      page: currentPage,
      select: { id: true, title: true, slug: true, publishedAt: true, season: true, heroImage: true },
    }),
    payload.find({ collection: 'years', limit: 100 }),
  ]);

  const totalPages = postsData.totalPages ?? 1;
  const posts = postsData.docs;

  const yearsMap = new Map(
    (yearsResult.docs as unknown as Year[]).map((year) => [year.id, year.year])
  );

  const rows = posts.map((post) => {
    let seasonDisplay = 'N/A';
    if (typeof post.season === 'object' && post.season?.year) {
      seasonDisplay = post.season.year;
    } else if (typeof post.season === 'number') {
      seasonDisplay = yearsMap.get(post.season) || 'N/A';
    }
    return {
      date: post.publishedAt
        ? formatInEasternTime(post.publishedAt, { year: 'numeric', month: 'long', day: 'numeric' })
        : 'N/A',
      title: post.slug ? (
        <Link href={`/news/${post.slug}`} className="underline">
          {post.title || 'N/A'}
        </Link>
      ) : (
        post.title || 'N/A'
      ),
      season: seasonDisplay,
    };
  });

  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <section className='pt-[var(--item-gap)] pb-[var(--section-padding)]'>
      <div className="container">

        {/* Desktop */}
        <div className="hidden md:flex flex-col gap-[2rem]">
          <PageTitle>News</PageTitle>
          <div className="space-y-4">
            <Table>
              <TableHeader
                className="overflow-hidden w-full grid py-5 rounded-t-[0.625rem]"
                style={{
                  gridTemplateColumns: '1fr 2fr 1fr',
                  background: 'rgb(9, 31, 63)',
                }}
              >
                <TableRow className="border-0" style={{ display: 'contents' }}>
                  {['Date', 'Title', 'Season'].map((header) => (
                    <TableHead
                      key={header}
                      className="font-bold text-base uppercase !px-8 !h-auto text-white"
                    >
                      {header}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((row, index) => (
                  <TableRow
                    key={index}
                    className="border-x border-gray-200 even:bg-[#f3f3f3] hover:bg-[#e9e9e9] transition-colors grid"
                    style={{ gridTemplateColumns: '1fr 2fr 1fr' }}
                  >
                    <TableCell className="font-medium text-base px-8 py-4">{row.date}</TableCell>
                    <TableCell className="font-medium text-base px-8 py-4">{row.title}</TableCell>
                    <TableCell className="font-medium text-base px-8 py-4">{row.season}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {totalPages > 1 && (
              <div className="flex flex-col items-center gap-4">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        href={`?page=${currentPage - 1}`}
                        className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
                      />
                    </PaginationItem>
                    {pageNumbers.map((page) => (
                      <PaginationItem key={page}>
                        <PaginationLink href={`?page=${page}`} isActive={currentPage === page}>
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    ))}
                    <PaginationItem>
                      <PaginationNext
                        href={`?page=${currentPage + 1}`}
                        className={currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
                <div className="text-center text-sm text-gray-600">
                  Page {currentPage} of {totalPages}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Mobile */}
        <div className="md:hidden flex flex-col gap-[2rem]">
          <PageTitle>News</PageTitle>
          {posts.length === 0 ? (
            <div className="text-center py-8 text-gray-500">No news posts found.</div>
          ) : (
            <div className="flex flex-col gap-y-4">
              {posts.map((post) => (
                <MobileNewsCard
                  key={post.id}
                  title={post.title || 'Untitled Post'}
                  slug={post.slug || ''}
                  heroImage={post.heroImage}
                  publishedAt={post.publishedAt || ''}
                />
              ))}
            </div>
          )}

          {totalPages > 1 && (
            <div className="flex flex-col items-center gap-4 pb-4">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      href={`?page=${currentPage - 1}`}
                      className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
                    />
                  </PaginationItem>
                  {pageNumbers.map((page) => (
                    <PaginationItem key={page}>
                      <PaginationLink href={`?page=${page}`} isActive={currentPage === page}>
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                  <PaginationItem>
                    <PaginationNext
                      href={`?page=${currentPage + 1}`}
                      className={currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
              <div className="text-center text-sm text-gray-600">
                Page {currentPage} of {totalPages}
              </div>
            </div>
          )}
        </div>

      </div>
    </section>
  );
}
