import Link from "next/link";
import { Rocket } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  type Article,
  getVelocityLabel,
  formatTimeAgo,
} from "@/utils/mock-data";

interface RisingCardProps {
  article: Article;
}

const RisingCard = ({ article }: RisingCardProps) => {
  const velocity = getVelocityLabel(article);

  return (
    <Link
      href={`/articles/${article.id}`}
      className="group flex min-w-70 gap-3 rounded-xl border border-border bg-card p-4 transition-all hover:border-accent/40 hover:shadow-md"
    >
      <div className="h-20 w-20 shrink-0 overflow-hidden rounded-lg">
        <img
          src={article.image_url}
          alt={article.title}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />
      </div>
      <div className="flex min-w-0 flex-1 flex-col justify-between">
        <div>
          <div className="mb-1.5 flex items-center gap-2">
            <Badge className="bg-accent/15 text-accent hover:bg-accent/25 text-[10px] px-1.5 py-0">
              <Rocket className="mr-0.5 h-2.5 w-2.5" />
              {velocity}
            </Badge>
          </div>
          <h4 className="text-sm font-semibold leading-tight text-card-foreground line-clamp-2 transition-colors group-hover:text-primary">
            {article.title}
          </h4>
        </div>
        <div className="mt-1 flex items-center gap-2 text-[11px] text-muted-foreground">
          <span className="font-medium">{article.source.name}</span>
          <span>·</span>
          <span>{formatTimeAgo(article.published_at)}</span>
        </div>
      </div>
    </Link>
  );
};

export default RisingCard;
