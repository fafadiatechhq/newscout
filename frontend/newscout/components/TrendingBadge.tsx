import { TrendingUp } from "lucide-react";

interface TrendingBadgeProps {
  rank: number;
}

const TrendingBadge = ({ rank }: TrendingBadgeProps) => {
  return (
    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent text-sm font-bold text-accent-foreground">
      {rank}
    </div>
  );
};

export default TrendingBadge;
