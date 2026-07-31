import { useCallback, useEffect, useRef, useState } from 'react'
import { fetchArticles } from '@/lib/api/articles'
import type { Article } from '@/utils/mock-data'

interface UseArticlesOptions {
  categoryId?: number
  pageSize?: number
  enabled?: boolean
}

interface UseArticlesReturn {
  articles: Article[]
  totalCount: number
  isLoading: boolean
  isLoadingMore: boolean
  error: string | null
  hasMore: boolean
  retry: () => void
  sentinelRef: React.RefObject<HTMLDivElement>
}

export function useArticles({
  categoryId,
  pageSize = 6,
  enabled = true,
}: UseArticlesOptions = {}): UseArticlesReturn {
  const [articles, setArticles] = useState<Article[]>([])
  const [totalCount, setTotalCount] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [hasMore, setHasMore] = useState(false)
  const [retryKey, setRetryKey] = useState(0)

  const offsetRef = useRef(0)
  const isFetchingRef = useRef(false)
  const sentinelRef = useRef<HTMLDivElement>(null!)

  const fetchPage = useCallback(
    async (offset: number, append: boolean) => {
      if (isFetchingRef.current) return

      isFetchingRef.current = true
      if (append) {
        setIsLoadingMore(true)
      } else {
        setIsLoading(true)
        setError(null)
      }

      try {
        const result = await fetchArticles({
          categoryId,
          limit: pageSize,
          offset,
        })

        setArticles((prev) =>
          append ? [...prev, ...result.articles] : result.articles,
        )
        setTotalCount(result.count)
        offsetRef.current = offset + result.articles.length
        setHasMore(result.next !== null)
      } catch (err) {
        const message =
          err instanceof Error ? err.message : 'Failed to load articles'
        setError(message)
        if (!append) {
          setArticles([])
          setTotalCount(0)
        }
        setHasMore(false)
      } finally {
        isFetchingRef.current = false
        setIsLoading(false)
        setIsLoadingMore(false)
      }
    },
    [categoryId, pageSize],
  )

  const loadMore = useCallback(() => {
    if (!hasMore || isFetchingRef.current) {
      return
    }
    void fetchPage(offsetRef.current, true)
  }, [fetchPage, hasMore])

  const retry = useCallback(() => {
    setRetryKey((prev) => prev + 1)
  }, [])

  useEffect(() => {
    offsetRef.current = 0
    setHasMore(false)

    if (!enabled) {
      setArticles([])
      setTotalCount(0)
      setError(null)
      setIsLoading(false)
      setIsLoadingMore(false)
      return
    }

    void fetchPage(0, false)
  }, [categoryId, retryKey, fetchPage, enabled])

  useEffect(() => {
    const sentinel = sentinelRef.current
    if (!sentinel) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          loadMore()
        }
      },
      { rootMargin: '200px' },
    )

    observer.observe(sentinel)
    return () => observer.disconnect()
  }, [loadMore, articles.length, totalCount])

  return {
    articles,
    totalCount,
    isLoading,
    isLoadingMore,
    error,
    hasMore,
    retry,
    sentinelRef,
  }
}
