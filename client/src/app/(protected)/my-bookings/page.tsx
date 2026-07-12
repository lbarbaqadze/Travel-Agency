'use client'

import { Suspense, useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { AnimatePresence, motion } from 'framer-motion'
import {
  CalendarDays,
  CheckCircle2,
  Clock,
  CreditCard,
  MapPin,
  Ticket,
  Trash2,
  Users,
  XCircle,
} from 'lucide-react'
import Navbar from '@/components/layout/Navbar'
import ConfirmModal from '@/components/ui/ConfirmModal'
import { api } from '@/lib/api'
import { ENDPOINTS } from '@/lib/endpoints'
import { useAuthStore } from '@/store/authStore'
import { ApiError, useBookingStore } from '@/store/bookingStore'
import type { Booking, BookingStatus } from '@/types/booking'
import { fadeUp, scaleIn, staggerContainer } from '@/lib/motion'

const sectionStagger = staggerContainer(0.12)
const headerItem = fadeUp(0, 16)
const cardItem = scaleIn(0)

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

const STATUS_STYLES: Record<BookingStatus, string> = {
  pending: 'bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-400',
  confirmed: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400',
  cancelled: 'bg-neutral-100 text-neutral-400 dark:bg-neutral-800 dark:text-neutral-500',
}

const STATUS_ICONS: Record<BookingStatus, typeof Clock> = {
  pending: Clock,
  confirmed: CheckCircle2,
  cancelled: XCircle,
}

function StatusBadge({ status }: { status: BookingStatus }) {
  const Icon = STATUS_ICONS[status]
  return (
    <span
      className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest ${STATUS_STYLES[status]}`}
    >
      <Icon className="h-3 w-3" />
      {status}
    </span>
  )
}

function BookingCard({ booking }: { booking: Booking }) {
  const payForBooking = useBookingStore((s) => s.payForBooking)
  const cancelBooking = useBookingStore((s) => s.cancelBooking)
  const deleteBooking = useBookingStore((s) => s.deleteBooking)
  const payingId = useBookingStore((s) => s.payingId)
  const cancellingId = useBookingStore((s) => s.cancellingId)
  const deletingId = useBookingStore((s) => s.deletingId)

  const [localError, setLocalError] = useState<string | null>(null)
  const [confirmAction, setConfirmAction] = useState<'cancel' | 'delete' | null>(null)
  const isPaying = payingId === booking.id
  const isCancelling = cancellingId === booking.id
  const isDeleting = deletingId === booking.id
  const total = Number(booking.total_price)
  const isCancelled = booking.status === 'cancelled'

  async function handlePay() {
    setLocalError(null)
    try {
      await payForBooking(booking.id)
    } catch (err) {
      setLocalError(err instanceof ApiError ? err.message : 'Something went wrong. Please try again.')
    }
  }

  async function confirmCancel() {
    setLocalError(null)
    try {
      await cancelBooking(booking.id)
      setConfirmAction(null)
    } catch (err) {
      setLocalError(err instanceof ApiError ? err.message : 'Something went wrong. Please try again.')
    }
  }

  async function confirmDelete() {
    setLocalError(null)
    try {
      await deleteBooking(booking.id)
      setConfirmAction(null)
    } catch (err) {
      setLocalError(err instanceof ApiError ? err.message : 'Something went wrong. Please try again.')
    }
  }

  return (
    <motion.div
      variants={cardItem}
      exit={{ opacity: 0, scale: 0.96, transition: { duration: 0.2 } }}
      className={`relative rounded-3xl border border-neutral-100 bg-white p-6 shadow-sm transition-opacity dark:border-neutral-800 dark:bg-neutral-900 ${
        isCancelled ? 'opacity-60' : ''
      }`}
    >
      <button
        type="button"
        onClick={() => setConfirmAction('delete')}
        disabled={isDeleting}
        aria-label="Remove booking"
        title="Remove booking"
        className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full text-neutral-300 transition-colors hover:bg-red-50 hover:text-red-500 disabled:opacity-50 dark:text-neutral-600 dark:hover:bg-red-950/40 dark:hover:text-red-400"
      >
        <Trash2 className="h-4 w-4" />
      </button>

      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 pr-8">
        <div className="min-w-0">
          <div className="flex items-center gap-3 flex-wrap">
            <h3 className="text-base font-bold text-neutral-900 dark:text-white">{booking.tour_title}</h3>
            <StatusBadge status={booking.status} />
          </div>
          <p className="mt-1.5 flex items-center gap-1.5 text-sm text-neutral-500 dark:text-neutral-400">
            <MapPin className="h-3.5 w-3.5 text-neutral-400" />
            {booking.destination}
          </p>

          <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-neutral-500 dark:text-neutral-400">
            <span className="flex items-center gap-1.5">
              <Users className="h-3.5 w-3.5 text-neutral-400" />
              {booking.guests} {booking.guests === 1 ? 'guest' : 'guests'}
            </span>
            <span className="flex items-center gap-1.5">
              <CalendarDays className="h-3.5 w-3.5 text-neutral-400" />
              Booked {formatDate(booking.created_at)}
            </span>
          </div>
        </div>

        <div className="flex flex-col items-start sm:items-end gap-3 shrink-0">
          <span className="text-xl font-bold text-neutral-900 dark:text-white">${total.toFixed(0)}</span>

          {booking.status === 'pending' && (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setConfirmAction('cancel')}
                disabled={isCancelling || isPaying}
                className="rounded-full px-4 py-2.5 text-xs font-bold uppercase tracking-widest text-neutral-400 transition-colors hover:text-red-600 disabled:opacity-50 dark:hover:text-red-400"
              >
                {isCancelling ? 'Cancelling...' : 'Cancel'}
              </button>
              <button
                type="button"
                onClick={handlePay}
                disabled={isPaying || isCancelling}
                className="flex items-center gap-2 rounded-full bg-neutral-900 px-5 py-2.5 text-xs font-bold uppercase tracking-widest text-white transition-colors hover:bg-black disabled:opacity-60 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-100"
              >
                <CreditCard className="h-3.5 w-3.5" />
                {isPaying ? 'Redirecting...' : 'Pay Now'}
              </button>
            </div>
          )}
        </div>
      </div>

      {localError && (
        <p className="mt-4 rounded-xl bg-red-50 px-3 py-2 text-xs font-medium text-red-600 dark:bg-red-950/40 dark:text-red-400">{localError}</p>
      )}

      <ConfirmModal
        isOpen={confirmAction === 'cancel'}
        title="Cancel this reservation?"
        description={`You're about to cancel your booking for "${booking.tour_title}". You can always book again later.`}
        confirmLabel="Cancel Reservation"
        cancelLabel="Keep it"
        isLoading={isCancelling}
        onConfirm={confirmCancel}
        onCancel={() => setConfirmAction(null)}
      />

      <ConfirmModal
        isOpen={confirmAction === 'delete'}
        title="Remove this booking?"
        description={`"${booking.tour_title}" will be permanently removed from your bookings. This can't be undone.`}
        confirmLabel="Remove"
        cancelLabel="Keep it"
        isLoading={isDeleting}
        onConfirm={confirmDelete}
        onCancel={() => setConfirmAction(null)}
      />
    </motion.div>
  )
}

function BookingSkeleton() {
  return (
    <div className="rounded-3xl border border-neutral-100 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-900">
      <div className="h-4 w-1/3 rounded bg-neutral-100 animate-pulse dark:bg-neutral-800" />
      <div className="mt-3 h-3 w-1/4 rounded bg-neutral-100 animate-pulse dark:bg-neutral-800" />
      <div className="mt-6 h-3 w-1/2 rounded bg-neutral-100 animate-pulse dark:bg-neutral-800" />
    </div>
  )
}

function MyBookingsContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const wasCancelled = searchParams.get('checkout') === 'cancelled'
  const sessionId = searchParams.get('session_id')
  const [showCancelledNotice, setShowCancelledNotice] = useState(wasCancelled)
  const [paymentNotice, setPaymentNotice] = useState<'confirming' | 'confirmed' | 'failed' | null>(
    sessionId ? 'confirming' : null
  )

  const user = useAuthStore((s) => s.user)
  const isAuthLoading = useAuthStore((s) => s.isLoading)
  const bookings = useBookingStore((s) => s.bookings)
  const isLoadingBookings = useBookingStore((s) => s.isLoadingBookings)
  const fetchError = useBookingStore((s) => s.error)
  const fetchBookings = useBookingStore((s) => s.fetchBookings)

  useEffect(() => {
    if (!isAuthLoading && !user) {
      router.replace('/login?redirect=/my-bookings')
    }
  }, [user, isAuthLoading, router])

  useEffect(() => {
    if (!user) return

    if (sessionId) {
      api(ENDPOINTS.paymentSuccess(sessionId))
        .then(() => setPaymentNotice('confirmed'))
        .catch(() => setPaymentNotice('failed'))
        .finally(() => {
          fetchBookings()
          router.replace('/my-bookings', { scroll: false })
        })
    } else {
      fetchBookings()
    }
  }, [user, fetchBookings])

  const sorted = [...bookings].sort((a, b) => (a.id < b.id ? 1 : -1))
  const isLoading = isAuthLoading || (isLoadingBookings && bookings.length === 0)

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-white dark:bg-neutral-950">
        <motion.section
          variants={sectionStagger}
          initial="hidden"
          animate="visible"
          className="max-w-[1700px] mx-auto px-4 sm:px-6 lg:px-8 pt-10 sm:pt-15 pb-4"
        >
          <motion.span
            variants={headerItem}
            className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-neutral-400"
          >
            <Ticket className="h-3.5 w-3.5" />
            My Bookings
          </motion.span>
          <motion.h1
            variants={headerItem}
            className="mt-3 text-4xl sm:text-5xl font-light tracking-tight text-neutral-900 dark:text-white"
          >
            Your reservations,
            <span className="block font-bold">all in one place.</span>
          </motion.h1>
        </motion.section>

        <section className="max-w-[1700px] mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-20 sm:pb-24">
          {paymentNotice === 'confirming' && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 flex items-center gap-3 rounded-2xl bg-neutral-50 px-5 py-4 text-sm text-neutral-600 dark:bg-neutral-900 dark:text-neutral-300"
            >
              <div className="h-4 w-4 shrink-0 rounded-full border-2 border-neutral-300 border-t-neutral-900 animate-spin dark:border-neutral-600 dark:border-t-white" />
              Confirming your payment...
            </motion.div>
          )}
          {paymentNotice === 'confirmed' && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 flex items-center justify-between gap-4 rounded-2xl bg-emerald-50 px-5 py-4 text-sm text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400"
            >
              <span className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 shrink-0" />
                Payment successful — your booking is confirmed. Enjoy your trip!
              </span>
              <button
                type="button"
                onClick={() => setPaymentNotice(null)}
                className="shrink-0 text-xs font-bold uppercase tracking-widest hover:text-emerald-900 dark:hover:text-emerald-300"
              >
                Dismiss
              </button>
            </motion.div>
          )}
          {paymentNotice === 'failed' && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 flex items-center justify-between gap-4 rounded-2xl bg-red-50 px-5 py-4 text-sm text-red-600 dark:bg-red-950/40 dark:text-red-400"
            >
              <span>We couldn&apos;t verify your payment automatically. If you were charged, it will be confirmed shortly — try refreshing.</span>
              <button
                type="button"
                onClick={() => setPaymentNotice(null)}
                className="shrink-0 text-xs font-bold uppercase tracking-widest hover:text-red-800 dark:hover:text-red-300"
              >
                Dismiss
              </button>
            </motion.div>
          )}
          {showCancelledNotice && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 flex items-center justify-between gap-4 rounded-2xl bg-amber-50 px-5 py-4 text-sm text-amber-700 dark:bg-amber-950/40 dark:text-amber-400"
            >
              <span>Checkout was cancelled. Your reservation is still pending — you can pay whenever you&apos;re ready.</span>
              <button
                type="button"
                onClick={() => setShowCancelledNotice(false)}
                className="shrink-0 text-xs font-bold uppercase tracking-widest hover:text-amber-900 dark:hover:text-amber-300"
              >
                Dismiss
              </button>
            </motion.div>
          )}

          {isLoading ? (
            <div className="flex flex-col gap-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <BookingSkeleton key={i} />
              ))}
            </div>
          ) : fetchError && bookings.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-neutral-200 bg-neutral-50 p-12 text-center dark:border-neutral-700 dark:bg-neutral-900/50">
              <p className="text-sm text-neutral-500 dark:text-neutral-400">{fetchError}</p>
            </div>
          ) : sorted.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-neutral-200 bg-neutral-50 p-12 text-center dark:border-neutral-700 dark:bg-neutral-900/50">
              <p className="text-sm text-neutral-500 dark:text-neutral-400">You haven&apos;t reserved any tours yet.</p>
              <Link
                href="/tours"
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-neutral-900 px-6 py-3 text-xs font-bold uppercase tracking-widest text-white hover:bg-black transition-colors dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-100"
              >
                Explore tours
              </Link>
            </div>
          ) : (
            <motion.div
              variants={staggerContainer(0.08)}
              initial="hidden"
              animate="visible"
              className="flex flex-col gap-4"
            >
              <AnimatePresence initial={false}>
                {sorted.map((booking) => (
                  <BookingCard key={booking.id} booking={booking} />
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </section>
      </main>
    </>
  )
}

export default function MyBookingsPage() {
  return (
    <Suspense fallback={null}>
      <MyBookingsContent />
    </Suspense>
  )
}
