import { getPayload } from 'payload'
import config from '@payload-config'
import { unstable_cache } from 'next/cache'

interface ApiCoach {
  id: string | number
  fullName: string
}

interface ApiCoachEntry {
  id?: string
  coach: ApiCoach | string | number
  role?: string
}

interface ApiCoachingStaff {
  id: string | number
  year: string
  coaches: ApiCoachEntry[]
}

export type CoachRow = {
  name: string
  role: string
}

export type CoachingStaffDoc = {
  id: string | number
  year: string
  coaches: CoachRow[]
}

const roleLabels: Record<string, string> = {
  head: 'Head Coach',
  assistant: 'Assistant Coach',
}

export const getCoachingStaffYears = unstable_cache(
  async (): Promise<string[]> => {
    const payload = await getPayload({ config })

    const result = await payload.find({
      collection: 'coaching-staff',
      depth: 0,
      limit: 100,
      sort: '-year',
      select: { year: true },
    })

    const years = (result.docs as unknown as { year: string }[])
      .map((doc) => doc.year)
      .filter(Boolean)

    return [...new Set(years)].sort((a, b) => b.localeCompare(a))
  },
  ['coaching-staff-years'],
  { revalidate: 300, tags: ['coaching-staff'] },
)

export async function getCoachingStaffByYear(year: string): Promise<CoachingStaffDoc | null> {
  return unstable_cache(
    async () => {
      const payload = await getPayload({ config })

      const result = await payload.find({
        collection: 'coaching-staff',
        depth: 2,
        limit: 1,
        where: { year: { equals: year } },
      })

      const doc = (result.docs[0] as unknown as ApiCoachingStaff) ?? null
      if (!doc) return null

      const coaches: CoachRow[] = (doc.coaches || []).map((entry) => {
        const coach =
          typeof entry.coach === 'object' && entry.coach !== null
            ? (entry.coach as ApiCoach)
            : null
        return {
          name: coach?.fullName ?? '—',
          role: roleLabels[entry.role ?? ''] ?? entry.role ?? '—',
        }
      })

      return {
        id: doc.id,
        year: doc.year,
        coaches,
      }
    },
    ['coaching-staff-by-year', year],
    { revalidate: 300, tags: ['coaching-staff'] },
  )()
}
