import type { CollectionConfig } from 'payload'

export const Rosters: CollectionConfig = {
  slug: 'rosters',
  access: {
    read: () => true,
    create: ({ req: { user } }) => !!user,
    update: ({ req: { user } }) => !!user,
    delete: ({ req: { user } }) => !!user,
  },
  admin: {
    defaultColumns: ['season', 'updatedAt'],
    useAsTitle: 'season',
  },
  versions: {
    drafts: true, // ← This enables full draft functionality
    maxPerDoc: 25, // Optional: limits how many draft versions are kept (default is unlimited)
  },
  fields: [
    {
      name: 'season',
      type: 'relationship',
      relationTo: 'years',
      required: false,
      admin: {
        description: 'Season year (e.g., "2025")',
      },
    },
    {
      name: 'players',
      type: 'array',
      required: false,
      label: 'Players',
      admin: {
        description: 'Players on this roster',
      },
      fields: [
        {
          name: 'player',
          type: 'relationship',
          relationTo: 'players',
          required: true,
          label: 'Player',
        },
      ],
    },
  ],
}
