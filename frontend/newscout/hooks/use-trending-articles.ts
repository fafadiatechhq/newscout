import { useCallback, useEffect, useState } from 'react'
import { fetchArticles } from '@/lib/api/articles'
import type { Article } from '@/utils/mock-data'

interface UseTrendingArticlesOptions {
  limit?: number
}

interface UseTrendingArticlesReturn {
  articles: Article[]
  isLoading: boolean
  error: string | null
  retry: () => void
}

export function useTrendingArticles({
  limit = 5,
}: UseTrendingArticlesOptions = {}): UseTrendingArticlesReturn {
  const [articles, setArticles] = useState<Article[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [retryKey, setRetryKey] = useState(0)

  const retry = useCallback(() => {
    setRetryKey((prev) => prev + 1)
  }, [])

  useEffect(() => {
    let cancelled = false

    async function load() {
      setIsLoading(true)
      setError(null)

      try {
        const result = await fetchArticles({
          trending: true,
          limit,
          offset: 0,
        })
        if (!cancelled) {
          setArticles(result.articles)
        }
      } catch (err) {
        if (!cancelled) {
          const message =
            err instanceof Error ? err.message : 'Failed to load trending articles'
          setError(message)
          setArticles([])
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false)
        }
      }
    }

    void load()
    return () => {
      cancelled = true
    }
  }, [limit, retryKey])

  return {
    articles,
    isLoading,
    error,
    retry,
  }
}
