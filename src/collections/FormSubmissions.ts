import type { CollectionConfig } from 'payload'
import { answerLabel, answerText, exportSubmissionsHandler } from './endpoints/exportSubmissions'

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
            // Auto-generate one "Label: value" line per answer from the payload
            if (siblingData.payload && typeof siblingData.payload === 'object') {
              return Object.entries(siblingData.payload as Record<string, unknown>)
                .map(([key, value]) => `${answerLabel(key)}: ${answerText(value)}`)
                .join('\n')
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
    afterChange: [
      async ({ doc, operation, req }) => {
        // Copy Ando Day RSVPs to the Google Sheet (scripts/google-sheets/ando-day-rsvp.gs).
        // The submission is already saved, so a sheet failure is logged, never shown to the person.
        const sheetUrl = process.env.ANDO_DAY_RSVP_SHEET_URL
        if (operation !== 'create' || doc.formName !== 'ando-day-rsvp' || !sheetUrl) return doc
        try {
          const res = await fetch(sheetUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(doc.payload),
            signal: AbortSignal.timeout(10000),
          })
          const reply = await res.text()
          if (!res.ok || reply.trim() !== 'ok') throw new Error(`Sheet replied ${res.status}: ${reply.slice(0, 200)}`)
        } catch (error) {
          req.payload.logger.error({ err: error, msg: 'Could not copy the RSVP to the Google Sheet' })
        }
        return doc
      },
    ],
  },
  timestamps: true,
}
