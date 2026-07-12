'use client'

import { useEffect, useState } from 'react'
import { Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'

const THEME_TRANSITION_MS = 100

type ThemeToggleProps = {
  transparent?: boolean
  className?: string
}

function runThemeTransition(callback: () => void) {
  const root = document.documentElement
  root.classList.add('theme-transition')

  requestAnimationFrame(() => {
    requestAnimationFrame(callback)
  })

  window.setTimeout(() => {
    root.classList.remove('theme-transition')
  }, THEME_TRANSITION_MS)
}

export default function ThemeToggle({ transparent = false, className = '' }: ThemeToggleProps) {
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  if (!mounted) {
    return <span className={`inline-block h-10 w-10 shrink-0 ${className}`} aria-hidden />
  }

  const isDark = resolvedTheme === 'dark'

  function handleToggle() {
    runThemeTransition(() => setTheme(isDark ? 'light' : 'dark'))
  }

  return (
    <button
      type="button"
      onClick={handleToggle}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      className={`inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${
        transparent
          ? 'border-white/30 text-white/80 hover:border-white/50 hover:text-white focus-visible:ring-white'
          : 'border-neutral-200 text-neutral-600 hover:border-neutral-300 hover:text-neutral-900 focus-visible:ring-neutral-900 dark:border-neutral-700 dark:text-neutral-300 dark:hover:border-neutral-500 dark:hover:text-white dark:focus-visible:ring-white'
      } ${className}`}
    >
      {isDark ? <Sun className="h-4 w-4" strokeWidth={2} /> : <Moon className="h-4 w-4" strokeWidth={2} />}
    </button>
  )
}
