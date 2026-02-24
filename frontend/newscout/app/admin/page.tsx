import React from 'react'
import Dashboard from '@/components/admin/Dashboard'
import AdminLayout from '@/components/admin/AdminLayout'

const Adminpage = () => {
  return (
    <React.Fragment>
      <AdminLayout>
        <Dashboard />
      </AdminLayout>
    </React.Fragment>
  )
}

export default Adminpage
