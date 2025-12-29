'use client'

import { supabase } from './supabase'
import { User, Session } from '@supabase/supabase-js'

export interface AuthState {
  isAuthenticated: boolean
  user: User | null
  session: Session | null
}

// Login dengan Supabase Auth
export async function login(email: string, password: string): Promise<{ success: boolean; error?: string }> {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      return { success: false, error: error.message }
    }

    if (data.session) {
      return { success: true }
    }

    return { success: false, error: 'Login gagal' }
  } catch (error) {
    console.error('Login error:', error)
    return { success: false, error: 'Terjadi kesalahan saat login' }
  }
}

// Logout dari Supabase Auth
export async function logout(): Promise<void> {
  await supabase.auth.signOut()
}

// Get current auth state
export async function getAuthState(): Promise<AuthState> {
  try {
    const { data: { session } } = await supabase.auth.getSession()
    
    if (session) {
      return {
        isAuthenticated: true,
        user: session.user,
        session: session,
      }
    }

    return { isAuthenticated: false, user: null, session: null }
  } catch (error) {
    console.error('Get auth state error:', error)
    return { isAuthenticated: false, user: null, session: null }
  }
}

// Check if user is authenticated (synchronous check using cached session)
export function isAuthenticated(): boolean {
  // This is a sync function, we need to check localStorage for cached session
  if (typeof window === 'undefined') {
    return false
  }
  
  // Supabase stores session in localStorage with key pattern
  const storedSession = localStorage.getItem('sb-' + process.env.NEXT_PUBLIC_SUPABASE_URL?.replace('https://', '').split('.')[0] + '-auth-token')
  
  if (storedSession) {
    try {
      const session = JSON.parse(storedSession)
      // Check if session is expired
      if (session.expires_at && new Date(session.expires_at * 1000) > new Date()) {
        return true
      }
    } catch {
      return false
    }
  }
  
  return false
}

// Subscribe to auth state changes
export function onAuthStateChange(callback: (state: AuthState) => void) {
  return supabase.auth.onAuthStateChange((event, session) => {
    if (session) {
      callback({
        isAuthenticated: true,
        user: session.user,
        session: session,
      })
    } else {
      callback({
        isAuthenticated: false,
        user: null,
        session: null,
      })
    }
  })
}

// Get current user
export async function getCurrentUser(): Promise<User | null> {
  const { data: { user } } = await supabase.auth.getUser()
  return user
}
