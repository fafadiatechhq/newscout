import AdminLayout from "@/components/admin/AdminLayout";
import TeamContainer from "@/components/admin/team/TeamContainer";
import { generateMetadata } from "@/utils/title";
import React from "react";

export const metadata = generateMetadata("NewScout — Admin Team");

const AdminTeamPage = () => {
  return (
    <React.Fragment>
      <AdminLayout>
        <TeamContainer />
      </AdminLayout>
    </React.Fragment>
  );
};

export default AdminTeamPage;
