import PrivacyPageContainer from '@/components/privacy/PrivacyPolicyPageContainer'
import React from 'react'
import { generateMetadata } from "@/utils/title";

export const metadata = generateMetadata("NewScout — Privacy Policy");

const PrivacyPage = () => {
  return (
    <React.Fragment>
      <PrivacyPageContainer />
    </React.Fragment>
  )
} 

export default PrivacyPage
