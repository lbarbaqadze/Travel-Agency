'use client'

import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Check, X } from 'lucide-react'
import { sponsors, type Sponsor } from './aboutData'
import { fadeUp, staggerContainer, viewportOnce } from '@/lib/motion'

const container = staggerContainer(0.05, 0.06)
const item = fadeUp(0, 10)

function PartnerModal({
  partner,
  onClose,
}: {
  partner: Sponsor | null
  onClose: () => void
}) {
  useEffect(() => {
    if (!partner) return
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [partner, onClose])

  return (
    <AnimatePresence>
      {partner && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4 sm:p-6">
          <motion.button
            type="button"
            aria-label="Close"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-neutral-900/50 backdrop-blur-sm dark:bg-black/65"
            onClick={onClose}
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="partner-modal-title"
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-full max-w-md overflow-hidden rounded-3xl border border-neutral-100 bg-white shadow-2xl dark:border-neutral-800 dark:bg-neutral-950"
          >
            <div className="border-b border-neutral-100 px-6 pb-5 pt-6 dark:border-neutral-800">
              <button
                type="button"
                onClick={onClose}
                aria-label="Close dialog"
                className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-900 dark:hover:bg-neutral-800 dark:hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
              <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-neutral-400">
                {partner.tag}
              </p>
              <h2 id="partner-modal-title" className="mt-2 pr-8 text-xl font-semibold tracking-tight text-neutral-900 dark:text-white">
                {partner.name}
              </h2>
            </div>

            <div className="px-6 py-5">
              <p className="text-sm leading-relaxed text-neutral-500 dark:text-neutral-400">
                {partner.description}
              </p>
              <ul className="mt-4 flex flex-col gap-2">
                {partner.highlights.map((point) => (
                  <li
                    key={point}
                    className="flex items-start gap-2 text-xs text-neutral-600 dark:text-neutral-300"
                  >
                    <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-neutral-900 dark:text-white" strokeWidth={2.5} />
                    {point}
                  </li>
                ))}
              </ul>
            </div>

            <div className="border-t border-neutral-100 px-6 py-4 dark:border-neutral-800">
              <button
                type="button"
                onClick={onClose}
                className="w-full rounded-full bg-neutral-900 py-3 text-xs font-bold uppercase tracking-widest text-white transition-colors hover:bg-black dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-100"
              >
                Close
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

export default function AboutSponsors() {
  const [active, setActive] = useState<Sponsor | null>(null)

  return (
    <>
      <section id="partners" className="border-b border-neutral-100 bg-white py-10 dark:border-neutral-800 dark:bg-neutral-950 sm:py-12">
        <div className="mx-auto max-w-[1700px] px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={container}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between"
          >
            <div>
              <motion.p
                variants={item}
                className="text-[10px] font-bold uppercase tracking-[0.28em] text-neutral-400"
              >
                Trusted partners
              </motion.p>
              <motion.h2
                variants={item}
                className="mt-2 text-2xl font-light tracking-tight text-neutral-900 dark:text-white sm:text-3xl"
              >
                Built with partners who share
                <span className="block font-bold">our standards.</span>
              </motion.h2>
            </div>
            <motion.p variants={item} className="max-w-xs text-xs text-neutral-400 sm:text-right">
              Tap a partner to learn more about how we work together.
            </motion.p>
          </motion.div>

          <motion.div
            variants={container}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            className="mt-6 grid grid-cols-2 gap-2.5 sm:grid-cols-3 sm:gap-3 lg:grid-cols-6"
          >
            {sponsors.map((partner) => (
              <motion.button
                key={partner.id}
                type="button"
                variants={item}
                onClick={() => setActive(partner)}
                className="group flex cursor-pointer flex-col items-center justify-center rounded-2xl border border-neutral-100 bg-neutral-50 px-3 py-5 text-center transition-all hover:border-neutral-300 hover:bg-white hover:shadow-sm dark:border-neutral-800 dark:bg-neutral-900/50 dark:hover:border-neutral-600 dark:hover:bg-neutral-900"
              >
                <span className="text-sm font-bold tracking-tight text-neutral-900 dark:text-white">
                  {partner.name}
                </span>
                <span className="mt-1 text-[10px] font-medium uppercase tracking-widest text-neutral-400 transition-colors group-hover:text-neutral-600 dark:group-hover:text-neutral-300">
                  {partner.tag}
                </span>
              </motion.button>
            ))}
          </motion.div>
        </div>
      </section>

      <PartnerModal partner={active} onClose={() => setActive(null)} />
    </>
  )
}
