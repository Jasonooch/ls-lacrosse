import type { CollectionConfig } from 'payload'
import { revalidateTag } from 'next/cache'

import {
  HeadingFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

const revalidate = () => {
  try { revalidateTag('hall-of-fame') } catch {}
}

export const HallOfFame: CollectionConfig = {
  slug: 'hall-of-fame',
  labels: { singular: 'Hall of Fame inductee', plural: 'Hall of Fame' },
  access: {
    read: () => true,
    create: ({ req: { user } }) => !!user,
    update: ({ req: { user } }) => !!user,
    delete: ({ req: { user } }) => !!user,
  },
  admin: {
    defaultColumns: ['name', 'inductionYear', 'updatedAt'],
    useAsTitle: 'name',
  },
  hooks: {
    afterChange: [revalidate],
    afterDelete: [revalidate],
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: { position: 'sidebar', description: 'Auto-generated from name' },
      hooks: {
        beforeValidate: [
          ({ value, data }) => {
            if (!value && data?.name) {
              return data.name
                .toLowerCase()
                .replace(/[^\w\s-]/g, '')
                .replace(/\s+/g, '-')
                .replace(/-+/g, '-')
                .trim()
            }
            return value
          },
        ],
      },
    },
    {
      name: 'inductionYear',
      label: 'Class of (induction year)',
      type: 'number',
      required: true,
      admin: { position: 'sidebar', step: 1 },
    },
    {
      name: 'yearsAtLS',
      label: 'Years at LS',
      type: 'text',
      admin: { position: 'sidebar', description: 'e.g. 2008–2012' },
    },
    {
      name: 'photo',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'bio',
      type: 'richText',
      editor: lexicalEditor({
        features: ({ rootFeatures }) => [
          ...rootFeatures,
          HeadingFeature({ enabledHeadingSizes: ['h2', 'h3'] }),
          InlineToolbarFeature(),
        ],
      }),
    },
    {
      name: 'honors',
      type: 'array',
      labels: { singular: 'Honor', plural: 'Honors' },
      fields: [{ name: 'honor', type: 'text', required: true }],
    },
  ],
}
