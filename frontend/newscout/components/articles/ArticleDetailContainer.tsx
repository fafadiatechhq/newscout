'use client'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  ArrowLeft,
  Clock,
  Eye,
  BadgeCheck,
  Share2,
  Bookmark,
  ExternalLink,
  MessageCircle,
  Copy,
  Layers,
} from "lucide-react";
import { FaFacebook, FaTwitter } from "react-icons/fa";
import SourcesModal from "./SourcesModal";
import Layout from "@/components/Layout";
import ReadingProgressBar from "@/components/ReadingProgressBar";
import RelatedArticles from "@/components/articles/RelatedArticles";
import MoreFromSource from "@/components/articles/MoreFromSource";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useReadingHistory } from '@/hooks/use-reading-history'
import { useToast } from '@/hooks/use-toast'
import {
  getArticleById,
  formatTimeAgo,
  getSourceCountForArticle,
  getSourcesForArticle,
} from "@/utils/mock-data";
import CommentSection from "./CommentSection";

const ArticleDetailContainer = () => {
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
      <Layout>
        <ReadingProgressBar />
        <div className="container py-16 text-center">
          <h1 className="font-serif text-3xl font-bold text-foreground">
            Article Not Found
          </h1>
          <p className="mt-2 text-muted-foreground">
            The article you&apos;re looking for doesn&apos;t exist.
          </p>
          <Link href="/">
            <Button className="mt-4">Go Home</Button>
          </Link>
        </div>
      </Layout>
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
      <ReadingProgressBar />
      <div className="container py-8">
        <motion.article
          className="mx-auto max-w-3xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {/* Back link */}
          <Link
            href="/"
            className="mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to feed
          </Link>

          {/* Category and tags */}
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <Badge className="bg-accent text-accent-foreground hover:bg-accent/90">
              {article.category.name}
            </Badge>
            {article.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
          {/* Title */}
          <h1 className="mb-4 font-serif text-xl md:text-3xl font-bold leading-tight text-foreground  lg:text-4xl whitespace-normal">
            {article.title}
          </h1>
          {/* Meta */}
          <div className="mb-6 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1 font-medium text-foreground">
              {article.source.is_verified && (
                <BadgeCheck className="h-4 w-4 text-primary" />
              )}
              {article.source.name}
            </span>
            <span>By {article.author}</span>
            <span className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              {article.reading_time} min read
            </span>
            <span>{formatTimeAgo(article.published_at)}</span>
            <span className="flex items-center gap-1">
              <Eye className="h-4 w-4" />
              {article.views.toLocaleString()} views
            </span>
          </div>

          {/* Inline image */}
          <div className="relative mb-8 overflow-hidden rounded-xl">
            <img
              src={article.image_url}
              alt={article.title}
              className="h-auto w-full object-cover"
            />
          </div>

          {/* Article Actions */}
          <div className="mb-8 flex flex-wrap items-center gap-2 border-b border-t border-border py-3">
            <Button
              variant="outline"
              size="sm"
              className="cursor-pointer gap-2"
            >
              <Bookmark className="h-4 w-4" />
              Bookmark
            </Button>
            {/* Share Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="cursor-pointer gap-2"
                >
                  <Share2 className="h-4 w-4" />
                  Share
                </Button>
              </DropdownMenuTrigger>

              {/* Dropdown Options */}
              <DropdownMenuContent className="bg-card" align="start">
                <DropdownMenuItem onClick={handleCopyLink}>
                  <Copy className="mr-2 h-4 w-4" />
                  Copy Link
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <FaTwitter className="mr-2 h-4 w-4" />
                  Share on X
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <FaFacebook className="mr-2 h-4 w-4" />
                  Share on Facebook
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <MessageCircle className="mr-2 h-4 w-4" />
                  Share on WhatsApp
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <SourcesModal
              sources={articleSources}
              articleTitle={article.title}
              trigger={
                <Button
                  variant="outline"
                  size="sm"
                  className="cursor-pointer gap-2"
                >
                  <Layers className="h-4 w-4" />
                  {sourceCount} {sourceCount === 1 ? 'Source' : 'Sources'}
                </Button>
              }
            />

            <a
              href={article.content_url}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button
                variant="outline"
                size="sm"
                className="cursor-pointer gap-2"
              >
                <ExternalLink className="h-4 w-4" />
                Original
              </Button>
            </a>
          </div>

          {/* Content body */}
          <div className="prose prose-lg max-w-none">
            <p className="text-lg font-medium leading-relaxed text-foreground">
              {article.summary}
            </p>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              This article was originally published by {article.source.name}.
              NewScout aggregates content from verified publishers to provide
              you with a centralized news experience. Click &quot;Original&quot;
              above to read the full article on the publisher&apos;s website.
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
          <CommentSection/>

          {/* Source attribution */}
          <div className="mt-8 rounded-lg bg-surface p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                {article.source.name.charAt(0)}
              </div>
              <div>
                <p className="flex items-center gap-1 font-medium text-foreground">
                  {article.source.name}
                  {article.source.is_verified && (
                    <BadgeCheck className="h-4 w-4 text-primary" />
                  )}
                </p>
                <p className="text-xs text-muted-foreground">
                  Verified Publisher
                </p>
              </div>
            </div>
          </div>
        </motion.article>

        {/* Widgets */}
        <div className="mx-auto max-w-5xl space-y-12 py-12">
          <RelatedArticles article={article} />
          <MoreFromSource article={article} />
        </div>
      </div>
    </Layout>
  )
}

export default ArticleDetailContainer
