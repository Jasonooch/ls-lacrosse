import type { CollectionConfig } from 'payload'
import { revalidateTag } from 'next/cache'

export const Media: CollectionConfig = {
  slug: 'media',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
    },
  ],
  hooks: {
    afterChange: [
      () => {
        try { revalidateTag('posts') } catch {}
      },
    ],
  },
  upload: {
    focalPoint: true,
    crop: false,
    imageSizes: [
      {
        name: 'blur',
        width: 8,
        formatOptions: { format: 'webp', options: { quality: 20 } },
      },
      {
        name: 'micro',
        width: 180,
        height: 180,
        position: 'centre',
        formatOptions: { format: 'webp', options: { quality: 70 } },
      },
      {
        name: 'thumbnail',
        width: 430,
        formatOptions: { format: 'webp', options: { quality: 75 } },
      },
      {
        name: 'card',
        width: 875,
        formatOptions: { format: 'webp', options: { quality: 80 } },
      },
    ],
  },
}
