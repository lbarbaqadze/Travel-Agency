'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Clock, Mail, MapPin } from 'lucide-react'
import { fadeUp, staggerContainer, viewportOnce } from '@/lib/motion'

const CONTACT_EMAIL = 'infovoyager2021@gmail.com'

const infoItems = [
  {
    icon: Mail,
    label: 'Email',
    value: CONTACT_EMAIL,
    href: `mailto:${CONTACT_EMAIL}`,
  },
  {
    icon: Clock,
    label: 'Response time',
    value: 'Within 24 hours',
  },
  {
    icon: MapPin,
    label: 'Based in',
    value: 'Tbilisi, Georgia',
  },
]

const item = fadeUp(0, 16)
const sectionStagger = staggerContainer(0.08)

export default function ContactSidebar() {
  return (
    <motion.aside
      variants={sectionStagger}
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
      className="flex flex-col gap-5 self-start"
    >
      <div className="rounded-3xl border border-neutral-100 bg-neutral-50 p-5 dark:border-neutral-800 dark:bg-neutral-900/60 sm:p-6">
        <motion.h2 variants={item} className="text-base font-bold text-neutral-900 dark:text-white">
          Contact details
        </motion.h2>

        <ul className="mt-4 flex flex-col gap-3">
          {infoItems.map(({ icon: Icon, label, value, href }) => (
            <motion.li key={label} variants={item} className="flex items-center gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-neutral-900 shadow-sm dark:bg-neutral-800 dark:text-white">
                <Icon className="h-4 w-4" strokeWidth={1.75} />
              </span>
              <div className="min-w-0">
                <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">{label}</p>
                {href ? (
                  <a
                    href={href}
                    className="block break-all text-sm font-semibold text-neutral-900 transition-colors hover:text-neutral-600 dark:text-white dark:hover:text-neutral-300"
                  >
                    {value}
                  </a>
                ) : (
                  <p className="text-sm font-semibold text-neutral-900 dark:text-white">{value}</p>
                )}
              </div>
            </motion.li>
          ))}
        </ul>

        <motion.div variants={item} className="mt-5 border-t border-neutral-200 pt-4 dark:border-neutral-700">
          <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">Quick links</p>
          <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
            <li>
              <Link href="/tours" className="text-sm text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white">
                Tours
              </Link>
            </li>
            <li>
              <Link href="/my-bookings" className="text-sm text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white">
                My bookings
              </Link>
            </li>
            <li>
              <Link href="/about" className="text-sm text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white">
                About
              </Link>
            </li>
          </ul>
        </motion.div>
      </div>
    </motion.aside>
  )
}
