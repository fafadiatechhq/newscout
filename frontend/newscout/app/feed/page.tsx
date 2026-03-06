import FeedContainer from "@/components/FeedContainer";
import { generateMetadata } from "@/utils/title";
import React from "react";

export const metadata = generateMetadata("NewScout — Feed");

const FeedPage = () => {
  return (
    <React.Fragment>
      <FeedContainer />
    </React.Fragment>
  );
};

export default FeedPage;
