"use client";
import { useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import Layout from "@/components/Layout";
import ArticleCard from "@/components/ArticleCard";
import ArticleCardSkeleton from "@/components/ArticleCardSkeleton";
import InfiniteScrollSentinel from "@/components/InfiniteScrollSentinel";
import { Button } from "@/components/ui/button";
import { useCategories } from "@/hooks/use-categories";
import { useArticles } from "@/hooks/use-articles";

const PAGE_SIZE = 6;

const FeedContainer = () => {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get("category");

  const { getCategoryBySlug, isLoading: categoriesLoading } = useCategories();

  const activeCategory = useMemo(
    () => (categoryParam ? getCategoryBySlug(categoryParam) : undefined),
    [categoryParam, getCategoryBySlug],
  );

  const categoryId = activeCategory
    ? Number.parseInt(activeCategory.id, 10)
    : undefined;

  const showInvalidCategory =
    !categoriesLoading && categoryParam && !activeCategory;

  const articlesEnabled = !showInvalidCategory && !categoriesLoading;

  const {
    articles,
    totalCount,
    isLoading,
    isLoadingMore,
    error,
    hasMore,
    retry,
    sentinelRef,
  } = useArticles({
    categoryId:
      categoryId !== undefined && !Number.isNaN(categoryId)
        ? categoryId
        : undefined,
    pageSize: PAGE_SIZE,
    enabled: articlesEnabled,
  });

  return (
    <Layout>
      <div className="border-b border-border bg-surface">
        <div className="container py-8">
          <h1 className="font-serif text-3xl font-bold text-foreground md:text-4xl">
            {showInvalidCategory
              ? "Category not found"
              : activeCategory
                ? activeCategory.name
                : "Browse Articles"}
          </h1>
          <p className="mt-2 text-muted-foreground">
            {showInvalidCategory
              ? "Try browsing all articles or pick another category"
              : activeCategory
                ? `${totalCount} article${totalCount !== 1 ? "s" : ""} in ${activeCategory.name}`
                : "Discover the latest from verified publishers"}
          </p>
        </div>
      </div>

      <div className="container py-8">
        {error ? (
          <div className="py-16 text-center">
            <p className="font-serif text-xl text-muted-foreground">
              Unable to load articles
            </p>
            <p className="mt-2 text-sm text-muted-foreground">{error}</p>
            <Button className="mt-4 cursor-pointer" onClick={retry}>
              Try again
            </Button>
          </div>
        ) : showInvalidCategory ? (
          <div className="py-16 text-center">
            <p className="font-serif text-xl text-muted-foreground">
              No articles found for this category
            </p>
          </div>
        ) : !articlesEnabled || isLoading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: PAGE_SIZE }).map((_, i) => (
              <ArticleCardSkeleton key={i} />
            ))}
          </div>
        ) : (
          <>
            <div className="mb-6">
              <p className="text-sm text-muted-foreground">
                {totalCount} article
                {totalCount !== 1 ? "s" : ""} found
              </p>
            </div>

            {totalCount === 0 ? (
              <div className="py-16 text-center">
                <p className="font-serif text-xl text-muted-foreground">
                  No articles found
                </p>
                <p className="mt-2 text-sm text-muted-foreground">
                  Try browsing another category
                </p>
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

export default FeedContainer;
