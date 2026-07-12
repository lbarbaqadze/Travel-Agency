'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, Headphones, ShieldCheck, Sparkles } from 'lucide-react'
import { aboutFeatures } from './aboutData'
import { fadeUp, staggerContainer, viewportOnce } from '@/lib/motion'

const featureIcons = [Sparkles, ShieldCheck, Headphones] as const

const container = staggerContainer(0.1, 0.06)
const item = fadeUp(0, 16)

export default function AboutFeatures() {
  return (
    <section className="pt-14 pb-6 dark:bg-neutral-950 sm:pt-16 sm:pb-8 lg:pt-20 lg:pb-10">
      <div className="mx-auto max-w-[1700px] px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
          <motion.div
            variants={container}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            className="flex flex-col gap-6"
          >
            <motion.p
              variants={item}
              className="text-[10px] font-bold uppercase tracking-[0.28em] text-neutral-400"
            >
              {aboutFeatures.eyebrow}
            </motion.p>

            <motion.h2
              variants={item}
              className="text-3xl font-light tracking-tight text-neutral-900 dark:text-white sm:text-4xl lg:text-5xl"
            >
              {aboutFeatures.title}
              <span className="block font-bold text-neutral-500 dark:text-neutral-400">
                {aboutFeatures.titleAccent}
              </span>
            </motion.h2>

            <motion.p
              variants={item}
              className="max-w-xl text-sm leading-relaxed text-neutral-500 dark:text-neutral-400 sm:text-base"
            >
              {aboutFeatures.description}
            </motion.p>

            <motion.div variants={item} className="flex flex-wrap gap-4 pt-1">
              <Link
                href="/tours"
                className="inline-flex items-center gap-2 rounded-full bg-neutral-900 px-6 py-3.5 text-xs font-bold uppercase tracking-widest text-white transition-colors hover:bg-black dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-100"
              >
                Browse tours
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center rounded-full border border-neutral-200 px-6 py-3.5 text-xs font-bold uppercase tracking-widest text-neutral-900 transition-colors hover:bg-white dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-800"
              >
                Talk to us
              </Link>
            </motion.div>
          </motion.div>

          <motion.div
            variants={item}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            className="relative w-full"
          >
            <div className="group relative h-56 overflow-hidden rounded-2xl border border-neutral-200 bg-neutral-100 shadow-lg shadow-neutral-900/5 dark:border-neutral-800 dark:bg-neutral-900 dark:shadow-black/30 sm:h-64 lg:h-72">
              <Image
                src={aboutFeatures.image}
                alt={aboutFeatures.imageAlt}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/10 to-transparent dark:from-black/70 dark:via-black/20" />
              <div className="absolute bottom-4 left-4 right-4 sm:bottom-5 sm:left-5 sm:right-5">
                <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-white/70">
                  Voyager experience
                </p>
                <p className="mt-1 text-base font-semibold text-white sm:text-lg">
                  {aboutFeatures.imageCaption}
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        <motion.ul
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="mt-10 grid gap-4 sm:grid-cols-3"
        >
          {aboutFeatures.highlights.map(({ title, description }, index) => {
            const Icon = featureIcons[index] ?? Sparkles
            return (
              <motion.li
                key={title}
                variants={item}
                className="flex gap-3 rounded-2xl border border-neutral-200/80 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-950/60"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-neutral-900 text-white dark:bg-white dark:text-neutral-900">
                  <Icon className="h-4 w-4" strokeWidth={1.75} />
                </span>
                <div>
                  <p className="text-sm font-semibold text-neutral-900 dark:text-white">{title}</p>
                  <p className="mt-1 text-xs leading-relaxed text-neutral-500 dark:text-neutral-400">
                    {description}
                  </p>
                </div>
              </motion.li>
            )
          })}
        </motion.ul>
      </div>
    </section>
  )
}
