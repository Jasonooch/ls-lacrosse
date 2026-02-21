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
  }
  publishedAt?: string
  isMain?: boolean
  priority?: boolean
}

export default function MainNewsCard({
  title,
  slug,
  heroImage,
  publishedAt,
  isMain = false,
  priority,
}: MainNewsCardProps) {
  const formattedDate = publishedAt
    ? formatInEasternTime(publishedAt, {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      })
    : null

  const imageUrl = heroImage?.url || null

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
          blurDataURL={NEWS_BLUR_DATA_URL}
          sizes={
            isMain
              ? '(max-width: 768px) 100vw, (max-width: 1280px) 70vw, 860px'
              : '(max-width: 768px) 100vw, (max-width: 1280px) 30vw, 420px'
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
