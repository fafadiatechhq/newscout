import { getApiBaseUrl } from './config'
import { ApiError } from './types'

export async function apiFetch<T>(path: string, params?: URLSearchParams): Promise<T> {
  const query = params?.toString()
  const baseUrl = getApiBaseUrl()
  const url = query ? `${baseUrl}${path}?${query}` : `${baseUrl}${path}`

  const response = await fetch(url)

  if (!response.ok) {
    let message = `Request failed (${response.status})`
    try {
      const body = await response.json()
      if (typeof body?.detail === 'string') {
        message = body.detail
      }
    } catch {
      // ignore JSON parse errors
    }
    throw new ApiError(message, response.status)
  }

  return response.json() as Promise<T>
}
