import Trending from '@/components/trending/Trending'
import { generateMetadata } from "@/utils/title";

export const metadata = generateMetadata(
  "NewScout — Trending",
);

const page = () => {
  return (
    <div>
        <Trending/>
    </div>
  )
}

export default page