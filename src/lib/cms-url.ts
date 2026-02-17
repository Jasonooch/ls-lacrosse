const DEFAULT_CMS_ORIGIN = 'https://ls-lacrosse-payload.jasonorlando14.workers.dev'

const configuredCmsOrigin =
  process.env.NEXT_PUBLIC_CMS_ORIGIN || process.env.CMS_ORIGIN || DEFAULT_CMS_ORIGIN

function trimTrailingSlash(value: string): string {
  return value.replace(/\/+$/, '')
}

function normalizeCmsOrigin(value: string): string {
  try {
    return trimTrailingSlash(new URL(value).toString())
  } catch {
    return DEFAULT_CMS_ORIGIN
  }
}

export const CMS_ORIGIN = normalizeCmsOrigin(configuredCmsOrigin)

/**
 * Resolves a relative media path (from R2 storage) to a full URL.
 * Absolute URLs (already starting with http/https) are returned as-is.
 */
export function getCmsMediaUrl(path?: string | null): string | undefined {
  if (!path) return undefined
  if (/^https?:\/\//i.test(path)) return path
  return `${CMS_ORIGIN}${path.startsWith('/') ? path : `/${path}`}`
}
