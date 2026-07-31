"use client";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
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
import {
  useSearchArticles,
  type SearchArticleFilters,
} from "@/hooks/use-search-articles";
import type { AggregationBucket } from "@/lib/api/types";
import { cn } from "@/utils/utils";

const PAGE_SIZE = 6;

const DEFAULT_FILTERS: SearchArticleFilters = {
  sourceId: "all",
  categoryId: "all",
  tagId: "all",
  trending: false,
  featured: false,
  editorsPick: false,
  isBreaking: false,
};

function parseFiltersFromParams(
  searchParams: URLSearchParams,
): SearchArticleFilters {
  return {
    sourceId: searchParams.get("source") ?? "all",
    categoryId: searchParams.get("category") ?? "all",
    tagId: searchParams.get("tag") ?? "all",
    trending: searchParams.get("trending") === "true",
    featured: searchParams.get("featured") === "true",
    editorsPick: searchParams.get("editors_pick") === "true",
    isBreaking: searchParams.get("is_breaking") === "true",
  };
}

function hasActiveFilters(filters: SearchArticleFilters): boolean {
  return (
    filters.sourceId !== "all" ||
    filters.categoryId !== "all" ||
    filters.tagId !== "all" ||
    filters.trending ||
    filters.featured ||
    filters.editorsPick ||
    filters.isBreaking
  );
}

function buildSearchUrl(query: string, filters: SearchArticleFilters): string {
  const params = new URLSearchParams();
  if (query) {
    params.set("q", query);
  }
  if (filters.sourceId !== "all") {
    params.set("source", filters.sourceId);
  }
  if (filters.categoryId !== "all") {
    params.set("category", filters.categoryId);
  }
  if (filters.tagId !== "all") {
    params.set("tag", filters.tagId);
  }
  if (filters.trending) {
    params.set("trending", "true");
  }
  if (filters.featured) {
    params.set("featured", "true");
  }
  if (filters.editorsPick) {
    params.set("editors_pick", "true");
  }
  if (filters.isBreaking) {
    params.set("is_breaking", "true");
  }

  const queryString = params.toString();
  return queryString ? `/search?${queryString}` : "/search";
}

function filterNamedBuckets(buckets: AggregationBucket[]) {
  return buckets.filter((bucket) => bucket.name !== null);
}

const FLAG_OPTIONS = [
  { key: "trending" as const, label: "Trending" },
  { key: "featured" as const, label: "Featured" },
  { key: "editorsPick" as const, label: "Editor's Pick" },
  { key: "isBreaking" as const, label: "Breaking" },
];

const SearchResultsContainer = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";

  const filters = useMemo(
    () => parseFiltersFromParams(searchParams),
    [searchParams],
  );
  const [showFilters, setShowFilters] = useState(() =>
    hasActiveFilters(parseFiltersFromParams(searchParams)),
  );

  const updateFilters = useCallback(
    (next: Partial<SearchArticleFilters>) => {
      const merged = { ...filters, ...next };
      router.replace(buildSearchUrl(query, merged));
    },
    [filters, query, router],
  );

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
    filters,
    pageSize: PAGE_SIZE,
  });

  const sourceOptions = useMemo(
    () => filterNamedBuckets(aggregations.sources),
    [aggregations.sources],
  );
  const categoryOptions = useMemo(
    () => filterNamedBuckets(aggregations.categories),
    [aggregations.categories],
  );
  const tagOptions = useMemo(
    () => filterNamedBuckets(aggregations.tags),
    [aggregations.tags],
  );

  useEffect(() => {
    if (isLoading) return;

    const staleUpdates: Partial<SearchArticleFilters> = {};

    if (
      filters.sourceId !== "all" &&
      !sourceOptions.some((option) => String(option.id) === filters.sourceId)
    ) {
      staleUpdates.sourceId = "all";
    }
    if (
      filters.categoryId !== "all" &&
      !categoryOptions.some(
        (option) => String(option.id) === filters.categoryId,
      )
    ) {
      staleUpdates.categoryId = "all";
    }
    if (
      filters.tagId !== "all" &&
      !tagOptions.some((option) => String(option.id) === filters.tagId)
    ) {
      staleUpdates.tagId = "all";
    }

    if (Object.keys(staleUpdates).length > 0) {
      updateFilters(staleUpdates);
    }
  }, [
    isLoading,
    filters.sourceId,
    filters.categoryId,
    filters.tagId,
    sourceOptions,
    categoryOptions,
    tagOptions,
    updateFilters,
  ]);

  const filtersActive = hasActiveFilters(filters);
  const filtersDisabled = isLoading || isLoadingMore;
  const showResultsSection = Boolean(query) && !error;

  const renderFiltersPanel = () => (
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
            value={filters.sourceId}
            onValueChange={(value) => updateFilters({ sourceId: value })}
            disabled={filtersDisabled}
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

        <div>
          <label className="text-md font-medium text-foreground leading-10">
            Category
          </label>
          <Select
            value={filters.categoryId}
            onValueChange={(value) => updateFilters({ categoryId: value })}
            disabled={filtersDisabled}
          >
            <SelectTrigger>
              <SelectValue placeholder="All categories" />
            </SelectTrigger>
            <SelectContent className="bg-card">
              <SelectItem value="all">All Categories</SelectItem>
              {categoryOptions.map((category) => (
                <SelectItem key={category.id} value={String(category.id)}>
                  {category.name} ({category.count})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-md font-medium text-foreground leading-10">
            Tag
          </label>
          <Select
            value={filters.tagId}
            onValueChange={(value) => updateFilters({ tagId: value })}
            disabled={filtersDisabled}
          >
            <SelectTrigger>
              <SelectValue placeholder="All tags" />
            </SelectTrigger>
            <SelectContent className="bg-card">
              <SelectItem value="all">All Tags</SelectItem>
              {tagOptions.map((tag) => (
                <SelectItem key={tag.id} value={String(tag.id)}>
                  {tag.name} ({tag.count})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="mt-4">
        <p className="text-md mb-2 font-medium text-foreground">Flags</p>
        <div className="flex flex-wrap gap-2">
          {FLAG_OPTIONS.map(({ key, label }) => {
            const count =
              key === "editorsPick"
                ? aggregations.flags.editors_pick
                : key === "isBreaking"
                  ? aggregations.flags.is_breaking
                  : aggregations.flags[key];

            if (count === 0 && !filters[key]) {
              return null;
            }

            const isActive = filters[key];

            return (
              <Button
                key={key}
                type="button"
                variant={isActive ? "default" : "outline"}
                size="sm"
                disabled={filtersDisabled || count === 0}
                className={cn(
                  "cursor-pointer",
                  isActive && "pointer-events-auto",
                )}
                onClick={() => updateFilters({ [key]: !isActive })}
              >
                {label} ({count})
              </Button>
            );
          })}
        </div>
      </div>

      {filtersActive && (
        <div className="mt-4">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            disabled={filtersDisabled}
            className="cursor-pointer"
            onClick={() => {
              router.replace(buildSearchUrl(query, DEFAULT_FILTERS));
            }}
          >
            Clear all filters
          </Button>
        </div>
      )}
    </motion.div>
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
        ) : (
          <>
            {showResultsSection && (
              <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
                <p className="text-sm text-muted-foreground">
                  {isLoading
                    ? "Searching..."
                    : `${totalCount} article${totalCount !== 1 ? "s" : ""} found`}
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
                    {filtersActive && (
                      <span className="rounded-full bg-primary px-1.5 py-0.5 text-xs text-primary-foreground">
                        on
                      </span>
                    )}
                  </Button>
                </div>
              </div>
            )}

            {showResultsSection &&
              (showFilters || filtersActive) &&
              renderFiltersPanel()}

            {isLoading ? (
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
                  {filtersActive
                    ? "Try adjusting your filters or using different keywords"
                    : "Try different keywords or browse our categories"}
                </p>
                {filtersActive ? (
                  <Button
                    className="mt-4 cursor-pointer"
                    onClick={() => {
                      router.replace(buildSearchUrl(query, DEFAULT_FILTERS));
                    }}
                  >
                    Clear filters
                  </Button>
                ) : (
                  <Link href="/feed">
                    <Button className="mt-4">Browse all articles</Button>
                  </Link>
                )}
              </div>
            ) : (
              <>
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
          </>
        )}
      </div>
    </Layout>
  );
};

export default SearchResultsContainer;
