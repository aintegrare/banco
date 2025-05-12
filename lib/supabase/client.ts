"use client"

import { createClient as createSupabaseClient } from "@supabase/supabase-js"

// Singleton pattern para evitar múltiplas instâncias
let supabaseClient: ReturnType<typeof createSupabaseClient> | null = null

// Verificar se estamos em ambiente de preview
const isPreviewEnvironment =
  typeof window !== "undefined" &&
  (window.location.hostname === "localhost" || window.location.hostname.includes("vercel.app"))

// Criar um cliente mock para quando as variáveis de ambiente não estiverem disponíveis
function createMockClient() {
  console.warn("Usando cliente Supabase mock para ambiente de preview/desenvolvimento (client-side)")

  // Criar um objeto que simula a API do Supabase
  return {
    from: (table: string) => ({
      select: (columns?: string) => ({
        data: [],
        error: null,
        eq: (column: string, value: any) => ({
          data: [],
          error: null,
          single: () => ({ data: null, error: null }),
          order: (column: string, options: any) => ({ data: [], error: null }),
        }),
        single: () => ({ data: null, error: null }),
        order: (column: string, options: any) => ({ data: [], error: null }),
      }),
      insert: (data: any) => ({
        data: data,
        error: null,
        select: () => ({
          data: data,
          error: null,
          single: () => ({ data: data, error: null }),
        }),
      }),
      update: (data: any) => ({
        data: data,
        error: null,
        eq: (column: string, value: any) => ({ data: data, error: null }),
      }),
      delete: () => ({
        data: null,
        error: null,
        eq: (column: string, value: any) => ({ data: null, error: null }),
      }),
      eq: (column: string, value: any) => ({
        data: null,
        error: null,
        single: () => ({ data: null, error: null }),
      }),
    }),
    auth: {
      getSession: () => Promise.resolve({ data: { session: null }, error: null }),
      signInWithPassword: () => Promise.resolve({ data: null, error: null }),
      signOut: () => Promise.resolve({ error: null }),
    },
  } as any
}

export function getSupabaseClient() {
  if (supabaseClient) return supabaseClient

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn("Variáveis de ambiente do Supabase não encontradas")

    // Para ambiente de desenvolvimento/preview, usar cliente mock
    if (isPreviewEnvironment) {
      supabaseClient = createMockClient()
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

    // Em ambiente de preview ou desenvolvimento, usar cliente mock em caso de erro
    if (isPreviewEnvironment) {
      supabaseClient = createMockClient()
      return supabaseClient
    }

    throw error
  }
}

export const createClient = getSupabaseClient
