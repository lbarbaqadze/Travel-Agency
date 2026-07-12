'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion, useReducedMotion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { useMemo } from 'react'
import { useTours } from '@/hooks/useTours'
import { optimizeImageUrl } from '@/lib/cloudinary'
import { fadeUp, staggerContainer, viewportOnce } from '@/lib/motion'

function cld(publicId: string) {
  const cloud = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
  return `https://res.cloudinary.com/${cloud}/image/upload/f_auto,q_auto:good,w_900,h_600,c_fill/${publicId}`
}

const FALLBACK_SLIDES = [
  { src: cld('santorini-destination1_xm26dt'), alt: 'Santorini', href: '/tours' },
  { src: cld('london-destination1_ufjyjh'), alt: 'London', href: '/tours' },
  { src: cld('switzerland-destination1_smdldl'), alt: 'Swiss Alps', href: '/tours' },
  { src: cld('georgian-destination3_tsmxiy'), alt: 'Georgia', href: '/tours' },
  { src: cld('michael-evans-DMM06ib0VRs-unsplash_dwjhak'), alt: 'Alpine escape', href: '/tours' },
  { src: cld('img1_ptvmy6'), alt: 'Window view', href: '/tours' },
] as const

type Slide = { src: string; alt: string; href: string }

const container = staggerContainer(0.08, 0.04)
const item = fadeUp(0, 12)

function MarqueeSkeleton() {
  return (
    <div className="flex gap-4 md:gap-6">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="h-44 w-64 shrink-0 animate-pulse rounded-2xl bg-neutral-200 dark:bg-neutral-800 sm:h-52 sm:w-80"
        />
      ))}
    </div>
  )
}

function MarqueeTrack({ slides, animate }: { slides: Slide[]; animate: boolean }) {
  const duplicated = useMemo(() => [...slides, ...slides], [slides])

  return (
    <div className="relative flex overflow-hidden">
      <motion.div
        className="flex gap-4 md:gap-6"
        animate={animate ? { x: ['0%', '-50%'] } : undefined}
        transition={
          animate
            ? {
                x: {
                  repeat: Infinity,
                  repeatType: 'loop',
                  duration: Math.max(28, slides.length * 5),
                  ease: 'linear',
                },
              }
            : undefined
        }
        style={{ width: 'fit-content' }}
      >
        {duplicated.map((slide, index) => (
          <Link
            key={`${slide.href}-${slide.alt}-${index}`}
            href={slide.href}
            className="group relative block h-44 w-64 shrink-0 overflow-hidden rounded-2xl border border-neutral-200 bg-neutral-100 shadow-sm transition-shadow hover:shadow-md dark:border-neutral-800 dark:bg-neutral-900 dark:hover:shadow-black/30 sm:h-52 sm:w-80"
          >
            <Image
              src={slide.src}
              alt={slide.alt}
              fill
              loading="lazy"
              sizes="320px"
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/10 to-transparent" />
            <div className="absolute bottom-4 left-4 right-4">
              <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-white/70">Destination</p>
              <p className="mt-0.5 text-sm font-semibold text-white sm:text-base">{slide.alt}</p>
            </div>
          </Link>
        ))}
      </motion.div>
    </div>
  )
}

export default function AboutSection() {
  const { tours, isLoading } = useTours({ limit: 16 })
  const prefersReducedMotion = useReducedMotion()

  const slides = useMemo<Slide[]>(() => {
    const fromTours = tours
      .filter((tour) => tour.cover_image)
      .map((tour) => ({
        src: optimizeImageUrl(tour.cover_image as string, { width: 640, height: 420, crop: 'fill' }),
        alt: tour.destination,
        href: `/tours/${tour.slug}`,
      }))

    if (fromTours.length >= 4) return fromTours
    return [...fromTours, ...FALLBACK_SLIDES].slice(0, Math.max(6, fromTours.length + FALLBACK_SLIDES.length))
  }, [tours])

  return (
    <section className="overflow-hidden border-t border-neutral-100 bg-white pt-6 pb-10 dark:border-neutral-800 dark:bg-neutral-950 sm:pt-8 sm:pb-12">
      <div className="mx-auto max-w-[1700px] px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="mb-6 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-end sm:justify-between"
        >
          <div>
            <motion.p variants={item} className="text-[10px] font-bold uppercase tracking-[0.28em] text-neutral-400">
              Where we take you
            </motion.p>
            <motion.h2
              variants={item}
              className="mt-2 text-2xl font-light tracking-tight text-neutral-900 dark:text-white sm:text-3xl"
            >
              Real tours,
              <span className="block font-bold">real destinations.</span>
            </motion.h2>
          </div>

          <motion.div variants={item}>
            <Link
              href="/tours"
              className="group inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-neutral-900 transition-colors hover:text-neutral-600 dark:text-white dark:hover:text-neutral-300"
            >
              View all tours
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </motion.div>
        </motion.div>
      </div>

      <div className="mx-auto max-w-[1700px] px-4 sm:px-6 lg:px-8">
        {isLoading ? <MarqueeSkeleton /> : <MarqueeTrack slides={slides} animate={!prefersReducedMotion} />}
      </div>
    </section>
  )
}
