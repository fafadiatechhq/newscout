import { API_BASE_URL } from './config'
import { mapApiArticle } from './mappers'
import type { Article } from '@/utils/mock-data'
import { ApiError, type SearchParams, type SearchResponse } from './types'

export interface SearchResult {
  articles: Article[]
  count: number
  next: string | null
  aggregations: SearchResponse['aggregations']
}

export async function searchArticles({
  q,
  limit = 20,
  offset = 0,
  sourceId,
}: SearchParams): Promise<SearchResult> {
  const params = new URLSearchParams()
  params.set('q', q.trim())
  params.set('limit', String(limit))
  params.set('offset', String(offset))

  if (sourceId !== undefined) {
    params.set('source_id', String(sourceId))
  }

  const response = await fetch(`${API_BASE_URL}/search/?${params.toString()}`)

  if (!response.ok) {
    let message = `Search request failed (${response.status})`
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

  const data = (await response.json()) as SearchResponse

  return {
    articles: data.results.map(mapApiArticle),
    count: data.count,
    next: data.next,
    aggregations: data.aggregations,
  }
}
