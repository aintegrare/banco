"use client"

import { createClient as createSupabaseClient } from "@supabase/supabase-js"

// Singleton pattern para evitar múltiplas instâncias
let supabaseClient: ReturnType<typeof createSupabaseClient> | null = null

export function getSupabaseClient() {
  if (supabaseClient) return supabaseClient

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error("Variáveis de ambiente do Supabase não encontradas")
    throw new Error("Supabase URL and key must be defined")
  }

  try {
    supabaseClient = createSupabaseClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    })
    return supabaseClient
  } catch (error) {
    console.error("Erro ao criar cliente Supabase:", error)
    throw error
  }
}

export const createClient = getSupabaseClient
