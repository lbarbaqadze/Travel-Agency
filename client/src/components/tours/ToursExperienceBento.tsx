'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { ArrowRight, Headphones, ShieldCheck, Sparkles } from 'lucide-react'
import { fadeUp, scaleIn, staggerContainer, viewportOnce } from '@/lib/motion'

function cld(publicId: string) {
  return `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/f_auto,q_auto/${publicId}`
}

const travelStyles = [
  {
    category: 'beach',
    label: 'Beach Escape',
    description: 'Sun, sea, and slow mornings by the water.',
    image: cld('santorini-destination1_xm26dt'),
    className: 'lg:col-span-2 lg:row-span-2 min-h-[220px] lg:min-h-0',
  },
  {
    category: 'city-break',
    label: 'City Break',
    description: 'Culture, cuisine, and iconic streets.',
    image: cld('london-destination1_ufjyjh'),
    className: 'lg:col-span-1 lg:row-span-1 min-h-[180px]',
  },
  {
    category: 'mountain',
    label: 'Mountain',
    description: 'Peaks, fresh air, and alpine views.',
    image: cld('switzerland-destination1_smdldl'),
    className: 'lg:col-span-1 lg:row-span-1 min-h-[180px]',
  },
  {
    category: 'adventure',
    label: 'Adventure',
    description: 'Active trips for curious explorers.',
    image: cld('georgian-destination3_tsmxiy'),
    className: 'lg:col-span-1 min-h-[180px]',
  },
  {
    category: 'cultural',
    label: 'Cultural',
    description: 'Heritage, local life, and hidden gems.',
    image: cld('michael-evans-DMM06ib0VRs-unsplash_dwjhak'),
    className: 'lg:col-span-1 min-h-[180px]',
  },
]

const trustItems = [
  {
    icon: Sparkles,
    title: 'Hand-picked tours',
    text: 'Every listing is reviewed for quality, clarity, and value.',
  },
  {
    icon: ShieldCheck,
    title: 'Secure checkout',
    text: 'Transparent pricing and safe payment from start to finish.',
  },
  {
    icon: Headphones,
    title: 'Human support',
    text: 'Real help before and after you book — not just an auto-reply.',
  },
]

const sectionStagger = staggerContainer(0.1, 0.05)
const headerItem = fadeUp(0, 16)
const cardItem = scaleIn(0)

export default function ToursExperienceBento() {
  const router = useRouter()

  function browseCategory(category: string) {
    router.push(`/tours?category=${category}#tours-grid`)
  }

  return (
    <section className="relative overflow-hidden bg-white dark:bg-neutral-950">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(0,0,0,0.04)_1px,transparent_0)] bg-size-[24px_24px] dark:bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.05)_1px,transparent_0)]"
      />

      <div className="relative mx-auto max-w-[1700px] px-4 pt-8 pb-16 sm:px-6 sm:pt-10 sm:pb-20 lg:px-8">
        <motion.div
          variants={sectionStagger}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="mb-8 max-w-2xl"
        >
          <motion.span
            variants={headerItem}
            className="text-xs font-bold uppercase tracking-widest text-neutral-400"
          >
            Find your style
          </motion.span>
          <motion.h2
            variants={headerItem}
            className="mt-3 text-3xl font-light tracking-tight text-neutral-900 dark:text-white sm:text-4xl"
          >
            Every trip has a mood
            <span className="block font-bold">pick yours and explore.</span>
          </motion.h2>
          <motion.p variants={headerItem} className="mt-4 text-sm leading-relaxed text-neutral-500 dark:text-neutral-400">
            Browse by travel style to narrow the list, or scroll back up to filter by category and budget.
          </motion.p>
        </motion.div>

        <motion.div
          variants={staggerContainer(0.08)}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:grid-rows-2"
        >
          {travelStyles.map((style) => (
            <motion.button
              key={style.category}
              type="button"
              variants={cardItem}
              onClick={() => browseCategory(style.category)}
              className={`group relative overflow-hidden rounded-3xl text-left ${style.className}`}
            >
              <Image
                src={style.image}
                alt={style.label}
                fill
                sizes="(max-width: 1024px) 50vw, 25vw"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/75 via-black/25 to-black/10" />
              <div className="absolute inset-0 flex flex-col justify-end p-5 sm:p-6">
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/60">
                  {style.label}
                </span>
                <p className="mt-1 text-sm font-semibold text-white sm:text-base">{style.description}</p>
                <span className="mt-3 inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-white/80 transition-colors group-hover:text-white">
                  View tours
                  <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
                </span>
              </div>
            </motion.button>
          ))}
        </motion.div>

        <motion.div
          variants={sectionStagger}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="mt-10 rounded-3xl border border-neutral-100 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-950 sm:p-8"
        >
          <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
            <div className="grid gap-6 sm:grid-cols-3">
              {trustItems.map(({ icon: Icon, title, text }) => (
                <motion.div key={title} variants={headerItem} className="flex gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-neutral-900 text-white dark:bg-white dark:text-neutral-900">
                    <Icon className="h-4 w-4" strokeWidth={1.75} />
                  </span>
                  <div>
                    <p className="text-sm font-bold text-neutral-900 dark:text-white">{title}</p>
                    <p className="mt-1 text-xs leading-relaxed text-neutral-500 dark:text-neutral-400">{text}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.div variants={headerItem} className="flex flex-col gap-3 sm:flex-row lg:flex-col">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-neutral-900 px-6 py-3.5 text-xs font-bold uppercase tracking-widest text-white transition-colors hover:bg-black dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-100"
              >
                Need help choosing?
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
              <Link
                href="/#search"
                className="inline-flex items-center justify-center rounded-full border border-neutral-200 px-6 py-3.5 text-xs font-bold uppercase tracking-widest text-neutral-900 transition-colors hover:bg-neutral-50 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-900"
              >
                Search from home
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
