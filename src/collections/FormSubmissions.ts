import type { CollectionConfig } from 'payload'
import { exportSubmissionsHandler } from './endpoints/exportSubmissions'

export const FormSubmissions: CollectionConfig = {
  slug: 'form-submissions',
  endpoints: [
    {
      path: '/export',
      method: 'get',
      handler: exportSubmissionsHandler,
    },
  ],
  access: {
    // Public users can submit forms
    create: () => true,
    // Only authenticated admin users can view/manage submissions
    read: ({ req: { user } }) => !!user,
    update: ({ req: { user } }) => !!user,
    delete: ({ req: { user } }) => !!user,
  },
  admin: {
    useAsTitle: 'formName',
    defaultColumns: ['formName', 'name', 'email', 'status', 'createdAt'],
    enableRichTextRelationship: false,
    description: 'Form submissions from the website. You can export submissions to CSV using the bulk actions.',
  },
  fields: [
    {
      name: 'formName',
      type: 'text',
      required: true,
      index: true,
    },
    {
      name: 'name',
      type: 'text',
    },
    {
      name: 'email',
      type: 'email',
    },
    {
      name: 'payload',
      type: 'json',
      required: true,
      admin: {
        description: 'Full raw submission payload from the frontend form',
        readOnly: true,
      },
    },
    {
      name: 'formattedData',
      type: 'textarea',
      admin: {
        description: 'Human-readable version of the form data',
        readOnly: true,
        rows: 10,
      },
      hooks: {
        beforeChange: [
          ({ siblingData }) => {
            // Auto-generate formatted data from payload
            if (siblingData.payload) {
              return JSON.stringify(siblingData.payload, null, 2)
            }
            return undefined
          },
        ],
      },
    },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'new',
      options: [
        { label: 'New', value: 'new' },
        { label: 'Reviewed', value: 'reviewed' },
        { label: 'Replied', value: 'replied' },
        { label: 'Archived', value: 'archived' },
      ],
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'sourcePage',
      type: 'text',
      admin: {
        description: 'Optional page path where the form was submitted from',
      },
    },
  ],
  hooks: {
    beforeChange: [
      ({ data, operation, req }) => {
        // Prevent public submissions from spoofing status values
        if (operation === 'create' && !req.user) {
          return {
            ...data,
            status: 'new',
          }
        }
        return data
      },
    ],
  },
  timestamps: true,
}
