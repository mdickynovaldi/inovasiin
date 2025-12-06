import { createClient } from '@supabase/supabase-js'
import { Database } from '@/types/database'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)

// Admin credentials - in production, use Supabase Auth
export const ADMIN_EMAIL = 'inovasiin.id@gmail.com'
export const ADMIN_PASSWORD = 'sunghajung007'

