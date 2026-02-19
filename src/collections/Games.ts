import type { CollectionConfig } from 'payload'
import { revalidateTag } from 'next/cache'

const revalidateGames = () => { revalidateTag('games') }

export const Games: CollectionConfig = {
  slug: 'games',
  hooks: {
    afterChange: [revalidateGames],
    afterDelete: [revalidateGames],
  },
  access: {
    read: () => true,
    create: ({ req: { user } }) => !!user,
    update: ({ req: { user } }) => !!user,
    delete: ({ req: { user } }) => !!user,
  },
  admin: {
    defaultColumns: ['name', 'opponent', 'date', 'gameType', 'updatedAt'],
    useAsTitle: 'name',
  },
  versions: {
    drafts: true, // ← This enables full draft functionality
    maxPerDoc: 25, // Optional: limits how many draft versions are kept (default is unlimited)
  },
  fields: [
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        position: 'sidebar',
        description: 'Auto-generated from name',
      },
      hooks: {
        beforeChange: [
          async ({ data, req, originalDoc }) => {
            // On create: data.opponent is usually just the ID (string or number)
            // On update: it might be populated object if depth was requested
            let opponentId = null
            let opponentName = 'unknown'

            if (data.opponent) {
              if (typeof data.opponent === 'object' && data.opponent.name) {
                opponentName = data.opponent.name
              } else {
                opponentId = data.opponent // it's just the ID
              }
            } else if (originalDoc?.opponent) {
              if (typeof originalDoc.opponent === 'object' && originalDoc.opponent.name) {
                opponentName = originalDoc.opponent.name
              } else {
                opponentId = originalDoc.opponent
              }
            }

            // If we only have the ID, fetch the name from DB
            if (opponentId && req) {
              try {
                const opponent = await req.payload.findByID({
                  collection: 'opponents', // ← CHANGE THIS if your opponents collection has a different slug!
                  id: opponentId,
                  depth: 0,
                })
                opponentName = opponent.name || 'unknown'
              } catch (_e) {
                opponentName = 'unknown'
              }
            }

            // Need date to generate slug
            const dateValue = data.date || originalDoc?.date
            if (!dateValue || !opponentName) {
              return data.slug || '' // fallback, let validation catch it later
            }

            const date = new Date(dateValue)
            const year = date.getFullYear()
            const month = String(date.getMonth() + 1).padStart(2, '0')
            const day = String(date.getDate()).padStart(2, '0')

            const base = `${year}-${month}-${day}-${opponentName.toLowerCase().replace(/[^a-z0-9]/g, '-')}`

            return base.replace(/-+/g, '-').replace(/^-|-$/g, '')
          },
        ],
      },
    },
    {
      name: 'season',
      type: 'relationship',
      relationTo: 'years',
      required: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'level',
      type: 'relationship',
      relationTo: 'levels',
      required: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Game Info',
          fields: [
            {
              name: 'name',
              type: 'text',
              hooks: {
                beforeChange: [
                  async ({ data, req }) => {
                    const date = data.date
                    if (!date) return data.name

                    const d = new Date(date)
                    const year = d.getFullYear()
                    const month = String(d.getMonth() + 1).padStart(2, '0')
                    const day = String(d.getDate()).padStart(2, '0')

                    // Fetch opponent & level names if not populated
                    let opponentName = ''
                    let levelName = ''

                    if (data.opponent && typeof data.opponent === 'object') {
                      opponentName = data.opponent.name || ''
                    } else if (data.opponent) {
                      const opponent = await req.payload.findByID({
                        collection: 'opponents', // your opponents collection slug
                        id: data.opponent,
                        depth: 0,
                      })
                      opponentName = opponent.name || ''
                    }

                    // Same for level
                    if (data.level && typeof data.level === 'object') {
                      levelName = data.level.name || ''
                    } else if (data.level) {
                      const level = await req.payload.findByID({
                        collection: 'levels', // adjust to your level collection slug
                        id: data.level,
                        depth: 0,
                      })
                      levelName = level.name || ''
                    }

                    return `${year}-${month}-${day} | ${opponentName} | ${levelName}`
                  },
                ],
              },
              required: true,
              admin: {
                hidden: true,
                description: 'Game name (e.g., "vs Boston College")',
              },
            },
            {
              name: 'opponent',
              type: 'relationship',
              relationTo: 'opponents',
              required: true,
            },
            {
              name: 'date',
              type: 'date',
              required: true,
              admin: {
                date: {
                  pickerAppearance: 'dayAndTime',
                },
              },
            },
            {
              name: 'location',
              type: 'text',
              required: false,
              admin: {
                description: 'Game location/venue',
              },
            },
            {
              name: 'livestreamLink',
              type: 'text',
              required: false,
              admin: {
                description: 'URL to livestream',
              },
            },
            {
              name: 'gameType',
              type: 'select',
              required: true,
              defaultValue: 'regular-season',
              options: [
                {
                  label: 'Scrimmage',
                  value: 'scrimmage',
                },
                {
                  label: 'Regular Season',
                  value: 'regular-season',
                },
                {
                  label: 'Playoffs',
                  value: 'playoffs',
                },
              ],
              admin: {
                position: 'sidebar',
              },
            },
          ],
        },
        {
          label: 'Stats',
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'lsFinal',
                  label: 'LS Final Score',
                  type: 'number',
                  required: false,
                  min: 0,
                  admin: {
                    width: '50%',
                    description: 'Final score for LS',
                  },
                },
                {
                  name: 'opponentFinal',
                  label: 'Opponent Final Score',
                  type: 'number',
                  required: false,
                  min: 0,
                  admin: {
                    width: '50%',
                    description: 'Final score for opponent',
                  },
                },
              ],
            },
          ],
        },
      ],
    },
  ],
}
