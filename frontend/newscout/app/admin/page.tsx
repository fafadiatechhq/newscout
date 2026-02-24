import React from 'react'
import Dashboard from '@/components/admin/Dashboard'
import AdminLayout from '@/components/admin/AdminLayout'

const page = () => {
  return (
    <div>
      <AdminLayout>
        <Dashboard />
      </AdminLayout>
    </div>
  )
}

export default page
