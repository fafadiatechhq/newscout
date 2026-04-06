'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { Plus, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
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
import InviteMemberDialog from '@/components/admin/team/InviteMemberDialog'
import {
  teamMembers as initialMembers,
  organization,
  TeamMember,
} from '@/utils/admin-mock-data'
import { toast } from '@/hooks/use-toast'
import { fadeUp } from '@/utils/fade-up'

const roleColors: Record<string, string> = {
  owner: 'bg-primary/10 text-primary border-primary/20',
  admin: 'bg-accent/10 text-accent border-accent/20',
  viewer: 'bg-muted text-muted-foreground border-border',
}

const statusColors: Record<string, string> = {
  active: 'bg-emerald-500/10 text-emerald-700 border-emerald-200',
  pending: 'bg-amber-500/10 text-amber-700 border-amber-200',
}

const TeamContainer = () => {
  const [members, setMembers] = useState<TeamMember[]>(initialMembers)
  const [inviteOpen, setInviteOpen] = useState(false)
  const [removeTarget, setRemoveTarget] = useState<TeamMember | null>(null)

  const activeCount = members.filter((m) => m.status === 'active').length

  const handleRoleChange = (memberId: string, newRole: string) => {
    setMembers((prev) =>
      prev.map((m) =>
        m.id === memberId ? { ...m, role: newRole as TeamMember['role'] } : m,
      ),
    )
    toast({ title: 'Role updated' })
  }

  const handleRemove = () => {
    if (!removeTarget) return
    setMembers((prev) => prev.filter((m) => m.id !== removeTarget.id))
    toast({
      title: 'Member removed',
      description: `${removeTarget.name} has been removed.`,
    })
    setRemoveTarget(null)
  }

  return (
    <motion.div
      className="mx-auto max-w-5xl space-y-6"
      initial="hidden"
      animate="show"
      variants={{ show: { transition: { staggerChildren: 0.07 } } }}
    >
      {/* Header */}
      <motion.div
        className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
        variants={fadeUp}
      >
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Team Management
          </h1>
          <p className="mt-1 text-muted-foreground">
            {activeCount} of {organization.seat_limit} seats used
          </p>
        </div>
        <Button onClick={() => setInviteOpen(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Invite Member
        </Button>
      </motion.div>

      {/* Table */}
      <motion.div variants={fadeUp}>
        <Card>
          <CardContent className="overflow-x-auto p-0">
            <Table className="min-w-160">
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead className="w-12" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {members.map((member) => (
                  <TableRow key={member.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                          {member.avatar_initials}
                        </div>
                        {member.name}
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {member.email}
                    </TableCell>
                    <TableCell>
                      {member.role === 'owner' ? (
                        <Badge variant="outline" className={roleColors.owner}>
                          Owner
                        </Badge>
                      ) : (
                        <Select
                          value={member.role}
                          onValueChange={(val) =>
                            handleRoleChange(member.id, val)
                          }
                        >
                          <SelectTrigger className="h-7 w-24 text-xs">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="backdrop-blur-md">
                            <SelectItem value="admin">Admin</SelectItem>
                            <SelectItem value="viewer">Viewer</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={statusColors[member.status]}
                      >
                        {member.status === 'active' ? 'Active' : 'Pending'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {new Date(member.joined_at).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </TableCell>
                    <TableCell>
                      {member.role !== 'owner' && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-destructive"
                          onClick={() => setRemoveTarget(member)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </motion.div>

      <InviteMemberDialog open={inviteOpen} onOpenChange={setInviteOpen} />

      <AlertDialog
        open={!!removeTarget}
        onOpenChange={(open) => !open && setRemoveTarget(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove team member?</AlertDialogTitle>
            <AlertDialogDescription>
              {removeTarget?.name} will lose access to the organization
              immediately. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleRemove}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </motion.div>
  )
}

export default TeamContainer
