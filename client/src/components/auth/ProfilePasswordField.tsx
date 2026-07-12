'use client'

import { Eye, EyeOff } from 'lucide-react'

interface ProfilePasswordFieldProps {
  id: string
  label: string
  value: string
  onChange: (value: string) => void
  show: boolean
  onToggleShow: () => void
  minLength?: number
  maxLength?: number
  required?: boolean
  autoComplete?: string
}

export default function ProfilePasswordField({
  id,
  label,
  value,
  onChange,
  show,
  onToggleShow,
  minLength,
  maxLength,
  required = true,
  autoComplete,
}: ProfilePasswordFieldProps) {
  return (
    <label htmlFor={id} className="flex min-w-0 flex-col gap-1.5">
      <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">{label}</span>
      <div className="relative">
        <input
          id={id}
          type={show ? 'text' : 'password'}
          required={required}
          minLength={minLength}
          maxLength={maxLength}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          autoComplete={autoComplete}
          className="h-14 min-w-0 w-full rounded-2xl border border-neutral-200 bg-white px-4 pr-12 text-base font-medium text-neutral-900 outline-none transition-colors focus:border-neutral-900 dark:border-neutral-700 dark:bg-neutral-950 dark:text-white dark:focus:border-white"
        />
        <button
          type="button"
          onClick={onToggleShow}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 transition-colors hover:text-neutral-900 dark:hover:text-white"
          aria-label={show ? 'Hide password' : 'Show password'}
        >
          {show ? <EyeOff className="h-4 w-4" strokeWidth={2} /> : <Eye className="h-4 w-4" strokeWidth={2} />}
        </button>
      </div>
    </label>
  )
}
