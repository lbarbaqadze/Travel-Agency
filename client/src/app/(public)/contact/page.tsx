'use client'

import Navbar from '@/components/layout/Navbar'
import AboutHero from '@/components/about/AboutHero'
import ContactForm from '@/components/contact/ContactForm'
import ContactSidebar from '@/components/contact/ContactSidebar'
import { motion } from 'framer-motion'
import { fadeUp, staggerContainer, viewportOnce } from '@/lib/motion'

const faqItems = [
  {
    question: 'How do I book a tour?',
    answer: 'Browse tours, pick dates and guests, then complete checkout. Manage bookings from My Bookings.',
  },
  {
    question: 'Can I cancel a reservation?',
    answer: 'Pending bookings can be cancelled from your dashboard. For confirmed trips, contact us for help.',
  },
  {
    question: 'When do I get confirmation?',
    answer: 'Instantly by email after payment. Check spam if it does not arrive within a few minutes.',
  },
]

const item = fadeUp(0, 12)
const faqStagger = staggerContainer(0.06)

export default function ContactPage() {
  return (
    <>
      <Navbar />
      <main className="bg-white dark:bg-neutral-950">
        <AboutHero
          imagePublicId="adrien-olichon-2D1fFYL_OBc-unsplash_t8wctv"
          eyebrow="Contact Voyager"
          title={
            <>
              We&apos;re here to help
              <span className="block font-bold">plan your journey.</span>
            </>
          }
        />

        <section className="mx-auto max-w-[1700px] px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
          <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_300px] lg:gap-8 xl:grid-cols-[minmax(0,1fr)_320px]">
            <ContactForm />
            <ContactSidebar />
          </div>

          <motion.div
            variants={faqStagger}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            className="mt-8 grid gap-4 sm:grid-cols-3 sm:gap-5"
          >
            {faqItems.map((faq) => (
              <motion.div
                key={faq.question}
                variants={item}
                className="rounded-2xl border border-neutral-100 bg-neutral-50 p-4 dark:border-neutral-800 dark:bg-neutral-900/60"
              >
                <p className="text-sm font-semibold text-neutral-900 dark:text-white">{faq.question}</p>
                <p className="mt-1.5 text-xs leading-relaxed text-neutral-500 dark:text-neutral-400">{faq.answer}</p>
              </motion.div>
            ))}
          </motion.div>
        </section>

        <section className="border-t border-neutral-100 bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-900/40">
          <div className="mx-auto max-w-[1700px] px-4 py-10 sm:px-6 lg:px-8">
            <div className="grid gap-8 sm:grid-cols-2 sm:gap-10">
              <article id="privacy">
                <h2 className="text-lg font-bold text-neutral-900 dark:text-white">Privacy</h2>
                <div className="mt-3 flex flex-col gap-2 text-sm leading-relaxed text-neutral-500 dark:text-neutral-400">
                  <p>
                    Voyager collects only the information needed to process bookings and provide customer
                    support — such as your name, email, and payment details handled securely through our
                    payment provider.
                  </p>
                  <p>
                    We do not sell your personal data. Contact{' '}
                    <a
                      href="mailto:infovoyager2021@gmail.com"
                      className="font-medium text-neutral-900 underline underline-offset-2 dark:text-white"
                    >
                      infovoyager2021@gmail.com
                    </a>{' '}
                    to request access or deletion.
                  </p>
                </div>
              </article>

              <article id="terms">
                <h2 className="text-lg font-bold text-neutral-900 dark:text-white">Terms</h2>
                <div className="mt-3 flex flex-col gap-2 text-sm leading-relaxed text-neutral-500 dark:text-neutral-400">
                  <p>
                    By using Voyager you agree to our booking policies, including accurate guest details,
                    timely payment, and compliance with tour-specific requirements on each listing.
                  </p>
                  <p>
                    Cancellation rules depend on booking status and tour terms. Contact support before
                    your departure date for assistance with confirmed bookings.
                  </p>
                </div>
              </article>
            </div>
          </div>
        </section>
      </main>
    </>
  )
}
