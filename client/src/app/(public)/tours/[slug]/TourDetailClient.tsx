'use client'

import { Suspense } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowLeft, CalendarDays, Clock, MapPin, Plane, Users } from 'lucide-react'
import Navbar from '@/components/layout/Navbar'
import { TourGallery, BookingWidget, ReviewsSection, RelatedTours } from '@/components/tours'
import { useTourDetail } from '@/hooks/useTourDetail'
import { categoryLabel } from '@/types/tour'
import { fadeUp, staggerContainer } from '@/lib/motion'

const sectionStagger = staggerContainer(0.15)
const item = fadeUp(0, 16)

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function GallerySkeleton() {
  return (
    <div className="flex flex-col gap-3">
      <div className="aspect-4/3 sm:aspect-video w-full rounded-3xl bg-neutral-100 dark:bg-neutral-800 animate-pulse" />
      <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="aspect-square rounded-2xl bg-neutral-100 dark:bg-neutral-800 animate-pulse" />
        ))}
      </div>
    </div>
  )
}

function TourDetailContent() {
  const params = useParams<{ slug: string }>()
  const slug = params.slug
  const { tour, isLoading, error, notFound } = useTourDetail(slug)

  return (
      <main className="min-h-screen bg-white dark:bg-neutral-950">
        {notFound ? (
          <div className="max-w-[1700px] mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-24 text-center">
            <p className="text-xs font-bold uppercase tracking-widest text-neutral-400">404</p>
            <h1 className="mt-3 text-3xl sm:text-4xl font-light tracking-tight text-neutral-900 dark:text-white">
              This tour doesn&apos;t
              <span className="block font-bold">exist anymore.</span>
            </h1>
            <Link
              href="/tours"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-neutral-900 px-6 py-3 text-xs font-bold uppercase tracking-widest text-white hover:bg-black transition-colors dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-100"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Back to all tours
            </Link>
          </div>
        ) : error ? (
          <div className="max-w-[1700px] mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-24 text-center">
            <p className="text-sm text-neutral-500 dark:text-neutral-400">Couldn&apos;t load this tour right now. Please try again shortly.</p>
          </div>
        ) : (
          <>
            <section className="max-w-[1700px] mx-auto px-4 sm:px-6 lg:px-8 pt-10 sm:pt-15 pb-4">
              {isLoading || !tour ? (
                <div className="flex flex-col gap-3">
                  <div className="h-4 w-24 rounded bg-neutral-100 dark:bg-neutral-800 animate-pulse" />
                  <div className="h-10 w-2/3 rounded bg-neutral-100 dark:bg-neutral-800 animate-pulse" />
                  <div className="h-4 w-40 rounded bg-neutral-100 dark:bg-neutral-800 animate-pulse" />
                </div>
              ) : (
                <motion.div variants={sectionStagger} initial="hidden" animate="visible">
                  <motion.div variants={item}>
                    <Link
                      href="/tours"
                      className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors"
                    >
                      <ArrowLeft className="h-3.5 w-3.5" />
                      All Tours
                    </Link>
                  </motion.div>

                  <motion.span
                    variants={item}
                    className="mt-6 flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-neutral-400"
                  >
                    <Plane className="h-3.5 w-3.5" />
                    {categoryLabel(tour.category)}
                  </motion.span>

                  <motion.h1
                    variants={item}
                    className="mt-3 text-4xl sm:text-5xl font-light tracking-tight text-neutral-900 dark:text-white"
                  >
                    {tour.title}
                  </motion.h1>

                  <motion.div variants={item} className="mt-4 flex flex-wrap items-center gap-5 text-sm text-neutral-500 dark:text-neutral-400">
                    <span className="flex items-center gap-1.5">
                      <MapPin className="h-4 w-4 text-neutral-400" />
                      {tour.destination}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Clock className="h-4 w-4 text-neutral-400" />
                      {tour.duration_days} days
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Users className="h-4 w-4 text-neutral-400" />
                      Up to {tour.max_guests} guests
                    </span>
                    <span className="flex items-center gap-1.5">
                      <CalendarDays className="h-4 w-4 text-neutral-400" />
                      {formatDate(tour.start_date)} &ndash; {formatDate(tour.end_date)}
                    </span>
                  </motion.div>
                </motion.div>
              )}
            </section>

            <section className="max-w-[1700px] mx-auto px-4 sm:px-6 lg:px-8 pb-12 sm:pb-16">
              <div className="grid lg:grid-cols-3 gap-10">
                <div className="lg:col-span-2 flex flex-col gap-8">
                  {isLoading || !tour ? (
                    <GallerySkeleton />
                  ) : (
                    <motion.div
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6 }}
                    >
                      <TourGallery images={tour.images} alt={tour.destination} />
                    </motion.div>
                  )}

                  {tour && (
                    <motion.div
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.1 }}
                    >
                      <h2 className="text-xs font-bold uppercase tracking-widest text-neutral-400">
                        About this trip
                      </h2>
                      <p className="mt-3 text-base text-neutral-600 leading-relaxed whitespace-pre-line dark:text-neutral-400">
                        {tour.description}
                      </p>
                    </motion.div>
                  )}
                </div>

                <div className="lg:sticky lg:top-24 lg:self-start">
                  {isLoading || !tour ? (
                    <div className="h-96 rounded-3xl bg-neutral-100 dark:bg-neutral-800 animate-pulse" />
                  ) : (
                    <BookingWidget tour={tour} />
                  )}
                </div>
              </div>
            </section>

            {tour && (
              <>
                <ReviewsSection tourId={tour.id} />
                <RelatedTours currentSlug={tour.slug} category={tour.category} />
              </>
            )}
          </>
        )}
      </main>
  )
}

export default function TourDetailClient() {
  return (
    <>
      <Navbar />
      <Suspense fallback={
        <main className="min-h-screen bg-white dark:bg-neutral-950">
          <section className="max-w-[1700px] mx-auto px-4 sm:px-6 lg:px-8 pt-10 sm:pt-15 pb-4">
            <div className="flex flex-col gap-3">
              <div className="h-4 w-24 rounded bg-neutral-100 dark:bg-neutral-800 animate-pulse" />
              <div className="h-10 w-2/3 rounded bg-neutral-100 dark:bg-neutral-800 animate-pulse" />
              <div className="h-4 w-40 rounded bg-neutral-100 dark:bg-neutral-800 animate-pulse" />
            </div>
          </section>
          <section className="max-w-[1700px] mx-auto px-4 sm:px-6 lg:px-8 pb-12 sm:pb-16">
            <div className="grid lg:grid-cols-3 gap-10">
              <div className="lg:col-span-2">
                <GallerySkeleton />
              </div>
              <div className="h-96 rounded-3xl bg-neutral-100 dark:bg-neutral-800 animate-pulse" />
            </div>
          </section>
        </main>
      }>
        <TourDetailContent />
      </Suspense>
    </>
  )
}
