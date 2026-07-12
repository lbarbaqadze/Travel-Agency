'use client'

import { FormEvent, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ApiError, useAuthStore } from '@/store/authStore'
import AuthAside from '@/components/auth/AuthAside'
import {
  authCard,
  authFooterText,
  authFormPanel,
  authHeading,
  authInput,
  authLabel,
  authLink,
  authPage,
  authSubtext,
  authSubmitBtn,
} from '@/components/auth/authStyles'

export default function ForgotPasswordPage() {
  const router = useRouter()
  const forgotPassword = useAuthStore((s) => s.forgotPassword)

  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    setIsSubmitting(true)

    try {
      await forgotPassword(email)
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('voyager-reset-email', email)
      }
      router.push(`/change-password?email=${encodeURIComponent(email)}`)
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

  return (
    <div className={authPage}>
      <div className={authCard}>
        <div className={authFormPanel}>
          <div className="mx-auto flex w-full max-w-85 flex-col gap-10">
            <div className="flex flex-col gap-3">
              <h1 className={authHeading}>Forgot Password</h1>
              {error ? (
                <p className="text-sm font-medium tracking-wide text-rose-400">{error}</p>
              ) : (
                <p className={authSubtext}>
                  Enter your email and we&apos;ll send you a code to reset your password
                </p>
              )}
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-8">
              <div className="flex flex-col gap-1.5">
                <label className={authLabel}>Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Johndoe@gmail.com"
                  className={authInput}
                />
              </div>

              <button type="submit" disabled={isSubmitting} className={authSubmitBtn}>
                {isSubmitting ? 'Sending...' : 'Send Reset Code'}
              </button>
            </form>

            <p className={authFooterText}>
              Remember your password?
              <Link href="/login" className={`ml-2 ${authLink}`}>
                Back to Sign In
              </Link>
            </p>
          </div>
        </div>

        <AuthAside
          imagePublicId="reglog_ps6l23"
          eyebrow="Wanderlust"
          quote="To travel is to live."
        />
      </div>
    </div>
  )
}
