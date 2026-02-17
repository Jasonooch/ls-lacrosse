import { CollectionConfig } from 'payload'

export const CoachingStaff: CollectionConfig = {
  slug: 'coaching-staff',
  admin: {
    useAsTitle: 'year', // Shows a readable title in the admin list
    defaultColumns: ['year', 'level'],
    group: 'Teams & Staff', // Optional: group with your Rosters, etc.
  },
  access: {
    read: () => true,
    create: ({ req: { user } }) => !!user,
    update: ({ req: { user } }) => !!user,
    delete: ({ req: { user } }) => !!user,
  },
  fields: [
    {
      name: 'year',
      type: 'text',
      required: true,
      admin: {
        description: 'Format: "2025"',
        placeholder: '2025',
      },
      index: true, // Good for filtering/sorting by year
    },
    {
      name: 'level',
      type: 'relationship',
      relationTo: 'levels', // Change to your actual Levels/Teams collection slug
      required: true,
      admin: {
        position: 'sidebar',
      },
      index: true,
    },
    {
      name: 'coaches',
      type: 'array',
      label: 'Coaching Staff',
      minRows: 1,
      fields: [
        {
          name: 'coach',
          type: 'relationship',
          relationTo: 'coaches',
          required: true,
          admin: {
            width: '70%',
          },
        },
        {
          name: 'role',
          type: 'select',
          options: [
            { label: 'Head Coach', value: 'head' },
            { label: 'Assistant Coach', value: 'assistant' },
          ],
          defaultValue: 'assistant',
          admin: {
            width: '30%',
          },
        },
      ],
    },
  ],
  hooks: {
    // Optional: Ensure title updates if year/level changes
    beforeChange: [
      ({ data }) => {
        if (data.year && data.level?.name) {
          data.title = `${data.year} ${data.level.name} Coaching Staff`
        }
        return data
      },
    ],
  },
}

export default CoachingStaff
