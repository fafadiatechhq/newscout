import AdminLayout from "@/components/admin/AdminLayout"
import ApiKeys from "@/components/admin/ApiKeysContainer"
import React from "react"
const Apipage = () => {
  return (
    <React.Fragment>
      <AdminLayout>
        <ApiKeys />
      </AdminLayout>
    </React.Fragment>
  )
}

export default Apipage