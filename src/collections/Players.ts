import type { CollectionConfig } from 'payload'

export const Players: CollectionConfig = {
  slug: 'players',
  access: {
    read: () => true,
    create: ({ req: { user } }) => !!user,
    update: ({ req: { user } }) => !!user,
    delete: ({ req: { user } }) => !!user,
  },
  admin: {
    defaultColumns: ['fullName', 'jerseyNumber', 'graduationYear', 'updatedAt'],
    useAsTitle: 'fullName',
  },
  fields: [
    {
      type: 'row',
      fields: [
        {
          name: 'firstName',
          type: 'text',
          required: true,
          admin: {
            width: '50%',
            description: "Player's first name",
          },
        },
        {
          name: 'lastName',
          type: 'text',
          required: true,
          admin: {
            width: '50%',
            description: "Player's last name",
          },
        },
      ],
    },
    {
      name: 'fullName',
      type: 'text',
      admin: {
        readOnly: true,
        position: 'sidebar',
        description: 'Auto-generated from first and last name',
      },
      hooks: {
        beforeChange: [
          ({ siblingData }) => {
            return `${siblingData.firstName || ''} ${siblingData.lastName || ''}`.trim()
          },
        ],
      },
    },
    {
      name: 'position',
      type: 'select',
      options: [
        {
          label: 'Attack',
          value: 'Attack',
        },
        {
          label: 'Midfield',
          value: 'Midfield',
        },
        {
          label: 'Defense',
          value: 'Defense',
        },
        {
          label: 'Goalie',
          value: 'Goalie',
        },
        {
          label: 'Face Off',
          value: 'Face Off',
        },
      ],
      admin: {
        description: 'Optional for alumni whose position is unknown',
      },
    },
    {
      name: 'jerseyNumber',
      type: 'number',
      admin: {
        description: "Player's jersey number (optional for alumni whose number is unknown)",
      },
      min: 0,
      max: 999,
    },
    {
      name: 'graduationYear',
      type: 'relationship',
      relationTo: 'years',
      required: true,
      admin: {
        description: 'Year of graduation',
      },
    },
    {
      name: 'allAmerican',
      label: 'All-American',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'allAmericanYears',
      label: 'All-American years',
      type: 'relationship',
      relationTo: 'years',
      hasMany: true,
      admin: {
        position: 'sidebar',
        description: 'Each season this player was named an All-American',
        condition: (data) => Boolean(data?.allAmerican),
      },
      hooks: {
        // unchecking All-American clears the years, so no hidden values are left behind
        beforeChange: [({ value, siblingData }) => (siblingData?.allAmerican ? value : [])],
      },
    },
  ],
}
