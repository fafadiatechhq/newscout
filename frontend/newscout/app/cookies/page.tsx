
import CookiesPolicyContainer from "@/components/cookies/CookiePolicyContainer";
import { generateMetadata } from "@/utils/title";
import React from "react";

export const metadata = generateMetadata("NewScout — cookies");

const CookiesPage = () => {
  return (
    <React.Fragment>
      <CookiesPolicyContainer />
    </React.Fragment>
  );
};

export default CookiesPage;
