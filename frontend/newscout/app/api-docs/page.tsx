import MDXClientWrapper from '@/components/api-docs/MDXClientWrapper'

export const metadata = {
  title: 'API Documentation',
  description: "Integrate NewScout's aggregated news into your applications.",
}

export default function ApiDocsPage() {
  return (
      <MDXClientWrapper />
  )
}
