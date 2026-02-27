import React from 'react'
import Feed from '@/components/Feed'

import { generateMetadata } from "@/utils/title";

export const metadata = generateMetadata(
  "NewScout — feed",
);

const page = () => {
  return (
    <div>
      <Feed />
    </div>
  )
}

export default page
