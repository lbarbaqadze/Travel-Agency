'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { useTours } from '@/hooks/useTours'
import { fadeUp, scaleIn, staggerContainer, viewportOnce } from '@/lib/motion'
import DestinationCard from './DestinationCard'

const sectionStagger = staggerContainer(0.15)
const gridStagger = staggerContainer(0.08)
const headerItem = fadeUp(0, 16)
const cardItem = scaleIn(0)

function CardSkeleton() {
  return (
    <div className="flex flex-col rounded-3xl overflow-hidden border border-neutral-100 bg-white dark:border-neutral-800 dark:bg-neutral-900">
      <div className="aspect-4/5 w-full bg-neutral-100 animate-pulse dark:bg-neutral-800" />
      <div className="flex flex-col gap-2 p-4">
        <div className="h-4 w-2/3 rounded bg-neutral-100 animate-pulse dark:bg-neutral-800" />
        <div className="h-3 w-full rounded bg-neutral-100 animate-pulse dark:bg-neutral-800" />
        <div className="h-3 w-4/5 rounded bg-neutral-100 animate-pulse dark:bg-neutral-800" />
      </div>
    </div>
  )
}

export default function PopularDestinations() {
  const { tours, isLoading, error } = useTours({ limit: 8 })
  const [inView, setInView] = useState(false)

  return (
    <motion.section
      id="destinations"
      variants={sectionStagger}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      onViewportEnter={() => setInView(true)}
      viewport={viewportOnce}
      className="max-w-[1700px] mx-auto px-4 sm:px-6 lg:px-8 py-20"
    >
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-10">
        <div>
          <motion.span
            variants={headerItem}
            className="block text-xs font-bold uppercase tracking-widest text-neutral-400"
          >
            Popular Destinations
          </motion.span>
          <motion.h2
            variants={headerItem}
            className="mt-3 text-3xl sm:text-4xl font-light tracking-tight text-neutral-900 dark:text-white"
          >
            Curated trips,
            <span className="block font-bold">picked just for you.</span>
          </motion.h2>
        </div>

        <motion.div variants={headerItem}>
          <Link
            href="/tours"
            className="group flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-neutral-900 shrink-0 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2 dark:text-white dark:focus-visible:ring-white"
          >
            View all tours
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
          </Link>
        </motion.div>
      </div>

      {error ? (
        <div className="rounded-3xl border border-dashed border-neutral-200 bg-neutral-50 p-12 text-center dark:border-neutral-700 dark:bg-neutral-900/50">
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            Couldn&apos;t load destinations right now. Please try again shortly.
          </p>
        </div>
      ) : (
        <motion.div
          key={isLoading ? 'loading' : tours.map((t) => t.id).join('-')}
          variants={gridStagger}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6"
        >
          {isLoading
            ? Array.from({ length: 8 }).map((_, i) => (
                <motion.div key={i} variants={cardItem}>
                  <CardSkeleton />
                </motion.div>
              ))
            : tours.map((tour) => (
                <motion.div key={tour.id} variants={cardItem}>
                  <DestinationCard tour={tour} />
                </motion.div>
              ))}
        </motion.div>
      )}

      {!isLoading && !error && tours.length === 0 && (
        <div className="rounded-3xl border border-dashed border-neutral-200 bg-neutral-50 p-12 text-center dark:border-neutral-700 dark:bg-neutral-900/50">
          <p className="text-sm text-neutral-500 dark:text-neutral-400">No tours available yet. Check back soon.</p>
        </div>
      )}
    </motion.section>
  )
}
