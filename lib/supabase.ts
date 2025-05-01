import { createClient } from "@supabase/supabase-js"

// Tipos para as tabelas do portal
export type PortalLink = {
  id: string
  user_id: string
  title: string
  url: string
  category: string | null
  created_at: string
}

export type PortalTask = {
  id: string
  user_id: string
  title: string
  completed: boolean
  due_date: string | null
  priority: "low" | "medium" | "high"
  created_at: string
}

export type PortalContact = {
  id: string
  user_id: string
  name: string
  email: string
  phone: string | null
  company: string | null
  notes: string | null
  created_at: string
}

// Criação do cliente Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Singleton pattern para o cliente Supabase no lado do cliente
let supabaseInstance: ReturnType<typeof createClient> | null = null

export const getSupabase = () => {
  if (!supabaseInstance) {
    supabaseInstance = createClient(supabaseUrl, supabaseAnonKey)
  }
  return supabaseInstance
}

// Cliente Supabase para o lado do servidor
export const createServerSupabase = () => {
  return createClient(
    process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
      process.env.SUPABASE_ANON_KEY ||
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  )
}
