'use client'
import React, { useEffect, useState } from 'react'
import Layout from './Layout'
import BreakingNewsTicker from './BreakingNewsTicker'
import ArticleCardSkeleton from './ArticleCardSkeleton'
import ArticleCard from './ArticleCard'
import { articles, getTrendingArticles, formatTimeAgo } from '@/utils/mock-data'
import { motion } from 'framer-motion'
import { ArrowRight, BadgeCheck, Shield, TrendingUp, Zap } from 'lucide-react'
import Link from 'next/link'
import { useInfiniteScroll } from '@/hooks/use-infinite-scroll'
import TrendingBadge from './TrendingBadge'
import { Button } from './ui/button'
import InfiniteScrollSentinel from './InfiniteScrollSentinel'
import CategoryShowcase from './CategoryShowcase'
import EditorsPicks from './EditorsPicks'
import ForYouSection from './ForYouSection'

const LATEST_PAGE_SIZE = 4

const HomePageContainer = () => {
  const [initialLoading, setInitialLoading] = useState(true)

  useEffect(() => {
    // Simulate initial data fetch
    const timer = setTimeout(() => setInitialLoading(false), 800)
    return () => clearTimeout(timer)
  }, [])

  const heroArticle = articles[0]
  const trending = getTrendingArticles()
  const allLatest = articles.slice(1)
  const sidebarArticles = articles.slice(7)

  const { visibleCount, isLoading, hasMore, sentinelRef } = useInfiniteScroll({
    totalItems: allLatest.length,
    pageSize: LATEST_PAGE_SIZE,
  })

  const visibleLatest = allLatest.slice(0, visibleCount)

  return (
    <Layout>
      <BreakingNewsTicker />
      {/* Hero Section */}
      <section className="bg-primary">
        <div className="container py-2">
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Main hero */}
            <motion.div
              className="lg:col-span-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              {initialLoading ? (
                <ArticleCardSkeleton variant="featured" />
              ) : (
                <ArticleCard article={heroArticle} variant="featured" />
              )}
            </motion.div>

            {/* Side trending */}
            <motion.div
              className="flex flex-col rounded-xl bg-background p-5"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="mb-4 flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-accent" />
                <h3 className="font-serif text-base md:text-lg font-bold text-foreground">
                  Trending Now
                </h3>
              </div>
              <div className="flex flex-1 flex-col gap-1">
                {trending.slice(0, 5).map((article, i) => (
                  <Link
                    key={article.id}
                    href={`/articles/${article.id}`}
                    className="group flex items-start gap-3 rounded-lg p-2 transition-colors hover:bg-secondary"
                  >
                    <TrendingBadge rank={i + 1} />
                    <div className="min-w-0 flex-1 ">
                      <div className="text-sm font-extrabold leading-tight text-foreground transition-colors group-hover:text-primary line-clamp-2">
                        {article.title}
                      </div>
                      <span className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                        {article.source.is_verified && (
                          <BadgeCheck className="h-3 w-3 text-primary" />
                        )}
                        {article.source.name} ·{' '}
                        {formatTimeAgo(article.published_at)}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
              <Link href="/trending">
                <Button
                  variant="ghost"
                  className="mt-3 w-full text-sm text-primary hover:text-white cursor-pointer"
                >
                  View all trending
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Category Showcase */}
      <CategoryShowcase />

      {/* Editor's Picks */}
      <EditorsPicks />

      {/* For You - Personalized */}
      <ForYouSection />

      {/* Latest News Grid */}
      <section className="bg-background py-12">
        <div className="container">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3 ">
            {/* Main content */}
            <div className="lg:col-span-2">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="font-serif text-xl md:text-2xl font-bold text-foreground">
                  Latest News
                </h2>
                <Link href="/feed">
                  <Button variant="ghost" className="text-sm text-primary">
                    View all
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </Button>
                </Link>
              </div>
              <div className="grid gap-6 sm:grid-cols-2">
                {initialLoading
                  ? Array.from({ length: 4 }).map((_, i) => (
                      <ArticleCardSkeleton key={i} />
                    ))
                  : visibleLatest.map((article, i) => (
                      <motion.div
                        key={article.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                          duration: 0.3,
                          delay: Math.min(i * 0.05, 0.3),
                        }}
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
            </div>

            {/* Sidebar */}
            <aside className="space-y-8">
              {/* More stories */}
              <div className="rounded-xl bg-surface p-5">
                <h3 className="mb-4 font-serif text-lg font-bold text-foreground">
                  More Stories
                </h3>
                <div className="space-y-1">
                  {initialLoading
                    ? Array.from({ length: 4 }).map((_, i) => (
                        <ArticleCardSkeleton key={i} variant="compact" />
                      ))
                    : sidebarArticles.map((article) => (
                        <ArticleCard
                          key={article.id}
                          article={article}
                          variant="compact"
                        />
                      ))}
                </div>
              </div>

              {/* CTA */}
              <div className="rounded-xl bg-primary p-6 text-primary-foreground">
                <h3 className="mb-2 font-serif text-lg md:text-xl font-bold">
                  Stay Informed
                </h3>
                <p className="mb-4 text-sm text-primary-foreground/70">
                  Get personalized news delivered to your inbox. Join 50,000+
                  professionals.
                </p>
                <div className="flex gap-2">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="h-8 md:h-10 flex-1 rounded-md bg-primary-foreground/10 w-full px-1 md:px-3 py-4  text-xs md:text-sm text-primary-foreground placeholder:text-primary-foreground/50 focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                  <Button className="h-8 md:h-10 bg-accent text-accent-foreground  text-xs md:text-sm hover:bg-accent/90 cursor-pointer">
                    Subscribe
                  </Button>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-xl border border-border p-4 text-center">
                  <Zap className="mx-auto mb-2 h-5 w-5 text-accent" />
                  <p className="font-serif text-xl md:text-2xl font-bold text-foreground">
                    50+
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Verified Sources
                  </p>
                </div>
                <div className="rounded-xl border border-border p-4 text-center">
                  <Shield className="mx-auto mb-2 h-5 w-5 text-primary" />
                  <p className="font-serif text-xl md:text-2xl font-bold text-foreground">
                    24/7
                  </p>
                  <p className="text-xs text-muted-foreground">Live Updates</p>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </Layout>
  )
}

export default HomePageContainer
