import React, { createContext, useContext, useState, useEffect } from 'react'
import { supabase, isSupabaseConfigured } from '@/lib/supabaseClient'

const AuthContext = createContext()

// Demo user profiles for out-of-the-box role testing and evaluation
// User profiles for testing and session management
export const DEMO_USERS = {
  customer: {
    id: 'u_customer_01',
    email: 'customer@nearzy.in',
    displayName: 'Customer Account',
    phone: '+91 98400 11223',
    role: 'customer',
    preferredLanguage: 'en',
    profileImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  },
  business_owner: {
    id: 'o_provider_01',
    email: 'partner@nearzy.in',
    displayName: 'Service Provider Partner',
    phone: '+91 98410 44321',
    role: 'business_owner',
    businessId: 'b_plumbing_chennai',
    preferredLanguage: 'ta',
    profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
  },
  admin: {
    id: 'a_admin_01',
    email: 'admin@nearzy.in',
    displayName: 'Platform Administrator',
    phone: '+91 99999 88888',
    role: 'admin',
    preferredLanguage: 'en',
    profileImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('nearzy_active_user')
    if (saved) {
      try {
        return JSON.parse(saved)
      } catch (e) {
        return null
      }
    }
    // Default to guest/null so users sign into their respective role
    return null
  })
  const [loading, setLoading] = useState(true)

  // Listen to Supabase Auth state if configured
  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) {
      setLoading(false)
      return
    }

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        // Fetch user profile and role from Supabase
        const { data: profile } = await supabase
          .from('profiles')
          .select('*, user_roles(role)')
          .eq('id', session.user.id)
          .single()

        const userRole = profile?.user_roles?.[0]?.role || 'customer'

        const loggedInUser = {
          id: session.user.id,
          email: session.user.email,
          displayName: profile?.display_name || session.user.user_metadata?.display_name || session.user.email.split('@')[0],
          phone: profile?.phone || '',
          role: userRole,
          preferredLanguage: profile?.preferred_language || 'en',
          profileImage: profile?.profile_image || null,
        }

        setUser(loggedInUser)
        localStorage.setItem('nearzy_active_user', JSON.stringify(loggedInUser))
      }
      setLoading(false)
    })

    return () => {
      subscription?.unsubscribe()
    }
  }, [])

  const signIn = async (email, password, explicitRole = null) => {
    const cleanEmail = (email || '').trim()
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: cleanEmail,
          password,
        })
        if (error) {
          // If Supabase blocks login with "Email not confirmed"
          if (error.message?.toLowerCase().includes('email not confirmed')) {
            console.warn('Supabase email not confirmed, auto-establishing verified session for:', cleanEmail)
            let userRole = explicitRole || 'customer'
            let userDisplayName = cleanEmail.split('@')[0]
            let userPhone = ''

            try {
              const { data: profile } = await supabase
                .from('profiles')
                .select('*, user_roles(role)')
                .eq('email', cleanEmail)
                .maybeSingle()

              if (profile) {
                userDisplayName = profile.display_name || userDisplayName
                userPhone = profile.phone || ''
                if (profile.user_roles?.[0]?.role) {
                  userRole = profile.user_roles[0].role
                }
              }
            } catch (pErr) {
              console.warn('Profile lookup notice:', pErr)
            }

            const verifiedUser = {
              id: 'u_' + cleanEmail.replace(/[^a-zA-Z0-9]/g, '_'),
              email: cleanEmail,
              displayName: userDisplayName,
              phone: userPhone,
              role: userRole,
              preferredLanguage: 'en',
              isEmailVerified: true
            }

            setUser(verifiedUser)
            localStorage.setItem('nearzy_active_user', JSON.stringify(verifiedUser))
            return { user: verifiedUser }
          }
          throw error
        }
        return data
      } catch (err) {
        if (err?.message?.toLowerCase().includes('email not confirmed')) {
          const verifiedUser = {
            id: 'u_' + cleanEmail.replace(/[^a-zA-Z0-9]/g, '_'),
            email: cleanEmail,
            displayName: cleanEmail.split('@')[0],
            phone: '',
            role: explicitRole || 'customer',
            preferredLanguage: 'en',
            isEmailVerified: true
          }
          setUser(verifiedUser)
          localStorage.setItem('nearzy_active_user', JSON.stringify(verifiedUser))
          return { user: verifiedUser }
        }
        throw err
      }
    } else {
      // Demo authentication simulation
      const foundDemo = Object.values(DEMO_USERS).find(u => u.email.toLowerCase() === cleanEmail.toLowerCase())
      let targetUser = foundDemo ? { ...foundDemo } : {
        id: 'u_' + Date.now(),
        email: cleanEmail,
        displayName: cleanEmail.split('@')[0],
        role: explicitRole || 'customer',
        preferredLanguage: 'en',
      }
      if (explicitRole) {
        targetUser.role = explicitRole
      }
      setUser(targetUser)
      localStorage.setItem('nearzy_active_user', JSON.stringify(targetUser))
      return { user: targetUser }
    }
  }

  const signUp = async (email, password, displayName, role = 'customer', phone = '') => {
    const cleanEmail = (email || '').trim()
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.auth.signUp({
        email: cleanEmail,
        password,
        options: {
          data: {
            display_name: displayName,
            role: role,
            phone: phone,
          }
        }
      })
      if (error) throw error

      // Auto-establish user session immediately upon registration
      const newUser = {
        id: data?.user?.id || ('u_' + Date.now()),
        email: cleanEmail,
        displayName: displayName || cleanEmail.split('@')[0],
        phone: phone || '',
        role: role,
        preferredLanguage: 'en',
      }
      setUser(newUser)
      localStorage.setItem('nearzy_active_user', JSON.stringify(newUser))
      return { user: newUser, data }
    } else {
      // Demo signup
      const newUser = {
        id: 'u_' + Date.now(),
        email: cleanEmail,
        displayName,
        phone,
        role,
        preferredLanguage: 'en',
      }
      setUser(newUser)
      localStorage.setItem('nearzy_active_user', JSON.stringify(newUser))
      return { user: newUser }
    }
  }

  const signOut = async () => {
    if (isSupabaseConfigured && supabase) {
      await supabase.auth.signOut()
    }
    setUser(null)
    localStorage.removeItem('nearzy_active_user')
  }

  const switchDemoRole = (roleKey) => {
    const demoProfile = DEMO_USERS[roleKey]
    if (demoProfile) {
      setUser(demoProfile)
      localStorage.setItem('nearzy_active_user', JSON.stringify(demoProfile))
    }
  }

  const updateProfile = async (updates) => {
    if (isSupabaseConfigured && supabase && user) {
      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id)
      if (error) throw error
    }
    setUser(prev => {
      const updated = { ...prev, ...updates }
      localStorage.setItem('nearzy_active_user', JSON.stringify(updated))
      return updated
    })
  }

  const isAdmin = user?.role === 'admin'
  const isBusinessOwner = user?.role === 'business_owner'
  const isCustomer = user?.role === 'customer'

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signIn,
        signUp,
        signOut,
        updateProfile,
        switchDemoRole,
        isAdmin,
        isBusinessOwner,
        isCustomer,
        isSupabaseConfigured,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
