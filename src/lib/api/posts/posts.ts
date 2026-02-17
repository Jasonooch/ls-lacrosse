import { getPayload } from 'payload'
import config from '@payload-config'
import type { LexicalEditorState, Year } from '@/types/cms'

export type Post = {
  id: string;
  title: string;
  slug: string;
  content?: LexicalEditorState;
  heroImage?: {
    url: string;
    alt?: string;
  };
  publishedAt?: string;
  season?: Year;
  photoAttribution?: string;
};

export async function getPosts({
  limit = 12,
  page = 1,
  excludeSlug,
  slug,
}: {
  limit?: number;
  page?: number;
  excludeSlug?: string;
  slug?: string;
} = {}): Promise<{
  docs: Post[];
  totalDocs?: number;
  totalPages?: number;
  hasNextPage?: boolean;
  hasPrevPage?: boolean;
}> {
  const payload = await getPayload({ config })

  const conditions: Record<string, unknown>[] = []
  if (slug) conditions.push({ slug: { equals: slug } })
  if (excludeSlug) conditions.push({ slug: { not_equals: excludeSlug } })

  const where =
    conditions.length > 1
      ? { and: conditions }
      : conditions.length === 1
        ? conditions[0]
        : {}

  const result = await payload.find({
    collection: 'posts',
    depth: 3,
    sort: '-publishedAt',
    limit,
    page,
    where,
  })

  return {
    docs: result.docs as unknown as Post[],
    totalDocs: result.totalDocs,
    totalPages: result.totalPages,
    hasNextPage: result.hasNextPage,
    hasPrevPage: result.hasPrevPage,
  }
}
