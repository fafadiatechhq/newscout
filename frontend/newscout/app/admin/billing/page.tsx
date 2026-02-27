import AdminLayout from '@/components/admin/AdminLayout'
import Billing from '@/components/admin/Billing'
import React from 'react'

const AdminBillingPage = () => {
  return (
    <React.Fragment>
      <AdminLayout>
        <Billing />
      </AdminLayout>
    </React.Fragment>
  )
}

export default AdminBillingPage
