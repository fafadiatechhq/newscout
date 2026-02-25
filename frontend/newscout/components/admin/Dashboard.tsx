'use client'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import {
  Activity,
  Users,
  CreditCard,
  Key,
  BarChart3,
  FileText,
} from 'lucide-react'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card'
import StatCard from '@/components/admin/StatCard'
import {
  organization,
  usageStats,
  activityFeed,
  getActiveTeamCount,
  getTotalApiCalls,
} from '@/utils/admin-mock-data'
import { formatTimeAgo } from '@/utils/mock-data'

const quickActions = [
  {
    title: 'Team',
    description: 'Manage members & roles',
    icon: Users,
    to: '/admin/team',
  },
  {
    title: 'Billing',
    description: 'Plans & invoices',
    icon: CreditCard,
    to: '/admin/billing',
  },
  {
    title: 'API Keys',
    description: 'Keys & usage analytics',
    icon: Key,
    to: '/admin/api-keys',
  },
]

const activityIcons: Record<string, typeof Activity> = {
  key: Key,
  user: Users,
  billing: CreditCard,
  settings: Activity,
}

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07 } },
}

const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35 } },
}

const Dashboard = () => {
  const totalCalls = getTotalApiCalls()

  return (
    <motion.div
      className="mx-auto max-w-6xl space-y-8"
      initial="hidden"
      animate="show"
      variants={stagger}
    >
      {/* Welcome */}
      <motion.div variants={fadeUp}>
        <h1 className="text-3xl font-bold text-foreground">
          {organization.name}
        </h1>
        <p className="mt-1 text-muted-foreground">
          Welcome back. Here&apos;s an overview of your account.
        </p>
      </motion.div>

      {/* Stat cards */}
      <motion.div
        className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
        variants={stagger}
      >
        <motion.div variants={fadeUp}>
          <StatCard
            icon={BarChart3}
            label="API Calls (30d)"
            value={totalCalls.toLocaleString()}
            trend="+12% vs last month"
            trendUp
          />
        </motion.div>
        <motion.div variants={fadeUp}>
          <StatCard
            icon={Users}
            label="Active Members"
            value={String(getActiveTeamCount())}
            trend={`of ${organization.seat_limit} seats`}
          />
        </motion.div>
        <motion.div variants={fadeUp}>
          <StatCard
            icon={CreditCard}
            label="Current Plan"
            value={organization.plan.name}
          ></StatCard>
        </motion.div>
        <motion.div variants={fadeUp}>
          <StatCard
            icon={FileText}
            label="Articles Accessed"
            value="8,420"
            trend="+5% this week"
            trendUp
          />
        </motion.div>
      </motion.div>

      {/* Usage chart */}
      <motion.div variants={fadeUp}>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">API Usage — Last 30 Days</CardTitle>
            <CardDescription>
              Total calls across all active keys
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={usageStats}>
                  <defs>
                    <linearGradient id="colorCalls" x1="0" y1="0" x2="0" y2="1">
                      <stop
                        offset="5%"
                        stopColor="hsl(191, 42%, 28%)"
                        stopOpacity={0.3}
                      />
                      <stop
                        offset="95%"
                        stopColor="hsl(191, 42%, 28%)"
                        stopOpacity={0}
                      />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    className="stroke-border"
                  />
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 11 }}
                    className="fill-muted-foreground"
                  />
                  <YAxis
                    tick={{ fontSize: 11 }}
                    className="fill-muted-foreground"
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: 'var(--radius)',
                      fontSize: 12,
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="calls"
                    stroke="hsl(191, 42%, 28%)"
                    strokeWidth={2}
                    fill="url(#colorCalls)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Quick actions + Activity feed */}
      <div className="grid gap-6 lg:grid-cols-5">
        {/* Quick actions */}
        <motion.div className="space-y-4 lg:col-span-2" variants={stagger}>
          <h2 className="font-serif text-lg font-semibold text-foreground">
            Quick Actions
          </h2>
          {quickActions.map((action) => (
            <motion.div key={action.title} variants={fadeUp}>
              <Link href={action.to}>
                <Card className="transition-all hover:shadow-md hover:border-primary/30">
                  <CardContent className="flex items-center gap-4 p-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <action.icon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">
                        {action.title}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {action.description}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        {/* Activity feed */}
        <motion.div className="lg:col-span-3" variants={fadeUp}>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {activityFeed.map((item) => {
                const Icon = activityIcons[item.icon_type] ?? Activity
                return (
                  <div key={item.id} className="flex items-start gap-3">
                    <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground">
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm text-foreground">{item.action}</p>
                      <p className="text-xs text-muted-foreground">
                        {item.actor} · {formatTimeAgo(item.timestamp)}
                      </p>
                    </div>
                  </div>
                )
              })}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  )
}

export default Dashboard
