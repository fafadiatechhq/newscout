import Feed from "@/components/Feed";
import { generateMetadata } from "@/utils/title";

export const metadata = generateMetadata("NewScout — Feed");

const FeedPage = () => {
  return (
    <div>
      <Feed />
    </div>
  );
};

export default FeedPage;
