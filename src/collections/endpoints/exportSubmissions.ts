import type { PayloadHandler } from 'payload'

export const exportSubmissionsHandler: PayloadHandler = async (req, res) => {
  const { payload, user } = req

  // Check if user is authenticated
  if (!user) {
    return res.status(401).json({ error: 'Unauthorized' })
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

    // Set headers for CSV download
    res.setHeader('Content-Type', 'text/csv')
    res.setHeader('Content-Disposition', `attachment; filename="form-submissions-${new Date().toISOString().split('T')[0]}.csv"`)

    return res.send(csv)
  } catch (error) {
    console.error('Error exporting submissions:', error)
    return res.status(500).json({ error: 'Failed to export submissions' })
  }
}
