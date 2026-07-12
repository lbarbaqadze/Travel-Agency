'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { CalendarDays, Map, MessageSquare, Users } from 'lucide-react'
import { api, ApiError } from '@/lib/api'
import { ENDPOINTS } from '@/lib/endpoints'

interface Stats {
  tours: number
  bookings: number
  reviews: number
  users: number
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    Promise.all([
      api<{ pagination: { total: number } }>(ENDPOINTS.toursAdmin('limit=1')),
      api<{ results: number }>(ENDPOINTS.bookingsAdmin),
      api<{ results: number }>(ENDPOINTS.reviewsAdmin),
      api<{ results: number }>(ENDPOINTS.users),
    ])
      .then(([toursRes, bookingsRes, reviewsRes, usersRes]) => {
        setStats({
          tours: toursRes.pagination.total,
          bookings: bookingsRes.results,
          reviews: reviewsRes.results,
          users: usersRes.results,
        })
      })
      .catch((err) => setError(err instanceof ApiError ? err.message : 'Failed to load stats'))
  }, [])

  const cards = [
    { label: 'Tours', value: stats?.tours, href: '/admin/tours', icon: Map },
    { label: 'Bookings', value: stats?.bookings, href: '/admin/bookings', icon: CalendarDays },
    { label: 'Reviews', value: stats?.reviews, href: '/admin/reviews', icon: MessageSquare },
    { label: 'Users', value: stats?.users, href: '/admin/users', icon: Users },
  ]

  return (
    <div className="flex flex-1 flex-col">
      <header className="border-b border-neutral-100 bg-white dark:border-neutral-800 dark:bg-neutral-900 px-4 py-4 sm:px-6 sm:py-5 lg:px-8">
        <h1 className="text-xl sm:text-2xl font-light tracking-tight text-neutral-900 dark:text-white">
          Dashboard
        </h1>
        <p className="mt-1 text-sm text-neutral-500">Overview of your travel agency</p>
      </header>

      <div className="flex-1 p-4 sm:p-6 lg:p-8">
        {error ? (
          <p className="text-sm text-red-600">{error}</p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {cards.map(({ label, value, href, icon: Icon }) => (
              <Link
                key={label}
                href={href}
                className="group rounded-2xl border border-neutral-100 bg-white dark:border-neutral-800 dark:bg-neutral-900 p-6 shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="flex items-center justify-between">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300 transition-colors group-hover:bg-neutral-900 group-hover:text-white">
                    <Icon className="h-5 w-5" />
                  </span>
                  <span className="text-3xl font-bold text-neutral-900 dark:text-white">
                    {value ?? '—'}
                  </span>
                </div>
                <p className="mt-4 text-xs font-bold uppercase tracking-widest text-neutral-400">{label}</p>
              </Link>
            ))}
          </div>
        )}

        <div className="mt-8 rounded-2xl border border-neutral-100 bg-white dark:border-neutral-800 dark:bg-neutral-900 p-6">
          <h2 className="text-sm font-bold text-neutral-900 dark:text-white">Quick actions</h2>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link
              href="/admin/tours/new"
              className="rounded-full bg-neutral-900 px-5 py-2.5 text-xs font-bold uppercase tracking-widest text-white hover:bg-black dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-100 transition-colors"
            >
              Add new tour
            </Link>
            <Link
              href="/admin/tours"
              className="rounded-full border border-neutral-200 px-5 py-2.5 text-xs font-bold uppercase tracking-widest text-neutral-600 hover:bg-neutral-50 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800 transition-colors"
            >
              Manage tours
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
