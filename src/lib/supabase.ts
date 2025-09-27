import { createClient } from '@supabase/supabase-js'
import { createBrowserClient } from '@supabase/ssr'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

// For client-side usage
export const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey)

// For server-side usage
export const createServerClient = () => {
  return createClient(supabaseUrl, supabaseAnonKey)
}

export type Database = {
  public: {
    Tables: {
      user_notes: {
        Row: {
          id: string
          user_id: string
          verse_key: string
          note: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          verse_key: string
          note: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          verse_key?: string
          note?: string
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {}
    Functions: {}
    Enums: {}
  }
}