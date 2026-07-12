'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import { TourForm } from '@/components/admin'
import { api, ApiError } from '@/lib/api'
import { ENDPOINTS } from '@/lib/endpoints'
import type { TourDetail } from '@/types/tour'

interface TourByIdResponse {
  status: string
  data: { tour: TourDetail }
}

export default function AdminEditTourPage() {
  const params = useParams<{ id: string }>()
  const [tour, setTour] = useState<TourDetail | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!params.id) return
    api<TourByIdResponse>(ENDPOINTS.tourById(params.id))
      .then((res) => setTour(res.data.tour))
      .catch((err) => setError(err instanceof ApiError ? err.message : 'Failed to load tour'))
      .finally(() => setIsLoading(false))
  }, [params.id])

  return (
    <div className="flex flex-1 flex-col">
      <header className="border-b border-neutral-100 bg-white dark:border-neutral-800 dark:bg-neutral-900 px-4 py-4 sm:px-6 sm:py-5 lg:px-8">
        <h1 className="text-xl sm:text-2xl font-light tracking-tight text-neutral-900 dark:text-white">Edit Tour</h1>
        <p className="mt-1 text-sm text-neutral-500 truncate">
          {tour ? tour.title : 'Loading...'}
        </p>
      </header>

      <div className="flex-1 p-4 sm:p-6 lg:p-8">
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-6 w-6 animate-spin text-neutral-400" />
          </div>
        ) : error ? (
          <p className="text-sm text-red-600">{error}</p>
        ) : tour ? (
          <div className="mx-auto max-w-3xl rounded-2xl border border-neutral-100 bg-white dark:border-neutral-800 dark:bg-neutral-900 p-4 sm:p-6 lg:p-8 shadow-sm">
            <TourForm mode="edit" tour={tour} />
          </div>
        ) : null}
      </div>
    </div>
  )
}
