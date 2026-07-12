'use client'

import { FormEvent, Suspense, useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { ApiError, useAuthStore } from '@/store/authStore'
import {
  authCardCompact,
  authFooterText,
  authHeadingCompact,
  authInputCode,
  authLabelCenter,
  authLinkMuted,
  authPage,
  authResendBtn,
  authSubtext,
  authSubmitBtn,
} from '@/components/auth/authStyles'

function VerifyEmailForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const verifyEmail = useAuthStore((s) => s.verifyEmail)
  const resendVerification = useAuthStore((s) => s.resendVerification)

  const email = searchParams.get('email') ?? ''
  const [code, setCode] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isResending, setIsResending] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!email) {
      setError('Email is missing. Please register again.')
      return
    }

    setError('')
    setSuccess('')
    setIsSubmitting(true)

    try {
      await verifyEmail(email, code)
      setSuccess('Email verified successfully!')
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
      setError('Email is missing. Please register again.')
      return
    }

    setError('')
    setSuccess('')
    setIsResending(true)

    try {
      await resendVerification(email)
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
        <h1 className={authHeadingCompact}>Verify your Email</h1>
        {error ? (
          <p className="text-sm font-medium tracking-wide text-rose-400">{error}</p>
        ) : success ? (
          <p className="text-sm font-medium tracking-wide text-emerald-600 dark:text-emerald-400">{success}</p>
        ) : (
          <p className={authSubtext}>
            {email ? (
              <>
                We&apos;ve sent a verification code to{' '}
                <span className="not-italic text-neutral-600 dark:text-neutral-300">{email}</span>.
              </>
            ) : (
              "We've sent a verification code to your email."
            )}{' '}
            Please enter it below.
          </p>
        )}
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <div className="flex flex-col gap-1.5">
          <label className={authLabelCenter}>Verification Code</label>
          <input
            type="text"
            required
            maxLength={6}
            pattern="[0-9]{6}"
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
            placeholder="••••••"
            className={authInputCode}
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting || code.length !== 6}
          className={`${authSubmitBtn} mt-2`}
        >
          {isSubmitting ? 'Verifying...' : 'Verify Account'}
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
        <Link href="/login" className={authLinkMuted}>
          Back to Sign In
        </Link>
      </div>
    </div>
  )
}

export default function VerifyEmailPage() {
  return (
    <div className={authPage}>
      <Suspense
        fallback={
          <div className={`${authCardCompact} text-center text-sm text-neutral-400 dark:text-neutral-500`}>
            Loading...
          </div>
        }
      >
        <VerifyEmailForm />
      </Suspense>
    </div>
  )
}
