import { motion } from "framer-motion";
import { Award, BadgeCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { getEditorsPicks, formatTimeAgo } from "@/utils/mock-data";
import Link from "next/link";

const EditorsPicks = () => {
  const picks = getEditorsPicks();

  return (
    <section className="border-b border-border bg-background py-10">
      <div className="container">
        <div className="mb-6 flex items-center gap-2">
          <Award className="h-5 w-5 text-accent" />
          <h2 className="font-serif text-2xl font-bold text-foreground">
            Editor's Picks
          </h2>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {picks.map((article, i) => (
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
                <div className="relative aspect-[16/10] overflow-hidden">
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
