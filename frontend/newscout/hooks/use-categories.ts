import { useCallback, useEffect, useMemo, useState } from 'react'
import { fetchCategories } from '@/lib/api/categories'
import type { Category } from '@/utils/mock-data'

interface UseCategoriesReturn {
  categories: Category[]
  topLevelCategories: Category[]
  isLoading: boolean
  error: string | null
  getCategoryBySlug: (slug: string) => Category | undefined
  retry: () => void
}

export function useCategories(): UseCategoriesReturn {
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [retryKey, setRetryKey] = useState(0)

  useEffect(() => {
    let cancelled = false

    async function load() {
      setIsLoading(true)
      setError(null)

      try {
        const result = await fetchCategories()
        if (!cancelled) {
          setCategories(result)
        }
      } catch (err) {
        if (!cancelled) {
          const message =
            err instanceof Error ? err.message : 'Failed to load categories'
          setError(message)
          setCategories([])
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
  }, [retryKey])

  const topLevelCategories = useMemo(
    () => categories.filter((category) => !category.parentId),
    [categories],
  )

  const getCategoryBySlug = useCallback(
    (slug: string) => categories.find((category) => category.slug === slug),
    [categories],
  )

  const retry = useCallback(() => {
    setRetryKey((prev) => prev + 1)
  }, [])

  return {
    categories,
    topLevelCategories,
    isLoading,
    error,
    getCategoryBySlug,
    retry,
  }
}
