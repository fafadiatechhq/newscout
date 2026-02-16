import { useState, useEffect, useCallback } from "react";

const STORAGE_KEY = "newscout-reading-history";

interface ReadingEntry {
  articleId: string;
  categorySlug: string;
  timestamp: number;
}

export function useReadingHistory() {
  const [history, setHistory] = useState<ReadingEntry[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
    } catch {
      // storage full or unavailable
    }
  }, [history]);

  const trackView = useCallback((articleId: string, categorySlug: string) => {
    setHistory((prev) => {
      // Don't duplicate if already tracked recently (within 1 hour)
      const oneHourAgo = Date.now() - 3600000;
      const alreadyTracked = prev.some(
        (e) => e.articleId === articleId && e.timestamp > oneHourAgo
      );
      if (alreadyTracked) return prev;

      const entry: ReadingEntry = { articleId, categorySlug, timestamp: Date.now() };
      // Keep last 50 entries
      return [entry, ...prev].slice(0, 50);
    });
  }, []);

  /** Returns category slugs ranked by frequency, most-read first */
  const getPreferredCategories = useCallback((): string[] => {
    const counts: Record<string, number> = {};
    history.forEach((e) => {
      counts[e.categorySlug] = (counts[e.categorySlug] || 0) + 1;
    });
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .map(([slug]) => slug);
  }, [history]);

  const getViewedArticleIds = useCallback((): Set<string> => {
    return new Set(history.map((e) => e.articleId));
  }, [history]);

  return { history, trackView, getPreferredCategories, getViewedArticleIds };
}
