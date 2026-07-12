'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { Tag } from 'lucide-react'
import { CATEGORY_LABELS } from '@/types/tour'
import { fadeUp } from '@/lib/motion'

const item = fadeUp(0, 12)

interface ToursCategoryFilterProps {
  category: string
}

export default function ToursCategoryFilter({ category }: ToursCategoryFilterProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  function toggleCategory(value: string) {
    const params = new URLSearchParams(searchParams.toString())
    params.delete('page')
    if (category === value) params.delete('category')
    else params.set('category', value)
    router.push(`/tours${params.toString() ? `?${params.toString()}` : ''}`, { scroll: false })
  }

  return (
    <motion.div variants={item} className="flex flex-wrap items-center gap-2">
      <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-neutral-400 mr-1">
        <Tag className="h-3 w-3" />
        Category
      </span>

      <button
        type="button"
        onClick={() => toggleCategory('')}
        className={`cursor-pointer rounded-full px-4 py-2 text-xs font-bold uppercase tracking-widest transition-colors ${
          !category
            ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900'
            : 'bg-neutral-100 text-neutral-500 hover:bg-neutral-200 hover:text-neutral-900 dark:bg-neutral-800 dark:text-neutral-400 dark:hover:bg-black dark:hover:text-white'
        }`}
      >
        All
      </button>

      {Object.entries(CATEGORY_LABELS).map(([value, label]) => (
        <button
          key={value}
          type="button"
          onClick={() => toggleCategory(value)}
          className={`cursor-pointer rounded-full px-4 py-2 text-xs font-bold uppercase tracking-widest transition-colors ${
            category === value
              ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900'
              : 'bg-neutral-100 text-neutral-500 hover:bg-neutral-200 hover:text-neutral-900 dark:bg-neutral-800 dark:text-neutral-400 dark:hover:bg-neutral-700 dark:hover:text-white'
          }`}
        >
          {label}
        </button>
      ))}
    </motion.div>
  )
}
