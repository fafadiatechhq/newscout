import TermsPageContainer from "@/components/TermsPageContainer/TermsPageContainer";
import { generateMetadata } from "@/utils/title";
import React from "react";

export const metadata = generateMetadata("NewScout — Terms of Service");

const TermsPage = () => {
  return (
    <React.Fragment>
      <TermsPageContainer />
    </React.Fragment>
  );
};

export default TermsPage;
