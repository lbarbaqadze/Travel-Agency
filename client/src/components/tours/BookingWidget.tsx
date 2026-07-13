'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { Minus, Plus, ShieldCheck, Users } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import { ApiError, useBookingStore } from '@/store/bookingStore'
import type { TourDetail } from '@/types/tour'

interface BookingWidgetProps {
  tour: TourDetail
}

export default function BookingWidget({ tour }: BookingWidgetProps) {
  const pathname = usePathname()
  const router = useRouter()
  const searchParams = useSearchParams()
  const user = useAuthStore((s) => s.user)
  const isAuthLoading = useAuthStore((s) => s.isLoading)
  const createBooking = useBookingStore((s) => s.createBooking)
  const fetchBookings = useBookingStore((s) => s.fetchBookings)
  const bookings = useBookingStore((s) => s.bookings)
  const isCreating = useBookingStore((s) => s.isCreating)

  const guests = Math.min(tour.max_guests, Math.max(1, Number(searchParams.get('guests') ?? '1') || 1))
  const [localError, setLocalError] = useState<string | null>(null)

  useEffect(() => {
    if (user) fetchBookings()
  }, [user, fetchBookings])

  const activeBooking = bookings.find(
    (b) => b.tour_id === tour.id && (b.status === 'pending' || b.status === 'confirmed')
  )

  const price = Number(tour.price)
  const total = price * guests

  function updateGuests(next: number) {
    setLocalError(null)
    const clamped = Math.min(tour.max_guests, Math.max(1, next))
    const params = new URLSearchParams(searchParams.toString())
    if (clamped > 1) params.set('guests', String(clamped))
    else params.delete('guests')
    router.replace(`${pathname}${params.toString() ? `?${params.toString()}` : ''}`, { scroll: false })
  }

  async function handleBook() {
    setLocalError(null)

    if (!user) {
      const query = searchParams.toString()
      const redirect = `${pathname}${query ? `?${query}` : ''}`
      router.push(`/login?redirect=${encodeURIComponent(redirect)}`)
      return
    }

    try {
      await createBooking(tour.id, guests)
      router.push('/my-bookings')
    } catch (err) {
      setLocalError(err instanceof ApiError ? err.message : 'Something went wrong. Please try again.')
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.15 }}
      className="rounded-3xl border border-neutral-100 bg-white p-6 shadow-xl shadow-neutral-900/5 dark:border-neutral-800 dark:bg-neutral-900 dark:shadow-black/30"
    >
      <div className="flex items-baseline gap-1.5">
        <span className="text-3xl font-bold text-neutral-900 dark:text-white">${price.toFixed(0)}</span>
        <span className="text-xs font-medium text-neutral-400">/ person</span>
      </div>

      <div className="mt-6 flex items-center justify-between rounded-full border border-neutral-100 px-4 py-3 dark:border-neutral-700">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-neutral-400">
          <Users className="h-3.5 w-3.5" />
          Guests
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => updateGuests(guests - 1)}
            disabled={guests <= 1}
            aria-label="Decrease guests"
            className="flex h-7 w-7 items-center justify-center rounded-full bg-neutral-100 text-neutral-600 transition-colors hover:bg-neutral-200 disabled:pointer-events-none disabled:opacity-30 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700"
          >
            <Minus className="h-3 w-3" />
          </button>
          <span className="w-5 text-center text-sm font-bold text-neutral-900 dark:text-white">{guests}</span>
          <button
            type="button"
            onClick={() => updateGuests(guests + 1)}
            disabled={guests >= tour.max_guests}
            aria-label="Increase guests"
            className="flex h-7 w-7 items-center justify-center rounded-full bg-neutral-100 text-neutral-600 transition-colors hover:bg-neutral-200 disabled:pointer-events-none disabled:opacity-30 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700"
          >
            <Plus className="h-3 w-3" />
          </button>
        </div>
      </div>
      <p className="mt-2 px-1 text-[11px] text-neutral-400">Up to {tour.max_guests} guests per booking.</p>

      <div className="mt-6 flex items-center justify-between border-t border-neutral-100 pt-5 dark:border-neutral-800">
        <span className="text-sm font-semibold text-neutral-500 dark:text-neutral-400">Total</span>
        <span className="text-xl font-bold text-neutral-900 dark:text-white">${total.toFixed(0)}</span>
      </div>

      {localError && (
        <p className="mt-4 rounded-xl bg-red-50 px-3 py-2 text-xs font-medium text-red-600 dark:bg-red-950/50 dark:text-red-400">{localError}</p>
      )}

      {activeBooking ? (
        <div className="mt-5 flex flex-col gap-3">
          <p className="rounded-xl bg-neutral-50 px-3 py-2.5 text-xs leading-relaxed text-neutral-600 dark:bg-neutral-800/60 dark:text-neutral-400">
            You already have a {activeBooking.status} booking for this tour.
          </p>
          <Link
            href="/my-bookings"
            className="flex w-full items-center justify-center rounded-full border border-neutral-200 py-4 text-xs font-bold uppercase tracking-widest text-neutral-900 transition-colors hover:border-neutral-300 dark:border-neutral-700 dark:text-white dark:hover:border-neutral-600"
          >
            View in My Bookings
          </Link>
        </div>
      ) : (
        <motion.button
          type="button"
          onClick={handleBook}
          disabled={isCreating || isAuthLoading}
          whileHover={{ scale: isCreating ? 1 : 1.02 }}
          whileTap={{ scale: isCreating ? 1 : 0.98 }}
          className="cursor-pointer mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-neutral-900 py-4 text-xs font-bold uppercase tracking-widest text-white transition-colors hover:bg-black disabled:opacity-60 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-100"
        >
          {isCreating ? 'Reserving...' : user ? 'Reserve Now' : 'Sign in to book'}
        </motion.button>
      )}

      <div className="mt-4 flex items-center justify-center gap-1.5 text-[11px] text-neutral-400">
        <ShieldCheck className="h-3.5 w-3.5" />
        No payment yet &middot; Confirm &amp; pay in My Bookings
      </div>
    </motion.div>
  )
}
