import type { PayloadHandler } from 'payload'

export const exportSubmissionsHandler: PayloadHandler = async (req) => {
  const { payload, user } = req

  // Check if user is authenticated
  if (!user) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    // Fetch all submissions
    const submissions = await payload.find({
      collection: 'form-submissions',
      limit: 10000,
      sort: '-createdAt',
    })

    // Convert to CSV
    const rows: string[] = []

    // CSV Header
    rows.push('ID,Form Name,Name,Email,Status,Source Page,Created At,Form Data')

    // CSV Rows
    submissions.docs.forEach((submission) => {
      const formData = JSON.stringify(submission.payload).replace(/"/g, '""')
      rows.push(
        [
          submission.id,
          `"${submission.formName || ''}"`,
          `"${submission.name || ''}"`,
          `"${submission.email || ''}"`,
          submission.status,
          `"${submission.sourcePage || ''}"`,
          submission.createdAt,
          `"${formData}"`,
        ].join(',')
      )
    })

    const csv = rows.join('\n')
    const filename = `form-submissions-${new Date().toISOString().split('T')[0]}.csv`

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
