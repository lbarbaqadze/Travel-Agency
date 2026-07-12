'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRight, Check, Headphones, ShieldCheck, Sparkles, X } from 'lucide-react'
import { fadeUp, staggerContainer, viewportOnce } from '@/lib/motion'

function cld(publicId: string) {
  return `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/f_auto,q_auto/${publicId}`
}

const SHOWCASE_IMAGE = cld('michael-evans-DMM06ib0VRs-unsplash_dwjhak')

const highlights = [
  {
    icon: Sparkles,
    title: 'Hand-picked destinations',
    description: 'Every tour is curated for quality, value, and unforgettable experiences.',
  },
  {
    icon: ShieldCheck,
    title: 'Secure & transparent',
    description: 'Clear pricing, instant confirmation, and safe booking from start to finish.',
  },
  {
    icon: Headphones,
    title: 'Support when you need it',
    description: 'Real help before, during, and after your trip — not just a confirmation email.',
  },
]

const headerItem = fadeUp(0, 16)

type ShowcaseModalProps = {
  isOpen: boolean
  onClose: () => void
}

function ShowcaseModal({ isOpen, onClose }: ShowcaseModalProps) {
  useEffect(() => {
    if (!isOpen) return
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [isOpen, onClose])

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4 sm:p-6">
          <motion.button
            type="button"
            aria-label="Close modal backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-neutral-900/55 backdrop-blur-sm dark:bg-black/70"
            onClick={onClose}
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="showcase-modal-title"
            initial={{ opacity: 0, y: 20, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.97 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="relative flex max-h-[90vh] w-full max-w-lg flex-col overflow-hidden rounded-3xl bg-white shadow-2xl  dark:bg-neutral-950"
          >
            <div className="relative h-44 shrink-0 sm:h-52">
              <Image
                src={SHOWCASE_IMAGE}
                alt="Alpine destination"
                fill
                sizes="(max-width: 512px) 100vw, 512px"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent" />
              <button
                type="button"
                onClick={onClose}
                aria-label="Close"
                className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-neutral-700 backdrop-blur-sm transition-colors hover:bg-white dark:bg-neutral-900/90 dark:text-white dark:hover:bg-neutral-900"
              >
                <X className="h-4 w-4" />
              </button>
              <div className="absolute bottom-4 left-5 right-5">
                <span className="text-[10px] font-bold uppercase tracking-widest text-white/70">
                  Info Voyager
                </span>
                <h2 id="showcase-modal-title" className="mt-1 text-xl font-semibold tracking-tight text-white sm:text-2xl">
                  Travel made simple
                </h2>
              </div>
            </div>

            <div className="overflow-y-auto p-5 sm:p-6">
              <p className="text-sm leading-relaxed text-neutral-500 dark:text-neutral-400">
                From inspiration to departure, Info Voyager keeps every step clear — browse curated
                tours, book in minutes, and travel with confidence.
              </p>

              <ul className="mt-5 flex flex-col gap-3">
                {highlights.map(({ icon: Icon, title, description }) => (
                  <li
                    key={title}
                    className="flex gap-3 rounded-2xl border border-neutral-100 bg-neutral-50 p-3.5 dark:border-neutral-800 dark:bg-neutral-900/60"
                  >
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-neutral-900 text-white dark:bg-white dark:text-neutral-900">
                      <Icon className="h-4 w-4" strokeWidth={1.75} />
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-neutral-900 dark:text-white">{title}</p>
                      <p className="mt-0.5 text-xs leading-relaxed text-neutral-500 dark:text-neutral-400">
                        {description}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>

              <ul className="mt-5 flex flex-col gap-2">
                {['Instant booking confirmation', 'Flexible guest options', 'Manage trips in one place'].map(
                  (item) => (
                    <li key={item} className="flex items-center gap-2 text-xs text-neutral-600 dark:text-neutral-300">
                      <Check className="h-3.5 w-3.5 shrink-0 text-neutral-900 dark:text-white" strokeWidth={2.5} />
                      {item}
                    </li>
                  )
                )}
              </ul>

              <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-full px-6 py-3 text-xs font-bold uppercase tracking-widest text-neutral-500 transition-colors hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-900"
                >
                  Close
                </button>
                <Link
                  href="/tours"
                  onClick={onClose}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-neutral-900 px-6 py-3 text-xs font-bold uppercase tracking-widest text-white transition-colors hover:bg-black dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-100"
                >
                  Browse tours
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

export default function ProductShowcaseSection() {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <>
      <motion.section
        variants={staggerContainer(0.12, 0.06)}
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
      >
        <div className="mx-auto grid max-w-[1700px] grid-cols-1 items-center gap-10 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-2 lg:gap-16 lg:px-8 lg:py-24">
          <div className="flex flex-col gap-6 text-center lg:text-left">
            <motion.span
              variants={headerItem}
              className="text-xs font-bold uppercase tracking-widest text-neutral-400"
            >
              Why Info Voyager
            </motion.span>
            <motion.h2
              variants={headerItem}
              className="text-3xl sm:text-4xl lg:text-5xl font-light tracking-tight text-neutral-900 leading-tight dark:text-white"
            >
              Curated journeys,
              <span className="block font-bold">zero hassle.</span>
            </motion.h2>
            <motion.p
              variants={headerItem}
              className="mx-auto max-w-lg text-sm sm:text-base text-neutral-500 leading-relaxed lg:mx-0 dark:text-neutral-400"
            >
              Skip the endless tabs and scattered bookings. Discover hand-picked tours, compare
              transparent prices, and reserve your next adventure in just a few clicks.
            </motion.p>

            <motion.div
              variants={headerItem}
              className="flex flex-col gap-3 sm:flex-row sm:justify-center lg:justify-start"
            >
              <Link
                href="/tours"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-neutral-900 px-7 py-3.5 text-xs font-bold uppercase tracking-widest text-white transition-colors hover:bg-black dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-100"
              >
                Explore tours
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
              <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                className="inline-flex items-center justify-center rounded-full border border-neutral-200 px-7 py-3.5 text-xs font-bold uppercase tracking-widest text-neutral-900 transition-colors hover:bg-neutral-50 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-900"
              >
                Learn more
              </button>
            </motion.div>
          </div>

          <motion.div variants={headerItem} className="relative mx-auto w-full max-w-xl lg:max-w-none">
            <div className="group relative aspect-4/3 overflow-hidden rounded-3xl border border-neutral-100 bg-neutral-100 shadow-lg shadow-neutral-900/5 dark:border-neutral-800 dark:shadow-black/30 sm:aspect-5/4">
              <Image
                src={SHOWCASE_IMAGE}
                alt="Scenic mountain destination in Switzerland"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/45 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-3">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-white/70">
                    Featured escape
                  </p>
                  <p className="text-lg font-semibold text-white">Swiss Alps retreat</p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(true)}
                  className="shrink-0 rounded-full bg-white/90 px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-neutral-900 backdrop-blur-sm transition-colors hover:bg-white"
                >
                  Details
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.section>

      <ShowcaseModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  )
}
