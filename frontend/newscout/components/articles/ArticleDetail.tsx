'use client'
import { motion } from 'framer-motion'
import Layout from '@/components/Layout'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useEffect } from 'react'
import MoreFromSource from '@/components/articles/MoreFromSource'
import { Button } from '@/components/ui/button'
import { useReadingHistory } from '@/hooks/use-reading-history'
import { useToast } from '@/hooks/use-toast'
import {
  getArticleById,
  getSourceCountForArticle,
  getSourcesForArticle,
} from '@/utils/mock-data'

const ArticleDetail = () => {
  const { id } = useParams<{ id: string }>()
  const article = getArticleById(id || '')
  const { toast } = useToast()
  const { trackView } = useReadingHistory()

  useEffect(() => {
    if (article) {
      trackView(article.id, article.category.slug)
    }
  }, [article, trackView])
  if (!article) {
    return (
      <div>
        <Layout>
          <div className="container py-16 text-center">
            <h1 className="font-serif text-3xl font-bold text-foreground">
              Article Not Found
            </h1>
            <p className="mt-2 text-muted-foreground">
              The article you're looking for doesn't exist.
            </p>
            <Link href="/">
              <Button className="mt-4">Go Home</Button>
            </Link>
          </div>
        </Layout>
      </div>
    )
  }
  const sourceCount = getSourceCountForArticle(article.id)
  const articleSources = getSourcesForArticle(article.id)

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href)
    toast({
      title: 'Link copied!',
      description: 'Article link copied to clipboard.',
    })
  }

  return (
    <Layout>
      <div className="container py-8">
        <motion.article
          className="mx-auto max-w-3xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {/* Inline image */}
          <div className="mb-8 overflow-hidden rounded-xl">
            <img
              src={article.image_url}
              alt={article.title}
              className="h-auto w-full object-cover"
            />
          </div>
          {/* Content body */}
          <div className="prose prose-lg max-w-none">
            <p className="text-lg font-medium leading-relaxed text-foreground">
              {article.summary}
            </p>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              This article was originally published by {article.source.name}.
              NewScout aggregates content from verified publishers to provide
              you with a centralized news experience. Click "Original" above to
              read the full article on the publisher's website.
            </p>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              The global landscape continues to evolve rapidly, with
              developments in this area having far-reaching implications for
              industries, governments, and individuals worldwide. Experts
              suggest that the trends highlighted in this piece will shape
              policy discussions and investment decisions throughout 2026 and
              beyond.
            </p>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              Stakeholders across sectors are closely monitoring these
              developments, as the outcomes could redefine competitive dynamics
              and create new opportunities for innovation and growth. Industry
              analysts recommend staying informed and adapting strategies
              accordingly.
            </p>
          </div>
        </motion.article>
        <div className="mx-auto max-w-5xl space-y-12 py-12">
          <MoreFromSource article={article} />
        </div>
      </div>
    </Layout>
  )
}

export default ArticleDetail
