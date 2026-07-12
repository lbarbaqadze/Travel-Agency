'use client'

import { Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import Navbar from '@/components/layout/Navbar'
import { DestinationCard } from '@/components/home'
import { ToursPopularHero, ToursCategoryFilter, ToursPagination, ToursExperienceBento } from '@/components/tours'
import { useTours } from '@/hooks/useTours'
import { scaleIn, staggerContainer } from '@/lib/motion'

const cardItem = scaleIn(0)

function CardSkeleton() {
  return (
    <div className="flex flex-col rounded-3xl overflow-hidden border border-neutral-100 bg-white dark:border-neutral-800 dark:bg-neutral-900">
      <div className="aspect-4/5 w-full bg-neutral-100 dark:bg-neutral-800 animate-pulse" />
      <div className="flex flex-col gap-2 p-4">
        <div className="h-4 w-2/3 rounded bg-neutral-100 dark:bg-neutral-800 animate-pulse" />
        <div className="h-3 w-full rounded bg-neutral-100 dark:bg-neutral-800 animate-pulse" />
        <div className="h-3 w-4/5 rounded bg-neutral-100 dark:bg-neutral-800 animate-pulse" />
      </div>
    </div>
  )
}

function ToursContent() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const destination = searchParams.get('destination') ?? ''
  const category = searchParams.get('category') ?? ''
  const maxPrice = searchParams.get('maxPrice') ?? ''
  const page = Number(searchParams.get('page') ?? '1') || 1

  const { tours, isLoading, error, pagination } = useTours({
    limit: 12,
    destination: destination || undefined,
    category: category || undefined,
    maxPrice: maxPrice ? Number(maxPrice) : undefined,
    page,
  })

  function handlePageChange(nextPage: number) {
    const params = new URLSearchParams(searchParams.toString())
    if (nextPage > 1) params.set('page', String(nextPage))
    else params.delete('page')
    router.push(`/tours${params.toString() ? `?${params.toString()}` : ''}`)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <main className="min-h-screen bg-white dark:bg-neutral-950">
      <ToursPopularHero />

      <section
        id="tours-grid"
        className="max-w-[1700px] mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-10 pb-4 sm:pb-6"
      >
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-6"
        >
          <ToursCategoryFilter category={category} />
        </motion.div>

        {error ? (
          <div className="rounded-3xl border border-dashed border-neutral-200 bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-900/50 p-12 text-center">
            <p className="text-sm text-neutral-500">
              Couldn&apos;t load tours right now. Please try again shortly.
            </p>
          </div>
        ) : (
          <>
            {!isLoading && pagination && (
              <p className="mb-6 text-xs font-semibold uppercase tracking-widest text-neutral-400">
                {pagination.total} {pagination.total === 1 ? 'tour' : 'tours'} found
              </p>
            )}

            <motion.div
              variants={staggerContainer(0.06)}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6"
            >
              {isLoading
                ? Array.from({ length: 12 }).map((_, i) => <CardSkeleton key={i} />)
                : tours.map((tour) => (
                    <motion.div key={tour.id} variants={cardItem}>
                      <DestinationCard tour={tour} />
                    </motion.div>
                  ))}
            </motion.div>

            {!isLoading && tours.length === 0 && (
              <div className="rounded-3xl border border-dashed border-neutral-200 bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-900/50 p-12 text-center">
                <p className="text-sm text-neutral-500">
                  No tours match your filters. Try adjusting your search.
                </p>
              </div>
            )}

            {!isLoading && pagination && (
              <ToursPagination pagination={pagination} onPageChange={handlePageChange} />
            )}
          </>
        )}
      </section>

      <ToursExperienceBento />
    </main>
  )
}

export default function ToursPage() {
  return (
    <>
      <Navbar />
      <Suspense fallback={null}>
        <ToursContent />
      </Suspense>
    </>
  )
}
