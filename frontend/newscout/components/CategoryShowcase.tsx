'use client';

import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { Category, categories } from '@/utils/mock-data'
import Link from 'next/link'
import { useEffect, useState } from 'react'


const CategoryShowcase = () => {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("http://localhost:8000/api/v1/categories/");
        const data = await res.json();
        setCategories(data.results);
      } catch (err) {
        console.error("Error fetching categories:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) return <p className="p-8">Loading...</p>;

  if (!categories || categories.length === 0) {
    return (
      <section className="border-b border-border bg-surface py-10">
        <div className="container">
          <h2 className="mb-6 font-serif text-xl md:text-2xl font-bold text-foreground">
            Popular Categories
          </h2>
          <div className="rounded-xl border border-dashed border-border bg-card p-8 text-center">
            <p className="font-serif text-lg font-bold text-foreground">
              No categories available
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              Please check back later for popular categories.
            </p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="border-b border-border bg-surface">
      <div className="container py-8">
        <h2 className="mb-6 font-serif text-xl md:text-2xl font-bold text-foreground">
          Popular Categories
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {categories.map((cat, i) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
            >
              <Link
                href={`/feed?category=${cat.slug}`}
                className="group flex flex-col justify-between rounded-xl border border-border bg-card p-5 transition-all hover:border-primary/40 hover:shadow-md"
              >
                <div>
                  <h3 className="mb-1 font-serif text-lg font-bold text-card-foreground group-hover:text-primary">
                    {cat.name}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {cat.description}
                  </p>
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <span className="rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-secondary-foreground">
                    {cat.article_count?.toLocaleString() || 0} articles
                  </span>
                  <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:translate-x-1 group-hover:text-primary" />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default CategoryShowcase
