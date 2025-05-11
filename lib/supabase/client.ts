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

    // Para ambiente de desenvolvimento/preview, usar valores de fallback
    if (process.env.NODE_ENV !== "production") {
      // Valores de fallback apenas para desenvolvimento/preview
      const fallbackUrl = "https://xyzcompany.supabase.co"
      const fallbackKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

      console.warn("Usando valores de fallback para ambiente de desenvolvimento")

      supabaseClient = createSupabaseClient(fallbackUrl, fallbackKey, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
        },
      })

      return supabaseClient
    }

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
