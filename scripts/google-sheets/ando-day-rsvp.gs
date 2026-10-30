/**
 * Ando Day RSVPs -> Google Sheet.
 *
 * Setup: in the sheet, Extensions > Apps Script, paste this file, set TOKEN to a long random string,
 * then Deploy > New deployment > Web app (Execute as: Me, Who has access: Anyone).
 * In Vercel, set ANDO_DAY_RSVP_SHEET_URL to the web app URL plus ?token=<TOKEN> and redeploy.
 *
 * The site posts each RSVP here as JSON. One row per email: answering again updates that row.
 */
const TOKEN = 'change-me'
const HEADERS = ['Updated', 'First name', 'Last name', 'Email', 'Attending', 'Guests', 'Total attending']
const EMAIL_COLUMN = 4

function doPost(e) {
  if (!e.parameter || e.parameter.token !== TOKEN) return ContentService.createTextOutput('forbidden')

  const data = JSON.parse(e.postData.contents)
  const email = String(data.email || '').trim().toLowerCase()
  const row = [
    new Date(),
    data.firstName || '',
    data.lastName || '',
    email,
    data.attending || '',
    Number(data.guests) || 0,
    Number(data.totalAttending) || 0,
  ]

  const lock = LockService.getScriptLock()
  lock.waitLock(10000)
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0]
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(HEADERS)
      sheet.setFrozenRows(1)
    }

    const last = sheet.getLastRow()
    const emails = last > 1 ? sheet.getRange(2, EMAIL_COLUMN, last - 1, 1).getValues() : []
    const index = email ? emails.findIndex(([value]) => String(value).toLowerCase() === email) : -1

    if (index === -1) sheet.appendRow(row)
    else sheet.getRange(index + 2, 1, 1, row.length).setValues([row])
  } finally {
    lock.releaseLock()
  }

  return ContentService.createTextOutput('ok')
}
