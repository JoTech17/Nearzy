// Nearzy Database Profile Verification Utility
// Run with: node scripts/checkDbProfiles.js
import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Read .env manually to ensure environment variables are loaded
function loadEnv() {
  const envPath = path.resolve(__dirname, '../.env')
  if (fs.existsSync(envPath)) {
    const content = fs.readFileSync(envPath, 'utf8')
    content.split('\n').forEach(line => {
      const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/)
      if (match) {
        const key = match[1]
        let val = (match[2] || '').trim()
        if (val.startsWith('"') && val.endsWith('"')) val = val.slice(1, -1)
        if (val.startsWith("'") && val.endsWith("'")) val = val.slice(1, -1)
        process.env[key] = val
      }
    })
  }
}

loadEnv()

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_PUBLISHABLE_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Supabase credentials missing in .env')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function checkDatabase() {
  console.log('\n======================================================')
  console.log('   🔍 NEARZY SUPABASE DATABASE PROFILE AUDIT')
  console.log('======================================================')
  console.log(`📡 Connected to: ${supabaseUrl}\n`)

  try {
    // 1. Fetch Profiles
    const { data: profiles, error: profileErr } = await supabase
      .from('profiles')
      .select('id, display_name, email, phone, preferred_language, created_at')
      .order('created_at', { ascending: false })

    if (profileErr) {
      console.error('❌ Error fetching profiles:', profileErr.message)
    } else {
      console.log(`👤 REGISTERED PROFILES (Table: "profiles") [Total: ${profiles.length}]`)
      if (profiles.length === 0) {
        console.log('   (No registered profiles found in the database yet)')
      } else {
        console.table(profiles.map(p => ({
          'User ID': p.id.substring(0, 8) + '...',
          'Display Name': p.display_name,
          'Email': p.email,
          'Phone': p.phone || 'N/A',
          'Lang': p.preferred_language,
          'Created At': new Date(p.created_at).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })
        })))
      }
    }

    // 2. Fetch User Roles
    const { data: roles, error: roleErr } = await supabase
      .from('user_roles')
      .select('user_id, role, created_at')

    if (!roleErr && roles) {
      console.log(`\n🛡️ USER ROLES (Table: "user_roles") [Total: ${roles.length}]`)
      if (roles.length > 0) {
        console.table(roles.map(r => ({
          'User ID': r.user_id.substring(0, 8) + '...',
          'Role': r.role,
          'Assigned At': new Date(r.created_at).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })
        })))
      } else {
        console.log('   (No explicit roles in user_roles table; defaults to customer)')
      }
    }

    // 3. Fetch User-Registered Businesses
    const { data: userBusinesses, error: bizErr } = await supabase
      .from('businesses')
      .select('id, name, city, locality, phone, created_by, created_at')
      .not('created_by', 'is', null)
      .order('created_at', { ascending: false })

    if (!bizErr && userBusinesses) {
      console.log(`\n🏪 USER-REGISTERED BUSINESSES [Total: ${userBusinesses.length}]`)
      if (userBusinesses.length > 0) {
        console.table(userBusinesses.map(b => ({
          'Business Name': b.name,
          'City': b.city,
          'Locality': b.locality,
          'Phone': b.phone,
          'Owner ID': (b.created_by || '').substring(0, 8) + '...',
          'Registered At': new Date(b.created_at).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })
        })))
      } else {
        console.log('   (No businesses created by registered users yet)')
      }
    }

    // 4. Total Platform Businesses count
    const { count: totalBizCount, error: countErr } = await supabase
      .from('businesses')
      .select('*', { count: 'exact', head: true })

    if (!countErr) {
      console.log(`\n📊 TOTAL PLATFORM BUSINESSES IN DATABASE: ${totalBizCount}`)
    }

    console.log('\n======================================================')
    console.log('✅ Audit completed successfully.')
    console.log('======================================================\n')
  } catch (err) {
    console.error('❌ Failed to audit database:', err)
  }
}

checkDatabase()
