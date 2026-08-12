import Layout from '@/components/Layout'
import ReadingProgressBar from '@/components/ReadingProgressBar'
import { Skeleton } from '@/components/ui/skeleton'

const ArticleDetailSkeleton = () => {
  return (
    <Layout>
      <ReadingProgressBar />
      <div className="container py-8">
        <div className="mx-auto max-w-3xl space-y-6">
          <Skeleton className="h-4 w-24" />
          <div className="flex gap-2">
            <Skeleton className="h-6 w-20 rounded-full" />
            <Skeleton className="h-6 w-16 rounded-full" />
          </div>
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-4/5" />
          <div className="flex gap-4">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-20" />
          </div>
          <Skeleton className="aspect-video w-full rounded-xl" />
          <div className="flex gap-2 border-y border-border py-3">
            <Skeleton className="h-9 w-28" />
            <Skeleton className="h-9 w-24" />
            <Skeleton className="h-9 w-28" />
          </div>
          <div className="space-y-3">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default ArticleDetailSkeleton
