'use client'

import { motion } from 'framer-motion'
import { Sparkles } from 'lucide-react'
import { DestinationCard } from '@/components/home'
import { useTours } from '@/hooks/useTours'
import { fadeUp, scaleIn, staggerContainer, viewportOnce } from '@/lib/motion'

const sectionStagger = staggerContainer(0.12)
const headerItem = fadeUp(0, 16)
const cardItem = scaleIn(0)

interface RelatedToursProps {
  currentSlug: string
  category: string
}

export default function RelatedTours({ currentSlug, category }: RelatedToursProps) {
  const { tours, isLoading } = useTours({ limit: 8, category })
  const related = tours.filter((t) => t.slug !== currentSlug).slice(0, 4)

  if (!isLoading && related.length === 0) return null

  return (
    <motion.section
      variants={sectionStagger}
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
      className="max-w-[1700px] mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 border-t border-neutral-100 dark:border-neutral-800"
    >
      <motion.div variants={headerItem} className="mb-6">
        <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-neutral-400">
          You Might Also Like
        </span>
        <h2 className="mt-3 text-3xl sm:text-4xl font-light tracking-tight text-neutral-900 dark:text-white">
          More trips,
          <span className="block font-bold">worth exploring.</span>
        </h2>
      </motion.div>

      <motion.div
        variants={staggerContainer(0.08)}
        className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6"
      >
        {isLoading
          ? Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="aspect-4/5 rounded-3xl bg-neutral-100 dark:bg-neutral-800 animate-pulse" />
            ))
          : related.map((tour) => (
              <motion.div key={tour.id} variants={cardItem}>
                <DestinationCard tour={tour} />
              </motion.div>
            ))}
      </motion.div>
    </motion.section>
  )
}
