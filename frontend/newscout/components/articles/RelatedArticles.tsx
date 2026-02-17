import { articles, type Article } from "@/utils/mock-data";
import ArticleCard from "@/components/ArticleCard";

interface RelatedArticlesProps {
  article: Article;
}

const RelatedArticles = ({ article }: RelatedArticlesProps) => {
  const relatedArticles = articles
    .filter((a) => a.id !== article.id && a.category.id === article.category.id)
    .slice(0, 3);

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
