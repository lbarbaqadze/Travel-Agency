import type { Variants } from 'framer-motion'

export const easeOutExpo = [0.22, 1, 0.36, 1] as const

export const fadeUp = (delay = 0, distance = 24): Variants => ({
  hidden: { opacity: 0, y: distance },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, delay, ease: easeOutExpo } },
})

export const fadeIn = (delay = 0): Variants => ({
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.7, delay, ease: 'easeOut' } },
})

export const scaleIn = (delay = 0): Variants => ({
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5, delay, ease: easeOutExpo } },
})

export const staggerContainer = (stagger = 0.12, delayChildren = 0): Variants => ({
  hidden: {},
  visible: { transition: { staggerChildren: stagger, delayChildren } },
})

export const fadeUpContainer = (delay = 0, distance = 24, stagger = 0.08, delayChildren = 0.15): Variants => ({
  hidden: { opacity: 0, y: distance },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay, ease: easeOutExpo, staggerChildren: stagger, delayChildren },
  },
})

export const viewportOnce = { once: true, margin: '-80px' } as const
