import { apiFetch } from './fetch'
import { mapApiCategory } from './mappers'
import type { Category } from '@/utils/mock-data'
import type { ApiCategory, PaginatedResponse } from './types'

export async function fetchCategories(): Promise<Category[]> {
  const params = new URLSearchParams()
  params.set('limit', '100')

  const data = await apiFetch<PaginatedResponse<ApiCategory>>(
    '/categories/',
    params,
  )

  return data.results.map(mapApiCategory)
}
