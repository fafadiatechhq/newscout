/**
 * Resolves the Django API base URL for the current environment.
 * In the browser, matches the page hostname so LAN access (192.168.x.x:3000) works.
 * Override with NEXT_PUBLIC_API_BASE_URL when needed (custom domains, production).
 */
export function getApiBaseUrl(): string {
  if (process.env.NEXT_PUBLIC_API_BASE_URL) {
    return process.env.NEXT_PUBLIC_API_BASE_URL
  }
  if (typeof window !== 'undefined') {
    return `http://${window.location.hostname}:8000/api/v1`
  }
  return 'http://localhost:8000/api/v1'
}
