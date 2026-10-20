# Nearzy — AI-Powered Local Service & Business Marketplace

**Official Tagline:** *"Unga Ooru, Unga Service!"*

Nearzy is a complete, modern, full-stack local service discovery, comparison, and booking marketplace built with React, Vite, Tailwind CSS, Supabase PostgreSQL, and Google Gemini AI. It connects customers in Tamil Nadu and India with neighbourhood service professionals, shops, and technicians.

---

## 🌟 Key Highlights

- **Bilingual Interface:** Full Tamil (தமிழ்) and English (EN) language support with persistent language switching.
- **AI-Powered Nearzy Assistant:** Natural language search powered by Google Gemini API via a secure server-side endpoint. Strictly interprets user criteria (category, locality, budget) and matches real database records without fabricating listings.
- **Hybrid Business Listing & Claiming:** Administrative directory creation + owner search & claiming workflow with document verification audit.
- **Booking & Availability System:** Real-time booking requests, date/slot selection, doorstep vs shop mode, status lifecycle (`pending`, `accepted`, `rejected`, `in_progress`, `completed`, `cancelled`).
- **Verified Reviews & Ratings:** Verified customer reviews for completed service visits, automatic business rating recalculation triggers, and business owner official replies.
- **Role-Based Portals:**
  - **Customer Portal:** Profile management, upcoming & past bookings, cancellation options, saved favourite businesses, and review submission.
  - **Business Owner Portal:** Profile completeness, live listing status, booking requests manager, services & pricing editor, working hours schedule, and customer review replies.
  - **Administrator Console:** Platform KPIs, business claim reviews (approve/reject with evidence check), listing suspension/verification toggles, categories management, complaints moderation, and security audit logs.
- **Production-Ready & Vercel Optimized:** SPA rewrites (`vercel.json`), responsive layout across mobile, tablet, laptop, and desktop.

---

## 🏗️ Technology Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 18, Vite, Tailwind CSS, React Router v6 |
| **Icons & Visuals** | Lucide React, Unsplash curated business imagery |
| **Forms & Validation** | React Hook Form, Zod |
| **Backend & Database** | Supabase PostgreSQL, Supabase Auth, Row Level Security (RLS) |
| **Storage** | Supabase Storage (`business-images`, `profiles`, `verification-documents`) |
| **AI Integration** | Google Gemini API (via server-side Supabase Edge Function `ai-assistant`) |
| **Deployment** | Vercel (Frontend), Supabase (Backend/Functions) |

---

## 📂 Project Structure

```
Nearzy/
├── public/
│   ├── logo.svg                     # Official Nearzy brand icon
│   └── favicon.svg
├── src/
│   ├── components/
│   │   ├── common/
│   │   │   ├── Navbar.jsx           # Global header with language & test role switchers
│   │   │   ├── Footer.jsx           # Comprehensive footer with Tamil Nadu localities
│   │   │   ├── BusinessCard.jsx     # Card with rating, open status, price, and favorite action
│   │   │   ├── CategoryCard.jsx     # Interactive category card
│   │   │   ├── RatingStars.jsx      # Display & interactive review rating stars
│   │   │   ├── Badge.jsx            # Status and role badges
│   │   │   ├── Modal.jsx            # Accessible dialog component
│   │   │   ├── SkeletonCard.jsx     # Pulse loading placeholder
│   │   │   ├── EmptyState.jsx       # Informative empty states
│   │   │   └── IconResolver.jsx     # Dynamic Lucide icon mapper
│   │   ├── AIAssistantModal.jsx     # Conversational Gemini search modal with intent breakdown
│   │   ├── BookingModal.jsx         # Service booking request flow with validation
│   │   └── ReportModal.jsx          # Listing complaint & moderation modal
│   ├── context/
│   │   ├── AuthContext.jsx          # Supabase auth listener with 1-click test personas
│   │   ├── LanguageContext.jsx      # English & Tamil bilingual dictionary provider
│   │   └── ToastContext.jsx         # Animated toast notification manager
│   ├── data/
│   │   └── mockData.js              # Initial 20 categories & starter verified Tamil Nadu businesses
│   ├── lib/
│   │   └── supabaseClient.js        # Resilient Supabase client with connectivity detection
│   ├── pages/
│   │   ├── Home.jsx                 # Hero, search bar, categories, featured, how it works
│   │   ├── Search.jsx               # Search & discovery with real-time sidebar filters & sorting
│   │   ├── Categories.jsx           # All 20 categories browsing page
│   │   ├── BusinessDetail.jsx       # Business page with services, open status, reviews, booking
│   │   ├── RegisterBusiness.jsx     # Multi-step business registration for providers
│   │   ├── ClaimBusiness.jsx        # Search existing listing & submit proof of ownership
│   │   ├── Login.jsx                # Login with 1-click test persona quick-logins
│   │   ├── Register.jsx             # Role-based customer vs provider signup
│   │   ├── customer/
│   │   │   └── CustomerDashboard.jsx # Bookings, favorites, profile settings
│   │   ├── owner/
│   │   │   └── OwnerDashboard.jsx   # Metrics, bookings manager, services editor, review replies
│   │   └── admin/
│   │       └── AdminDashboard.jsx   # Claims approval, listing moderation, reports, audit logs
│   ├── services/
│   │   ├── businessService.js       # Complete database & persistent storage data layer
│   │   └── aiService.js             # Gemini AI intent extraction & weighted ranking engine
│   ├── App.jsx                      # Main router & app layout shell
│   ├── index.css                    # Tailwind CSS directives & scrollbar styling
│   └── main.jsx
├── supabase/
│   ├── migrations/
│   │   └── 20261018000000_initial_schema.sql  # Full schema with RLS, triggers, functions
│   ├── functions/
│   │   └── ai-assistant/index.ts              # Secure server-side Gemini Edge Function
│   └── seed.sql                               # Seed script for 20 categories & sample listings
├── .env.example                     # Documented environment variable template
├── tailwind.config.js               # Nearzy brand colors & typography
├── vercel.json                      # Vercel SPA client-side routing rewrites
└── vite.config.js                   # Vite config with ESM URL path alias
```

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js `v18+` or `v20+`
- npm `v9+` or `v10+`

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Configuration
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Populate your Supabase credentials:
```env
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

> **Note:** Nearzy includes a built-in persistent storage fallback engine. You can run and test the complete user experience, search, booking, claiming, and admin reviews immediately even before configuring your Supabase project!

### 4. Run Development Server
```bash
npm run dev
```
Open your browser at `http://localhost:5173`.

### 5. Build for Production
```bash
npm run build
```
The output will be bundled in the `dist` directory.

---

## 🗄️ Supabase Database & Security Setup

1. Create a project at [supabase.com](https://supabase.com).
2. Open the **SQL Editor** in your Supabase Dashboard.
3. Run `supabase/migrations/20261018000000_initial_schema.sql` to create:
   - `profiles`, `user_roles`, `categories`, `businesses`, `business_owners`, `business_claims`, `services`, `opening_hours`, `bookings`, `reviews`, `favorites`, `reports`, `audit_logs`.
   - Auto-rating recalculation triggers.
   - Row Level Security (RLS) policies for Customers, Providers, and Admins.
4. Run `supabase/seed.sql` to populate the 20 official categories (with Tamil translations) and starter Chennai listings.
5. Create Storage buckets in **Storage**:
   - `business-images` (Public)
   - `profiles` (Public)
   - `verification-documents` (Private)

---

## 🤖 Google Gemini AI Server-Side Setup

The Gemini API key is **strictly stored server-side** to safeguard credentials.

### Deploy the Edge Function:
```bash
supabase functions deploy ai-assistant
supabase secrets set GEMINI_API_KEY="your-gemini-api-key"
supabase secrets set GEMINI_MODEL="gemini-1.5-flash"
```

### Safety & Grounding Rules:
- Gemini is only used to extract search parameters (category, area, budget) from natural language.
- Gemini is **never allowed to hallucinate** business names, prices, or ratings.
- Business results are retrieved directly from the verified database records and ranked transparently.

---

## 🧪 Testing Personas

For evaluator convenience, you can test all three roles in one click from the Navbar persona switcher or the login page:

1. **Customer Persona (Karthik S.):** View bookings, save favourites, submit reviews for completed appointments.
2. **Business Owner Persona (Sri Murugan Electricals):** Accept/reject booking requests, add services, respond to reviews.
3. **Platform Administrator (Lead Admin):** Review submitted business claims, toggle verification badges, moderate reports, view audit logs.

---

## 🌐 Vercel Deployment

1. Push this repository to GitHub.
2. Import the repository into [Vercel](https://vercel.com).
3. Framework Preset: **Vite**.
4. Root Directory: `./`.
5. Add Environment Variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
6. Click **Deploy**. Single-page routing is preconfigured via `vercel.json`.

---

## 📄 License
© 2026 Nearzy Technologies. All rights reserved.  
*"Unga Ooru, Unga Service!"*
