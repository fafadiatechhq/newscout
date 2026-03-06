import AdminLayout from "@/components/admin/AdminLayout";
import TeamContainer from "@/components/admin/team/TeamContainer";
import { generateMetadata } from "@/utils/title";

export const metadata = generateMetadata("NewScout — Admin Team");

const AdminTeamPage = () => {
  return (
    <AdminLayout>
      <TeamContainer />
    </AdminLayout>
  );
};

export default AdminTeamPage;
