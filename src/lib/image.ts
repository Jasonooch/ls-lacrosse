// Dark gray 1x1 SVG placeholder for news images (dark overlay cards)
const svg = '<svg xmlns="http://www.w3.org/2000/svg" width="1" height="1"><rect fill="#111827"/></svg>'
export const NEWS_BLUR_DATA_URL = `data:image/svg+xml;base64,${btoa(svg)}`

/**
 * Fetch a tiny image URL and return a base64 data URL for use as a blur placeholder.
 * Server-side only — call from async server components / page.tsx at ISR build time.
 */
export async function getBlurDataURL(url: string): Promise<string> {
  try {
    const res = await fetch(url, { cache: 'force-cache' })
    if (!res.ok) return NEWS_BLUR_DATA_URL
    const buffer = await res.arrayBuffer()
    const b64 = Buffer.from(buffer).toString('base64')
    const mime = res.headers.get('content-type') ?? 'image/webp'
    return `data:${mime};base64,${b64}`
  } catch {
    return NEWS_BLUR_DATA_URL
  }
}
