import BillingContainer from "@/components/admin/BillingContainer";
import AdminLayout from "@/components/admin/AdminLayout";
import { generateMetadata } from "@/utils/title";

export const metadata = generateMetadata("NewScout — Admin Billing");

const AdminBillingPage = () => {
  return (
    <AdminLayout>
      <BillingContainer />
    </AdminLayout>
  );
};

export default AdminBillingPage;
