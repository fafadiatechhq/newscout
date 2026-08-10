import { apiFetch } from './fetch'
import { mapApiArticle } from './mappers'
import { getArticleById, type Article } from '@/utils/mock-data'
import { ApiError } from './types'
import type { ApiArticle, ArticlesParams, PaginatedResponse } from './types'

export interface ArticlesResult {
  articles: Article[]
  count: number
  next: string | null
}

export async function fetchArticles({
  trending,
  categoryId,
  sourceId,
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

  if (sourceId !== undefined) {
    params.set('source_id', String(sourceId))
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

export async function fetchArticle(id: string): Promise<Article> {
  const data = await apiFetch<ApiArticle>(`/articles/${id}/`)
  return mapApiArticle(data)
}

export async function resolveArticleById(id: string): Promise<Article | null> {
  try {
    return await fetchArticle(id)
  } catch (err) {
    if (err instanceof ApiError && err.status === 404) {
      return getArticleById(id) ?? null
    }
    return getArticleById(id) ?? null
  }
}
