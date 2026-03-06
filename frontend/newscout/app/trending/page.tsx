import TrendingContainer from "@/components/trending/TrendingContainer";
import { generateMetadata } from "@/utils/title";
import React from "react";

export const metadata = generateMetadata("NewScout — Trending");

const TrendingPage = () => {
  return (
    <React.Fragment>
      <TrendingContainer />
    </React.Fragment>
  );
};

export default TrendingPage;
