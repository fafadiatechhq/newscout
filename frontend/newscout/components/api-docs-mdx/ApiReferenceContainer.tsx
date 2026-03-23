'use client'

import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'

const RedocStandalone = dynamic(
  () => import('redoc').then((mod) => mod.RedocStandalone),
  { ssr: false },
)

export default function ApiReferenceContainer() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null // 👈 prevents hydration mismatch

  return (
    <div style={{ height: '100vh' }}>
      <RedocStandalone specUrl="http://localhost:8000/api/schema/" />
    </div>
  )
}
