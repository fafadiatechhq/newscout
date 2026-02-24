import Link from "next/link";
import { motion } from "framer-motion";
import { Hash } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { getTrendingTags } from "@/utils/mock-data";

const TrendingTopics = () => {
  const tags = getTrendingTags();

  return (
    <div>
      <div className="mb-4 flex items-center gap-2">
        <Hash className="h-5 w-5 text-primary" />
        <h3 className="font-serif text-xl font-bold text-foreground">
          Trending Topics
        </h3>
      </div>
      <div className="flex flex-wrap gap-2">
        {tags.map((item, i) => (
          <motion.div
            key={item.tag}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.04 }}
          >
            <Link href={`/search?q=${encodeURIComponent(item.tag)}`}>
              <Badge
                variant="outline"
                className="cursor-pointer px-3 py-1.5 text-sm transition-colors hover:bg-primary hover:text-primary-foreground"
              >
                {item.tag}
                <span className="ml-1.5 rounded-full bg-muted px-1.5 py-0.5 text-[10px] font-bold text-muted-foreground">
                  {item.count}
                </span>
              </Badge>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default TrendingTopics;
