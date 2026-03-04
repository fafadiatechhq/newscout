"use client";
import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Search, ArrowLeft, Filter } from "lucide-react";
import Layout from "@/components/Layout";
import ArticleCard from "@/components/ArticleCard";
import InfiniteScrollSentinel from "@/components/InfiniteScrollSentinel";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { searchArticles, sources } from "@/utils/mock-data";
import { useInfiniteScroll } from "@/hooks/use-infinite-scroll";

const PAGE_SIZE = 6;

const SearchResults = () => {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";

  const [selectedSource, setSelectedSource] = useState<string>("all");
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest" | "popular">(
    "newest",
  );
  const [showFilters, setShowFilters] = useState(false);

  const baseResults = useMemo(() => searchArticles(query), [query]);

  const filteredResults = useMemo(() => {
    let result = [...baseResults];

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
  }, [baseResults, selectedSource, sortOrder]);

  const { visibleCount, isLoading, hasMore, sentinelRef } = useInfiniteScroll({
    totalItems: filteredResults.length,
    pageSize: PAGE_SIZE,
  });

  const visibleResults = filteredResults.slice(0, visibleCount);

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
                {baseResults.length} article
                {baseResults.length !== 1 ? "s" : ""} found
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container py-8">
        {baseResults.length === 0 ? (
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
        ) : (
          <>
            <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
              <p className="text-sm text-muted-foreground">
                {filteredResults.length} article
                {filteredResults.length !== 1 ? "s" : ""} found
              </p>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowFilters(!showFilters)}
                  className="gap-2 cursor-pointer"
                >
                  <Filter className="h-4 w-4" />
                  Filters
                </Button>
                <Select
                  value={sortOrder}
                  onValueChange={(v) => setSortOrder(v as typeof sortOrder)}
                >
                  <SelectTrigger className="w-36 cursor-pointer">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-card cursor-pointer">
                    <SelectItem value="newest">Newest first</SelectItem>
                    <SelectItem value="oldest">Oldest first</SelectItem>
                    <SelectItem value="popular">Most popular</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Filter Dropdown */}
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, scaleY: 0 }}
                animate={{ opacity: 1, scaleY: 1 }}
                exit={{ opacity: 0, scaleY: 0 }}
                style={{ transformOrigin: "top" }}
                className="mb-6 rounded-xl border border-border bg-surface p-4"
              >
                <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
                  <div>
                    <label className="text-md font-medium text-foreground leading-10">
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

            {filteredResults.length === 0 ? (
              <div className="py-16 text-center">
                <p className="font-serif text-xl text-muted-foreground">
                  No articles found
                </p>
                <p className="mt-2 text-sm text-muted-foreground">
                  Try adjusting your filters
                </p>
              </div>
            ) : (
              <>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {visibleResults.map((article, i) => (
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
              </>
            )}
          </>
        )}
      </div>
    </Layout>
  );
};

export default SearchResults;
