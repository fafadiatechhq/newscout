'use client'

import dynamic from 'next/dynamic'

const RedocStandalone = dynamic(
  () => import('redoc').then((mod) => mod.RedocStandalone),
  { ssr: false },
)

type Props = {
  specUrl: string
}

export default function RedocClientContainer({ specUrl }: Props) {
  return (
    <div className="w-full">
      <RedocStandalone
        specUrl={specUrl}
        options={{
          scrollYOffset: 80,
          hideDownloadButton: false,
          theme: {
            colors: {
              primary: {
                main: '#6366f1',
              },
              text: {
                primary: '#0f172a',
              },
            },
            typography: {
              fontSize: '14px',
              fontFamily: 'Inter, sans-serif',
              headings: {
                fontFamily: 'Inter, sans-serif',
                fontWeight: '600',
              },
            },
            sidebar: {
              backgroundColor: '#020617',
              textColor: '#e2e8f0',
            },
          },
        }}
      />
    </div>
  )
}
