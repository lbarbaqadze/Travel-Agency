'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { MapPin, Plane, Search } from 'lucide-react'
import { CATEGORY_LABELS } from '@/types/tour'
import { useTours } from '@/hooks/useTours'
import { fadeUp, fadeUpContainer, staggerContainer, viewportOnce } from '@/lib/motion'

const sectionStagger = staggerContainer(0.18)
const headerItem = fadeUp(0, 16)
const formContainer = fadeUpContainer(0, 24, 0.08, 0.2)
const fieldItem = fadeUp(0, 16)

export default function FlightSearchPanel() {
  const router = useRouter()
  const { tours } = useTours({ limit: 50 })

  const destinationOptions = useMemo(
    () => Array.from(new Set(tours.map((t) => t.destination))).sort(),
    [tours]
  )

  const [destination, setDestination] = useState('')
  const [category, setCategory] = useState('')
  const [maxPrice, setMaxPrice] = useState('')
  const [isDestOpen, setIsDestOpen] = useState(false)
  const destRef = useRef<HTMLDivElement>(null)

  const filteredOptions = useMemo(
    () =>
      destination
        ? destinationOptions.filter((d) => d.toLowerCase().includes(destination.toLowerCase()))
        : destinationOptions,
    [destination, destinationOptions]
  )

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (destRef.current && !destRef.current.contains(e.target as Node)) {
        setIsDestOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    const params = new URLSearchParams()
    if (destination) params.set('destination', destination)
    if (category) params.set('category', category)
    if (maxPrice) params.set('maxPrice', maxPrice)
    router.push(`/tours${params.toString() ? `?${params.toString()}` : ''}`)
  }

  return (
    <motion.section
      id="search"
      variants={sectionStagger}
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
      className="max-w-[1700px] mx-auto px-4 sm:px-6 lg:px-8 pt-16"
    >
      <div className="mb-8">
        <motion.span
          variants={headerItem}
          className="block text-xs font-bold uppercase tracking-widest text-neutral-400"
        >
          Flight Booking
        </motion.span>
        <motion.h2
          variants={headerItem}
          className="mt-3 text-3xl sm:text-4xl font-light tracking-tight text-neutral-900 dark:text-white"
        >
          Explore New Horizons,
          <span className="block font-bold">One Destination at a Time.</span>
        </motion.h2>
      </div>

      <motion.form
        onSubmit={handleSearch}
        variants={formContainer}
        className="flex flex-col lg:flex-row lg:items-center gap-3 rounded-4xl border border-neutral-100 bg-white p-3 shadow-xl shadow-neutral-900/5 dark:border-neutral-800 dark:bg-neutral-900 dark:shadow-black/20"
      >
        <motion.div variants={fieldItem} ref={destRef} className="relative flex flex-1">
          <label className="flex flex-1 cursor-text items-center gap-3 rounded-full px-4 py-3 hover:bg-neutral-50 transition-colors dark:hover:bg-neutral-800">
            <MapPin className="h-4 w-4 text-neutral-400 shrink-0" />
            <div className="flex flex-col min-w-0 w-full">
              <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">
                Destination
              </span>
              <input
                type="text"
                value={destination}
                onChange={(e) => {
                  setDestination(e.target.value)
                  setIsDestOpen(true)
                }}
                onFocus={() => setIsDestOpen(true)}
                placeholder="Where to?"
                autoComplete="off"
                className="w-full bg-transparent text-sm font-semibold text-neutral-900 placeholder:text-neutral-300 placeholder:font-normal outline-none dark:text-white dark:placeholder:text-neutral-600"
              />
            </div>
          </label>

          {isDestOpen && filteredOptions.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.15 }}
              className="absolute left-0 top-[calc(100%+8px)] z-20 max-h-64 w-full overflow-y-auto rounded-2xl border border-neutral-100 bg-white p-2 shadow-xl dark:border-neutral-700 dark:bg-neutral-900"
            >
              {filteredOptions.map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => {
                    setDestination(d)
                    setIsDestOpen(false)
                  }}
                  className="flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-left text-sm font-medium text-neutral-700 hover:bg-neutral-50 transition-colors dark:text-neutral-200 dark:hover:bg-neutral-800"
                >
                  <MapPin className="h-3.5 w-3.5 text-neutral-400" />
                  {d}
                </button>
              ))}
            </motion.div>
          )}
        </motion.div>

        <div className="hidden lg:block h-8 w-px bg-neutral-100 dark:bg-neutral-800" />

        <motion.label
          variants={fieldItem}
          className="flex flex-1 items-center gap-3 rounded-full px-4 py-3 hover:bg-neutral-50 transition-colors dark:hover:bg-neutral-800"
        >
          <Plane className="h-4 w-4 text-neutral-400 shrink-0" />
          <div className="flex flex-col min-w-0 w-full">
            <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">
              Trip Type
            </span>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-transparent text-sm font-semibold text-neutral-900 outline-none appearance-none cursor-pointer dark:text-white"
            >
              <option value="">Any category</option>
              {Object.entries(CATEGORY_LABELS).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>
        </motion.label>

        <div className="hidden lg:block h-8 w-px bg-neutral-100 dark:bg-neutral-800" />

        <motion.label
          variants={fieldItem}
          className="flex flex-1 items-center gap-3 rounded-full px-4 py-3 hover:bg-neutral-50 transition-colors dark:hover:bg-neutral-800"
        >
          <span className="text-neutral-400 shrink-0 text-sm font-bold">$</span>
          <div className="flex flex-col min-w-0">
            <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">
              Budget up to
            </span>
            <input
              type="number"
              min={0}
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              placeholder="No limit"
              className="w-full appearance-none bg-transparent text-sm font-semibold text-neutral-900 placeholder:text-neutral-300 placeholder:font-normal outline-none [-moz-appearance:textfield] dark:text-white dark:placeholder:text-neutral-600 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
            />
          </div>
        </motion.label>

        <motion.button
          variants={fieldItem}
          type="submit"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className="flex items-center justify-center gap-2 rounded-full bg-neutral-900 px-7 py-4 text-xs font-bold uppercase tracking-widest text-white shrink-0 hover:bg-black transition-colors shadow-sm dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-100"
        >
          <Search className="h-3.5 w-3.5" />
          Search Tours
        </motion.button>
      </motion.form>
    </motion.section>
  )
}
