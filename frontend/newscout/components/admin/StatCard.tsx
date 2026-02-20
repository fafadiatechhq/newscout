import { LucideIcon } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/utils/utils'

interface StatCardProps {
  icon: LucideIcon
  label: string
  value: string
  trend?: string
  trendUp?: boolean
  className?: string
}

const StatCard = ({
  icon: Icon,
  label,
  value,
  trend,
  trendUp,
  className,
}: StatCardProps) => (
  <Card className={cn('transition-shadow hover:shadow-md', className)}>
    <CardContent className="flex items-center gap-4 p-5">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
        <Icon className="h-5 w-5" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-xs font-medium text-muted-foreground">{label}</p>
        <p className="text-2xl font-bold leading-tight text-foreground">
          {value}
        </p>
        {trend && (
          <p
            className={cn(
              'mt-0.5 text-xs font-medium',
              trendUp ? 'text-primary' : 'text-muted-foreground',
            )}
          >
            {trend}
          </p>
        )}
      </div>
    </CardContent>
  </Card>
)

export default StatCard
