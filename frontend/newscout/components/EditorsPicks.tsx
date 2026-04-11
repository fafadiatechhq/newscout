import Link from "next/link";
import { motion } from "framer-motion";
import { Award, BadgeCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { getEditorsPicks, formatTimeAgo, Article } from "@/utils/mock-data";
import { useEffect, useState } from "react";

const EditorsPicks = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const res = await fetch("http://localhost:8000/api/v1/articles/");
        const data = await res.json();
        setArticles(data.results);
      } catch (err) {
        console.error("Error fetching articles:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchArticles();
  }, []);

  if (loading) return <p className="p-8">Loading...</p>;

  if (!articles || articles.length === 0) {
    return (
      <section className="border-b border-border bg-background py-10">
        <div className="container">
          <div className="mb-6 flex items-center gap-2">
            <Award className="h-5 w-5 text-accent" />
            <h2 className="font-serif text-xl md:text-2xl font-bold text-foreground">
              Editor's Picks
            </h2>
          </div>
          <div className="rounded-xl border border-dashed border-border bg-card p-8 text-center">
            <Award className="mx-auto mb-3 h-8 w-8 text-muted-foreground" />
            <p className="font-serif text-lg font-bold text-foreground">
              No editor's picks available
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              Please check back later for our curated selections.
            </p>
          </div>
        </div>
      </section>
    );
  }
  
  return (
    <section className="border-b border-border bg-background py-10">
      <div className="container">
        <div className="mb-6 flex items-center gap-2">
          <Award className="h-5 w-5 text-accent" />
          <h2 className="font-serif text-xl md:text-2xl font-bold text-foreground">
            Editor's Picks
          </h2>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {articles.map((article, i) => (
            <motion.div
              key={article.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: i * 0.08 }}
            >
              <Link
                href={`/articles/${article.id}`}
                className="group flex flex-col overflow-hidden rounded-xl border border-border bg-card transition-shadow hover:shadow-lg"
              >
                <div className="relative aspect-16/10 overflow-hidden">
                  <img
                    src={article.image_url}
                    alt={article.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                  <Badge className="absolute left-3 top-3 bg-accent text-accent-foreground hover:bg-accent/80 text-xs">
                    <Award className="mr-1 h-3 w-3" />
                    Editor's Pick
                  </Badge>
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
                    <span>{formatTimeAgo(article.published_at)}</span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default EditorsPicks;
