'use client'
import { useMemo } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Search, ArrowLeft } from 'lucide-react'
import Layout from '@/components/Layout'
import ArticleCard from '@/components/ArticleCard'
import InfiniteScrollSentinel from '@/components/InfiniteScrollSentinel'
import { Button } from '@/components/ui/button'
import { searchArticles } from '@/utils/mock-data'
import { useInfiniteScroll } from '@/hooks/use-infinite-scroll'

const PAGE_SIZE = 6

const SearchResults = () => {
  const searchParams = useSearchParams()
  const query = searchParams.get('q') || ''

  const results = useMemo(() => searchArticles(query), [query])

  const { visibleCount, isLoading, hasMore, sentinelRef } = useInfiniteScroll({
    totalItems: results.length,
    pageSize: PAGE_SIZE,
  })

  const visibleResults = results.slice(0, visibleCount)

  return (
    <Layout>
      <div className="border-b border-border bg-surface">
        <div className="container py-8">
          <Link
            href="/"
            className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Link>
          <div className="flex items-center gap-3">
            <Search className="h-6 w-6 text-primary" />
            <div>
              <h1 className="font-serif text-2xl font-bold text-foreground md:text-3xl">
                Results for "{query}"
              </h1>
              <p className="text-muted-foreground">
                {results.length} article{results.length !== 1 ? 's' : ''} found
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container py-8">
        {results.length > 0 ? (
          <>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {visibleResults.map((article, i) => (
                <motion.div
                  key={article.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: Math.min(i * 0.05, 0.3) }}
                >
                  <ArticleCard article={article} />
                </motion.div>
              ))}
            </div>
            <InfiniteScrollSentinel
              sentinelRef={sentinelRef}
              isLoading={isLoading}
              hasMore={hasMore}
            />
          </>
        ) : (
          <div className="py-16 text-center">
            <Search className="mx-auto mb-4 h-12 w-12 text-muted-foreground/30" />
            <p className="font-serif text-xl text-muted-foreground">
              No articles found
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              Try different keywords or browse our categories
            </p>
            <Link href="/feed">
              <Button className="mt-4">Browse all articles</Button>
            </Link>
          </div>
        )}
      </div>
    </Layout>
  )
}

export default SearchResults
