import AdminLayout from "@/components/admin/AdminLayout"
import ApiKeysContainer from "@/components/admin/api-keys/ApiKeysContainer"
import React from "react"
const ApiKeysPage = () => {
  return (
    <React.Fragment>
      <AdminLayout>
        <ApiKeysContainer />
      </AdminLayout>
    </React.Fragment>
  )
}

export default ApiKeysPage