// Generator script for 200 Tamil Nadu Service Providers (10 per service category)
import fs from 'fs';

const categories = [
  { id: 'c0000001-0000-0000-0000-000000000001', name: 'Home Services', name_ta: 'வீட்டு சேவைகள்', slug: 'home-services', icon: 'Home', display_order: 1, desc: 'General maintenance and home repairs', desc_ta: 'இல்ல பராமரிப்பு மற்றும் பழுதுபார்க்கும் சேவைகள்' },
  { id: 'c0000001-0000-0000-0000-000000000002', name: 'Electricians', name_ta: 'எலக்ட்ரீஷியன்கள்', slug: 'electricians', icon: 'Zap', display_order: 2, desc: 'Wiring, fuse repair, and switchboards', desc_ta: 'வயரிங் மற்றும் மின்சார பாதுகாப்பு சேவைகள்' },
  { id: 'c0000001-0000-0000-0000-000000000003', name: 'Plumbing', name_ta: 'பிளம்பிங்', slug: 'plumbing', icon: 'Wrench', display_order: 3, desc: 'Pipes, taps, motors and leakage fix', desc_ta: 'குழாய் கசிவு மற்றும் மோட்டார் பழுது' },
  { id: 'c0000001-0000-0000-0000-000000000004', name: 'Carpentry', name_ta: 'தச்சு வேலை', slug: 'carpentry', icon: 'Hammer', display_order: 4, desc: 'Furniture, doors, modular fittings', desc_ta: 'மரச்சாமான்கள் பழுது மற்றும் மர வேலைப்பாடு' },
  { id: 'c0000001-0000-0000-0000-000000000005', name: 'Cleaning Services', name_ta: 'சுத்தம் செய்யும் சேவைகள்', slug: 'cleaning-services', icon: 'Sparkles', display_order: 5, desc: 'Deep house and sofa sanitization', desc_ta: 'முழு வீடு மற்றும் சோபா சுத்தம்' },
  { id: 'c0000001-0000-0000-0000-000000000006', name: 'Appliance Repair', name_ta: 'வீட்டு உபகரணங்கள் பழுது', slug: 'appliance-repair', icon: 'Tv', display_order: 6, desc: 'AC, fridge, washing machine care', desc_ta: 'ஏசி மற்றும் குளிர்சாதன பெட்டி பழுது' },
  { id: 'c0000001-0000-0000-0000-000000000007', name: 'Vehicle Mechanics', name_ta: 'வாகன மெக்கானிக்', slug: 'vehicle-mechanics', icon: 'Gauge', display_order: 7, desc: 'Two and four wheeler repair & roadside help', desc_ta: 'இருசக்கர மற்றும் நான்கு சக்கர வாகன பழுது' },
  { id: 'c0000001-0000-0000-0000-000000000008', name: 'Bike and Car Services', name_ta: 'பைக் & கார் சர்வீஸ்', slug: 'bike-and-car-services', icon: 'Car', display_order: 8, desc: 'Foam wash, detailing, tyre alignment', desc_ta: 'வாட்டர் வாஷ் மற்றும் முழுமையான வாகன சர்வீஸ்' },
  { id: 'c0000001-0000-0000-0000-000000000009', name: 'Beauty and Salons', name_ta: 'அழகு & சலூன்', slug: 'beauty-and-salons', icon: 'Scissors', display_order: 9, desc: 'Haircut, facial, bridal salon', desc_ta: 'முடி அலங்காரம் மற்றும் மணப்பெண் அலங்காரம்' },
  { id: 'c0000001-0000-0000-0000-000000000010', name: 'Healthcare and Clinics', name_ta: 'சுகாதாரம் & கிளினிக்குகள்', slug: 'healthcare-and-clinics', icon: 'Stethoscope', display_order: 10, desc: 'Doctors, dental care, physiotherapy', desc_ta: 'மருத்துவ கிளினிக் மற்றும் பல் மருத்துவம்' },
  { id: 'c0000001-0000-0000-0000-000000000011', name: 'Education and Tutors', name_ta: 'கல்வி & ஆசிரியர்கள்', slug: 'education-and-tutors', icon: 'GraduationCap', display_order: 11, desc: 'Maths, Science, Tamil, NEET tuition', desc_ta: 'பள்ளி மற்றும் போட்டித் தேர்வு சிறப்பு பயிற்சி' },
  { id: 'c0000001-0000-0000-0000-000000000012', name: 'Restaurants and Cafes', name_ta: 'உணவகங்கள் & கஃபேக்கள்', slug: 'restaurants-and-cafes', icon: 'UtensilsCrossed', display_order: 12, desc: 'South Indian mess, cafes, family dine', desc_ta: 'பாரம்பரிய உணவகம் மற்றும் கஃபேக்கள்' },
  { id: 'c0000001-0000-0000-0000-000000000013', name: 'Grocery and Retail Shops', name_ta: 'மளிகை & சில்லறை கடைகள்', slug: 'grocery-and-retail', icon: 'ShoppingBag', display_order: 13, desc: 'Provision stores, organic produce, essentials', desc_ta: 'பாரம்பரிய மளிகைக் கடைகள் மற்றும் காய்கறிகள்' },
  { id: 'c0000001-0000-0000-0000-000000000014', name: 'Electronics and Mobile Repair', name_ta: 'மொபைல் & எலக்ட்ரானிக்ஸ் பழுது', slug: 'electronics-and-mobile-repair', icon: 'Smartphone', display_order: 14, desc: 'Screen replacement, chip repair, laptops', desc_ta: 'ஸ்மார்ட்போன் மற்றும் மடிக்கணினி சர்வீஸ்' },
  { id: 'c0000001-0000-0000-0000-000000000015', name: 'Photography', name_ta: 'புகைப்படக்கலை', slug: 'photography', icon: 'Camera', display_order: 15, desc: 'Wedding, outdoor, baby portraits & drone', desc_ta: 'திருமண புகைப்படம் மற்றும் வீடியோ பதிவு' },
  { id: 'c0000001-0000-0000-0000-000000000016', name: 'Event Management', name_ta: 'நிகழ்வு மேலாண்மை', slug: 'event-management', icon: 'PartyPopper', display_order: 16, desc: 'Catering, decoration, sound & lights', desc_ta: 'விழா மேடை அலங்காரம் மற்றும் கேட்டரிங்' },
  { id: 'c0000001-0000-0000-0000-000000000017', name: 'Tailoring and Laundry', name_ta: 'தையல் & சலவை', slug: 'tailoring-and-laundry', icon: 'Shirt', display_order: 17, desc: 'Blouse stitching, alterations, dry cleaning', desc_ta: 'தையல் கலை மற்றும் உலர் சலவை' },
  { id: 'c0000001-0000-0000-0000-000000000018', name: 'Professional Services', name_ta: 'தொழில்முறை சேவைகள்', slug: 'professional-services', icon: 'Briefcase', display_order: 18, desc: 'Auditors, GST, legal advice, docs', desc_ta: 'ஜிஎஸ்டி தாக்கல் மற்றும் சட்ட ஆலோசனை' },
  { id: 'c0000001-0000-0000-0000-000000000019', name: 'Accommodation and PG', name_ta: 'தங்குமிடம் & பிஜி', slug: 'accommodation-and-pg', icon: 'Building', display_order: 19, desc: 'Hostels, bachelor stays, rooms with food', desc_ta: 'வாடகை அறைகள் மற்றும் பிஜி விடுதிகள்' },
  { id: 'c0000001-0000-0000-0000-000000000020', name: 'Other Local Businesses', name_ta: 'பிற உள்ளூர் வணிகங்கள்', slug: 'other-local-businesses', icon: 'Layers', display_order: 20, desc: 'Key makers, xerox, nursery plants, pet care', desc_ta: 'சாவி தயாரிப்பு, ஜெராக்ஸ் மற்றும் பிற சேவைகள்' },
];

const tnHubs = [
  { city: 'Chennai', locality: 'Anna Nagar', lat: 13.0850, lng: 80.2101, postal: '600040' },
  { city: 'Chennai', locality: 'T. Nagar', lat: 13.0418, lng: 80.2341, postal: '600017' },
  { city: 'Chennai', locality: 'Velachery', lat: 12.9815, lng: 80.2180, postal: '600042' },
  { city: 'Chennai', locality: 'Adyar', lat: 13.0012, lng: 80.2565, postal: '600020' },
  { city: 'Chennai', locality: 'OMR', lat: 12.9344, lng: 80.2312, postal: '600097' },
  { city: 'Coimbatore', locality: 'Gandhipuram', lat: 11.0168, lng: 76.9558, postal: '641012' },
  { city: 'Coimbatore', locality: 'RS Puram', lat: 11.0085, lng: 76.9450, postal: '641002' },
  { city: 'Madurai', locality: 'KK Nagar', lat: 9.9252, lng: 78.1198, postal: '625020' },
  { city: 'Madurai', locality: 'Simmakkal', lat: 9.9280, lng: 78.1250, postal: '625001' },
  { city: 'Tiruchirappalli', locality: 'Thillai Nagar', lat: 10.8250, lng: 78.6850, postal: '620018' },
  { city: 'Tiruchirappalli', locality: 'Cantonment', lat: 10.7905, lng: 78.7047, postal: '620001' },
  { city: 'Salem', locality: 'Fairlands', lat: 11.6643, lng: 78.1460, postal: '636016' },
  { city: 'Salem', locality: 'Suramangalam', lat: 11.6750, lng: 78.1200, postal: '636005' },
  { city: 'Tirunelveli', locality: 'Palayamkottai', lat: 8.7139, lng: 77.7567, postal: '627002' },
  { city: 'Erode', locality: 'Perundurai Road', lat: 11.3410, lng: 77.7172, postal: '638011' },
  { city: 'Vellore', locality: 'Katpadi', lat: 12.9698, lng: 79.1390, postal: '632014' },
  { city: 'Thanjavur', locality: 'Medical College Road', lat: 10.7870, lng: 79.1378, postal: '613004' },
  { city: 'Hosur', locality: 'Bagalur Road', lat: 12.7409, lng: 77.8253, postal: '635109' },
  { city: 'Tiruppur', locality: 'Avinashi Road', lat: 11.1085, lng: 77.3411, postal: '641602' },
  { city: 'Nagercoil', locality: 'Court Road', lat: 8.1833, lng: 77.4119, postal: '629001' }
];

const categoryImages = {
  'home-services': 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&auto=format&fit=crop&q=80',
  'electricians': 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800&auto=format&fit=crop&q=80',
  'plumbing': 'https://images.unsplash.com/photo-1581244277943-fe4a9c777189?w=800&auto=format&fit=crop&q=80',
  'carpentry': 'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?w=800&auto=format&fit=crop&q=80',
  'cleaning-services': 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&auto=format&fit=crop&q=80',
  'appliance-repair': 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=800&auto=format&fit=crop&q=80',
  'vehicle-mechanics': 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=800&auto=format&fit=crop&q=80',
  'bike-and-car-services': 'https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?w=800&auto=format&fit=crop&q=80',
  'beauty-and-salons': 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&auto=format&fit=crop&q=80',
  'healthcare-and-clinics': 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=800&auto=format&fit=crop&q=80',
  'education-and-tutors': 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&auto=format&fit=crop&q=80',
  'restaurants-and-cafes': 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&auto=format&fit=crop&q=80',
  'grocery-and-retail': 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&auto=format&fit=crop&q=80',
  'electronics-and-mobile-repair': 'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=800&auto=format&fit=crop&q=80',
  'photography': 'https://images.unsplash.com/photo-1537633552985-df8429e8048b?w=800&auto=format&fit=crop&q=80',
  'event-management': 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800&auto=format&fit=crop&q=80',
  'tailoring-and-laundry': 'https://images.unsplash.com/photo-1582738411706-bfc8e691d1c2?w=800&auto=format&fit=crop&q=80',
  'professional-services': 'https://images.unsplash.com/photo-1450133064473-71024230f91b?w=800&auto=format&fit=crop&q=80',
  'accommodation-and-pg': 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800&auto=format&fit=crop&q=80',
  'other-local-businesses': 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?w=800&auto=format&fit=crop&q=80',
};

const providers = [];
let bizCounter = 1;

categories.forEach((cat, catIdx) => {
  for (let i = 0; i < 10; i++) {
    const hub = tnHubs[(catIdx * 2 + i) % tnHubs.length];
    const bizId = `b_${cat.slug}_${i + 1}`;
    const namePrefixes = [
      'Sri Krishna', 'Vetrivel', 'Tamil Valam', 'Kaveri', 'Kongu Express', 
      'Madurai Meenakshi', 'Annamalai', 'Chola', 'Kumaran', 'Mullai'
    ];
    const prefix = namePrefixes[i % namePrefixes.length];
    const bizName = `${prefix} ${cat.name} & Services`;
    const bizNameTa = `${prefix} ${cat.name_ta}`;
    const slug = `${prefix.toLowerCase().replace(/\s+/g, '-')}-${cat.slug}-${hub.locality.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${i + 1}`;
    const minPrice = 199 + ((i * 50) % 600);
    const rating = Number((4.3 + ((i * 7) % 7) * 0.1).toFixed(1));
    const reviews = 18 + ((i * 13) % 95);

    // Lat/lng slight jitter so markers in same locality do not overlap exactly
    const latJitter = (Math.sin(i * 1.5) * 0.015);
    const lngJitter = (Math.cos(i * 1.5) * 0.015);

    providers.push({
      id: bizId,
      categoryId: cat.id,
      categorySlug: cat.slug,
      categoryName: cat.name,
      categoryNameTa: cat.name_ta,
      categoryIcon: cat.icon,
      name: bizName,
      nameTa: bizNameTa,
      slug: slug,
      description: `Verified professional ${cat.name.toLowerCase()} in ${hub.locality}, ${hub.city}. Equipped with certified tools and prompt doorstep assistance.`,
      descriptionTa: `${hub.locality}, ${hub.city} பகுதியில் தரமான ${cat.name_ta} உடனடி சேவை.`,
      address: `Shop No ${12 + i}, Main Bazaar Road, ${hub.locality}`,
      locality: hub.locality,
      city: hub.city,
      state: 'Tamil Nadu',
      postalCode: hub.postal,
      latitude: Number((hub.lat + latJitter).toFixed(4)),
      longitude: Number((hub.lng + lngJitter).toFixed(4)),
      phone: `+91 984${(10 + i * 7).toString().padStart(2, '0')} ${(20000 + i * 345).toString().slice(0, 5)}`,
      email: `contact@${slug.slice(0, 15)}.jowala.in`,
      website: '',
      coverImage: categoryImages[cat.slug] || categoryImages['home-services'],
      serviceMode: ['at_doorstep', 'at_shop'],
      experienceYears: 4 + (i % 12),
      isVerified: true,
      isClaimed: true,
      listingStatus: 'active',
      rating: rating > 5.0 ? 5.0 : rating,
      reviewCount: reviews,
      minPrice: minPrice,
      services: [
        {
          id: `s_${bizId}_1`,
          name: `Standard ${cat.name} Consultation & Checkup`,
          nameTa: `அடிப்படை ${cat.name_ta} பரிசோதனை`,
          description: `Comprehensive on-site inspection and diagnosis by senior technician in ${hub.city}.`,
          price: minPrice,
          pricingType: 'fixed',
          durationMinutes: 45,
          bookingEnabled: true,
        },
        {
          id: `s_${bizId}_2`,
          name: `Comprehensive ${cat.name} Solution`,
          nameTa: `முழுமையான ${cat.name_ta} சர்வீஸ்`,
          description: `Full servicing with 30-day workmanship guarantee and safety compliance.`,
          price: minPrice + 350,
          pricingType: 'starting_at',
          durationMinutes: 90,
          bookingEnabled: true,
        }
      ],
      openingHours: [
        { day: 1, open: '08:30', close: '20:30', closed: false },
        { day: 2, open: '08:30', close: '20:30', closed: false },
        { day: 3, open: '08:30', close: '20:30', closed: false },
        { day: 4, open: '08:30', close: '20:30', closed: false },
        { day: 5, open: '08:30', close: '20:30', closed: false },
        { day: 6, open: '08:30', close: '20:30', closed: false },
        { day: 0, open: '09:00', close: '14:00', closed: false },
      ]
    });
  }
});

const content = `// JoWala Production Data Catalog
// 20 Standard Categories & Exactly 10 Verified Providers Per Category (200 Total Providers Across Tamil Nadu)

export const INITIAL_CATEGORIES = ${JSON.stringify(categories, null, 2)};

export const INITIAL_BUSINESSES = ${JSON.stringify(providers, null, 2)};

export const INITIAL_REVIEWS = [
  {
    id: 'r01',
    businessId: 'b_plumbing_1',
    customerName: 'Senthil Nathan',
    rating: 5,
    comment: 'Quick doorstep visit in Anna Nagar! Cleaned up the pipe burst and fixed bathroom valves within 40 minutes.',
    createdAt: '2026-10-14T10:30:00Z',
    ownerResponse: 'Thank you for choosing JoWala verified service!',
    ownerRespondedAt: '2026-10-14T12:00:00Z'
  },
  {
    id: 'r02',
    businessId: 'b_electricians_1',
    customerName: 'Anitha R.',
    rating: 4.8,
    comment: 'Very professional inverter wiring and fuse check in Coimbatore. Highly recommended.',
    createdAt: '2026-10-15T15:20:00Z',
    ownerResponse: null
  }
];

export const INITIAL_BOOKINGS = [
  {
    id: 'bk-1001',
    customerId: 'u01',
    customerName: 'Verified Customer',
    customerPhone: '+91 98400 11223',
    businessId: 'b_plumbing_1',
    businessName: 'Sri Krishna Plumbing & Services',
    serviceId: 's_b_plumbing_1_1',
    serviceName: 'Standard Plumbing Consultation & Checkup',
    requestedDate: '2026-10-22',
    requestedTime: '10:30',
    serviceMode: 'at_doorstep',
    serviceAddress: 'No 24, 2nd Avenue, Anna Nagar, Chennai',
    notes: 'Drainage pipe check.',
    estimatedPrice: 199,
    status: 'accepted',
    createdAt: '2026-10-17T09:00:00Z'
  }
];
`;

fs.writeFileSync('src/data/mockData.js', content);
console.log('Successfully generated 200 service providers across 20 categories in src/data/mockData.js!');
