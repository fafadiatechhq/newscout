import type { Article, ArticleSourceEntry, Category, Source } from '@/utils/mock-data'
import type { ApiArticle, ApiCategory } from './types'
import { slugify } from './slug'

function estimateReadingTime(summary: string): number {
  const wordCount = summary
    .split(/\s+/)
    .filter((word) => word.length > 0).length
  if (wordCount === 0) return 3
  return Math.min(30, Math.max(1, Math.ceil(wordCount / 200)))
}

function mapSource(apiSource: ApiArticle['source'][number] | undefined): Source {
  return {
    id: String(apiSource?.id ?? ''),
    name: apiSource?.name ?? 'Unknown',
    logo_url: apiSource?.logo_url ?? '',
    is_verified: apiSource?.is_verified ?? false,
  }
}

export function mapArticleSources(json: ApiArticle): ArticleSourceEntry[] {
  const contentUrl = json.content_url ?? ''
  const apiSources = json.source ?? []

  if (apiSources.length === 0) {
    return []
  }

  return apiSources.map((apiSource, index) => ({
    source: mapSource(apiSource),
    url: apiSource.url ?? (index === 0 ? contentUrl : '#'),
  }))
}

export function mapApiCategory(apiCategory: ApiCategory): Category {
  const name = apiCategory.name ?? 'Uncategorized'
  return {
    id: String(apiCategory.id),
    name,
    slug: slugify(name),
    description: apiCategory.description ?? '',
    article_count: 0,
    parentId:
      apiCategory.parent != null ? String(apiCategory.parent) : null,
  }
}

function mapCategory(apiCategory: ApiArticle['category'] | undefined): Category {
  if (!apiCategory) {
    return mapApiCategory({ id: 0, name: 'Uncategorized' })
  }
  return mapApiCategory(apiCategory)
}

export function mapApiArticle(json: ApiArticle): Article {
  const primarySource = json.source?.[0]

  return {
    id: String(json.id),
    title: json.title ?? '',
    summary: json.summary ?? '',
    content_url: json.content_url ?? primarySource?.url ?? '',
    source: mapSource(primarySource),
    category: mapCategory(json.category),
    author: json.author ?? '',
    published_at: json.published_at ?? new Date().toISOString(),
    image_url: json.image_url ?? '',
    tags: (json.tags ?? []).map((tag) => tag.name),
    reading_time: estimateReadingTime(json.summary ?? ''),
    views: 0,
    sources: mapArticleSources(json),
  }
}
