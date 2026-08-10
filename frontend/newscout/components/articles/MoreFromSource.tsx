"use client";

import { useEffect, useState } from "react";
import { BadgeCheck } from "lucide-react";
import { fetchArticles } from "@/lib/api/articles";
import ArticleCard from "@/components/ArticleCard";
import ArticleCardSkeleton from "@/components/ArticleCardSkeleton";
import {
  getArticlesBySource,
  type Article,
} from "@/utils/mock-data";

interface MoreFromSourceProps {
  article: Article;
}

const MoreFromSource = ({ article }: MoreFromSourceProps) => {
  const [sourceArticles, setSourceArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const sourceId = Number.parseInt(article.source.id, 10);

    async function load() {
      setIsLoading(true);

      try {
        if (!Number.isNaN(sourceId)) {
          const result = await fetchArticles({
            sourceId,
            limit: 4,
            offset: 0,
          });
          const filtered = result.articles
            .filter((a) => a.id !== article.id)
            .slice(0, 3);
          if (!cancelled) {
            setSourceArticles(filtered);
          }
        } else if (!cancelled) {
          setSourceArticles(
            getArticlesBySource(article.source.id, article.id).slice(0, 3),
          );
        }
      } catch {
        if (!cancelled) {
          setSourceArticles(
            getArticlesBySource(article.source.id, article.id).slice(0, 3),
          );
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
  }, [article.id, article.source.id]);

  if (isLoading) {
    return (
      <section>
        <div className="mb-5 flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
            {article.source.name.charAt(0)}
          </div>
          <h2 className="font-serif text-xl font-bold text-foreground">
            More from {article.source.name}
          </h2>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <ArticleCardSkeleton key={i} />
          ))}
        </div>
      </section>
    );
  }

  if (sourceArticles.length === 0) return null;

  return (
    <section>
      <div className="mb-5 flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
          {article.source.name.charAt(0)}
        </div>
        <h2 className="font-serif text-xl font-bold text-foreground">
          More from {article.source.name}
        </h2>
        {article.source.is_verified && (
          <BadgeCheck className="h-4 w-4 text-primary" />
        )}
      </div>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {sourceArticles.map((a) => (
          <ArticleCard key={a.id} article={a} />
        ))}
      </div>
    </section>
  );
};

export default MoreFromSource;
