import { apiFetch } from './fetch'
import { mapApiArticle } from './mappers'
import type { Article } from '@/utils/mock-data'
import type { ApiArticle, ArticlesParams, PaginatedResponse } from './types'

export interface ArticlesResult {
  articles: Article[]
  count: number
  next: string | null
}

export async function fetchArticles({
  trending,
  categoryId,
  limit = 20,
  offset = 0,
}: ArticlesParams): Promise<ArticlesResult> {
  const params = new URLSearchParams()
  params.set('limit', String(limit))
  params.set('offset', String(offset))

  if (trending) {
    params.set('trending', 'true')
  }

  if (categoryId !== undefined) {
    params.set('category_id', String(categoryId))
  }

  const data = await apiFetch<PaginatedResponse<ApiArticle>>(
    '/articles/',
    params,
  )

  return {
    articles: data.results.map(mapApiArticle),
    count: data.count,
    next: data.next,
  }
}
