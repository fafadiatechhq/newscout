// import { Link } from "react-router-dom";
import { AlertTriangle } from "lucide-react";
import { articles } from "@/lib/mock-data";
import Link from "next/link";

const BreakingNewsTicker = () => {
  const breakingArticles = articles.slice(0, 3);

  return (
    <div className="overflow-hidden border-b border-border bg-card">
      <div className="container flex items-center gap-4 py-2">
        <span className="flex shrink-0 items-center gap-1.5 rounded bg-accent px-2.5 py-1 text-xs font-bold uppercase tracking-wider text-accent-foreground">
          <AlertTriangle className="h-3 w-3" />
          Breaking
        </span>
        <div className="relative min-w-0 flex-1 overflow-hidden">
          <div className="animate-ticker flex whitespace-nowrap hover:[animation-play-state:paused]">
            {[...breakingArticles, ...breakingArticles].map((article, i) => (
              <Link
                key={`${article.id}-${i}`}
                href={`/articles/${article.id}`}
                className="mr-12 inline-block text-sm font-medium text-foreground transition-colors hover:text-primary"
              >
                {article.title}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BreakingNewsTicker;
