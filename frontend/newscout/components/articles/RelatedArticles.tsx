"use client";

import { useEffect, useState } from "react";
import { fetchArticles } from "@/lib/api/articles";
import ArticleCard from "@/components/ArticleCard";
import ArticleCardSkeleton from "@/components/ArticleCardSkeleton";
import { articles as mockArticles, type Article } from "@/utils/mock-data";

interface RelatedArticlesProps {
  article: Article;
}

function getMockRelated(article: Article): Article[] {
  return mockArticles
    .filter(
      (a) => a.id !== article.id && a.category.id === article.category.id,
    )
    .slice(0, 3);
}

const RelatedArticles = ({ article }: RelatedArticlesProps) => {
  const [relatedArticles, setRelatedArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const categoryId = Number.parseInt(article.category.id, 10);

    async function load() {
      setIsLoading(true);

      try {
        if (!Number.isNaN(categoryId)) {
          const result = await fetchArticles({
            categoryId,
            limit: 4,
            offset: 0,
          });
          const filtered = result.articles
            .filter((a) => a.id !== article.id)
            .slice(0, 3);
          if (!cancelled) {
            setRelatedArticles(filtered);
          }
        } else if (!cancelled) {
          setRelatedArticles(getMockRelated(article));
        }
      } catch {
        if (!cancelled) {
          setRelatedArticles(getMockRelated(article));
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, [article.id, article.category.id]);

  if (isLoading) {
    return (
      <section>
        <h2 className="mb-5 font-serif text-xl font-bold text-foreground">
          Related in {article.category.name}
        </h2>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <ArticleCardSkeleton key={i} />
          ))}
        </div>
      </section>
    );
  }

  if (relatedArticles.length === 0) return null;

  return (
    <section>
      <h2 className="mb-5 font-serif text-xl font-bold text-foreground">
        Related in {article.category.name}
      </h2>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {relatedArticles.map((a) => (
          <ArticleCard key={a.id} article={a} />
        ))}
      </div>
    </section>
  );
};

export default RelatedArticles;
