import type { PayloadHandler, Where } from 'payload'

/** "First_Name" or "firstName" -> "First name"; all-caps words such as LS stay as they are */
export const answerLabel = (key: string) => {
  const words = key
    .replace(/_/g, ' ')
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .trim()
    .split(/\s+/)
    .map((word) => (word.length > 1 && word === word.toUpperCase() ? word : word.toLowerCase()))
    .join(' ')
  return words.charAt(0).toUpperCase() + words.slice(1)
}

export const answerText = (value: unknown): string => {
  if (value == null) return ''
  if (Array.isArray(value)) return value.map(answerText).join(', ')
  if (typeof value === 'object') return JSON.stringify(value)
  return String(value)
}

const csvCell = (value: unknown) => `"${answerText(value).replace(/"/g, '""')}"`

/**
 * GET /api/form-submissions/export, staff only. Add ?form=<form name> (e.g. ?form=ando-day-rsvp) to export
 * one form with each answer in its own column; without it every form is exported with the answers in one cell.
 */
export const exportSubmissionsHandler: PayloadHandler = async (req) => {
  const { payload, user } = req

  // Check if user is authenticated
  if (!user) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const form = req.searchParams.get('form')?.trim() || undefined
    const where: Where | undefined = form ? { formName: { equals: form } } : undefined

    const submissions = await payload.find({
      collection: 'form-submissions',
      where,
      limit: 10000,
      sort: '-createdAt',
      req,
    })

    const answers = (submission: (typeof submissions.docs)[number]) =>
      (submission.payload && typeof submission.payload === 'object' && !Array.isArray(submission.payload)
        ? submission.payload
        : {}) as Record<string, unknown>

    // One column per answer when exporting a single form, in the order the answers first appear
    const keys = form ? [...new Set(submissions.docs.flatMap((s) => Object.keys(answers(s))))] : []

    const header = [
      'ID',
      'Form Name',
      'Name',
      'Email',
      'Status',
      'Source Page',
      'Created At',
      ...(form ? keys.map(answerLabel) : ['Form Data']),
    ]
    const rows = submissions.docs.map((submission) =>
      [
        submission.id,
        submission.formName,
        submission.name,
        submission.email,
        submission.status,
        submission.sourcePage,
        submission.createdAt,
        ...(form ? keys.map((key) => answers(submission)[key]) : [JSON.stringify(submission.payload)]),
      ]
        .map(csvCell)
        .join(','),
    )

    const csv = [header.map(csvCell).join(','), ...rows].join('\n')
    const filename = `${form ?? 'form-submissions'}-${new Date().toISOString().split('T')[0]}.csv`

    return new Response(csv, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    })
  } catch (error) {
    console.error('Error exporting submissions:', error)
    return Response.json({ error: 'Failed to export submissions' }, { status: 500 })
  }
}
