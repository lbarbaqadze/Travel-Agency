'use client'

import { useState } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowDown, Compass } from 'lucide-react'

function cld(publicId: string) {
  return `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/f_auto,q_auto/${publicId}`
}

const POPULAR_TOURS = [
  {
    id: 1,
    name: 'Santorini',
    region: 'Greece',
    color: 'rgba(56, 189, 248, 0.08)',
    image: cld('santorini-destination1_xm26dt'),
    description:
      'Whitewashed cliffs and caldera sunsets — our most-booked escape for travelers chasing beauty by the Aegean.',
  },
  {
    id: 2,
    name: 'Switzerland',
    region: 'Alps',
    color: 'rgba(148, 163, 184, 0.1)',
    image: cld('switzerland-destination1_smdldl'),
    description:
      'Alpine peaks, crystal lakes, and refined retreats — a fan favorite for scenery, rest, and adventure.',
  },
  {
    id: 3,
    name: 'London',
    region: 'England',
    color: 'rgba(120, 113, 108, 0.1)',
    image: cld('london-destination1_ufjyjh'),
    description:
      'Iconic landmarks, historic streets, and world-class culture — the city break travelers return to most.',
  },
]

function scrollToTours() {
  document.getElementById('tours-grid')?.scrollIntoView({ behavior: 'smooth' })
}

export default function ToursPopularHero() {
  const [active, setActive] = useState(POPULAR_TOURS[0])

  return (
    <section className="relative flex min-h-svh w-full flex-col items-center justify-between overflow-hidden bg-neutral-900 pt-20 pb-10 text-white dark:bg-neutral-950 sm:pb-12">
      <motion.div
        animate={{
          background: `radial-gradient(circle at 50% 45%, ${active.color} 0%, rgba(23,23,23,0) 70%)`,
        }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="absolute inset-0 z-0"
      />

      <div className="absolute inset-0 bg-linear-to-b from-black/50 via-transparent to-black/60" />

      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-20 flex items-center gap-1.5"
      >
        <Compass className="h-3.5 w-3.5 text-white/50" strokeWidth={2} />
        <span className="text-xs font-bold uppercase tracking-widest text-white/50">
          Popular Tours
        </span>
      </motion.div>

      <div className="relative z-10 flex w-full grow flex-col items-center justify-center px-4">
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={active.name}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 0.06, scale: 1 }}
              exit={{ opacity: 0, scale: 1.04 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-col items-center leading-[0.85] tracking-tight"
            >
              <span className="text-[20vw] font-bold uppercase sm:text-[14vw] lg:text-[11vw]">
                {active.name}
              </span>
              <span className="text-[14vw] font-light uppercase text-white/40 sm:text-[9vw] lg:text-[7vw]">
                {active.region}
              </span>
            </motion.div>
          </AnimatePresence>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={active.id}
            initial={{ opacity: 0, y: 24, scale: 0.88 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -24, scale: 1.06 }}
            transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-10 h-[min(68vw,300px)] w-[min(68vw,300px)] sm:h-[min(52vw,380px)] sm:w-[min(52vw,380px)] lg:h-[min(38vw,420px)] lg:w-[min(38vw,420px)]"
          >
            <div className="absolute -inset-2 rounded-full bg-white/5 blur-md" />
            <div className="relative h-full w-full overflow-hidden rounded-full border border-white/10 shadow-[0_32px_80px_rgba(0,0,0,0.55)]">
              <Image
                src={active.image}
                alt={`${active.name}, ${active.region}`}
                fill
                priority={active.id === 1}
                sizes="(max-width: 640px) 300px, 420px"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/30 via-transparent to-black/10" />
            </div>
          </motion.div>
        </AnimatePresence>

        <AnimatePresence mode="wait">
          <motion.div
            key={`copy-${active.id}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="relative z-20 mt-10 max-w-md text-center"
          >
            <h1 className="text-2xl font-light tracking-tight text-white sm:text-3xl lg:text-4xl">
              Find your next
              <span className="block font-bold text-white">unforgettable journey.</span>
            </h1>
            <p className="mt-4 px-2 text-xs leading-relaxed text-white/55 sm:text-sm dark:text-white/70">
              {active.description}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="relative z-20 flex items-end gap-6 sm:gap-10">
        {POPULAR_TOURS.map((tour) => {
          const isActive = active.id === tour.id
          return (
            <button
              key={tour.id}
              type="button"
              onClick={() => setActive(tour)}
              className="group flex flex-col items-center gap-1.5"
            >
              <span
                className={`text-[10px] font-bold uppercase tracking-[0.25em] transition-colors duration-300 sm:text-[11px] ${
                  isActive ? 'text-white' : 'text-white/35 group-hover:text-white/60'
                }`}
              >
                {tour.name}
              </span>
              {isActive && (
                <motion.div
                  layoutId="tours-popular-indicator"
                  className="h-0.5 w-6 rounded-full bg-white"
                  transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                />
              )}
            </button>
          )
        })}
      </div>

      <motion.button
        type="button"
        onClick={scrollToTours}
        aria-label="Scroll to all tours"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, y: [0, 6, 0] }}
        transition={{
          opacity: { duration: 0.6, delay: 0.8 },
          y: { duration: 1.8, repeat: Infinity, ease: 'easeInOut', delay: 1 },
        }}
        whileHover={{ scale: 1.08 }}
        className="absolute bottom-6 right-4 z-20 flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur-sm transition-colors hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white sm:right-8"
      >
        <ArrowDown className="h-4 w-4" />
      </motion.button>
    </section>
  )
}
