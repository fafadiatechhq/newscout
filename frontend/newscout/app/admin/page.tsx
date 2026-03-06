import React from 'react'
import Dashboard from '@/components/admin/Dashboard'
import AdminLayout from '@/components/admin/AdminLayout'
import { generateMetadata } from "@/utils/title";

export const metadata = generateMetadata("NewScout — Admin");

const AdminPage = () => {
  return (
    <React.Fragment>
      <AdminLayout>
        <Dashboard />
      </AdminLayout>
    </React.Fragment>
  )
}

export default AdminPage
