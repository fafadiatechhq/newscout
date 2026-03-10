import ApiDocsContainer from '@/components/api-docs/ApiDocsContainer'
import { generateMetadata } from '@/utils/title'
import React from 'react'

export const metadata = generateMetadata('NewScout — Api-Docs')
const ApiDocspage = () => {
  return (
    <React.Fragment>
      <ApiDocsContainer />
    </React.Fragment>
  )
}
