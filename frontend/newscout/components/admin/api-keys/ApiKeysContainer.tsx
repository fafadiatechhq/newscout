'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { Plus, Trash2, Shield } from 'lucide-react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import GenerateKeyDialog from '@/components/admin/api-keys/GenerateKeyDialog'
import { toast } from '@/hooks/use-toast'
import { fadeUp } from '@/utils/fade-up'
import { stagger } from '@/utils/stagger'

interface ApiKey {
  id: string
  name: string
  key_masked: string
  full_key: string
  created_at: string
  last_used: string | null
  status: 'active' | 'revoked'
  created_by: string
}

const ApiKeysContainer = () => {
  const [keys, setKeys] = useState<ApiKey[]>([])
  const [generateOpen, setGenerateOpen] = useState(false)
  const [revokeTarget, setRevokeTarget] = useState<ApiKey | null>(null)
  const [selectedKey, setSelectedKey] = useState<string | null>(null)
  const rateLimit = {
    used: 1250,
    limit: 10000,
  }
  const usagePercent = Math.round((rateLimit.used / rateLimit.limit) * 100)
  const handleRevoke = () => {
    if (!revokeTarget) return
    setKeys((prev) =>
      prev.map((k) =>
        k.id === revokeTarget.id ? { ...k, status: 'revoked' as const } : k,
      ),
    )
    toast({
      title: 'Key revoked',
      description: `${revokeTarget.name} has been revoked.`,
    })
    setRevokeTarget(null)
  }

  const chartData = [
    { date: 'Mar 1', calls: 120 },
    { date: 'Mar 2', calls: 300 },
    { date: 'Mar 3', calls: 220 },
    { date: 'Mar 4', calls: 450 },
    { date: 'Mar 5', calls: 380 },
  ]
  return (
    <motion.div
      className="mx-auto md:max-w-5xl space-y-8"
      initial="hidden"
      animate="show"
      variants={stagger}
    >
      {/* Header */}
      <motion.div
        className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
        variants={fadeUp}
      >
        <div>
          <h1 className="text-3xl font-bold text-foreground ">
            API Keys & Usage
          </h1>
          <p className="mt-1 text-muted-foreground">
            Generate, manage, and monitor your API keys.
          </p>
        </div>
        <Button
          onClick={() => setGenerateOpen(true)}
          className="gap-2 cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          Generate New Key
        </Button>
      </motion.div>

      {/* Rate limit */}
      <motion.div variants={fadeUp}>
        <Card>
          <CardContent className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:gap-6">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Shield className="h-5 w-5" />
            </div>
            <div className="flex-1 space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium text-foreground">
                  Daily Rate Limit
                </span>
                <span className="text-muted-foreground">
                  {rateLimit.used.toLocaleString()} /{' '}
                  {rateLimit.limit.toLocaleString()} requests
                </span>
              </div>
              <Progress value={usagePercent} className="h-2" />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Keys table */}
      <motion.div variants={fadeUp}>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Your Keys</CardTitle>
          </CardHeader>
          <CardContent className="overflow-x-auto p-1">
            <Table className="w-full table-fixed ">
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Key</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Last Used</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-12" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {keys.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="text-center text-muted-foreground"
                    >
                      No API keys generated yet
                    </TableCell>
                  </TableRow>
                ) : (
                  keys.map((apiKey) => (
                    <TableRow
                      key={apiKey.id}
                      className={
                        selectedKey === apiKey.id
                          ? 'bg-muted/50'
                          : 'cursor-pointer'
                      }
                      onClick={() =>
                        apiKey.status === 'active' && setSelectedKey(apiKey.id)
                      }
                    >
                      <TableCell className="font-medium">
                        {apiKey.name}
                      </TableCell>

                      <TableCell>
                        <code className="rounded bg-muted py-0.5 text-xs font-mono">
                          {apiKey.key_masked}
                        </code>
                      </TableCell>

                      <TableCell className="text-sm text-muted-foreground">
                        {new Date(apiKey.created_at).toLocaleDateString(
                          'en-US',
                          {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          },
                        )}
                      </TableCell>

                      <TableCell className="text-sm text-muted-foreground">
                        {apiKey.last_used
                          ? new Date(apiKey.last_used).toLocaleDateString(
                              'en-US',
                              {
                                month: 'short',
                                day: 'numeric',
                              },
                            )
                          : 'Never'}
                      </TableCell>

                      <TableCell>
                        <Badge
                          variant="outline"
                          className={
                            apiKey.status === 'active'
                              ? 'bg-emerald-500/10 text-emerald-700 border-emerald-200'
                              : 'bg-muted text-muted-foreground border-border'
                          }
                        >
                          {apiKey.status === 'active' ? 'Active' : 'Revoked'}
                        </Badge>
                      </TableCell>

                      <TableCell>
                        {apiKey.status === 'active' && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="w-8 h-8 text-muted-foreground hover:text-secondary cursor-pointer"
                            onClick={(e) => {
                              e.stopPropagation()
                              setRevokeTarget(apiKey)
                            }}
                          >
                            <Trash2 className="h-4 w-4 " />
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </motion.div>

      {/* Usage chart */}
      {chartData.length > 0 && (
        <motion.div variants={fadeUp}>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">
                Usage — {keys.find((k) => k.id === selectedKey)?.name}
              </CardTitle>
              <CardDescription>
                Requests per day over the last 14 days
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
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
                    <Bar
                      dataKey="calls"
                      fill="hsl(191, 42%, 28%)"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      <GenerateKeyDialog
        open={generateOpen}
        onOpenChange={setGenerateOpen}
        onKeyCreated={(newKey) => {
          setKeys((prev) => [newKey, ...prev])
          setSelectedKey(newKey.id)
        }}
      />

      <AlertDialog
        open={!!revokeTarget}
        onOpenChange={(open) => !open && setRevokeTarget(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Revoke API key?</AlertDialogTitle>
            <AlertDialogDescription>
              "{revokeTarget?.name}" will stop working immediately. Any
              integrations using this key will break.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleRevoke}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Revoke Key
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </motion.div>
  )
}

export default ApiKeysContainer
