'use client'

import { FormEvent, Suspense, useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { ApiError, useAuthStore } from '@/store/authStore'
import PasswordInput from '@/components/auth/PasswordInput'
import {
  authCardCompact,
  authFooterText,
  authHeadingCompact,
  authInputCode,
  authLabelCenter,
  authLink,
  authLinkMuted,
  authPage,
  authResendBtn,
  authSubtext,
  authSubmitBtn,
} from '@/components/auth/authStyles'

const RESET_EMAIL_KEY = 'voyager-reset-email'

function ChangePasswordForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const resetPassword = useAuthStore((s) => s.resetPassword)
  const forgotPassword = useAuthStore((s) => s.forgotPassword)

  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isResending, setIsResending] = useState(false)

  useEffect(() => {
    const fromQuery = searchParams.get('email')
    const fromStorage = typeof window !== 'undefined' ? sessionStorage.getItem(RESET_EMAIL_KEY) : null
    const resolved = fromQuery ?? fromStorage ?? ''
    setEmail(resolved)
    if (resolved && typeof window !== 'undefined') {
      sessionStorage.setItem(RESET_EMAIL_KEY, resolved)
    }
  }, [searchParams])

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    setIsSubmitting(true)

    try {
      await resetPassword(code, newPassword)
      sessionStorage.removeItem(RESET_EMAIL_KEY)
      router.push('/login')
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message)
      } else {
        setError('Something went wrong. Please try again.')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleResend() {
    if (!email) {
      setError('Email is missing. Please request a new code from forgot password.')
      return
    }

    setError('')
    setSuccess('')
    setIsResending(true)

    try {
      await forgotPassword(email)
      setSuccess('A new verification code has been sent. Check your inbox and spam folder.')
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message)
      } else {
        setError('Something went wrong. Please try again.')
      }
    } finally {
      setIsResending(false)
    }
  }

  return (
    <div className={authCardCompact}>
      <div className="flex flex-col gap-3 text-center">
        <h1 className={authHeadingCompact}>Change Password</h1>
        {error ? (
          <p className="text-sm font-medium tracking-wide text-rose-400">{error}</p>
        ) : success ? (
          <p className="text-sm font-medium tracking-wide text-emerald-600 dark:text-emerald-400">{success}</p>
        ) : (
          <p className={authSubtext}>
            {email ? (
              <>
                Enter the 6-digit verification code sent to{' '}
                <span className="not-italic text-neutral-600 dark:text-neutral-300">{email}</span>, then choose a new
                password.
              </>
            ) : (
              'Enter the 6-digit verification code from your email and choose a new password.'
            )}
          </p>
        )}
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <div className="flex flex-col gap-1.5">
          <label className={authLabelCenter}>Verification Code</label>
          <input
            type="text"
            inputMode="numeric"
            autoComplete="one-time-code"
            required
            maxLength={6}
            pattern="[0-9]{6}"
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
            placeholder="••••••"
            className={authInputCode}
          />
        </div>

        <PasswordInput
          id="new-password"
          label="New Password"
          value={newPassword}
          onChange={setNewPassword}
          show={showNewPassword}
          onToggleShow={() => setShowNewPassword((prev) => !prev)}
        />

        <PasswordInput
          id="confirm-password"
          label="Confirm Password"
          value={confirmPassword}
          onChange={setConfirmPassword}
          show={showConfirmPassword}
          onToggleShow={() => setShowConfirmPassword((prev) => !prev)}
        />

        <p className="text-[11px] leading-relaxed text-neutral-400 dark:text-neutral-500">
          Password must be 8–64 characters and include uppercase, lowercase, number, and special character.
        </p>

        <button
          type="submit"
          disabled={isSubmitting || code.length !== 6 || !newPassword || !confirmPassword}
          className={authSubmitBtn}
        >
          {isSubmitting ? 'Resetting...' : 'Reset Password'}
        </button>
      </form>

      <div className={`${authFooterText} flex flex-col gap-4`}>
        <p>
          Didn&apos;t receive the code?{' '}
          <button
            type="button"
            onClick={handleResend}
            disabled={isResending || !email}
            className={authResendBtn}
          >
            {isResending ? 'Sending...' : 'Resend code'}
          </button>
        </p>
        <p>
          <Link href="/forgot-password" className={authLink}>
            Request a new code
          </Link>
          {' · '}
          <Link href="/login" className={authLinkMuted}>
            Back to Sign In
          </Link>
        </p>
      </div>
    </div>
  )
}

export default function ChangePasswordPage() {
  return (
    <div className={authPage}>
      <Suspense
        fallback={
          <div className={`${authCardCompact} text-center text-sm text-neutral-400 dark:text-neutral-500`}>
            Loading...
          </div>
        }
      >
        <ChangePasswordForm />
      </Suspense>
    </div>
  )
}
