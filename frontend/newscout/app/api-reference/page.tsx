// app/api-reference/page.tsx

import RedocClient from '@/components/api-docs-mdx/RedocClientContainer'

export default function ApiReferencePage() {
  return (
    <div className="min-h-screen">
      <RedocClient specUrl="http://127.0.0.1:8000/api/schema/" />
    </div>
  )
}
