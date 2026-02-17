import type { CollectionConfig } from 'payload'

export const Level: CollectionConfig = {
  slug: 'levels',
  admin: {
    useAsTitle: 'name',
  },
  fields: [
    {
      name: 'name', // The key name for the field
      label: 'Level Name', // What the user sees in the Admin UI (e.g., "Beginner", "Intermediate")
      type: 'text', // Simple, basic text input
      required: true, // This field must always have a value
    },
  ],
}
