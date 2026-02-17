import type { CollectionConfig } from 'payload'

export const Years: CollectionConfig = {
  slug: 'years',
  access: {
    read: () => true, // Allow anyone to read years
    create: ({ req: { user } }) => !!user,
    update: ({ req: { user } }) => !!user,
    delete: ({ req: { user } }) => !!user,
  },
  admin: {
    useAsTitle: 'year',
  },
  fields: [
    {
      name: 'year',
      label: 'Year',
      type: 'text',
      required: true,
      unique: true,
    },
  ],
}
