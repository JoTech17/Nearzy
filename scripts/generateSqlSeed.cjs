const fs = require('fs');
const path = require('path');

// Read generated mockData
const mockDataPath = path.join(__dirname, '..', 'src', 'data', 'mockData.js');
const content = fs.readFileSync(mockDataPath, 'utf8');

// Extract INITIAL_BUSINESSES
const match = content.match(/export const INITIAL_BUSINESSES = (\[[\s\S]*?\]);\s*export const INITIAL_REVIEWS/);
if (!match) {
  console.error('Could not find INITIAL_BUSINESSES in mockData.js');
  process.exit(1);
}

const businesses = JSON.parse(match[1]);
console.log('Parsed', businesses.length, 'businesses from mockData.js');

let sql = `-- JoWala Statewide Seed Script: 760 Distributed Businesses Across All 38 Districts of Tamil Nadu
-- Tagline: Unga Ooru, Unga Service!

`;

// Generate batch inserts for businesses
sql += `INSERT INTO public.businesses (id, category_id, name, slug, description, description_ta, address, locality, city, state, postal_code, latitude, longitude, phone, email, website, cover_image, service_mode, experience_years, is_verified, listing_status, rating, review_count, min_price)\nVALUES\n`;

const escapeSql = (str) => {
  if (!str) return 'NULL';
  return `'${String(str).replace(/'/g, "''")}'`;
};

const rows = businesses.map(b => {
  // Convert ID to deterministic UUID
  const hexIdx = businesses.indexOf(b) + 10;
  const uuid = `b0000002-0000-0000-0000-${String(hexIdx).padStart(12, '0')}`;
  b.dbId = uuid;

  const coverImg = 'https://images.unsplash.com/photo-1581244277943-fe4a9c777189?w=800&auto=format&fit=crop&q=80';

  return `  (${escapeSql(uuid)}, ${escapeSql(b.categoryId)}, ${escapeSql(b.name)}, ${escapeSql(b.slug)}, ${escapeSql(b.description)}, ${escapeSql(b.descriptionTa)}, ${escapeSql(b.address)}, ${escapeSql(b.locality)}, ${escapeSql(b.city)}, 'Tamil Nadu', ${escapeSql(b.postalCode)}, ${b.latitude}, ${b.longitude}, ${escapeSql(b.phone)}, ${escapeSql(b.email)}, ${escapeSql(b.website)}, '${coverImg}', ARRAY['at_doorstep', 'at_shop']::TEXT[], ${b.experienceYears || 5}, TRUE, 'active', ${b.rating || 4.8}, ${b.reviewCount || 25}, ${b.minPrice || 299})`;
});

sql += rows.join(',\n') + `\nON CONFLICT (slug) DO UPDATE\nSET name = EXCLUDED.name,\n    address = EXCLUDED.address,\n    locality = EXCLUDED.locality,\n    latitude = EXCLUDED.latitude,\n    longitude = EXCLUDED.longitude,\n    rating = EXCLUDED.rating,\n    review_count = EXCLUDED.review_count;\n\n`;

// Generate sample services for each
sql += `-- Insert services for distributed businesses\n`;
sql += `INSERT INTO public.services (business_id, name, name_ta, description, price, pricing_type, duration_minutes, booking_enabled)\nVALUES\n`;

const serviceRows = [];
businesses.forEach(b => {
  if (b.services && b.services.length > 0) {
    b.services.forEach(s => {
      serviceRows.push(`  (${escapeSql(b.dbId)}, ${escapeSql(s.name)}, ${escapeSql(s.nameTa)}, ${escapeSql(s.description)}, ${s.price}, 'fixed', ${s.durationMinutes || 60}, TRUE)`);
    });
  }
});

sql += serviceRows.join(',\n') + `;\n`;

const outputPath = path.join(__dirname, '..', 'supabase', 'seed_tamilnadu_all.sql');
fs.writeFileSync(outputPath, sql, 'utf8');
console.log('Successfully wrote SQL seed file to', outputPath, `(${Math.round(sql.length / 1024)} KB)`);
