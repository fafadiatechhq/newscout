import { Loader2 } from "lucide-react";

interface InfiniteScrollSentinelProps {
  sentinelRef: React.RefObject<HTMLDivElement>;
  isLoading: boolean;
  hasMore: boolean;
}

const InfiniteScrollSentinel = ({ sentinelRef, isLoading, hasMore }: InfiniteScrollSentinelProps) => {
  return (
    <div ref={sentinelRef} className="flex justify-center py-8">
      {isLoading && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          Loading more…
        </div>
      )}
      {!hasMore && !isLoading && (
        <p className="text-sm text-muted-foreground">You've reached the end</p>
      )}
    </div>
  );
};

export default InfiniteScrollSentinel;
