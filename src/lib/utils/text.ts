/**
 * Utility functions for text processing
 */

/**
 * Strips HTML tags from a string and returns plain text
 * Also handles HTML entities and normalizes whitespace
 * Uses DOM API when available (client-side), falls back to regex (server-side)
 * 
 * @param html - The HTML string to strip
 * @returns Plain text without HTML tags
 */
export function stripHtml(html: string): string {
  if (!html) return ''
  
  // Use DOM API if available (client-side)
  if (typeof window !== 'undefined' && typeof document !== 'undefined') {
    try {
      const tmp = document.createElement('div')
      tmp.innerHTML = html
      const text = tmp.textContent || tmp.innerText || ''
      return text.replace(/\s+/g, ' ').trim()
    } catch {
      // Fallback to regex if DOM parsing fails
      return stripHtmlRegex(html)
    }
  }
  
  // Use regex for server-side rendering
  return stripHtmlRegex(html)
}

/**
 * Strips HTML tags using regex (for server-side or when DOM is not available)
 * Less accurate than stripHtml but works in Node.js environments
 * 
 * @param html - The HTML string to strip
 * @returns Plain text without HTML tags
 */
export function stripHtmlRegex(html: string): string {
  if (!html) return ''
  
  return html
    // Remove script and style tags and their content
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
    // Remove HTML tags
    .replace(/<[^>]+>/g, '')
    // Decode common HTML entities
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'")
    // Decode numeric entities
    .replace(/&#(\d+);/g, (_, dec) => String.fromCharCode(dec))
    .replace(/&#x([a-f\d]+);/gi, (_, hex) => String.fromCharCode(parseInt(hex, 16)))
    // Normalize whitespace
    .replace(/\s+/g, ' ')
    .trim()
}

/**
 * Truncates text to a specified length with ellipsis
 * 
 * @param text - The text to truncate
 * @param maxLength - Maximum length before truncation
 * @param suffix - Suffix to append (default: '...')
 * @returns Truncated text
 */
export function truncateText(text: string, maxLength: number, suffix: string = '...'): string {
  if (!text || text.length <= maxLength) return text
  return text.substring(0, maxLength - suffix.length).trim() + suffix
}

/**
 * Strips HTML and truncates text in one operation
 * 
 * @param html - The HTML string to process
 * @param maxLength - Maximum length before truncation
 * @param suffix - Suffix to append (default: '...')
 * @returns Plain text without HTML, truncated if needed
 */
export function stripHtmlAndTruncate(html: string, maxLength: number, suffix: string = '...'): string {
  const text = typeof window !== 'undefined' ? stripHtml(html) : stripHtmlRegex(html)
  return truncateText(text, maxLength, suffix)
}

