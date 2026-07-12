'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowDown } from 'lucide-react'
import { fadeUp, staggerContainer } from '@/lib/motion'

function cld(publicId: string) {
  return `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/f_auto,q_auto/${publicId}`
}

const HERO_IMAGE_MOBILE_URL = cld('Generated_image_kabxes')
const HERO_IMAGE_URL = cld('hero-jet_v3hjgh')

const THUMBNAILS = [
  { src: cld('thumb-1_cdnsdi'), className: 'left-0 top-0 -rotate-6', wide: false },
  { src: cld('thumb-3_twolsq'), className: 'right-0 top-0 rotate-6', wide: false },
  { src: cld('thumb-2_mpbrdy'), className: 'left-4 sm:left-8 top-24 sm:top-28 rotate-3', wide: true },
  { src: cld('thumb-4_lr0b3m'), className: 'right-4 sm:right-8 top-24 sm:top-28 -rotate-3', wide: true },
]

const contentItem = fadeUp(0, 18)

function scrollToSearch() {
  document.getElementById('search')?.scrollIntoView({ behavior: 'smooth' })
}

export default function Hero() {
  const [imageFailed, setImageFailed] = useState(false)

  return (
    <section className="relative min-h-[540px] sm:min-h-[640px] lg:min-h-[680px] w-full overflow-hidden bg-neutral-900">
      {!imageFailed && (
        <motion.div
          initial={{ scale: 1.12, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0"
        >
          <Image
            src={HERO_IMAGE_MOBILE_URL}
            alt="Private jet flying above the clouds"
            fill
            priority
            sizes="100vw"
            className="object-cover sm:hidden"
          />
          <Image
            src={HERO_IMAGE_URL}
            alt="Private jet flying above the clouds"
            fill
            priority
            sizes="100vw"
            className="hidden object-cover sm:block"
            onError={() => setImageFailed(true)}
          />
        </motion.div>
      )}
      <div className="absolute inset-0 bg-linear-to-b from-black/70 via-black/25 to-black/70 dark:from-black/85 dark:via-black/45 dark:to-black/85" />

      <div className="relative z-10 mx-auto flex min-h-[540px] sm:min-h-[640px] lg:min-h-[680px] max-w-[1700px] flex-col items-center justify-center px-4 py-16 sm:py-20 text-center">
        <div className="relative mx-auto w-full max-w-5xl">
          {THUMBNAILS.map((thumb, i) => (
            <motion.div
              key={thumb.src}
              initial={{ opacity: 0, y: 16, rotate: 0 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.08, transition: { duration: 0.2 } }}
              transition={{ duration: 0.6, delay: 0.35 + 0.12 * i, ease: [0.22, 1, 0.36, 1] }}
              className={`absolute h-11 w-11 overflow-hidden rounded-xl border-2 border-white/80 shadow-lg sm:h-16 sm:w-16 sm:rounded-2xl lg:h-20 lg:w-20 ${
                thumb.wide ? 'hidden sm:block' : ''
              } ${thumb.className}`}
            >
              <Image src={thumb.src} alt="" fill sizes="80px" className="object-cover" />
            </motion.div>
          ))}

          <motion.div
            variants={staggerContainer(0.12, 0.1)}
            initial="hidden"
            animate="visible"
            className="relative z-10 mx-auto max-w-2xl"
          >
            <motion.span
              variants={contentItem}
              className="text-xs font-bold uppercase tracking-widest text-white/60"
            >
              Flight Booking
            </motion.span>

            <motion.h1
              variants={contentItem}
              className="mt-4 text-4xl sm:text-6xl lg:text-7xl leading-[0.95] tracking-tight"
            >
              <span className="font-light text-white/70">Fly Smarter,</span>
              <span className="block font-bold text-white">Explore Further.</span>
            </motion.h1>

            <motion.p
              variants={contentItem}
              className="mx-auto mt-6 max-w-md text-sm sm:text-base text-white/80 leading-relaxed"
            >
              Elevate your journey with intelligently curated tours that take you farther,
              faster, and with unmatched ease.
            </motion.p>

            <motion.div variants={contentItem} className="mt-8">
              <Link
                href="/tours"
                className="inline-flex rounded-full bg-white px-7 py-3.5 text-xs font-bold uppercase tracking-widest text-neutral-900 transition-all hover:scale-105 hover:bg-neutral-100 shadow-sm dark:border dark:border-white/40 dark:bg-white/10 dark:text-white dark:backdrop-blur-sm dark:hover:bg-white/20 dark:hover:scale-105"
              >
                Get Ticket Now
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>

      <motion.button
        onClick={scrollToSearch}
        aria-label="Scroll to search"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, y: [0, 6, 0] }}
        transition={{ opacity: { duration: 0.6, delay: 1 }, y: { duration: 1.8, repeat: Infinity, ease: 'easeInOut', delay: 1.2 } }}
        whileHover={{ scale: 1.1 }}
        className="absolute bottom-8 left-1/2 z-10 flex h-12 w-12 -translate-x-1/2 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm border border-white/25 hover:bg-white/20 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
      >
        <ArrowDown className="h-4 w-4" />
      </motion.button>
    </section>
  )
}
