'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Bookmark, BookmarkX, Trash2, ArrowRight } from 'lucide-react'
import Layout from '@/components/Layout'
import ArticleCard from '@/components/ArticleCard'
import { Button } from '@/components/ui/button'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { getArticleById } from '@/utils/mock-data'
import { useToast } from '@/hooks/use-toast'
import type { Article } from '@/utils/mock-data'

const BOOKMARKS_KEY = 'newscout-bookmarks'
const DEFAULT_BOOKMARKS = ['a1', 'a3', 'a5', 'a7', 'a9', 'a11']

function getBookmarkedIds(): string[] {
  try {
    const stored = localStorage.getItem(BOOKMARKS_KEY)
    if (stored) return JSON.parse(stored)
    // Seed with defaults on first visit
    localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(DEFAULT_BOOKMARKS))
    return DEFAULT_BOOKMARKS
  } catch {
    return DEFAULT_BOOKMARKS
  }
}

const BookmarksContainer = () => {
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>(getBookmarkedIds)
  const [articles, setArticles] = useState<Article[]>([])
  const [removeTarget, setRemoveTarget] = useState<string | null>(null)
  const [showClearAll, setShowClearAll] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    const resolved = bookmarkedIds
      .map((id) => getArticleById(id))
      .filter(Boolean) as Article[]
    setArticles(resolved)
  }, [bookmarkedIds])

  const removeBookmark = (articleId: string) => {
    const updated = bookmarkedIds.filter((id) => id !== articleId)
    setBookmarkedIds(updated)
    localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(updated))
    setRemoveTarget(null)
    toast({ title: 'Removed', description: 'Article removed from bookmarks.' })
  }

  const clearAll = () => {
    setBookmarkedIds([])
    localStorage.setItem(BOOKMARKS_KEY, JSON.stringify([]))
    setShowClearAll(false)
    toast({ title: 'Cleared', description: 'All bookmarks have been cleared.' })
  }

  return (
    <Layout>
      {/* Hero */}
      <section className="bg-primary py-12 text-primary-foreground">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-3"
          >
            <Bookmark className="h-8 w-8" />
            <div>
              <h1 className="font-serif text-3xl font-bold md:text-4xl">
                Bookmarks
              </h1>
              <p className="mt-1 text-primary-foreground/70">
                Your saved articles in one place
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <section className="py-10">
        <div className="container">
          {articles.length > 0 ? (
            <>
              <div className="mb-6 flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  {articles.length} saved{' '}
                  {articles.length === 1 ? 'article' : 'articles'}
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowClearAll(true)}
                  className="gap-1.5 text-destructive hover:bg-accent hover:text-accent-foreground"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Clear all
                </Button>
              </div>

              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {articles.map((article, i) => (
                  <motion.div
                    key={article.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="group relative"
                  >
                    <ArticleCard article={article} />
                    <button
                      onClick={() => setRemoveTarget(article.id)}
                      className="absolute right-13 top-3.5 z-10 rounded-full bg-background/80 p-1.5 text-muted-foreground opacity-0 shadow-sm backdrop-blur transition-all hover:bg-background hover:text-foreground group-hover:opacity-100"
                      aria-label="Remove bookmark"
                    >
                      <BookmarkX className="h-5 w-5" />
                    </button>
                  </motion.div>
                ))}
              </div>
            </>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center py-20 text-center"
            >
              <div className="mb-4 rounded-full bg-muted p-4">
                <Bookmark className="h-8 w-8 text-muted-foreground" />
              </div>
              <h2 className="font-serif text-xl font-semibold text-foreground">
                No bookmarks yet
              </h2>
              <p className="mt-2 max-w-sm text-sm text-muted-foreground">
                Save articles you want to read later by tapping the bookmark
                icon on any article.
              </p>
              <div className="mt-6 flex gap-3">
                <Button asChild>
                  <Link href="/feed">
                    Browse Feed
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/trending">Trending</Link>
                </Button>
              </div>
            </motion.div>
          )}
        </div>
      </section>
      {/* Remove single bookmark dialog */}
      <AlertDialog
        open={!!removeTarget}
        onOpenChange={(open) => !open && setRemoveTarget(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove bookmark?</AlertDialogTitle>
            <AlertDialogDescription>
              This article will be removed from your bookmarks. You can always
              bookmark it again later.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => removeTarget && removeBookmark(removeTarget)}
            >
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Clear all dialog */}
      <AlertDialog open={showClearAll} onOpenChange={setShowClearAll}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Clear all bookmarks?</AlertDialogTitle>
            <AlertDialogDescription>
              This will remove all {articles.length} saved articles from your
              bookmarks. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={clearAll}
            >
              Clear all
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Layout>
  )
}

export default BookmarksContainer
