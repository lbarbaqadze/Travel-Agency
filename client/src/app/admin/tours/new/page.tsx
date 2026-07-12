'use client'

import { TourForm } from '@/components/admin'

export default function AdminNewTourPage() {
  return (
    <div className="flex flex-1 flex-col">
      <header className="border-b border-neutral-100 bg-white dark:border-neutral-800 dark:bg-neutral-900 px-4 py-4 sm:px-6 sm:py-5 lg:px-8">
        <h1 className="text-xl sm:text-2xl font-light tracking-tight text-neutral-900 dark:text-white">New Tour</h1>
        <p className="mt-1 text-sm text-neutral-500">Create a tour and upload photos to Cloudinary</p>
      </header>

      <div className="flex-1 p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-3xl rounded-2xl border border-neutral-100 bg-white dark:border-neutral-800 dark:bg-neutral-900 p-4 sm:p-6 lg:p-8 shadow-sm">
          <TourForm mode="create" />
        </div>
      </div>
    </div>
  )
}
