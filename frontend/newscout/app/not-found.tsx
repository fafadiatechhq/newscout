import Layout from '@/components/Layout'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

const NotFound = () => {
  return (
    <Layout>
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <h1 className="mb-4 font-serif text-6xl font-bold text-foreground">
            404
          </h1>
          <p className="mb-6 text-xl text-muted-foreground">
            Oops! Page not found
          </p>
          <Link href="/">
            <Button>Return to Home</Button>
          </Link>
        </div>
      </div>
    </Layout>
  )
}

export default NotFound
