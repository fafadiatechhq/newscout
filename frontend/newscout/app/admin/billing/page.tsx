import Billing from "@/components/admin/Billing";
import AdminLayout from "@/components/admin/AdminLayout";
import { generateMetadata } from "@/utils/title";

export const metadata = generateMetadata("NewScout — Admin Billing");

const AdminBillingPage = () => {
  return (
    <>
      <AdminLayout>
        <Billing />
      </AdminLayout>
    </>
  );
};

export default AdminBillingPage
