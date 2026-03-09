
import CookiePageContainer from "@/components/cookies/CookiePolicyPageContainer";
import { generateMetadata } from "@/utils/title";
import React from "react";

export const metadata = generateMetadata("NewScout — cookie-policy");

const CookiePolicyPage = () => {
  return (
    <React.Fragment>
      <CookiePageContainer />
    </React.Fragment>
  );
};

export default CookiePolicyPage;
