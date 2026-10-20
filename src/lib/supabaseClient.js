// Nearzy Supabase Client Initialization
import { createClient } from '@supabase/supabase-js'

const rawUrl = 
  import.meta.env.VITE_SUPABASE_URL || 
  import.meta.env.SUPABASE_URL || 
  ''

let rawKey = 
  import.meta.env.VITE_SUPABASE_ANON_KEY || 
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || 
  import.meta.env.SUPABASE_PUBLISHABLE_KEY || 
  ''

// If VITE_SUPABASE_ANON_KEY was mistakenly filled with postgresql:// connection string, fallback to publishable key
if (rawKey.trim().startsWith('postgresql://')) {
  rawKey = import.meta.env.SUPABASE_PUBLISHABLE_KEY || import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || ''
}

const supabaseUrl = rawUrl.trim()
const supabaseAnonKey = rawKey.trim()

export const isSupabaseConfigured = Boolean(
  supabaseUrl && 
  supabaseAnonKey && 
  supabaseUrl.startsWith('https://') && 
  supabaseAnonKey.length > 20 &&
  !supabaseUrl.includes('your-project-ref') &&
  !supabaseAnonKey.includes('dummy_anon_key') &&
  !supabaseAnonKey.startsWith('postgresql://')
)

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    })
  : null

export async function checkSupabaseConnection() {
  if (!isSupabaseConfigured || !supabase) {
    return {
      connected: false,
      message: 'Supabase credentials not configured in .env',
    }
  }

  try {
    const { error } = await supabase.from('categories').select('id').limit(1)
    if (error) throw error
    return { connected: true, message: 'Connected to Supabase PostgreSQL successfully' }
  } catch (err) {
    return {
      connected: false,
      message: err.message || 'Failed to query Supabase tables',
    }
  }
}
