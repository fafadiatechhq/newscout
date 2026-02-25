"use client";
import { motion } from "framer-motion";
import { Sparkles, BadgeCheck, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { articles, formatTimeAgo } from "@/utils/mock-data";
import { useReadingHistory } from "@/hooks/use-reading-history";
import Link from "next/link";
import { useState, useEffect } from "react";

const ForYouSection = () => {
  const [mounted, setMounted] = useState(false);
  const { getPreferredCategories, getViewedArticleIds } = useReadingHistory();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // Render a loading state or nothing to match server render
    return (
      <section className="border-b border-border bg-surface py-10">
        <div className="container">
          <div className="mb-6 flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-accent" />
            <h2 className="font-serif text-2xl font-bold text-foreground">For You</h2>
          </div>
          <div className="rounded-xl border border-dashed border-border bg-card p-8 text-center">
            <Sparkles className="mx-auto mb-3 h-8 w-8 text-muted-foreground" />
            <p className="font-serif text-lg font-bold text-foreground">
              Loading personalized picks...
            </p>
          </div>
        </div>
      </section>
    );
  }

  const preferredCategories = getPreferredCategories();
  const viewedIds = getViewedArticleIds();

  // If no reading history, show nothing (or a prompt)
  if (preferredCategories.length === 0) {
    return (
      <section className="border-b border-border bg-surface py-10">
        <div className="container">
          <div className="mb-6 flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-accent" />
            <h2 className="font-serif text-xl md:text-2xl font-bold text-foreground">
              For You
            </h2>
          </div>
          <div className="rounded-xl border border-dashed border-border bg-card p-8 text-center">
            <Sparkles className="mx-auto mb-3 h-8 w-8 text-muted-foreground" />
            <p className="font-serif text-lg font-bold text-foreground">
              Personalized picks coming soon
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              Start reading articles to get recommendations tailored to your
              interests.
            </p>
          </div>
        </div>
      </section>
    )
  }

  // Recommend articles from preferred categories that haven't been read
  const recommended = articles
    .filter((a) => !viewedIds.has(a.id))
    .sort((a, b) => {
      const aIdx = preferredCategories.indexOf(a.category.slug)
      const bIdx = preferredCategories.indexOf(b.category.slug)
      // Preferred categories first, then by views
      const aScore = aIdx >= 0 ? aIdx : 999
      const bScore = bIdx >= 0 ? bIdx : 999
      if (aScore !== bScore) return aScore - bScore
      return b.views - a.views
    })
    .slice(0, 4)

  // If all articles have been read, show top unread or fallback
  if (recommended.length === 0) {
    return null
  }

  return (
    <section className="border-b border-border bg-surface py-10">
      <div className="container">
        <div className="mb-6 flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-accent" />
          <h2 className="font-serif text-2xl font-bold text-foreground">
            For You
          </h2>
          <span className="ml-2 rounded-full bg-accent/10 px-3 py-0.5 text-xs font-medium text-accent">
            Based on your reading
          </span>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {recommended.map((article, i) => (
            <motion.div
              key={article.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.07 }}
            >
              <Link
                href={`/articles/${article.id}`}
                className="group flex flex-col overflow-hidden rounded-xl border border-border bg-card transition-shadow hover:shadow-lg"
              >
                <div className="aspect-16/10 overflow-hidden">
                  <img
                    src={article.image_url}
                    alt={article.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                </div>
                <div className="flex flex-1 flex-col p-4">
                  <Badge variant="secondary" className="mb-2 w-fit text-xs">
                    {article.category.name}
                  </Badge>
                  <h3 className="mb-2 font-serif text-base font-bold leading-tight text-card-foreground transition-colors group-hover:text-primary line-clamp-2">
                    {article.title}
                  </h3>
                  <div className="mt-auto flex items-center gap-2 text-xs text-muted-foreground">
                    {article.source.is_verified && (
                      <BadgeCheck className="h-3 w-3 text-primary" />
                    )}
                    <span className="font-medium">{article.source.name}</span>
                    <span>·</span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {article.reading_time} min
                    </span>
                    <span>·</span>
                    <span>{formatTimeAgo(article.published_at)}</span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default ForYouSection
