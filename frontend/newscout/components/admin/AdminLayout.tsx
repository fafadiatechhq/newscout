'use client'

import Link from 'next/link'
import {
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
} from '@/components/ui/sidebar'
import AdminSidebar from './AdminSidebar'
import BackToTop from '@/components/BackToTop'
import { currentUser, organization } from '@/utils/admin-mock-data'
import { ArrowLeft } from 'lucide-react'
import { cn } from '@/utils/utils'

function AdminLayoutContent({ children }: { children: React.ReactNode }) {
  const { open } = useSidebar()

  return (
    <div className="flex min-h-screen w-full ">
      <AdminSidebar />
      {/* Content wrapper */}
      <div
        className={cn(
          'flex flex-1 flex-col transition-all duration-300',
          open ? 'md:ml-38' : 'md:ml-18',
        )}
      >
        {/* Top bar */}
        <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-border bg-background/95 px-4 backdrop-blur supports-backdrop-filter:bg-background/60">
          <SidebarTrigger />

          <Link
            href="/"
            className="flex items-center gap-1 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-3 w-3" />
            Back to site
          </Link>

          <div className="ml-auto flex items-center gap-3">
            <span className="text-xs text-muted-foreground">
              {organization.name}
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
              {currentUser.avatar_initials}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto p-6">{children}</main>
        <BackToTop />
      </div>
    </div>
  )
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SidebarProvider>
      <AdminLayoutContent>{children}</AdminLayoutContent>
    </SidebarProvider>
  )
}
