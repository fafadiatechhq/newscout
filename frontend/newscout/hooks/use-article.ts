import { useCallback, useEffect, useState } from 'react'
import { fetchArticle } from '@/lib/api/articles'
import { ApiError } from '@/lib/api/types'
import { getArticleById, type Article } from '@/utils/mock-data'

interface UseArticleReturn {
  article: Article | null
  isLoading: boolean
  error: string | null
  notFound: boolean
  retry: () => void
}

export function useArticle(id: string | undefined): UseArticleReturn {
  const [article, setArticle] = useState<Article | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [notFound, setNotFound] = useState(false)
  const [retryKey, setRetryKey] = useState(0)

  const retry = useCallback(() => {
    setRetryKey((prev) => prev + 1)
  }, [])

  useEffect(() => {
    if (!id) {
      setArticle(null)
      setIsLoading(false)
      setError(null)
      setNotFound(true)
      return
    }

    let cancelled = false
    const articleId = id

    async function load() {
      setIsLoading(true)
      setError(null)
      setNotFound(false)

      try {
        const result = await fetchArticle(articleId)
        if (!cancelled) {
          setArticle(result)
        }
      } catch (err) {
        if (!cancelled) {
          const mockArticle = getArticleById(articleId)
          if (mockArticle) {
            setArticle(mockArticle)
          } else if (err instanceof ApiError && err.status === 404) {
            setArticle(null)
            setNotFound(true)
          } else {
            const message =
              err instanceof Error ? err.message : 'Failed to load article'
            setError(message)
            setArticle(null)
          }
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
  }, [id, retryKey])

  return {
    article,
    isLoading,
    error,
    notFound,
    retry,
  }
}
