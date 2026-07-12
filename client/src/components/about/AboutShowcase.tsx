'use client'

import { useCallback, useEffect, useState } from 'react'
import Image from 'next/image'
import { AnimatePresence, motion } from 'framer-motion'
import { Check, ChevronLeft, ChevronRight, X } from 'lucide-react'
import { showcaseModals, showcaseSlides, type ShowcaseModalId } from './aboutData'

const SLIDE_COUNT = showcaseSlides.length

function ShowcaseCardModal({
  modalId,
  onClose,
}: {
  modalId: ShowcaseModalId | null
  onClose: () => void
}) {
  const content = modalId ? showcaseModals[modalId] : null

  useEffect(() => {
    if (!modalId) return
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [modalId, onClose])

  function scrollToPartners() {
    onClose()
    requestAnimationFrame(() => {
      document.getElementById('partners')?.scrollIntoView({ behavior: 'smooth' })
    })
  }

  return (
    <AnimatePresence>
      {content && modalId && (
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
            aria-labelledby="showcase-modal-title"
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="relative flex max-h-[90vh] w-full max-w-md flex-col overflow-hidden rounded-3xl border border-neutral-100 bg-white shadow-2xl dark:border-neutral-800 dark:bg-neutral-950"
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
                {content.eyebrow}
              </p>
              <h2
                id="showcase-modal-title"
                className="mt-2 pr-8 text-xl font-semibold tracking-tight text-neutral-900 dark:text-white"
              >
                {content.title}
              </h2>
            </div>

            <div className="overflow-y-auto px-6 py-5">
              <p className="text-sm leading-relaxed text-neutral-500 dark:text-neutral-400">
                {content.description}
              </p>
              <ul className="mt-4 flex flex-col gap-2">
                {content.highlights.map((point) => (
                  <li
                    key={point}
                    className="flex items-start gap-2 text-xs text-neutral-600 dark:text-neutral-300"
                  >
                    <Check
                      className="mt-0.5 h-3.5 w-3.5 shrink-0 text-neutral-900 dark:text-white"
                      strokeWidth={2.5}
                    />
                    {point}
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex flex-col gap-2 border-t border-neutral-100 px-6 py-4 dark:border-neutral-800">
              {modalId === 'partners' && (
                <button
                  type="button"
                  onClick={scrollToPartners}
                  className="w-full rounded-full bg-neutral-900 py-3 text-xs font-bold uppercase tracking-widest text-white transition-colors hover:bg-black dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-100"
                >
                  View all partners
                </button>
              )}
              <button
                type="button"
                onClick={onClose}
                className={`w-full rounded-full py-3 text-xs font-bold uppercase tracking-widest transition-colors ${
                  modalId === 'partners'
                    ? 'text-neutral-500 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-900'
                    : 'bg-neutral-900 text-white hover:bg-black dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-100'
                }`}
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

export default function AboutShowcase() {
  const [index, setIndex] = useState(0)
  const [activeModal, setActiveModal] = useState<ShowcaseModalId | null>(null)

  const go = useCallback((dir: 1 | -1) => {
    setIndex((i) => (i + dir + SLIDE_COUNT) % SLIDE_COUNT)
  }, [])

  const goTo = useCallback((i: number) => {
    setIndex(i)
  }, [])

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (activeModal) return
      if (e.key === 'ArrowLeft') go(-1)
      if (e.key === 'ArrowRight') go(1)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [go, activeModal])

  const slide = showcaseSlides[index]
  const nextSlide = showcaseSlides[(index + 1) % SLIDE_COUNT]

  return (
    <>
      <section
        className="relative h-screen min-h-[640px] w-full overflow-hidden bg-neutral-950 dark:bg-black"
        aria-roledescription="carousel"
        aria-label="About Voyager showcase"
      >
        <AnimatePresence mode="sync">
          <motion.div
            key={slide.id}
            initial={{ opacity: 0, scale: 1.06 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0"
          >
            <Image
              src={slide.image}
              alt=""
              fill
              priority={index === 0}
              sizes="100vw"
              className="object-cover"
            />
          </motion.div>
        </AnimatePresence>

        <div className="absolute inset-0 bg-linear-to-b from-black/55 via-black/20 to-black/65 dark:from-black/70 dark:via-black/35 dark:to-black/75" />
        <div className="absolute inset-0 bg-black/10 dark:bg-black/20" />

        <div className="relative z-10 mx-auto flex h-full max-w-[1700px] flex-col px-4 pb-10 pt-24 sm:px-8 lg:px-12">
          <div className="flex flex-1 flex-col items-center justify-center gap-10 lg:flex-row lg:items-center lg:justify-between lg:gap-16">
            <div className="relative order-2 flex w-full max-w-[280px] shrink-0 items-center justify-center sm:max-w-[300px] lg:order-1 lg:max-w-[320px]">
              <button
                type="button"
                onClick={() => go(-1)}
                aria-label="Previous slide"
                className="absolute -left-2 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-md transition-colors hover:bg-white/20 sm:-left-6"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>

              <div className="relative h-[340px] w-[220px] sm:h-[380px] sm:w-[240px]">
                <motion.div
                  key={`back-${nextSlide.id}`}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 0.85, x: 36, rotate: 4 }}
                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute inset-0 overflow-hidden rounded-4xl border border-white/10 shadow-2xl"
                >
                  <Image src={nextSlide.card.image} alt="" fill sizes="240px" className="object-cover" />
                  <div className="absolute inset-0 bg-black/30" />
                </motion.div>

                <AnimatePresence mode="wait">
                  <motion.div
                    key={slide.id}
                    initial={{ opacity: 0, y: 24, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -16, scale: 0.98 }}
                    transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                    className="absolute inset-0 overflow-hidden rounded-4xl border border-white/20 shadow-[0_24px_60px_rgba(0,0,0,0.45)]"
                  >
                    <Image
                      src={slide.card.image}
                      alt={slide.card.headline}
                      fill
                      sizes="240px"
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/10 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-5">
                      <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/60">
                        {slide.card.label}
                      </span>
                      <p className="mt-1 text-lg font-semibold text-white">{slide.card.headline}</p>
                      <button
                        type="button"
                        onClick={() => setActiveModal(slide.card.modal)}
                        className="mt-4 inline-flex rounded-full bg-white px-5 py-2.5 text-[10px] font-bold uppercase tracking-widest text-neutral-900 transition-transform hover:scale-[1.02]"
                      >
                        {slide.card.cta}
                      </button>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>

              <button
                type="button"
                onClick={() => go(1)}
                aria-label="Next slide"
                className="absolute -right-2 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-md transition-colors hover:bg-white/20 sm:-right-6"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>

            <div className="order-1 flex flex-1 flex-col items-center text-center lg:order-2 lg:items-center">
              <AnimatePresence mode="wait">
                <motion.div
                  key={slide.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                  className="max-w-xl"
                >
                  <h1 className="text-[clamp(2.75rem,8vw,5.5rem)] font-extralight uppercase leading-none tracking-[0.06em] text-white">
                    {slide.title}
                  </h1>
                  <p className="mt-4 text-sm font-light tracking-wide text-white/75 sm:text-base">
                    {slide.subtitle}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="hidden w-[320px] shrink-0 lg:block lg:order-3" aria-hidden />
          </div>

          <div className="flex items-end justify-between gap-4">
            <p className="hidden max-w-xs text-xs leading-relaxed text-white/40 sm:block">
              A travel platform built around clarity — curated listings, honest pricing, real support.
            </p>
            <div className="flex flex-1 items-center justify-center gap-2 sm:flex-none">
              {showcaseSlides.map((s, i) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => goTo(i)}
                  aria-label={`Go to slide ${i + 1}: ${s.title}`}
                  aria-current={i === index ? 'true' : undefined}
                  className="group flex h-6 items-center px-0.5"
                >
                  <span
                    className={`block h-1 rounded-full transition-all duration-300 ${
                      i === index ? 'w-7 bg-white' : 'w-2 bg-white/35 group-hover:bg-white/60'
                    }`}
                  />
                </button>
              ))}
            </div>
            <p className="text-xs font-medium tabular-nums text-white/50">
              {index + 1} / {SLIDE_COUNT}
            </p>
          </div>
        </div>
      </section>

      <ShowcaseCardModal modalId={activeModal} onClose={() => setActiveModal(null)} />
    </>
  )
}
