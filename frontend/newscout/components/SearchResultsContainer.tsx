"use client";
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Search, ArrowLeft, Filter } from "lucide-react";
import Layout from "@/components/Layout";
import ArticleCard from "@/components/ArticleCard";
import ArticleCardSkeleton from "@/components/ArticleCardSkeleton";
import InfiniteScrollSentinel from "@/components/InfiniteScrollSentinel";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSearchArticles } from "@/hooks/use-search-articles";

const PAGE_SIZE = 6;

const SearchResultsContainer = () => {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";

  const [selectedSource, setSelectedSource] = useState<string>("all");
  const [showFilters, setShowFilters] = useState(false);

  const {
    articles,
    totalCount,
    aggregations,
    isLoading,
    isLoadingMore,
    error,
    hasMore,
    retry,
    sentinelRef,
  } = useSearchArticles({
    query,
    sourceId: selectedSource,
    pageSize: PAGE_SIZE,
  });

  const sourceOptions = aggregations.sources.filter(
    (source) => source.name !== null,
  );

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
                {query ? `Results for "${query}"` : "Search"}
              </h1>
              {!isLoading && !error && query && (
                <p className="text-muted-foreground">
                  {totalCount} article
                  {totalCount !== 1 ? "s" : ""} found
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="container py-8">
        {!query ? (
          <div className="py-16 text-center">
            <Search className="mx-auto mb-4 h-12 w-12 text-muted-foreground/30" />
            <p className="font-serif text-xl text-muted-foreground">
              Enter a search term
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              Use the search bar to find articles
            </p>
          </div>
        ) : error ? (
          <div className="py-16 text-center">
            <Search className="mx-auto mb-4 h-12 w-12 text-muted-foreground/30" />
            <p className="font-serif text-xl text-muted-foreground">
              Unable to load search results
            </p>
            <p className="mt-2 text-sm text-muted-foreground">{error}</p>
            <Button className="mt-4 cursor-pointer" onClick={retry}>
              Try again
            </Button>
          </div>
        ) : isLoading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: PAGE_SIZE }).map((_, i) => (
              <ArticleCardSkeleton key={i} />
            ))}
          </div>
        ) : totalCount === 0 ? (
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
                {totalCount} article
                {totalCount !== 1 ? "s" : ""} found
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
              </div>
            </div>

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
                        {sourceOptions.map((source) => (
                          <SelectItem key={source.id} value={String(source.id)}>
                            {source.name} ({source.count})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </motion.div>
            )}

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {articles.map((article, i) => (
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
              isLoading={isLoadingMore}
              hasMore={hasMore}
            />
          </>
        )}
      </div>
    </Layout>
  );
};

export default SearchResultsContainer;
