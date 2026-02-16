import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { categories } from "@/utils/mock-data";
import Link from "next/link";

const CategoryShowcase = () => {
  return (
    <section className="border-b border-border bg-surface">
      <div className="container py-8">
        <h2 className="mb-6 font-serif text-2xl font-bold text-foreground">Popular Categories</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((cat, i) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
            >
              <Link
                href={`/feed?category=${cat.slug}`}
                className="group flex flex-col justify-between rounded-xl border border-border bg-card p-5 transition-all hover:border-primary/40 hover:shadow-md"
              >
                <div>
                  <h3 className="mb-1 font-serif text-lg font-bold text-card-foreground transition-colors group-hover:text-primary">
                    {cat.name}
                  </h3>
                  <p className="text-sm text-muted-foreground">{cat.description}</p>
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <span className="rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-secondary-foreground">
                    {cat.article_count.toLocaleString()} articles
                  </span>
                  <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary" />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoryShowcase;
