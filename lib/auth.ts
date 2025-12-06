'use client'

import { ADMIN_EMAIL, ADMIN_PASSWORD } from './supabase'

const AUTH_KEY = 'inovasiin_admin_auth'

export interface AuthState {
  isAuthenticated: boolean
  email: string | null
  loginTime: number | null
}

export function login(email: string, password: string): { success: boolean; error?: string } {
  if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
    const authState: AuthState = {
      isAuthenticated: true,
      email: email,
      loginTime: Date.now(),
    }
    localStorage.setItem(AUTH_KEY, JSON.stringify(authState))
    return { success: true }
  }
  return { success: false, error: 'Email atau password salah' }
}

export function logout(): void {
  localStorage.removeItem(AUTH_KEY)
}

export function getAuthState(): AuthState {
  if (typeof window === 'undefined') {
    return { isAuthenticated: false, email: null, loginTime: null }
  }
  
  const stored = localStorage.getItem(AUTH_KEY)
  if (!stored) {
    return { isAuthenticated: false, email: null, loginTime: null }
  }
  
  try {
    const authState: AuthState = JSON.parse(stored)
    
    // Session expires after 24 hours
    const SESSION_DURATION = 24 * 60 * 60 * 1000
    if (authState.loginTime && Date.now() - authState.loginTime > SESSION_DURATION) {
      logout()
      return { isAuthenticated: false, email: null, loginTime: null }
    }
    
    return authState
  } catch {
    return { isAuthenticated: false, email: null, loginTime: null }
  }
}

export function isAuthenticated(): boolean {
  return getAuthState().isAuthenticated
}

