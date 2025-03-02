// Video hosting domains that we consider watchable
const VIDEO_DOMAINS = new Set(['youtube.com', 'youtu.be', 'vimeo.com', 'dailymotion.com', 'twitch.tv'])

// Common video file extensions
const VIDEO_EXTENSIONS = new Set(['.mp4', '.webm', '.ogg', '.mov', '.avi', '.wmv', '.m4v', '.mpg', '.mpeg'])

/**
 * Extracts domain from a URL string
 */
function extractDomain(url: string): string {
  try {
    const { hostname } = new URL(url)
    return hostname.toLowerCase()
  } catch {
    return ''
  }
}

/**
 * Checks if a URL points to a video hosting platform
 */
function isVideoHostingPlatform(url: string): boolean {
  const domain = extractDomain(url).replace(/^www\./, '')
  return VIDEO_DOMAINS.has(domain)
}

/**
 * Checks if a URL points to a direct video file
 */
function isVideoFile(url: string): boolean {
  const lowercaseUrl = url.toLowerCase()
  return Array.from(VIDEO_EXTENSIONS).some(ext => lowercaseUrl.endsWith(ext))
}

/**
 * Determines if a URL points to watchable content
 */
export function isWatchable(url: string | URL): boolean {
  const urlString = typeof url === 'string' ? url : url.toString()

  if (!urlString) return false

  return isVideoHostingPlatform(urlString) || isVideoFile(urlString)
}
