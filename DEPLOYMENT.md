# JoWala — Deployment & Production Verification Guide

**Official Tagline:** "Unga Ooru, Unga Service!"

This guide details how to deploy JoWala to Vercel, connect Supabase PostgreSQL with Row Level Security, and configure the Google Gemini AI Assistant.

---

## 1. Prerequisites & Required External Credentials

Before starting production deployment, obtain the following credentials:

| Credential Name | Provider | Environment | Purpose |
|---|---|---|---|
| `VITE_SUPABASE_URL` | Supabase Dashboard | Frontend (Vercel) | Connects to your PostgreSQL API |
| `VITE_SUPABASE_ANON_KEY` | Supabase Dashboard | Frontend (Vercel) | Public anonymous client key |
| `GEMINI_API_KEY` | Google AI Studio | Server (Supabase Secrets) | Natural language intent interpretation |
| `GEMINI_MODEL` | Google AI Studio | Server (Supabase Secrets) | Model selection (`gemini-1.5-flash`) |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase Dashboard | Server (Supabase Secrets) | Privileged admin queries in Edge Functions |

---

## 2. Supabase Configuration

### Step 2.1: Create Project
1. Log in to [Supabase](https://supabase.com).
2. Click **New Project** and select region closest to your target audience (e.g. `ap-south-1` - Mumbai, India).

### Step 2.2: Apply Migrations
1. Go to the **SQL Editor** tab in your Supabase dashboard.
2. Paste and run the contents of:
   ```
   supabase/migrations/20261018000000_initial_schema.sql
   ```
3. Verify that the following 15 tables are created with Row Level Security (RLS) enabled:
   - `profiles`
   - `user_roles`
   - `categories`
   - `businesses`
   - `business_owners`
   - `business_claims`
   - `services`
   - `business_images`
   - `opening_hours`
   - `bookings`
   - `reviews`
   - `favorites`
   - `notifications`
   - `reports`
   - `audit_logs`

### Step 2.3: Seed Data
1. In the **SQL Editor**, paste and execute:
   ```
   supabase/seed.sql
   ```
2. Verify that 20 official categories (with English & Tamil translations) and starter Chennai listings are seeded.

### Step 2.4: Storage Buckets
1. In the Supabase Dashboard, navigate to **Storage** -> **New Bucket**.
2. Create:
   - `business-images`: Public bucket (Allowed MIME types: `image/*`, max 5 MB).
   - `profiles`: Public bucket (Allowed MIME types: `image/*`, max 2 MB).
   - `verification-documents`: **Private bucket** (for GSTIN, Trade License evidence).

---

## 3. Gemini AI Edge Function Deployment

To keep the Gemini API key completely secure and inaccessible to browser clients, deploy the `ai-assistant` function to Supabase:

1. Install Supabase CLI locally:
   ```bash
   npm install -g supabase
   ```
2. Link your local project:
   ```bash
   supabase link --project-ref your-project-ref
   ```
3. Set your server-side secrets:
   ```bash
   supabase secrets set GEMINI_API_KEY="your-gemini-api-key"
   supabase secrets set GEMINI_MODEL="gemini-1.5-flash"
   ```
4. Deploy the function:
   ```bash
   supabase functions deploy ai-assistant
   ```

---

## 4. Vercel Frontend Deployment

1. Push your repository to GitHub.
2. In [Vercel](https://vercel.com), select **Add New Project** and import your JoWala repository.
3. Configure the Project Settings:
   - **Framework Preset:** `Vite`
   - **Root Directory:** `./`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
4. Add the Frontend Environment Variables:
   - `VITE_SUPABASE_URL`: `https://your-project-ref.supabase.co`
   - `VITE_SUPABASE_ANON_KEY`: `eyJhbGciOi...`
5. Click **Deploy**.

`vercel.json` in the root directory ensures that deep routes such as `/business/anna-nagar-express-plumbing` and `/search?category=plumbing` are rewritten to `index.html` for client-side routing.

---

## 5. Verification Checklist

- [x] Production build passes without errors: `npm run build` generates `dist/`.
- [x] Tagline and brand identity displayed: *"Unga Ooru, Unga Service!"*.
- [x] Dual language support: Instant toggle between English and தமிழ்.
- [x] Search & discovery: Live keyword search, category filter, locality filter, price limit, rating filter, open now, booking enabled.
- [x] Business detail: Real-time open/closed status calculation, services list, price quotes, customer reviews breakdown.
- [x] Booking workflow: Service selection, date picker, time slot, doorstep vs shop mode, phone, address, and confirmation card with booking ID.
- [x] Reviews & ratings: Automated rating recalculation trigger, owner official response.
- [x] Hybrid listing: Register new business + Claim existing listing with evidence upload.
- [x] Dashboards:
  - Customer: My Bookings, Saved Businesses, Profile.
  - Owner: KPIs, Booking requests (Accept/Decline/Complete), Services manager, Review replies.
  - Admin: Claims audit & approval, listings moderation, categories manager, moderation reports, audit trail.
- [x] Gemini AI: Structured intent extraction (category, locality, budget), matching authentic database records with transparent reasons, and fallback search.
