
import { Skeleton } from "@/components/ui/skeleton";

interface ArticleCardSkeletonProps {
  variant?: "default" | "compact" | "featured";
}

const ArticleCardSkeleton = ({ variant = "default" }: ArticleCardSkeletonProps) => {
  if (variant === "featured") {
    return (
      <div className="overflow-hidden rounded-xl">
        <Skeleton className="aspect-video w-full" />
      </div>
    );
  }

  if (variant === "compact") {
    return (
      <div className="flex gap-4 p-3">
        <Skeleton className="h-16 w-16 shrink-0 rounded-md" />
        <div className="min-w-0 flex-1 space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-3 w-2/3" />
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card">
      <Skeleton className="aspect-16/10 w-full" />
      <div className="p-5 space-y-3">
        <div className="flex gap-2">
          <Skeleton className="h-5 w-20 rounded-full" />
        </div>
        <Skeleton className="h-5 w-full" />
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
        <div className="flex justify-between pt-1">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-3 w-20" />
        </div>
      </div>
    </div>
  );
};

export default ArticleCardSkeleton;
