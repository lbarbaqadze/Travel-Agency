'use client'

import { FormEvent, useState } from 'react'
import { motion } from 'framer-motion'
import { CheckCircle2, Send } from 'lucide-react'
import { fadeUp, staggerContainer, viewportOnce } from '@/lib/motion'

const CONTACT_EMAIL = 'infovoyager2021@gmail.com'

const SUBJECTS = [
  { value: 'general', label: 'General inquiry' },
  { value: 'booking', label: 'Booking support' },
  { value: 'cancellation', label: 'Cancellation request' },
  { value: 'partnership', label: 'Partnership' },
  { value: 'other', label: 'Other' },
]

const inputClassName =
  'h-12 rounded-2xl border border-neutral-200 bg-white px-4 text-base font-medium text-neutral-900 outline-none transition-colors focus:border-neutral-900 dark:border-neutral-700 dark:bg-neutral-950 dark:text-white dark:focus:border-white'

const sectionStagger = staggerContainer(0.1)
const item = fadeUp(0, 16)

export default function ContactForm() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [subject, setSubject] = useState('general')
  const [message, setMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setIsSubmitting(true)

    const subjectLabel = SUBJECTS.find((s) => s.value === subject)?.label ?? 'Inquiry'
    const body = `Name: ${name.trim()}\nEmail: ${email.trim()}\n\n${message.trim()}`
    const mailtoUrl = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(`[Voyager] ${subjectLabel}`)}&body=${encodeURIComponent(body)}`

    window.location.href = mailtoUrl

    setTimeout(() => {
      setIsSubmitting(false)
      setIsSuccess(true)
    }, 400)
  }

  if (isSuccess) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center self-start rounded-3xl border border-neutral-100 bg-white p-8 text-center shadow-sm dark:border-neutral-800 dark:bg-neutral-900 sm:p-10"
      >
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 dark:bg-emerald-950/40">
          <CheckCircle2 className="h-7 w-7 text-emerald-600 dark:text-emerald-400" />
        </span>
        <h2 className="mt-5 text-xl font-bold text-neutral-900 dark:text-white">Message ready to send</h2>
        <p className="mt-2 max-w-sm text-sm leading-relaxed text-neutral-500 dark:text-neutral-400">
          Your email app should open with your message pre-filled. If it didn&apos;t, reach us directly at{' '}
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="font-medium text-neutral-900 underline underline-offset-2 dark:text-white"
          >
            {CONTACT_EMAIL}
          </a>
          .
        </p>
        <button
          type="button"
          onClick={() => {
            setIsSuccess(false)
            setName('')
            setEmail('')
            setSubject('general')
            setMessage('')
          }}
          className="mt-6 rounded-full border border-neutral-200 px-6 py-3 text-xs font-bold uppercase tracking-widest text-neutral-900 transition-colors hover:bg-neutral-50 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-800"
        >
          Send another message
        </button>
      </motion.div>
    )
  }

  return (
    <motion.form
      variants={sectionStagger}
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
      onSubmit={handleSubmit}
      className="self-start rounded-3xl border border-neutral-100 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900 sm:p-6"
    >
      <motion.div variants={item}>
        <h2 className="text-lg font-bold text-neutral-900 dark:text-white">Send us a message</h2>
        <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
          Fill in the form and we&apos;ll get back to you within one business day.
        </p>
      </motion.div>

      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        <motion.label variants={item} className="flex flex-col gap-1.5">
          <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">Full name</span>
          <input
            type="text"
            required
            minLength={2}
            maxLength={80}
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="John Doe"
            className={inputClassName}
          />
        </motion.label>

        <motion.label variants={item} className="flex flex-col gap-1.5">
          <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">Email</span>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className={inputClassName}
          />
        </motion.label>

        <motion.label variants={item} className="flex flex-col gap-1.5 sm:col-span-2">
          <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">Subject</span>
          <select
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className={`${inputClassName} cursor-pointer appearance-none`}
          >
            {SUBJECTS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </motion.label>

        <motion.label variants={item} className="flex flex-col gap-1.5 sm:col-span-2">
          <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">Message</span>
          <textarea
            required
            minLength={10}
            maxLength={2000}
            rows={4}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Tell us how we can help with your trip..."
            className="resize-none rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-base font-medium text-neutral-900 outline-none transition-colors focus:border-neutral-900 dark:border-neutral-700 dark:bg-neutral-950 dark:text-white dark:placeholder:text-neutral-600 dark:focus:border-white"
          />
        </motion.label>
      </div>

      <motion.button
        variants={item}
        type="submit"
        disabled={isSubmitting}
        className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-neutral-900 px-7 py-4 text-xs font-bold uppercase tracking-widest text-white transition-colors hover:bg-black disabled:opacity-60 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-100 sm:w-auto"
      >
        <Send className="h-3.5 w-3.5" />
        {isSubmitting ? 'Opening email...' : 'Send message'}
      </motion.button>
    </motion.form>
  )
}
