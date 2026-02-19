"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { TrendingUp, Flame, Clock, Eye, Newspaper } from "lucide-react";
import Layout from "@/components/Layout";
import ArticleCard from "@/components/ArticleCard";
import TrendingBadge from "@/components/TrendingBadge";
import TimeFilter from "@/components/trending/TimeFilter";
import RisingCard from "@/components/trending/RisingCard";
import TrendingTopics from "@/components/trending/TrendingTopics";
import TopSources from "@/components/trending/TopSources";
import InfiniteScrollSentinel from "@/components/InfiniteScrollSentinel";
import {
  getTrendingByPeriod,
  getRisingArticles,
  formatTimeAgo,
  formatViews,
  getSourceCountForArticle,
  type TrendingPeriod,
} from "@/utils/mock-data";
import { useInfiniteScroll } from "@/hooks/use-infinite-scroll";

const PAGE_SIZE = 6;

const Trending = () => {
  const [period, setPeriod] = useState<TrendingPeriod>("now");

  const allTrending = getTrendingByPeriod(period);
  const topArticle = allTrending[0];
  const restArticles = allTrending.slice(1);

  const { visibleCount, isLoading, hasMore, sentinelRef } = useInfiniteScroll({
    totalItems: restArticles.length,
    pageSize: PAGE_SIZE,
  });

  const visibleRest = restArticles.slice(0, visibleCount);
  const risingArticles = getRisingArticles(
    allTrending.slice(0, 6).map((a) => a.id),
  );

  return (
    <Layout>
      {/* Header */}
      <div className="bg-primary">
        <div className="container py-10">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent">
              <TrendingUp className="h-6 w-6 text-accent-foreground" />
            </div>
            <div>
              <h1 className="font-serif text-2xl font-bold text-primary-foreground md:text-4xl">
                Trending Now
              </h1>
              <p className="text-primary-foreground/70 text-sm md:text-lg">
                The most read stories across NewScout
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Time Filter */}
      <div className="border-b border-border bg-background">
        <div className="container py-4">
          <TimeFilter value={period} onChange={setPeriod} />
        </div>
      </div>

      <div className="container py-10">
        {/* Top story with Stats Ribbon */}
        {topArticle && (
          <motion.div
            className="mb-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            key={topArticle.id}
          >
            <div className="mb-3 flex items-center gap-2">
              <Flame className="h-5 w-5 text-accent" />
              <span className="text-sm font-semibold text-accent">
                #1 Trending
              </span>
            </div>
            <ArticleCard article={topArticle} variant="featured" />
            {/* Stats Ribbon */}
            <div className="mt-3 flex flex-wrap items-center gap-4 rounded-lg bg-muted px-4 py-2.5 text-xs md:text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <Eye className="h-4 w-4" />
                {formatViews(topArticle.views)} views
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="h-4 w-4" />
                {topArticle.reading_time} min read
              </span>
              <span className="">
                Published {formatTimeAgo(topArticle.published_at)}
              </span>
              <span className="flex items-center gap-1.5">
                <Newspaper className="h-4 w-4" />
                {getSourceCountForArticle(topArticle.id)} sources
              </span>
            </div>
          </motion.div>
        )}

        {/* Rising Fast */}
        {risingArticles.length > 0 && (
          <section className="mb-10">
            <div className="mb-4 flex items-center gap-2">
              <Flame className="h-5 w-5 text-accent" />
              <h2 className="font-serif text-2xl font-bold text-foreground">
                Rising Fast
              </h2>
            </div>
            <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-none">
              {risingArticles.map((article, i) => (
                <motion.div
                  key={article.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                  className="flex-shrink-0"
                >
                  <RisingCard article={article} />
                </motion.div>
              ))}
            </div>
          </section>
        )}

        {/* Trending list with infinite scroll */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {visibleRest.map((article, i) => (
            <motion.div
              key={article.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: Math.min(i * 0.05, 0.3) }}
            >
              <div className="relative">
                <div className="absolute -left-2 -top-2 z-10">
                  <TrendingBadge rank={i + 2} />
                </div>
                <ArticleCard article={article} />
              </div>
            </motion.div>
          ))}
        </div>

        <InfiniteScrollSentinel
          sentinelRef={sentinelRef}
          isLoading={isLoading}
          hasMore={hasMore}
        />

        {/* Two-column footer: Topics + Sources */}
        <div className="mt-12 grid gap-8 md:grid-cols-2">
          <TrendingTopics />
          <TopSources />
        </div>
      </div>
    </Layout>
  );
};

export default Trending;
