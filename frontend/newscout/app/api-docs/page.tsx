// app/api-docs-mdx/page.tsx
import MDXClientWrapper from '@/components/api-docs-mdx/MDXClientWrapper'

export const metadata = {
  title: 'API Documentation',
  description: "Integrate NewScout's aggregated news into your applications.",
}

export default function Page() {
  return (
      <MDXClientWrapper />

  )
}
