import HomePageContainer from "@/components/HomePageContainer";
import { generateMetadata } from "@/utils/title";

export const metadata = generateMetadata(
  "NewScout — News Aggregation & Discovery Platform",
);

export default function Home() {
  return (
    <div>
      <HomePageContainer />
    </div>
  );
}
