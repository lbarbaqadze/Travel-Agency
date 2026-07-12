export default function Loading() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-white px-4 dark:bg-neutral-950">
      <div className="relative h-12 w-12">
        <div className="absolute inset-0 rounded-full border-2 border-neutral-200 dark:border-neutral-800" />
        <div className="absolute inset-0 animate-spin rounded-full border-2 border-transparent border-t-neutral-900 dark:border-t-white" />
      </div>
      <p className="text-xs font-bold uppercase tracking-[0.28em] text-neutral-400">Loading</p>
    </div>
  )
}
