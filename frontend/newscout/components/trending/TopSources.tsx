import Link from "next/link";
import { motion } from "framer-motion";
import { BadgeCheck, Trophy, Newspaper } from "lucide-react";
import { getTopSources } from "@/utils/mock-data";

const TopSources = () => {
  const topSources = getTopSources();

  return (
    <div>
      <div className="mb-4 flex items-center gap-2">
        <Trophy className="h-5 w-5 text-accent" />
        <h3 className="font-serif text-xl font-bold text-foreground">
          Top Sources
        </h3>
      </div>
      <div className="space-y-2">
        {topSources.map((item, i) => (
          <motion.div
            key={item.source.id}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.06 }}
          >
            <Link
              href={`/feed?source=${item.source.id}`}
              className="group flex items-center gap-3 rounded-lg border border-border bg-card p-3 transition-all hover:border-primary/30 hover:shadow-sm"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-sm font-bold text-muted-foreground">
                {i + 1}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-semibold text-card-foreground transition-colors group-hover:text-primary">
                    {item.source.name}
                  </span>
                  {item.source.is_verified && (
                    <BadgeCheck className="h-3.5 w-3.5 text-primary" />
                  )}
                </div>
              </div>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Newspaper className="h-3 w-3" />
                <span>{item.count} articles</span>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default TopSources;
