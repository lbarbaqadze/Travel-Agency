'use client'

import { Compass, RotateCcw } from 'lucide-react'
import Link from 'next/link'
import { useEffect } from 'react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-8 bg-white px-4 text-center dark:bg-neutral-950">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-neutral-900 dark:bg-white">
        <Compass className="h-7 w-7 text-white dark:text-neutral-900" strokeWidth={2} />
      </div>

      <div className="max-w-md">
        <p className="text-xs font-bold uppercase tracking-[0.28em] text-neutral-400">Something went wrong</p>
        <h1 className="mt-3 text-3xl font-light tracking-tight text-neutral-900 dark:text-white sm:text-4xl">
          We hit a
          <span className="block font-bold">small bump.</span>
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-neutral-500 dark:text-neutral-400">
          An unexpected error occurred. Try again, or head back home while we get things sorted.
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          onClick={reset}
          className="inline-flex items-center gap-2 rounded-full bg-neutral-900 px-6 py-3 text-xs font-bold uppercase tracking-widest text-white transition-colors hover:bg-black dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-100"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          Try again
        </button>
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-full border border-neutral-200 px-6 py-3 text-xs font-bold uppercase tracking-widest text-neutral-900 transition-colors hover:border-neutral-300 dark:border-neutral-700 dark:text-white dark:hover:border-neutral-600"
        >
          Back home
        </Link>
      </div>
    </div>
  )
}
