import { createClient as createSupabaseClient } from "@supabase/supabase-js"

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseKey) {
    console.warn("Variáveis de ambiente do Supabase não encontradas (servidor) - Modo demo ativo")
    // Retorna um cliente mock para modo demo
    return createMockClient()
  }

  return createSupabaseClient(supabaseUrl, supabaseKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  })
}

// Cliente mock para modo de demonstração
function createMockClient() {
  return {
    auth: {
      getSession: () => Promise.resolve({ data: { session: null }, error: null }),
      signInWithPassword: () =>
        Promise.resolve({ data: { user: null, session: null }, error: { message: "Demo mode" } }),
      signUp: () => Promise.resolve({ data: { user: null, session: null }, error: { message: "Demo mode" } }),
      signOut: () => Promise.resolve({ error: null }),
    },
    from: (table: string) => ({
      select: () => ({
        eq: () => ({
          single: () => Promise.resolve({ data: null, error: { message: "Demo mode - no data" } }),
        }),
        order: () => Promise.resolve({ data: [], error: null }),
        limit: () => Promise.resolve({ data: [], error: null }),
      }),
      insert: () => Promise.resolve({ data: null, error: { message: "Demo mode - insert disabled" } }),
      update: () => Promise.resolve({ data: null, error: { message: "Demo mode - update disabled" } }),
      delete: () => Promise.resolve({ data: null, error: { message: "Demo mode - delete disabled" } }),
      upsert: () => Promise.resolve({ data: null, error: { message: "Demo mode - upsert disabled" } }),
    }),
    rpc: () => Promise.resolve({ data: null, error: { message: "Demo mode - RPC disabled" } }),
  } as any
}

// Função getSupabaseClient para compatibilidade com código existente
export function getSupabaseClient() {
  return createClient()
}

// Verificar se o Supabase está configurado
export function isSupabaseConfigured() {
  return !!(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY)
}

// Criar cliente apenas se as variáveis de ambiente estiverem disponíveis
let supabase: ReturnType<typeof createSupabaseClient> | null = null

try {
  if (isSupabaseConfigured()) {
    supabase = createClient()
  } else {
    console.log("Supabase não configurado - usando cliente mock")
    supabase = createMockClient() as any
  }
} catch (error) {
  console.warn("Erro ao criar cliente Supabase do servidor, usando cliente mock:", error)
  supabase = createMockClient() as any
}

export { supabase }
