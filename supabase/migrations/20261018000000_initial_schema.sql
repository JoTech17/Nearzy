-- JoWala Database Schema Migration
-- Tagline: Unga Ooru, Unga Service!
-- Comprehensive schema with RLS, Triggers, Functions, and Storage definitions

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-----------------------------------------------------------
-- 1. PROFILES & ROLES
-----------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  preferred_language TEXT NOT NULL DEFAULT 'en' CHECK (preferred_language IN ('en', 'ta')),
  preferred_locality TEXT,
  profile_image TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('customer', 'business_owner', 'admin')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT uq_user_role UNIQUE (user_id, role)
);

-- Helper functions for RLS
CREATE OR REPLACE FUNCTION public.is_admin(user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_roles.user_id = $1 AND user_roles.role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.is_business_owner(user_id UUID, biz_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.business_owners
    WHERE business_owners.user_id = $1 
      AND business_owners.business_id = $2 
      AND business_owners.ownership_status = 'approved'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-----------------------------------------------------------
-- 2. CATEGORIES
-----------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  name_ta TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  description_ta TEXT,
  icon TEXT NOT NULL DEFAULT 'Wrench',
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  display_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-----------------------------------------------------------
-- 3. BUSINESSES
-----------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.businesses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID NOT NULL REFERENCES public.categories(id) ON DELETE RESTRICT,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  description_ta TEXT,
  address TEXT NOT NULL,
  locality TEXT NOT NULL,
  city TEXT NOT NULL DEFAULT 'Chennai',
  state TEXT NOT NULL DEFAULT 'Tamil Nadu',
  postal_code TEXT,
  latitude NUMERIC(10, 7),
  longitude NUMERIC(10, 7),
  phone TEXT NOT NULL,
  email TEXT,
  website TEXT,
  cover_image TEXT,
  service_mode TEXT[] NOT NULL DEFAULT ARRAY['at_doorstep', 'at_shop']::TEXT[],
  experience_years INT NOT NULL DEFAULT 0,
  is_verified BOOLEAN NOT NULL DEFAULT FALSE,
  listing_status TEXT NOT NULL DEFAULT 'active' CHECK (listing_status IN ('active', 'suspended', 'pending')),
  created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  rating NUMERIC(3, 2) NOT NULL DEFAULT 0.0,
  review_count INT NOT NULL DEFAULT 0,
  min_price NUMERIC(10, 2) NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Search indexes
CREATE INDEX IF NOT EXISTS idx_businesses_category ON public.businesses(category_id);
CREATE INDEX IF NOT EXISTS idx_businesses_locality ON public.businesses(locality);
CREATE INDEX IF NOT EXISTS idx_businesses_city ON public.businesses(city);
CREATE INDEX IF NOT EXISTS idx_businesses_rating ON public.businesses(rating DESC);
CREATE INDEX IF NOT EXISTS idx_businesses_status ON public.businesses(listing_status);
CREATE INDEX IF NOT EXISTS idx_businesses_name_trgm ON public.businesses USING gin (name gin_trgm_ops);

-----------------------------------------------------------
-- 4. BUSINESS OWNERS & CLAIMS
-----------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.business_owners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  ownership_status TEXT NOT NULL DEFAULT 'approved' CHECK (ownership_status IN ('pending', 'approved', 'revoked')),
  assigned_role TEXT NOT NULL DEFAULT 'primary_owner',
  approved_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT uq_business_owner UNIQUE (business_id, user_id)
);

CREATE TABLE IF NOT EXISTS public.business_claims (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
  claimant_user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'under_review', 'approved', 'rejected', 'more_info_required')),
  business_phone_claimed TEXT,
  evidence_text TEXT,
  evidence_documents TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  reviewer_user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  reviewer_notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  reviewed_at TIMESTAMPTZ
);

-----------------------------------------------------------
-- 5. SERVICES
-----------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  name_ta TEXT,
  description TEXT,
  price NUMERIC(10, 2) NOT NULL DEFAULT 0,
  pricing_type TEXT NOT NULL DEFAULT 'fixed' CHECK (pricing_type IN ('fixed', 'starting_at', 'quote')),
  duration_minutes INT NOT NULL DEFAULT 60,
  booking_enabled BOOLEAN NOT NULL DEFAULT TRUE,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_services_business ON public.services(business_id);

-----------------------------------------------------------
-- 6. BUSINESS IMAGES & OPENING HOURS
-----------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.business_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
  storage_path TEXT NOT NULL,
  image_type TEXT NOT NULL DEFAULT 'gallery' CHECK (image_type IN ('logo', 'cover', 'gallery')),
  display_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.opening_hours (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
  day_of_week INT NOT NULL CHECK (day_of_week BETWEEN 0 AND 6),
  open_time TIME NOT NULL DEFAULT '09:00:00',
  close_time TIME NOT NULL DEFAULT '20:00:00',
  is_closed BOOLEAN NOT NULL DEFAULT FALSE,
  CONSTRAINT uq_biz_day UNIQUE (business_id, day_of_week)
);

-----------------------------------------------------------
-- 7. BOOKINGS
-----------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  business_id UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
  service_id UUID NOT NULL REFERENCES public.services(id) ON DELETE RESTRICT,
  requested_date DATE NOT NULL,
  requested_time TIME NOT NULL,
  service_mode TEXT NOT NULL DEFAULT 'at_doorstep' CHECK (service_mode IN ('at_doorstep', 'at_shop', 'remote')),
  service_address TEXT,
  customer_phone TEXT NOT NULL,
  notes TEXT,
  estimated_price NUMERIC(10, 2) NOT NULL DEFAULT 0,
  final_price NUMERIC(10, 2),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected', 'confirmed', 'in_progress', 'completed', 'cancelled')),
  cancellation_reason TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_bookings_customer ON public.bookings(customer_id);
CREATE INDEX IF NOT EXISTS idx_bookings_business ON public.bookings(business_id);
CREATE INDEX IF NOT EXISTS idx_bookings_date ON public.bookings(requested_date);

-----------------------------------------------------------
-- 8. REVIEWS & RATINGS
-----------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
  customer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  booking_id UUID REFERENCES public.bookings(id) ON DELETE SET NULL,
  rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment TEXT NOT NULL,
  moderation_status TEXT NOT NULL DEFAULT 'approved' CHECK (moderation_status IN ('pending', 'approved', 'flagged', 'hidden')),
  owner_response TEXT,
  owner_responded_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT uq_customer_booking_review UNIQUE (customer_id, booking_id)
);

CREATE INDEX IF NOT EXISTS idx_reviews_business ON public.reviews(business_id);

-----------------------------------------------------------
-- 9. FAVORITES, NOTIFICATIONS, REPORTS, AUDIT LOGS
-----------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  business_id UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT uq_customer_favorite UNIQUE (customer_id, business_id)
);

CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  link TEXT,
  is_read BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reporter_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  business_id UUID REFERENCES public.businesses(id) ON DELETE CASCADE,
  review_id UUID REFERENCES public.reviews(id) ON DELETE CASCADE,
  reason TEXT NOT NULL,
  description TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'investigating', 'resolved', 'dismissed')),
  assigned_admin_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  resolution_notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  resolved_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS public.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id TEXT NOT NULL,
  details JSONB NOT NULL DEFAULT '{}'::JSONB,
  ip_address TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-----------------------------------------------------------
-- 10. DATABASE TRIGGERS
-----------------------------------------------------------

-- Trigger 1: Auto create profile and assign 'customer' role on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name, email, preferred_language)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1)),
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'preferred_language', 'en')
  );

  INSERT INTO public.user_roles (user_id, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'role', 'customer')
  );

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Trigger 2: Auto recalculate rating & review count for business
CREATE OR REPLACE FUNCTION public.update_business_rating_summary()
RETURNS TRIGGER AS $$
DECLARE
  target_biz_id UUID;
  new_rating NUMERIC(3, 2);
  new_count INT;
BEGIN
  IF (TG_OP = 'DELETE') THEN
    target_biz_id := OLD.business_id;
  ELSE
    target_biz_id := NEW.business_id;
  END IF;

  SELECT 
    COALESCE(ROUND(AVG(rating), 2), 0.0),
    COUNT(*)
  INTO new_rating, new_count
  FROM public.reviews
  WHERE business_id = target_biz_id AND moderation_status = 'approved';

  UPDATE public.businesses
  SET rating = new_rating,
      review_count = new_count,
      updated_at = NOW()
  WHERE id = target_biz_id;

  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_update_rating ON public.reviews;
CREATE TRIGGER trg_update_rating
  AFTER INSERT OR UPDATE OR DELETE ON public.reviews
  FOR EACH ROW EXECUTE FUNCTION public.update_business_rating_summary();

-----------------------------------------------------------
-- 11. ROW LEVEL SECURITY (RLS) POLICIES
-----------------------------------------------------------

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.businesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.business_owners ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.business_claims ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.business_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.opening_hours ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Profiles: Public can view basic profile info, user can update their own
CREATE POLICY "Public profiles are viewable by everyone" 
  ON public.profiles FOR SELECT USING (true);

CREATE POLICY "Users can update own profile" 
  ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- User roles: Viewable by user or admin, managed by admin
CREATE POLICY "Users can view own roles" 
  ON public.user_roles FOR SELECT USING (auth.uid() = user_id OR public.is_admin(auth.uid()));

CREATE POLICY "Admins can manage roles" 
  ON public.user_roles FOR ALL USING (public.is_admin(auth.uid()));

-- Categories: Read-only to public, writeable by admin
CREATE POLICY "Categories viewable by public" 
  ON public.categories FOR SELECT USING (is_active = true OR public.is_admin(auth.uid()));

CREATE POLICY "Admins can manage categories" 
  ON public.categories FOR ALL USING (public.is_admin(auth.uid()));

-- Businesses: Active viewable by public, owners and admins can edit
CREATE POLICY "Businesses are viewable by public" 
  ON public.businesses FOR SELECT USING (listing_status = 'active' OR public.is_business_owner(auth.uid(), id) OR public.is_admin(auth.uid()));

CREATE POLICY "Owners can update their businesses" 
  ON public.businesses FOR UPDATE USING (public.is_business_owner(auth.uid(), id) OR public.is_admin(auth.uid()));

CREATE POLICY "Admins and authorized users can insert businesses" 
  ON public.businesses FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Admins can delete businesses" 
  ON public.businesses FOR DELETE USING (public.is_admin(auth.uid()));

-- Business Owners
CREATE POLICY "Business owners are viewable by public" 
  ON public.business_owners FOR SELECT USING (true);

CREATE POLICY "Admins manage business owners" 
  ON public.business_owners FOR ALL USING (public.is_admin(auth.uid()));

-- Business Claims
CREATE POLICY "Claimants can view own claims" 
  ON public.business_claims FOR SELECT USING (claimant_user_id = auth.uid() OR public.is_admin(auth.uid()));

CREATE POLICY "Users can insert claims" 
  ON public.business_claims FOR INSERT WITH CHECK (claimant_user_id = auth.uid());

CREATE POLICY "Admins can update claims" 
  ON public.business_claims FOR UPDATE USING (public.is_admin(auth.uid()));

-- Services: Public can read active, owners can manage
CREATE POLICY "Public can view services" 
  ON public.services FOR SELECT USING (is_active = true OR public.is_business_owner(auth.uid(), business_id) OR public.is_admin(auth.uid()));

CREATE POLICY "Owners can manage services" 
  ON public.services FOR ALL USING (public.is_business_owner(auth.uid(), business_id) OR public.is_admin(auth.uid()));

-- Business Images & Opening Hours: Public read, owners manage
CREATE POLICY "Public can view business images" 
  ON public.business_images FOR SELECT USING (true);

CREATE POLICY "Owners can manage business images" 
  ON public.business_images FOR ALL USING (public.is_business_owner(auth.uid(), business_id) OR public.is_admin(auth.uid()));

CREATE POLICY "Public can view opening hours" 
  ON public.opening_hours FOR SELECT USING (true);

CREATE POLICY "Owners can manage opening hours" 
  ON public.opening_hours FOR ALL USING (public.is_business_owner(auth.uid(), business_id) OR public.is_admin(auth.uid()));

-- Bookings: Customers view/create own, owners view/update for their business, admins view/update all
CREATE POLICY "Customers and owners can view bookings" 
  ON public.bookings FOR SELECT USING (
    customer_id = auth.uid() OR 
    public.is_business_owner(auth.uid(), business_id) OR 
    public.is_admin(auth.uid())
  );

CREATE POLICY "Customers can create bookings" 
  ON public.bookings FOR INSERT WITH CHECK (customer_id = auth.uid());

CREATE POLICY "Customers and owners can update bookings" 
  ON public.bookings FOR UPDATE USING (
    customer_id = auth.uid() OR 
    public.is_business_owner(auth.uid(), business_id) OR 
    public.is_admin(auth.uid())
  );

-- Reviews: Approved are public, customers can insert/edit own, owners can respond
CREATE POLICY "Public can view approved reviews" 
  ON public.reviews FOR SELECT USING (moderation_status = 'approved' OR customer_id = auth.uid() OR public.is_admin(auth.uid()));

CREATE POLICY "Customers can insert reviews" 
  ON public.reviews FOR INSERT WITH CHECK (customer_id = auth.uid());

CREATE POLICY "Owners can update review response" 
  ON public.reviews FOR UPDATE USING (public.is_business_owner(auth.uid(), business_id) OR customer_id = auth.uid() OR public.is_admin(auth.uid()));

-- Favorites
CREATE POLICY "Users can manage own favorites" 
  ON public.favorites FOR ALL USING (customer_id = auth.uid());

-- Notifications
CREATE POLICY "Users can view and update own notifications" 
  ON public.notifications FOR ALL USING (user_id = auth.uid());

-- Reports
CREATE POLICY "Users can create reports" 
  ON public.reports FOR INSERT WITH CHECK (reporter_id = auth.uid());

CREATE POLICY "Users view own reports, admins view and update all" 
  ON public.reports FOR SELECT USING (reporter_id = auth.uid() OR public.is_admin(auth.uid()));

CREATE POLICY "Admins can update reports" 
  ON public.reports FOR UPDATE USING (public.is_admin(auth.uid()));

-- Audit Logs: Only admins can view, system inserts
CREATE POLICY "Admins can view audit logs" 
  ON public.audit_logs FOR SELECT USING (public.is_admin(auth.uid()));

CREATE POLICY "Authenticated users can create audit logs" 
  ON public.audit_logs FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-----------------------------------------------------------
-- 12. STORAGE BUCKET CONFIGURATION
-----------------------------------------------------------
-- Note: Run in Supabase SQL editor or Storage configuration:
-- INSERT INTO storage.buckets (id, name, public) VALUES ('business-images', 'business-images', true) ON CONFLICT DO NOTHING;
-- INSERT INTO storage.buckets (id, name, public) VALUES ('profiles', 'profiles', true) ON CONFLICT DO NOTHING;
-- INSERT INTO storage.buckets (id, name, public) VALUES ('verification-documents', 'verification-documents', false) ON CONFLICT DO NOTHING;
