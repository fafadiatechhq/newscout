import Trending from '@/components/trending/Trending'
import { generateMetadata } from "@/utils/title";
import React from 'react';

export const metadata = generateMetadata("NewScout — Trending");

const TrendingPage = () => {
  return (
    <React.Fragment>
        <Trending/>
    </React.Fragment>
  )
}

export default TrendingPage;