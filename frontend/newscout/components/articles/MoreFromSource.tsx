import { BadgeCheck } from "lucide-react";
import { type Article, getArticlesBySource } from "@/utils/mock-data";
import ArticleCard from "@/components/ArticleCard";

interface MoreFromSourceProps {
  article: Article;
}

const MoreFromSource = ({ article }: MoreFromSourceProps) => {
  const sourceArticles = getArticlesBySource(article.source.id, article.id).slice(0, 3);

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
        {article.source.is_verified && <BadgeCheck className="h-4 w-4 text-primary" />}
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
