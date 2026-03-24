import PricingContainer from "@/components/pricing/PricingContainer";
import { generateMetadata } from "@/utils/title";
import React from "react";

export const metadata = generateMetadata("NewScout — Pricing");

const PricingPage = () => {
  return (
    <React.Fragment>
      <PricingContainer />
    </React.Fragment>
  );
};

export default PricingPage;
