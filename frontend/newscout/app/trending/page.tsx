import Trending from '@/components/trending/Trending'
import { generateMetadata } from "@/utils/title";

export const metadata = generateMetadata("NewScout — Trending");

const TrendingPage = () => {
  return (
    <div>
        <Trending/>
    </div>
  )
}

export default TrendingPage;