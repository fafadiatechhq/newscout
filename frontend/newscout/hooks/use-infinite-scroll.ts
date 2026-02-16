import { useState, useEffect, useRef, useCallback } from "react";

interface UseInfiniteScrollOptions {
  /** Total items available */
  totalItems: number;
  /** Items to show per "page" */
  pageSize?: number;
  /** Simulated network delay in ms (0 to disable) */
  delay?: number;
  /** Root margin for IntersectionObserver */
  rootMargin?: string;
}

interface UseInfiniteScrollReturn {
  /** Number of items currently visible */
  visibleCount: number;
  /** Whether more items are currently loading */
  isLoading: boolean;
  /** Whether there are more items to load */
  hasMore: boolean;
  /** Ref to attach to the sentinel element at the bottom of the list */
  sentinelRef: React.RefObject<HTMLDivElement>;
  /** Manually reset to initial state */
  reset: () => void;
}

export function useInfiniteScroll({
  totalItems,
  pageSize = 6,
  delay = 400,
  rootMargin = "200px",
}: UseInfiniteScrollOptions): UseInfiniteScrollReturn {
  const [visibleCount, setVisibleCount] = useState(Math.min(pageSize, totalItems));
  const [isLoading, setIsLoading] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null!);
  const hasMore = visibleCount < totalItems;

  const reset = useCallback(() => {
    setVisibleCount(Math.min(pageSize, totalItems));
    setIsLoading(false);
  }, [pageSize, totalItems]);

  // Reset when totalItems changes (e.g. filter/search change)
  useEffect(() => {
    setVisibleCount(Math.min(pageSize, totalItems));
    setIsLoading(false);
  }, [totalItems, pageSize]);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting && !isLoading && visibleCount < totalItems) {
          setIsLoading(true);

          const load = () => {
            setVisibleCount((prev) => Math.min(prev + pageSize, totalItems));
            setIsLoading(false);
          };

          if (delay > 0) {
            setTimeout(load, delay);
          } else {
            load();
          }
        }
      },
      { rootMargin }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [visibleCount, totalItems, pageSize, isLoading, delay, rootMargin]);

  return { visibleCount, isLoading, hasMore, sentinelRef, reset };
}
