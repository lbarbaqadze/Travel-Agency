'use client'

import { FormEvent, useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  CheckCircle2,
  KeyRound,
  LogOut,
  ShieldCheck,
  Ticket,
  User,
} from 'lucide-react'
import Navbar from '@/components/layout/Navbar'
import ProfilePasswordField from '@/components/auth/ProfilePasswordField'
import { ApiError, useAuthStore } from '@/store/authStore'
import { fadeUp, staggerContainer } from '@/lib/motion'

const sectionStagger = staggerContainer(0.12)
const item = fadeUp(0, 16)

export default function ProfilePage() {
  const router = useRouter()
  const user = useAuthStore((s) => s.user)
  const isAuthLoading = useAuthStore((s) => s.isLoading)
  const updateProfile = useAuthStore((s) => s.updateProfile)
  const changePassword = useAuthStore((s) => s.changePassword)
  const requestChangePasswordCode = useAuthStore((s) => s.requestChangePasswordCode)
  const logOut = useAuthStore((s) => s.logOut)

  const [name, setName] = useState('')
  const [surname, setSurname] = useState('')
  const [profileError, setProfileError] = useState('')
  const [profileSuccess, setProfileSuccess] = useState('')
  const [isSavingProfile, setIsSavingProfile] = useState(false)

  const [verificationCode, setVerificationCode] = useState('')
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [codeSent, setCodeSent] = useState(false)
  const [isSendingCode, setIsSendingCode] = useState(false)
  const [passwordError, setPasswordError] = useState('')
  const [passwordSuccess, setPasswordSuccess] = useState('')
  const [isSavingPassword, setIsSavingPassword] = useState(false)

  useEffect(() => {
    if (!isAuthLoading && !user) {
      router.replace('/login?redirect=/profile')
    }
  }, [user, isAuthLoading, router])

  useEffect(() => {
    if (user) {
      setName(user.name)
      setSurname(user.surname)
    }
  }, [user])

  async function handleProfileSubmit(e: FormEvent) {
    e.preventDefault()
    setProfileError('')
    setProfileSuccess('')
    setIsSavingProfile(true)

    try {
      await updateProfile({ name: name.trim(), surname: surname.trim() })
      setProfileSuccess('Profile updated successfully.')
    } catch (err) {
      setProfileError(err instanceof ApiError ? err.message : 'Something went wrong. Please try again.')
    } finally {
      setIsSavingProfile(false)
    }
  }

  async function handleSendCode() {
    setPasswordError('')
    setPasswordSuccess('')
    setIsSendingCode(true)

    try {
      await requestChangePasswordCode()
      setCodeSent(true)
      setPasswordSuccess('Verification code sent to your email.')
    } catch (err) {
      setPasswordError(err instanceof ApiError ? err.message : 'Something went wrong. Please try again.')
    } finally {
      setIsSendingCode(false)
    }
  }

  async function handlePasswordSubmit(e: FormEvent) {
    e.preventDefault()
    setPasswordError('')
    setPasswordSuccess('')

    if (!codeSent) {
      setPasswordError('Please request a verification code first.')
      return
    }

    if (verificationCode.length !== 6) {
      setPasswordError('Enter the 6-digit verification code from your email.')
      return
    }

    if (newPassword !== confirmPassword) {
      setPasswordError('New passwords do not match.')
      return
    }

    setIsSavingPassword(true)

    try {
      await changePassword(currentPassword, newPassword, verificationCode)
      setPasswordSuccess('Password changed. Redirecting to sign in...')
      setTimeout(() => router.push('/login'), 1200)
    } catch (err) {
      setPasswordError(err instanceof ApiError ? err.message : 'Something went wrong. Please try again.')
    } finally {
      setIsSavingPassword(false)
    }
  }

  async function handleLogout() {
    await logOut()
    router.push('/')
  }

  if (isAuthLoading || !user) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen overflow-x-hidden bg-white dark:bg-neutral-950">
          <div className="max-w-[1700px] mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-24">
            <div className="h-8 w-48 rounded bg-neutral-100 dark:bg-neutral-800 animate-pulse" />
            <div className="mt-4 h-12 w-72 rounded bg-neutral-100 dark:bg-neutral-800 animate-pulse" />
            <div className="mt-10 grid gap-6 lg:grid-cols-2">
              <div className="h-80 rounded-3xl bg-neutral-100 dark:bg-neutral-800 animate-pulse" />
              <div className="h-80 rounded-3xl bg-neutral-100 dark:bg-neutral-800 animate-pulse" />
            </div>
          </div>
        </main>
      </>
    )
  }

  const initials = `${user.name.charAt(0)}${user.surname.charAt(0)}`.toUpperCase()

  return (
    <>
      <Navbar />
      <main className="min-h-screen overflow-x-hidden bg-white dark:bg-neutral-950">
        <motion.section
          variants={sectionStagger}
          initial="hidden"
          animate="visible"
          className="max-w-[1700px] mx-auto px-4 sm:px-6 lg:px-8 pt-24 sm:pt-28 pb-4"
        >
          <motion.span
            variants={item}
            className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-neutral-400"
          >
            <User className="h-3.5 w-3.5" />
            My Profile
          </motion.span>
          <motion.h1
            variants={item}
            className="mt-3 text-3xl sm:text-4xl lg:text-5xl font-light tracking-tight text-neutral-900 dark:text-white"
          >
            Manage your
            <span className="block font-bold">account settings.</span>
          </motion.h1>
        </motion.section>

        <section className="max-w-[1700px] mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-24 sm:pb-28">
          <div className="grid min-w-0 grid-cols-1 gap-6 lg:grid-cols-[minmax(0,280px)_minmax(0,1fr)] lg:gap-8">
            <motion.aside
              variants={item}
              initial="hidden"
              animate="visible"
              className="flex min-w-0 flex-col gap-4"
            >
              <div className="rounded-3xl border border-neutral-100 bg-neutral-50 p-4 sm:p-6 dark:border-neutral-800 dark:bg-neutral-900">
                <div className="flex items-center gap-3 sm:gap-4">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-neutral-900 text-base font-bold text-white sm:h-14 sm:w-14 sm:text-lg dark:bg-white dark:text-neutral-900">
                    {initials}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-base font-bold capitalize text-neutral-900 dark:text-white">
                      {user.name} {user.surname}
                    </p>
                    <p className="truncate text-sm text-neutral-500">{user.email}</p>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-2 sm:mt-5">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300">
                    <ShieldCheck className="h-3 w-3" />
                    {user.role}
                  </span>
                  {user.is_verified && (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400">
                      <CheckCircle2 className="h-3 w-3" />
                      Verified
                    </span>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 gap-2 sm:grid-cols-1">
                <Link
                  href="/my-bookings"
                  className="flex items-center justify-center gap-2 rounded-2xl border border-neutral-100 bg-white px-4 py-3 text-sm font-semibold text-neutral-700 transition-colors hover:bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-300 dark:hover:bg-neutral-800 sm:justify-start sm:gap-3"
                >
                  <Ticket className="h-4 w-4 shrink-0 text-neutral-400" />
                  My Bookings
                </Link>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex w-full items-center justify-center gap-2 rounded-2xl border border-red-100 bg-white px-4 py-3 text-sm font-semibold text-red-600 transition-colors hover:bg-red-50 dark:border-red-950/40 dark:bg-neutral-900 dark:hover:bg-red-950/30 sm:justify-start sm:gap-3"
                >
                  <LogOut className="h-4 w-4 shrink-0" />
                  Log Out
                </button>
              </div>
            </motion.aside>

            <div className="flex min-w-0 flex-col gap-6">
              <motion.form
                variants={item}
                initial="hidden"
                animate="visible"
                onSubmit={handleProfileSubmit}
                className="min-w-0 rounded-3xl border border-neutral-100 bg-white p-4 shadow-sm dark:border-neutral-800 dark:bg-neutral-900 sm:p-6 lg:p-8"
              >
                <div className="mb-6">
                  <h2 className="text-lg font-bold text-neutral-900 dark:text-white">Personal details</h2>
                  <p className="mt-1 text-sm text-neutral-500">
                    Update your name. Email changes require support for now.
                  </p>
                </div>

                <div className="grid min-w-0 gap-5 md:grid-cols-2">
                  <label className="flex flex-col gap-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">
                      First name
                    </span>
                    <input
                      type="text"
                      required
                      minLength={2}
                      maxLength={12}
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="h-12 rounded-2xl border border-neutral-200 bg-white px-4 text-base font-medium text-neutral-900 dark:text-white outline-none transition-colors focus:border-neutral-900 dark:border-neutral-700 dark:bg-neutral-950 dark:focus:border-white"
                    />
                  </label>
                  <label className="flex flex-col gap-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">
                      Last name
                    </span>
                    <input
                      type="text"
                      required
                      minLength={2}
                      maxLength={30}
                      value={surname}
                      onChange={(e) => setSurname(e.target.value)}
                      className="h-12 rounded-2xl border border-neutral-200 bg-white px-4 text-base font-medium text-neutral-900 dark:text-white outline-none transition-colors focus:border-neutral-900 dark:border-neutral-700 dark:bg-neutral-950 dark:focus:border-white"
                    />
                  </label>
                  <label className="flex min-w-0 flex-col gap-1.5 md:col-span-2">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">
                      Email
                    </span>
                    <input
                      type="email"
                      value={user.email}
                      disabled
                      className="h-12 cursor-not-allowed rounded-2xl border border-neutral-100 bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-900 px-4 text-base text-neutral-500"
                    />
                  </label>
                </div>

                {profileError && (
                  <p className="mt-4 rounded-xl bg-red-50 px-3 py-2 text-xs font-medium text-red-600">
                    {profileError}
                  </p>
                )}
                {profileSuccess && (
                  <p className="mt-4 rounded-xl bg-emerald-50 px-3 py-2 text-xs font-medium text-emerald-700">
                    {profileSuccess}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={isSavingProfile}
                  className="mt-6 w-full rounded-full bg-neutral-900 px-7 py-3.5 text-xs font-bold uppercase tracking-widest text-white transition-colors hover:bg-black disabled:opacity-60 sm:w-auto dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-100"
                >
                  {isSavingProfile ? 'Saving...' : 'Save changes'}
                </button>
              </motion.form>

              <motion.form
                variants={item}
                initial="hidden"
                animate="visible"
                onSubmit={handlePasswordSubmit}
                className="min-w-0 rounded-3xl border border-neutral-100 bg-white p-4 shadow-sm dark:border-neutral-800 dark:bg-neutral-900 sm:p-6 lg:p-8"
              >
                <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-start">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-neutral-900 text-white">
                    <KeyRound className="h-4 w-4" />
                  </span>
                  <div className="min-w-0">
                    <h2 className="text-lg font-bold text-neutral-900 dark:text-white">Change password</h2>
                    <p className="mt-1 text-sm leading-relaxed text-neutral-500">
                      Request a verification code to your email, then set a new password. You&apos;ll be signed out
                      after changing it.
                    </p>
                  </div>
                </div>

                <div className="flex min-w-0 flex-col gap-5">
                  <div className="rounded-2xl border border-neutral-100 bg-neutral-50 p-4 dark:border-neutral-800 dark:bg-neutral-950/60">
                    <p className="text-sm leading-relaxed text-neutral-600 wrap-break-words dark:text-neutral-400">
                      {codeSent ? (
                        <>
                          Code sent to{' '}
                          <span className="font-medium break-all text-neutral-900 dark:text-white">{user.email}</span>.
                          Enter it below to confirm the change.
                        </>
                      ) : (
                        <>
                          We&apos;ll send a 6-digit verification code to{' '}
                          <span className="font-medium break-all text-neutral-900 dark:text-white">{user.email}</span>.
                        </>
                      )}
                    </p>
                    <button
                      type="button"
                      onClick={handleSendCode}
                      disabled={isSendingCode}
                      className="mt-3 text-xs font-bold uppercase tracking-widest text-neutral-900 underline underline-offset-4 transition-colors hover:text-neutral-600 disabled:opacity-50 dark:text-white dark:hover:text-neutral-300"
                    >
                      {isSendingCode ? 'Sending...' : codeSent ? 'Resend code' : 'Send verification code'}
                    </button>
                  </div>

                  <label className="flex min-w-0 flex-col gap-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">
                      Verification code
                    </span>
                    <input
                      type="text"
                      inputMode="numeric"
                      autoComplete="one-time-code"
                      required
                      maxLength={6}
                      pattern="[0-9]{6}"
                      value={verificationCode}
                      onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ''))}
                      placeholder="000000"
                      className="h-12 w-full max-w-full rounded-2xl border border-neutral-200 bg-white px-4 text-center text-base tracking-[0.3em] font-mono text-neutral-900 outline-none transition-colors focus:border-neutral-900 dark:border-neutral-700 dark:bg-neutral-950 dark:text-white dark:focus:border-white"
                    />
                  </label>

                  <ProfilePasswordField
                    id="current-password"
                    label="Current password"
                    value={currentPassword}
                    onChange={setCurrentPassword}
                    show={showCurrentPassword}
                    onToggleShow={() => setShowCurrentPassword((prev) => !prev)}
                    autoComplete="current-password"
                  />
                  <ProfilePasswordField
                    id="new-password"
                    label="New password"
                    value={newPassword}
                    onChange={setNewPassword}
                    show={showNewPassword}
                    onToggleShow={() => setShowNewPassword((prev) => !prev)}
                    minLength={8}
                    maxLength={64}
                    autoComplete="new-password"
                  />
                  <ProfilePasswordField
                    id="confirm-password"
                    label="Confirm new password"
                    value={confirmPassword}
                    onChange={setConfirmPassword}
                    show={showConfirmPassword}
                    onToggleShow={() => setShowConfirmPassword((prev) => !prev)}
                    minLength={8}
                    maxLength={64}
                    autoComplete="new-password"
                  />

                  <p className="text-[11px] leading-relaxed text-neutral-400 dark:text-neutral-500">
                    Password must be 8–64 characters and include uppercase, lowercase, number, and special character.
                  </p>
                </div>

                {passwordError && (
                  <p className="mt-4 rounded-xl bg-red-50 px-3 py-2 text-xs font-medium text-red-600">
                    {passwordError}
                  </p>
                )}
                {passwordSuccess && (
                  <p className="mt-4 rounded-xl bg-emerald-50 px-3 py-2 text-xs font-medium text-emerald-700">
                    {passwordSuccess}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={isSavingPassword || verificationCode.length !== 6}
                  className="mt-6 w-full rounded-full border border-neutral-200 px-7 py-3.5 text-xs font-bold uppercase tracking-widest text-neutral-900 transition-colors hover:bg-neutral-50 disabled:opacity-60 sm:w-auto dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-800"
                >
                  {isSavingPassword ? 'Updating...' : 'Update password'}
                </button>
              </motion.form>
            </div>
          </div>
        </section>
      </main>
    </>
  )
}
