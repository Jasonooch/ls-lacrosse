const DEFAULT_LOCALE = 'en-US'
const EASTERN_TIME_ZONE = 'America/New_York'

type DateInput = Date | string | number

function toDate(value: DateInput): Date {
  return value instanceof Date ? value : new Date(value)
}

export function formatInEasternTime(
  value: DateInput,
  options: Intl.DateTimeFormatOptions,
  locale = DEFAULT_LOCALE,
): string {
  return new Intl.DateTimeFormat(locale, {
    ...options,
    timeZone: EASTERN_TIME_ZONE,
  }).format(toDate(value))
}

export function getEasternYear(value: DateInput, locale = DEFAULT_LOCALE): string {
  return formatInEasternTime(value, { year: 'numeric' }, locale)
}
