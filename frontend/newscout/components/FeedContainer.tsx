"use client";
import { useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Filter } from "lucide-react";
import Layout from "@/components/Layout";
import ArticleCard from "@/components/ArticleCard";
import InfiniteScrollSentinel from "@/components/InfiniteScrollSentinel";
import { articles, categories, sources } from "@/utils/mock-data";
import { useInfiniteScroll } from "@/hooks/use-infinite-scroll";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const PAGE_SIZE = 6;

const FeedContainer = () => {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get("category");
  const [selectedSource, setSelectedSource] = useState<string>("all");
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest" | "popular">(
    "newest",
  );
  const [showFilters, setShowFilters] = useState(false);

  const filteredArticles = useMemo(() => {
    let result = [...articles];

    if (categoryParam) {
      result = result.filter((a) => a.category.slug === categoryParam);
    }

    if (selectedSource !== "all") {
      result = result.filter((a) => a.source.id === selectedSource);
    }

    switch (sortOrder) {
      case "newest":
        result.sort(
          (a, b) =>
            new Date(b.published_at).getTime() -
            new Date(a.published_at).getTime(),
        );
        break;
      case "oldest":
        result.sort(
          (a, b) =>
            new Date(a.published_at).getTime() -
            new Date(b.published_at).getTime(),
        );
        break;
      case "popular":
        result.sort((a, b) => b.views - a.views);
        break;
    }

    return result;
  }, [categoryParam, selectedSource, sortOrder]);

  const { visibleCount, isLoading, hasMore, sentinelRef } = useInfiniteScroll({
    totalItems: filteredArticles.length,
    pageSize: PAGE_SIZE,
  });

  const visibleArticles = filteredArticles.slice(0, visibleCount);
  const activeCategory = categories.find((c) => c.slug === categoryParam);

  return (
    <Layout>
      {/* Page header */}
      <div className="border-b border-border bg-surface">
        <div className="container py-8">
          <h1 className="font-serif text-3xl font-bold text-foreground md:text-4xl">
            {activeCategory ? activeCategory.name : "Browse Articles"}
          </h1>
          <p className="mt-2 text-muted-foreground">
            {activeCategory
              ? `${activeCategory.article_count} articles in ${activeCategory.name}`
              : "Discover the latest from 50+ verified publishers"}
          </p>
        </div>
      </div>

      {/* Filters & Content */}
      <div className="container py-8">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            {filteredArticles.length} article
            {filteredArticles.length !== 1 ? "s" : ""} found
          </p>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className="gap-2"
            >
              <Filter className="h-4 w-4" />
              Filters
            </Button>
            <Select
              value={sortOrder}
              onValueChange={(v) => setSortOrder(v as typeof sortOrder)}
            >
              <SelectTrigger className="w-36">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-card">
                <SelectItem value="newest">Newest first</SelectItem>
                <SelectItem value="oldest">Oldest first</SelectItem>
                <SelectItem value="popular">Most popular</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-6 rounded-xl border border-border bg-surface p-4"
          >
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
              <div>
                <label className="mb-1 text-sm font-medium text-foreground">
                  Source
                </label>
                <Select
                  value={selectedSource}
                  onValueChange={setSelectedSource}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All sources" />
                  </SelectTrigger>
                  <SelectContent className="bg-card">
                    <SelectItem value="all">All Sources</SelectItem>
                    {sources.map((s) => (
                      <SelectItem key={s.id} value={s.id}>
                        {s.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </motion.div>
        )}

        {/* Articles grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {visibleArticles.map((article, i) => (
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

        {filteredArticles.length === 0 ? (
          <div className="py-16 text-center">
            <p className="font-serif text-xl text-muted-foreground">
              No articles found
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              Try adjusting your filters
            </p>
          </div>
        ) : (
          <InfiniteScrollSentinel
            sentinelRef={sentinelRef}
            isLoading={isLoading}
            hasMore={hasMore}
          />
        )}
      </div>
    </Layout>
  );
};

export default FeedContainer;
