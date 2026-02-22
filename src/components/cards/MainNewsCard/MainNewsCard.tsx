// src/app/cards/MainNewsCard.tsx  (or your path)

import Link from 'next/link'
import Image from 'next/image'
import styles from './MainNewsCard.module.css'
import { formatInEasternTime } from '@/lib/date-time'
import { NEWS_BLUR_DATA_URL } from '@/lib/image'

interface MainNewsCardProps {
  title: string
  slug: string
  heroImage?: {
    url?: string | null
    alt?: string
    focalX?: number | null
    focalY?: number | null
    sizes?: {
      blur?: { url?: string | null }
      thumbnail?: { url?: string | null }
      card?: { url?: string | null }
    }
  }
  publishedAt?: string
  isMain?: boolean
  priority?: boolean
  blurDataURL?: string
}

export default function MainNewsCard({
  title,
  slug,
  heroImage,
  publishedAt,
  isMain = false,
  priority,
  blurDataURL,
}: MainNewsCardProps) {
  const formattedDate = publishedAt
    ? formatInEasternTime(publishedAt, {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      })
    : null

  // Main card gets the full-width card size; secondary cards get the thumbnail size
  // When a Payload-generated size is available (already WebP), skip Vercel's optimizer
  const payloadSizedUrl = isMain
    ? heroImage?.sizes?.card?.url
    : heroImage?.sizes?.thumbnail?.url
  const imageUrl = payloadSizedUrl ?? heroImage?.url ?? null

  const imageAlt = heroImage?.alt || title

  return (
    <Link href={`/news/${slug}`} className={styles.card}>
      {/* Background Image */}
      {imageUrl ? (
        <Image
          src={imageUrl}
          alt={imageAlt}
          fill
          className={styles.image}
          priority={priority ?? isMain}
          placeholder="blur"
          blurDataURL={blurDataURL ?? NEWS_BLUR_DATA_URL}
          unoptimized={!!payloadSizedUrl}
          sizes={
            isMain
              ? '(max-width: 768px) 100vw, (max-width: 1280px) 70vw, 875px'
              : '(max-width: 768px) 100vw, (max-width: 1280px) 30vw, 430px'
          }
          style={{
            objectPosition:
              heroImage?.focalX != null && heroImage?.focalY != null
                ? `${heroImage.focalX}% ${heroImage.focalY}%`
                : '50% 25%',
          }}
        />
      ) : (
        <div className="absolute inset-0 bg-gray-800 flex items-center justify-center">
          <span className="text-white">No image</span>
        </div>
      )}

      {/* Text Wrapper + Red Bar */}
      <div className={styles.textWrapper}>
        <h3 className={styles.title}>{title}</h3>
        {formattedDate && <span className={styles.meta}>{formattedDate}</span>}
      </div>
    </Link>
  )
}
