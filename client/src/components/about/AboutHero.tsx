'use client'

import type { ReactNode } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Compass } from 'lucide-react'
import { fadeUp, staggerContainer } from '@/lib/motion'

function cld(publicId: string) {
  return `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/f_auto,q_auto/${publicId}`
}

const DEFAULT_HERO_IMAGE = 'santorini-destination1_xm26dt'

const container = staggerContainer(0.12, 0.05)
const item = fadeUp(0, 16)

interface ToursHeroProps {
  eyebrow?: string
  title: ReactNode
  imagePublicId?: string
}

export default function ToursHero({
  eyebrow = 'All Tours',
  title,
  imagePublicId = DEFAULT_HERO_IMAGE,
}: ToursHeroProps) {
  const heroImageUrl = cld(imagePublicId)
  return (
    <section className="relative min-h-[300px] sm:min-h-[360px] lg:min-h-[400px] w-full overflow-hidden bg-neutral-900 dark:bg-black">
      <motion.div
        initial={{ scale: 1.1, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
        className="absolute inset-0"
      >
        <Image
          src={heroImageUrl}
          alt="Scenic travel destination"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
      </motion.div>
      <div className="absolute inset-0 bg-linear-to-b from-black/70 via-black/40 to-black/70 dark:from-black/85 dark:via-black/50 dark:to-black/85" />

      <motion.div
        variants={container}
        initial="hidden"
        animate="visible"
        className="relative z-10 mx-auto flex min-h-[300px] sm:min-h-[360px] lg:min-h-[400px] max-w-[1700px] flex-col items-center justify-center px-4 py-14 text-center"
      >
        <motion.span
          variants={item}
          className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-white/60"
        >
          <Compass className="h-3.5 w-3.5" />
          {eyebrow}
        </motion.span>
        <motion.h1
          variants={item}
          className="mt-4 max-w-2xl text-4xl sm:text-5xl lg:text-6xl font-light leading-[1.05] tracking-tight text-white"
        >
          {title}
        </motion.h1>
      </motion.div>
    </section>
  )
}
