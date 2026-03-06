import Feed from "@/components/FeedContainer";
import { generateMetadata } from "@/utils/title";
import React from "react";

export const metadata = generateMetadata("NewScout — Feed");

const FeedPage = () => {
  return (
    <React.Fragment>
      <Feed />
    </React.Fragment>
  );
};

export default FeedPage;
