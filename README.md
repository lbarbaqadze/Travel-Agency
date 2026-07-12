# Voyager — Curated Tours Across Europe

A full-stack travel agency platform for discovering, booking, and managing curated tours across Europe. Built with a modern Next.js frontend and a secure Express API — featuring Stripe payments, Google OAuth, an admin control panel, and production deployment on Vercel.

---

## Tech Stack

### Frontend (`client/`)

| Category | Technology |
|----------|------------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS 4 |
| State | Zustand |
| Animation | Framer Motion |
| Icons | Lucide React, Heroicons, Font Awesome |
| UI primitives | Headless UI |
| Theming | next-themes (light / dark mode) |
| Testing | Vitest, Testing Library |
| Deployment | Vercel |

### Backend (`server/`)

| Category | Technology |
|----------|------------|
| Runtime | Node.js, Express 5 |
| Database | MySQL (TiDB Cloud) |
| Auth | JWT in httpOnly cookies, Passport Google OAuth 2.0 |
| Payments | Stripe Checkout + Webhooks |
| Media | Cloudinary (upload + CDN) |
| Email | Nodemailer (verification & password reset) |
| Validation | Joi |
| Security | Helmet, CORS, bcrypt, express-rate-limit |

---

## Key Features

### Public website

- **Homepage** — hero section, destination search panel, popular tours grid, feature highlights, and brand sections with Framer Motion animations.
- **Tours catalog** (`/tours`) — browse all tours with filters for destination, category, and budget; pagination for large result sets.
- **Tour detail pages** (`/tours/[slug]`) — image gallery, pricing, guest selector, booking widget, customer reviews, related tours, and per-tour SEO metadata.
- **About page** — brand story with horizontal photo gallery powered by Cloudinary.
- **Contact page** — contact form for customer inquiries.
- **Dark mode** — system-aware theme toggle across the entire app.
- **Responsive design** — mobile-first layout; iOS-friendly form inputs (no unwanted zoom on focus).

### Authentication & user account

- Email/password **sign up** and **sign in**.
- **Google OAuth** — one-click login via Google account.
- **Email verification** — 6-digit code sent after registration.
- **Forgot password** — email with reset code.
- **Change password** — from profile, with email verification code and show/hide password toggles.
- **Profile page** — update name and surname; sign out.
- **JWT session** — access + refresh tokens stored in httpOnly cookies; automatic silent token refresh on expired sessions.
- **Protected routes** — My Bookings, Profile, and Admin require authentication (client-side guard + API validation).

### Bookings & payments

- Select guest count and book a tour from the tour detail page.
- **Duplicate booking prevention** — a user cannot book the same tour twice while a pending or confirmed booking exists.
- **Stripe Checkout** — secure payment flow after booking creation.
- **Stripe webhooks** — backend confirms payment and updates booking status automatically.
- **My Bookings** (`/my-bookings`) — view all bookings, see status (pending / confirmed / cancelled), pay pending bookings, and cancel when allowed.

### Reviews

- Authenticated users can leave star ratings and comments on tours they have booked.
- Reviews display on tour detail pages.
- Admins can view and delete reviews from the admin panel.

### Admin panel (`/admin`)

Role-based access for users with the `admin` role:

| Section | What you can do |
|---------|-----------------|
| **Dashboard** | Overview stats — total tours, bookings, reviews, users |
| **Tours** | Create, edit, delete tours; upload images to Cloudinary |
| **Bookings** | View and manage all customer bookings |
| **Users** | View users, change roles (user / admin), delete accounts |
| **Reviews** | View all reviews and remove inappropriate ones |

### Error & loading states

- Root-level `loading.tsx` and `error.tsx` for graceful UX during navigation and failures.

---

## Project structure

```
TravelAgency/
├── client/                     # Next.js frontend
│   ├── src/app/
│   │   ├── (public)/           # Home, tours, about, contact
│   │   ├── (auth)/             # Login, register, verify, password reset
│   │   ├── (protected)/        # My bookings, profile
│   │   └── admin/              # Admin dashboard & management
│   ├── src/components/         # UI components (layout, tours, home, admin, seo)
│   ├── src/hooks/              # useTours and other hooks
│   ├── src/lib/                # API client, SEO, sitemap, Cloudinary utils
│   └── src/store/              # Zustand stores (auth, bookings)
│
├── server/                     # Express API
│   ├── api/index.js            # Vercel serverless entry point
│   ├── app.js                  # Express app (routes & middleware)
│   ├── server.js               # Local dev server (npm run dev)
│   ├── controllers/            # Business logic
│   ├── models/                 # Database queries (MySQL)
│   ├── router/                 # API route definitions
│   ├── middlewares/            # Auth, validation, rate limiting
│   ├── utils/                  # JWT, email, Cloudinary helpers
│   └── config/                 # DB, Passport, mailer
│

```

---

### 1. Clone the repository

```bash
git clone https://github.com/lbarbaqadze/Travel-Agency.git
cd Travel-Agency
```
