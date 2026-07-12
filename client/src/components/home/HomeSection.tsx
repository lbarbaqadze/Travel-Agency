'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, Compass, Plane, Sparkles } from 'lucide-react'
import { fadeUp, scaleIn, staggerContainer, viewportOnce } from '@/lib/motion'

function cld(publicId: string) {
  return `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/f_auto,q_auto/${publicId}`
}

const steps = [
  {
    icon: Compass,
    title: 'Discover your next destination',
    description:
      'Browse hand-picked tours across Europe, Asia, and beyond. Filter by style, season, and budget to find a trip that feels made for you.',
    image: cld('london-destination1_ufjyjh'),
  },
  {
    icon: Plane,
    title: 'Book in minutes, not hours',
    description:
      'Secure checkout, transparent pricing, and instant confirmation. Manage bookings and payments from one clean dashboard.',
    image: cld('hero-jet_v3hjgh'),
  },
  {
    icon: Sparkles,
    title: 'Travel with confidence',
    description:
      'From departure to return, enjoy curated itineraries, trusted partners, and support that keeps your journey smooth start to finish.',
    image: cld('georgian-destination3_tsmxiy'),
  },
]

const headerItem = fadeUp(0, 16)
const stepItem = scaleIn(0)

export default function UniversalHero() {
  return (
    <section className="relative overflow-hidden transition-colors duration-300 dark:bg-neutral-950">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(0,0,0,0.04)_1px,transparent_0)] bg-size-[24px_24px] dark:bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.06)_1px,transparent_0)]"
      />

      <div className="relative mx-auto max-w-[1700px] px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={staggerContainer(0.12, 0.05)}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="mx-auto mb-10 sm:mb-12 max-w-2xl text-center lg:text-left lg:max-w-none lg:flex lg:items-end lg:justify-between lg:gap-8"
        >
          <div>
            <motion.span
              variants={headerItem}
              className="text-xs font-bold uppercase tracking-widest text-neutral-400 dark:text-neutral-500"
            >
              How it works
            </motion.span>
            <motion.h2
              variants={headerItem}
              className="mt-3 text-3xl sm:text-4xl font-light tracking-tight text-neutral-900 leading-tight dark:text-white"
            >
              Plan less,
              <span className="block font-bold">travel more.</span>
            </motion.h2>
            <motion.p
              variants={headerItem}
              className="mt-3 text-sm sm:text-base text-neutral-500 leading-relaxed max-w-xl lg:mx-0 mx-auto dark:text-neutral-400"
            >
              Info Voyager turns complex trip planning into a simple three-step journey —
              less searching, more exploring.
            </motion.p>
          </div>

          <motion.div variants={headerItem} className="mt-6 lg:mt-0 shrink-0 text-center lg:text-right">
            <Link
              href="/tours"
              className="group inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-neutral-900 dark:text-white"
            >
              Explore tours
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
            </Link>
          </motion.div>
        </motion.div>

        <div className="relative mx-auto max-w-5xl">
          <div
            aria-hidden
            className="absolute left-4 sm:left-1/2 top-2 bottom-2 w-px sm:-translate-x-1/2 bg-linear-to-b from-transparent via-neutral-300 to-transparent dark:via-neutral-700"
          />

          <motion.ul
            variants={staggerContainer(0.14, 0.08)}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            className="flex flex-col gap-10 sm:gap-12 lg:gap-14"
          >
            {steps.map((step, index) => {
              const Icon = step.icon
              const isEven = index % 2 === 0

              return (
                <motion.li
                  key={step.title}
                  variants={stepItem}
                  className="relative grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8 lg:gap-10 items-center"
                >
                  <div
                    aria-hidden
                    className={`absolute left-4 sm:left-1/2 top-1/2 z-20 hidden sm:flex -translate-x-1/2 -translate-y-1/2 items-center ${
                      isEven ? 'flex-row' : 'flex-row-reverse'
                    }`}
                  >
                    <span
                      className={`h-px w-8 lg:w-12 bg-neutral-300 dark:bg-neutral-700 ${isEven ? 'order-1' : 'order-2'}`}
                    />
                    <span className="relative order-2 flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-2 border-white bg-neutral-900 text-white shadow-lg shadow-neutral-900/10 ring-4 ring-neutral-50 dark:border-neutral-800 dark:bg-white dark:text-neutral-900 dark:shadow-black/30 dark:ring-neutral-900">
                      <Icon className="h-4 w-4" strokeWidth={1.75} />
                    </span>
                    <span
                      className={`h-px w-8 lg:w-12 bg-neutral-300 dark:bg-neutral-700 ${isEven ? 'order-3' : 'order-1'}`}
                    />
                  </div>

                  <div
                    aria-hidden
                    className="absolute left-4 sm:left-1/2 top-8 z-10 flex h-9 w-9 -translate-x-1/2 items-center justify-center rounded-full border-2 border-white bg-neutral-900 text-white shadow-md dark:border-neutral-800 dark:bg-white dark:text-neutral-900 sm:hidden"
                  >
                    <Icon className="h-3.5 w-3.5" strokeWidth={1.75} />
                  </div>

                  <div
                    className={`relative pl-12 sm:pl-0 ${
                      isEven
                        ? 'sm:order-1 sm:pr-8 lg:pr-10 sm:text-right'
                        : 'sm:order-2 sm:pl-8 lg:pl-10 sm:text-left'
                    }`}
                  >
                    <div
                      className={`relative rounded-2xl border border-neutral-100 bg-white p-5 sm:p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900/80 dark:shadow-none ${
                        isEven ? 'sm:ml-auto' : ''
                      } max-w-md`}
                    >
                      <h3 className="text-xl sm:text-2xl font-semibold tracking-tight text-neutral-900 leading-snug dark:text-white">
                        {step.title}
                      </h3>
                      <p className="mt-2 text-sm text-neutral-500 leading-relaxed dark:text-neutral-400">
                        {step.description}
                      </p>
                    </div>
                  </div>

                  <div
                    className={`pl-12 sm:pl-0 ${isEven ? 'sm:order-2' : 'sm:order-1'}`}
                  >
                    <div
                      className={`group relative aspect-4/3 w-full max-w-md mx-auto sm:mx-0 sm:max-w-none overflow-hidden rounded-2xl sm:rounded-3xl border border-neutral-100 bg-white shadow-lg shadow-neutral-900/5 transition-transform duration-500 dark:border-neutral-800 dark:shadow-black/40 ${
                        isEven ? 'sm:-rotate-1 sm:hover:rotate-0' : 'sm:rotate-1 sm:hover:rotate-0'
                      }`}
                    >
                      <Image
                        src={step.image}
                        alt={step.title}
                        fill
                        sizes="(max-width: 640px) 100vw, 50vw"
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-linear-to-t from-black/30 via-transparent to-transparent dark:from-black/50" />
                    </div>
                  </div>
                </motion.li>
              )
            })}
          </motion.ul>
        </div>        
      </div>
    </section>
  )
}
