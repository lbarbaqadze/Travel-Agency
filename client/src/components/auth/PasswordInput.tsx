'use client'

import { authInputWithIcon, authLabel, authTogglePassword } from './authStyles'
import { Eye, EyeOff } from 'lucide-react'

interface PasswordInputProps {
  id: string
  label: string
  value: string
  onChange: (value: string) => void
  show: boolean
  onToggleShow: () => void
  minLength?: number
  maxLength?: number
  required?: boolean
  placeholder?: string
}

export default function PasswordInput({
  id,
  label,
  value,
  onChange,
  show,
  onToggleShow,
  minLength = 8,
  maxLength = 64,
  required = true,
  placeholder = '••••••••',
}: PasswordInputProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className={authLabel}>
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          type={show ? 'text' : 'password'}
          required={required}
          minLength={minLength}
          maxLength={maxLength}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={authInputWithIcon}
          autoComplete={id.includes('confirm') ? 'new-password' : 'new-password'}
        />
        <button
          type="button"
          onClick={onToggleShow}
          className={authTogglePassword}
          aria-label={show ? 'Hide password' : 'Show password'}
        >
          {show ? <EyeOff className="h-[18px] w-[18px]" strokeWidth={2} /> : <Eye className="h-[18px] w-[18px]" strokeWidth={2} />}
        </button>
      </div>
    </div>
  )
}
