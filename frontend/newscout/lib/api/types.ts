export interface ApiSource {
  id: number
  name: string
  url?: string
  logo_url?: string
  is_verified?: boolean
}

export interface ApiCategory {
  id: number
  name: string
  description?: string
  popular?: boolean
  parent?: number | null
}

export interface ApiTag {
  id: number
  name: string
}

export interface ApiArticle {
  id: number
  title: string
  author?: string
  summary: string
  content_url: string
  source: ApiSource[]
  category: ApiCategory
  tags: ApiTag[]
  published_at: string
  image_url: string
  trending?: boolean
  featured?: boolean
  editors_pick?: boolean
  is_breaking?: boolean
}

export interface AggregationBucket {
  id: number
  name: string | null
  count: number
}

export interface SearchAggregations {
  categories: AggregationBucket[]
  sources: AggregationBucket[]
  tags: AggregationBucket[]
  flags: {
    trending: number
    featured: number
    editors_pick: number
    is_breaking: number
  }
}

export const EMPTY_AGGREGATIONS: SearchAggregations = {
  categories: [],
  sources: [],
  tags: [],
  flags: {
    trending: 0,
    featured: 0,
    editors_pick: 0,
    is_breaking: 0,
  },
}

export interface SearchResponse {
  count: number
  next: string | null
  previous: string | null
  results: ApiArticle[]
  aggregations: SearchAggregations
}

export interface PaginatedResponse<T> {
  count: number
  next: string | null
  previous: string | null
  results: T[]
}

export interface SearchParams {
  q: string
  limit?: number
  offset?: number
  sourceId?: number
  categoryId?: number
  tagId?: number
  trending?: boolean
  featured?: boolean
  editorsPick?: boolean
  isBreaking?: boolean
}

export interface ArticlesParams {
  trending?: boolean
  categoryId?: number
  limit?: number
  offset?: number
}

export class ApiError extends Error {
  status: number

  constructor(message: string, status: number) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}
