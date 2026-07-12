'use client'

import { useEffect, useState } from 'react'
import { Loader2 } from 'lucide-react'
import { api, ApiError } from '@/lib/api'
import { ENDPOINTS } from '@/lib/endpoints'

interface AdminBooking {
  id: number
  guests: number
  total_price: number | string
  status: string
  created_at: string
  tour_title: string
  destination: string
  name: string
  surname: string
  email: string
}

interface BookingsAdminResponse {
  status: string
  results: number
  data: { bookings: AdminBooking[] }
}

const STATUS_STYLES: Record<string, string> = {
  pending: 'bg-amber-50 text-amber-700',
  confirmed: 'bg-emerald-50 text-emerald-700',
  cancelled: 'bg-neutral-100 text-neutral-400',
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<AdminBooking[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    api<BookingsAdminResponse>(ENDPOINTS.bookingsAdmin)
      .then((res) => setBookings(res.data.bookings))
      .catch((err) => setError(err instanceof ApiError ? err.message : 'Failed to load bookings'))
      .finally(() => setIsLoading(false))
  }, [])

  return (
    <div className="flex flex-1 flex-col">
      <header className="border-b border-neutral-100 bg-white dark:border-neutral-800 dark:bg-neutral-900 px-4 py-4 sm:px-6 sm:py-5 lg:px-8">
        <h1 className="text-xl sm:text-2xl font-light tracking-tight text-neutral-900 dark:text-white">Bookings</h1>
        <p className="mt-1 text-sm text-neutral-500">{bookings.length} reservations</p>
      </header>

      <div className="flex-1 p-4 sm:p-6 lg:p-8">
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-6 w-6 animate-spin text-neutral-400" />
          </div>
        ) : error ? (
          <p className="text-sm text-red-600">{error}</p>
        ) : bookings.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-neutral-200 bg-white dark:border-neutral-700 dark:bg-neutral-900 p-12 text-center">
            <p className="text-sm text-neutral-500">No bookings yet.</p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-neutral-100 bg-white dark:border-neutral-800 dark:bg-neutral-900 shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[800px] text-left text-sm">
                <thead>
                  <tr className="border-b border-neutral-100 bg-neutral-50/80 dark:bg-neutral-900/80">
                    <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-neutral-400">Tour</th>
                    <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-neutral-400">Guest</th>
                    <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-neutral-400">Guests</th>
                    <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-neutral-400">Total</th>
                    <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-neutral-400">Status</th>
                    <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-neutral-400">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((b) => (
                    <tr key={b.id} className="border-b border-neutral-50 last:border-0 dark:border-neutral-800 hover:bg-neutral-50/50 dark:hover:bg-neutral-800/50">
                      <td className="px-4 py-3">
                        <p className="font-semibold text-neutral-900 dark:text-white">{b.tour_title}</p>
                        <p className="text-xs text-neutral-400">{b.destination}</p>
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-neutral-900 capitalize">{b.name} {b.surname}</p>
                        <p className="text-xs text-neutral-400">{b.email}</p>
                      </td>
                      <td className="px-4 py-3 text-neutral-600">{b.guests}</td>
                      <td className="px-4 py-3 font-semibold text-neutral-900 dark:text-white">${Number(b.total_price).toFixed(0)}</td>
                      <td className="px-4 py-3">
                        <span className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest ${STATUS_STYLES[b.status] ?? 'bg-neutral-100 text-neutral-500'}`}>
                          {b.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-neutral-500">{formatDate(b.created_at)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
