import { useCallback, useEffect, useRef, useState } from 'react'
import { searchArticles } from '@/lib/api/search'
import type { SearchAggregations } from '@/lib/api/types'
import type { Article } from '@/utils/mock-data'

const EMPTY_AGGREGATIONS: SearchAggregations = {
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

interface UseSearchArticlesOptions {
  query: string
  sourceId: string
  pageSize?: number
}

interface UseSearchArticlesReturn {
  articles: Article[]
  totalCount: number
  aggregations: SearchAggregations
  isLoading: boolean
  isLoadingMore: boolean
  error: string | null
  hasMore: boolean
  retry: () => void
  sentinelRef: React.RefObject<HTMLDivElement>
}

export function useSearchArticles({
  query,
  sourceId,
  pageSize = 6,
}: UseSearchArticlesOptions): UseSearchArticlesReturn {
  const [articles, setArticles] = useState<Article[]>([])
  const [totalCount, setTotalCount] = useState(0)
  const [aggregations, setAggregations] =
    useState<SearchAggregations>(EMPTY_AGGREGATIONS)
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [hasMore, setHasMore] = useState(false)
  const [retryKey, setRetryKey] = useState(0)

  const offsetRef = useRef(0)
  const isFetchingRef = useRef(false)
  const sentinelRef = useRef<HTMLDivElement>(null!)

  const trimmedQuery = query.trim()
  const parsedSourceId =
    sourceId !== 'all' ? Number.parseInt(sourceId, 10) : undefined
  const activeSourceId =
    parsedSourceId !== undefined && !Number.isNaN(parsedSourceId)
      ? parsedSourceId
      : undefined

  const fetchPage = useCallback(
    async (offset: number, append: boolean) => {
      if (!trimmedQuery || isFetchingRef.current) return

      isFetchingRef.current = true
      if (append) {
        setIsLoadingMore(true)
      } else {
        setIsLoading(true)
        setError(null)
      }

      try {
        const result = await searchArticles({
          q: trimmedQuery,
          limit: pageSize,
          offset,
          sourceId: activeSourceId,
        })

        setArticles((prev) =>
          append ? [...prev, ...result.articles] : result.articles,
        )
        setTotalCount(result.count)
        setAggregations(result.aggregations)
        offsetRef.current = offset + result.articles.length
        setHasMore(result.next !== null)
      } catch (err) {
        const message =
          err instanceof Error ? err.message : 'Failed to load search results'
        setError(message)
        if (!append) {
          setArticles([])
          setTotalCount(0)
          setAggregations(EMPTY_AGGREGATIONS)
        }
        setHasMore(false)
      } finally {
        isFetchingRef.current = false
        setIsLoading(false)
        setIsLoadingMore(false)
      }
    },
    [trimmedQuery, pageSize, activeSourceId],
  )

  const loadMore = useCallback(() => {
    if (!hasMore || isFetchingRef.current || !trimmedQuery) {
      return
    }
    void fetchPage(offsetRef.current, true)
  }, [fetchPage, trimmedQuery, hasMore])

  const retry = useCallback(() => {
    setRetryKey((prev) => prev + 1)
  }, [])

  useEffect(() => {
    offsetRef.current = 0
    setHasMore(false)

    if (!trimmedQuery) {
      setArticles([])
      setTotalCount(0)
      setAggregations(EMPTY_AGGREGATIONS)
      setError(null)
      setIsLoading(false)
      setIsLoadingMore(false)
      return
    }

    void fetchPage(0, false)
  }, [trimmedQuery, activeSourceId, retryKey, fetchPage])

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
    aggregations,
    isLoading,
    isLoadingMore,
    error,
    hasMore,
    retry,
    sentinelRef,
  }
}
