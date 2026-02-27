'use client'
import { LayoutDashboard, Users, CreditCard, Key } from 'lucide-react'
import { NavLink } from '@/components/NavLink'
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarHeader,
  SidebarSeparator,
} from '@/components/ui/sidebar'
import Link from 'next/link'

const navItems = [
  { title: 'Dashboard', url: '/admin', icon: LayoutDashboard },
  { title: 'Team', url: '/admin/team', icon: Users },
  { title: 'Billing', url: '/admin/billing', icon: CreditCard },
  { title: 'API Keys', url: '/admin/api-keys', icon: Key },
]

const AdminSidebar = () => {
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="px-4 py-5 ">
        <Link href="/admin" className="flex items-center gap-2">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-sidebar-accent">
            <span className="font-serif text-sm font-bold text-sidebar-accent-foreground">
              N
            </span>
          </div>
          <span className="truncate font-serif text-lg font-bold text-sidebar-foreground group-data-[collapsible=icon]:hidden">
            NewScout
          </span>
        </Link>
      </SidebarHeader>

      <SidebarSeparator />

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Admin</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild tooltip={item.title}>
                    <NavLink
                      href={item.url}
                      className="flex items-center gap-2 text-sidebar-foreground/70 hover:text-sidebar-foreground"
                      activeClassName="bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                    >
                      <item.icon className="h-4 w-4 shrink-0" />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}

export default AdminSidebar
