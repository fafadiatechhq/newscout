import type { Article, Category, Source } from '@/utils/mock-data'
import type { ApiArticle } from './types'

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

function mapCategory(apiCategory: ApiArticle['category'] | undefined): Category {
  return {
    id: String(apiCategory?.id ?? ''),
    name: apiCategory?.name ?? 'Uncategorized',
    slug: (apiCategory?.name ?? 'uncategorized')
      .toLowerCase()
      .replace(/\s+/g, '-'),
    description: apiCategory?.description ?? '',
    article_count: 0,
  }
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
  }
}
