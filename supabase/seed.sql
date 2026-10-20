-- JoWala Seed Script: 20 Business Categories & Starter Local Listings
-- Tagline: Unga Ooru, Unga Service!

-- 1. Insert 20 Standard JoWala Categories
INSERT INTO public.categories (id, name, name_ta, slug, description, description_ta, icon, display_order)
VALUES
  ('c0000001-0000-0000-0000-000000000001', 'Home Services', 'வீட்டு சேவைகள்', 'home-services', 'General maintenance, repairs and handyman services for your residence', 'உங்கள் இல்ல பராமரிப்பு மற்றும் பழுதுபார்க்கும் சேவைகள்', 'Home', 1),
  ('c0000001-0000-0000-0000-000000000002', 'Electricians', 'எலக்ட்ரீஷியன்கள்', 'electricians', 'Wiring, fuse repair, switchboard installation, and electrical safety', 'வயரிங், பியூஸ் பழுது, சுவிட்ச்போர்டு பொருத்துதல் சேவைகள்', 'Zap', 2),
  ('c0000001-0000-0000-0000-000000000003', 'Plumbing', 'பிளம்பிங்', 'plumbing', 'Pipe leakage, tap replacement, bathroom fittings, and motor installation', 'குழாய் கசிவு, பைப் பொருத்துதல் மற்றும் மோட்டார் ரிப்பேர்', 'Wrench', 3),
  ('c0000001-0000-0000-0000-000000000004', 'Carpentry', 'தச்சு வேலை', 'carpentry', 'Furniture repair, modular kitchen, door & window fixing', 'மரச்சாமான்கள் பழுது, கதவு மற்றும் ஜன்னல் அமைப்புகள்', 'Hammer', 4),
  ('c0000001-0000-0000-0000-000000000005', 'Cleaning Services', 'சுத்தம் செய்யும் சேவைகள்', 'cleaning-services', 'Deep house cleaning, sofa shampooing, bathroom sanitization', 'முழு வீடு சுத்தம், சோபா வாஷிங் மற்றும் கழிவறை சுத்தம்', 'Sparkles', 5),
  ('c0000001-0000-0000-0000-000000000006', 'Appliance Repair', 'வீட்டு உபகரணங்கள் பழுது', 'appliance-repair', 'AC service, refrigerator repair, washing machine & microwave care', 'ஏசி சர்வீஸ், ஃப்ரிட்ஜ், வாஷிங் மெஷின் ரிப்பேர்', 'Tv', 6),
  ('c0000001-0000-0000-0000-000000000007', 'Vehicle Mechanics', 'வாகன மெக்கானிக்', 'vehicle-mechanics', 'Two-wheeler and four-wheeler roadside assistance and mechanic support', 'இருசக்கர மற்றும் நான்கு சக்கர வாகன பராமரிப்பு', 'Gauge', 7),
  ('c0000001-0000-0000-0000-000000000008', 'Bike and Car Services', 'பைக் & கார் சர்வீஸ்', 'bike-and-car-services', 'Full water wash, oil change, detailing, tyre alignment & periodic service', 'வாட்டர் வாஷ், ஆயில் மாற்றம் மற்றும் முழுமையான வாகன சர்வீஸ்', 'Car', 8),
  ('c0000001-0000-0000-0000-000000000009', 'Beauty and Salons', 'அழகு & சலூன்', 'beauty-and-salons', 'Haircut, facial, bridal makeover, and doorstep salon services', 'முடி வெட்டுதல், ஃபேஷியல் மற்றும் மணப்பெண் அலங்காரம்', 'Scissors', 9),
  ('c0000001-0000-0000-0000-000000000010', 'Healthcare and Clinics', 'சுகாதாரம் & கிளினிக்குகள்', 'healthcare-and-clinics', 'Dental care, general physicians, physiotherapy, and pathology labs', 'பல் மருத்துவம், பொது மருத்துவர்கள் மற்றும் பிசியோதெரபி', 'Stethoscope', 10),
  ('c0000001-0000-0000-0000-000000000011', 'Education and Tutors', 'கல்வி & ஆசிரியர்கள்', 'education-and-tutors', 'School coaching, NEET/JEE tutors, language classes & music training', 'பள்ளி டியூஷன், போட்டித் தேர்வு பயிற்சி மற்றும் மொழி வகுப்புகள்', 'GraduationCap', 11),
  ('c0000001-0000-0000-0000-000000000012', 'Restaurants and Cafes', 'உணவகங்கள் & கஃபேக்கள்', 'restaurants-and-cafes', 'Authentic South Indian mess, family dining, bakeries, and cafes', 'பாரம்பரிய உணவகங்கள், குடும்ப உணவகம் மற்றும் கஃபேக்கள்', 'UtensilsCrossed', 12),
  ('c0000001-0000-0000-0000-000000000013', 'Grocery and Retail Shops', 'மளிகை & சில்லறை கடைகள்', 'grocery-and-retail', 'Local provision stores, organic fruits & vegetables, supermarkets', 'பாரம்பரிய மளிகைக் கடைகள், இயற்கை காய்கறிகள்', 'ShoppingBag', 13),
  ('c0000001-0000-0000-0000-000000000014', 'Electronics and Mobile Repair', 'மொபைல் & எலக்ட்ரானிக்ஸ் பழுது', 'electronics-and-mobile-repair', 'Smartphone screen replacement, battery fixing, laptop servicing', 'ஸ்மார்ட்போன் திரை மாற்றம், மடிக்கணினி சர்வீஸ்', 'Smartphone', 14),
  ('c0000001-0000-0000-0000-000000000015', 'Photography', 'புகைப்படக்கலை', 'photography', 'Wedding photography, baby shoot, corporate events and drone shoots', 'திருமண புகைப்படம், சுப நிகழ்வுகள் மற்றும் வீடியோ', 'Camera', 15),
  ('c0000001-0000-0000-0000-000000000016', 'Event Management', 'நிகழ்வு மேலாண்மை', 'event-management', 'Catering, stage decoration, sound system, and wedding planners', 'கேட்டரிங், மேடை அலங்காரம், இசை மற்றும் விழா திட்டமிடல்', 'PartyPopper', 16),
  ('c0000001-0000-0000-0000-000000000017', 'Tailoring and Laundry', 'தையல் & சலவை', 'tailoring-and-laundry', 'Custom stitching, blouse alterations, dry cleaning & ironing', 'தையல் வேலைப்பாடு, உலர் சலவை மற்றும் அயர்னிங்', 'Shirt', 17),
  ('c0000001-0000-0000-0000-000000000018', 'Professional Services', 'தொழில்முறை சேவைகள்', 'professional-services', 'Auditing, GST filing, legal documentation, and insurance consulting', 'ஜிஎஸ்டி தாக்கல், சட்ட ஆலோசனை மற்றும் காப்பீட்டு சேவைகள்', 'Briefcase', 18),
  ('c0000001-0000-0000-0000-000000000019', 'Accommodation and PG', 'தங்குமிடம் & பிஜி', 'accommodation-and-pg', 'Paying guest hostels, rooms for rent, bachelor stays with food', 'பிஜி விடுதிகள், வாடகை அறைகள் மற்றும் தங்குமிடம்', 'Building', 19),
  ('c0000001-0000-0000-0000-000000000020', 'Other Local Businesses', 'பிற உள்ளூர் வணிகங்கள்', 'other-local-businesses', 'Key makers, xerox centres, printing press, and nursery gardens', 'சாவி தயாரிப்பாளர்கள், ஜெராக்ஸ் மற்றும் பிற சேவைகள்', 'Layers', 20)
ON CONFLICT (slug) DO UPDATE 
SET name = EXCLUDED.name,
    name_ta = EXCLUDED.name_ta,
    icon = EXCLUDED.icon,
    description = EXCLUDED.description,
    description_ta = EXCLUDED.description_ta;

-- 2. Insert Starter Verified Businesses (Realistic Chennai Listings)
INSERT INTO public.businesses (id, category_id, name, slug, description, description_ta, address, locality, city, state, postal_code, latitude, longitude, phone, email, website, cover_image, service_mode, experience_years, is_verified, listing_status, rating, review_count, min_price)
VALUES
  (
    'b0000001-0000-0000-0000-000000000001',
    'c0000001-0000-0000-0000-000000000003', -- Plumbing
    'Anna Nagar Express Plumbing & Motors',
    'anna-nagar-express-plumbing',
    'Fast doorstep plumbing service for residential and commercial spaces. Expert in leakages, pump installations, and sanitary repairs.',
    'அண்ணா நகர் பகுதியில் உடனடி பிளம்பிங் மற்றும் மோட்டார் பழுதுபார்க்கும் சேவை.',
    'Plot 142, 2nd Avenue, Near Roundtana, Anna Nagar',
    'Anna Nagar',
    'Chennai',
    'Tamil Nadu',
    '600040',
    13.0850, 80.2101,
    '+91 98401 23456',
    'contact@expressplumbing.in',
    'https://expressplumbing.in',
    'https://images.unsplash.com/photo-1581244277943-fe4a9c777189?w=800&auto=format&fit=crop&q=80',
    ARRAY['at_doorstep']::TEXT[],
    12,
    TRUE,
    'active',
    4.8,
    42,
    299.00
  ),
  (
    'b0000001-0000-0000-0000-000000000002',
    'c0000001-0000-0000-0000-000000000002', -- Electricians
    'Sri Murugan Electricals & Inverter Works',
    'sri-murugan-electricals-t-nagar',
    'Certified licensed electricians providing round-the-clock emergency electrical repairs, inverter installation, and safety checks in T. Nagar.',
    'தி நகர் பகுதியில் தகுதிவாய்ந்த எலக்ட்ரீஷியன்கள் மற்றும் இன்வெர்ட்டர் சர்வீஸ்.',
    'No 45, Usman Road, T. Nagar',
    'T. Nagar',
    'Chennai',
    'Tamil Nadu',
    '600017',
    13.0418, 80.2341,
    '+91 94440 98765',
    'info@srimuruganelec.com',
    NULL,
    'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800&auto=format&fit=crop&q=80',
    ARRAY['at_doorstep']::TEXT[],
    15,
    TRUE,
    'active',
    4.9,
    88,
    350.00
  ),
  (
    'b0000001-0000-0000-0000-000000000003',
    'c0000001-0000-0000-0000-000000000006', -- Appliance Repair
    'CoolBreeze AC & Refrigerator Specialists',
    'coolbreeze-ac-velachery',
    'Master technicians for split & inverter AC cleaning, gas charging, compressor repair, and refrigerator thermostat diagnosis.',
    'வேளச்சேரி ஏசி மற்றும் குளிர்சாதன பெட்டி பழுதுபார்க்கும் சிறப்பு மையம்.',
    'Shop 12, 100 Feet Bypass Road, Velachery',
    'Velachery',
    'Chennai',
    'Tamil Nadu',
    '600042',
    12.9815, 80.2180,
    '+91 98410 44321',
    'support@coolbreezeac.com',
    'https://coolbreezeac.com',
    'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=800&auto=format&fit=crop&q=80',
    ARRAY['at_doorstep', 'at_shop']::TEXT[],
    8,
    TRUE,
    'active',
    4.7,
    64,
    499.00
  ),
  (
    'b0000001-0000-0000-0000-000000000004',
    'c0000001-0000-0000-0000-000000000009', -- Beauty and Salons
    'Nila Naturals Ladies Salon & Bridal Lounge',
    'nila-naturals-salon-adyar',
    'Premium organic salon for women featuring hair spa, herbal facials, waxing, and specialized South Indian bridal makeovers.',
    'அடையாறு பகுதியில் பெண்களுக்கான இயற்கை அழகு நிலையம் மற்றும் மணப்பெண் அலங்காரம்.',
    '87, Gandhi Nagar 1st Main Road, Adyar',
    'Adyar',
    'Chennai',
    'Tamil Nadu',
    '600020',
    13.0012, 80.2565,
    '+91 97910 88776',
    'booking@nilanaturals.in',
    'https://nilanaturals.in',
    'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&auto=format&fit=crop&q=80',
    ARRAY['at_shop', 'at_doorstep']::TEXT[],
    9,
    TRUE,
    'active',
    4.9,
    110,
    400.00
  ),
  (
    'b0000001-0000-0000-0000-000000000005',
    'c0000001-0000-0000-0000-000000000014', -- Mobile Repair
    'OMR iTech Laptop & Mobile Hospital',
    'omr-itech-laptop-mobile-repair',
    'Quick chip-level iPhone, Android and MacBook motherboard repairs, screen replacement in 30 minutes with 6 months warranty.',
    'ஓஎம்ஆர் மொபைல் மற்றும் லேப்டாப் விரைவு பழுதுபார்க்கும் மையம்.',
    'GF-4, IT Highway Corridor, Thoraipakkam, OMR',
    'OMR',
    'Chennai',
    'Tamil Nadu',
    '600097',
    12.9344, 80.2312,
    '+91 90030 11223',
    'service@omritech.com',
    'https://omritech.com',
    'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=800&auto=format&fit=crop&q=80',
    ARRAY['at_shop', 'at_doorstep']::TEXT[],
    7,
    TRUE,
    'active',
    4.6,
    53,
    300.00
  ),
  (
    'b0000001-0000-0000-0000-000000000006',
    'c0000001-0000-0000-0000-000000000011', -- Education & Tutors
    'Tamil Valam Academy & Math Tuitions',
    'tamil-valam-academy-tuitions',
    'Expert personal and group coaching in Mathematics, Physics, and Tamil grammar for CBSE and State Board students with proven 90%+ pass rates.',
    'கணிதம், அறிவியல் மற்றும் தமிழ் இலக்கணத்திற்கான சிறப்பு தனிப்பயிற்சி வகுப்பு.',
    '23, Kutchery Road, Mylapore',
    'Mylapore',
    'Chennai',
    'Tamil Nadu',
    '600004',
    13.0339, 80.2678,
    '+91 98840 55667',
    'admissions@tamilvalam.org',
    NULL,
    'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&auto=format&fit=crop&q=80',
    ARRAY['at_shop', 'remote']::TEXT[],
    14,
    TRUE,
    'active',
    4.9,
    37,
    1500.00
  )
ON CONFLICT (slug) DO UPDATE
SET name = EXCLUDED.name,
    description = EXCLUDED.description,
    address = EXCLUDED.address,
    rating = EXCLUDED.rating,
    review_count = EXCLUDED.review_count,
    min_price = EXCLUDED.min_price;

-- 3. Insert Realistic Services for Businesses
INSERT INTO public.services (business_id, name, name_ta, description, price, pricing_type, duration_minutes, booking_enabled)
VALUES
  -- Plumbing Services
  ('b0000001-0000-0000-0000-000000000001', 'General Tap & Leakage Repair', 'குழாய் கசிவு பழுதுபார்த்தல்', 'Diagnosis and fixing of leaking pipes, angle valves, or dripping taps', 299.00, 'fixed', 45, true),
  ('b0000001-0000-0000-0000-000000000001', 'Water Motor / Pump Installation', 'மோட்டார் பம்ப் பொருத்துதல்', 'Complete installation or replacement of water booster pump or sump motor', 799.00, 'starting_at', 90, true),
  ('b0000001-0000-0000-0000-000000000001', 'Bathroom Sanitary Fittings Upgrade', 'குளியலறை உபகரணங்கள் மாற்றுதல்', 'Wash basin, commode seat, shower head & mixer installation', 549.00, 'fixed', 60, true),

  -- Electrician Services
  ('b0000001-0000-0000-0000-000000000002', 'Electrical Short Circuit & Fuse Check', 'ஷார்ட் சர்க்யூட் சரிபார்த்தல்', 'Emergency investigation of trip switches, MCB box, and short circuits', 350.00, 'fixed', 60, true),
  ('b0000001-0000-0000-0000-000000000002', 'Ceiling Fan & Chandelier Fitting', 'சீலிங் ஃபேன் பொருத்துதல்', 'Standard fan assembly, hook fitting and regulator setup', 250.00, 'fixed', 30, true),
  ('b0000001-0000-0000-0000-000000000002', 'Home Inverter & Battery Wiring', 'இன்வெர்ட்டர் பேட்டரி வயரிங்', 'Safe dual wiring setup for home power backup systems', 850.00, 'starting_at', 120, true),

  -- AC Repair Services
  ('b0000001-0000-0000-0000-000000000003', 'Split AC Foam Jet Deep Cleaning', 'ஏசி டீப் கிளீனிங் சர்வீஸ்', 'High pressure water jet clean of indoor cooling coil, filter & outdoor condenser', 499.00, 'fixed', 60, true),
  ('b0000001-0000-0000-0000-000000000003', 'AC Gas Top-Up & Leakage Fix', 'ஏசி கேஸ் நிரப்புதல்', 'Refrigerant pressure test, copper pipe brazing and gas refilling', 1899.00, 'quote', 90, true),

  -- Salon Services
  ('b0000001-0000-0000-0000-000000000004', 'Herbal Glow Facial & Cleansing', 'ஹெர்பல் க்ளோ ஃபேஷியல்', 'Nourishing organic facial with herbal extracts for radiant skin', 650.00, 'fixed', 60, true),
  ('b0000001-0000-0000-0000-000000000004', 'Traditional Bridal Mehendi & Makeover', 'மணப்பெண் அலங்காரம்', 'Complete bridal beauty package including hairstyle, drape and makeover', 3500.00, 'starting_at', 180, true);

-- 4. Insert Standard Opening Hours (Mon-Sat 9AM-8PM, Sun 10AM-2PM)
INSERT INTO public.opening_hours (business_id, day_of_week, open_time, close_time, is_closed)
SELECT 
  b.id,
  d.day,
  CASE WHEN d.day = 0 THEN '10:00:00'::TIME ELSE '09:00:00'::TIME END,
  CASE WHEN d.day = 0 THEN '14:00:00'::TIME ELSE '20:00:00'::TIME END,
  FALSE
FROM public.businesses b
CROSS JOIN (VALUES (0), (1), (2), (3), (4), (5), (6)) AS d(day)
ON CONFLICT (business_id, day_of_week) DO NOTHING;
