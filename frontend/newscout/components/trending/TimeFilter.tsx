import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Clock, CalendarDays, Calendar } from "lucide-react";
import type { TrendingPeriod } from "@/utils/mock-data";

interface TimeFilterProps {
  value: TrendingPeriod;
  onChange: (value: TrendingPeriod) => void;
}

const TimeFilter = ({ value, onChange }: TimeFilterProps) => {
  return (
    <Tabs value={value} onValueChange={(v) => onChange(v as TrendingPeriod)}>
      <TabsList className="bg-primary/10">
        <TabsTrigger
          value="now"
          className="gap-1.5 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
        >
          <Clock className="h-3.5 w-3.5" />
          Now
        </TabsTrigger>
        <TabsTrigger
          value="week"
          className="gap-1.5 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
        >
          <CalendarDays className="h-3.5 w-3.5" />
          This Week
        </TabsTrigger>
        <TabsTrigger
          value="month"
          className="gap-1.5 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
        >
          <Calendar className="h-3.5 w-3.5" />
          This Month
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
};

export default TimeFilter;
