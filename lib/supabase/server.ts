import { createClient as createSupabaseClient } from "@supabase/supabase-js"

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseKey) {
    console.error("Variáveis de ambiente do Supabase não encontradas (servidor)")
    throw new Error("Supabase URL and key must be defined")
  }

  return createSupabaseClient(supabaseUrl, supabaseKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  })
}

// Criar cliente apenas se as variáveis de ambiente estiverem disponíveis
let supabase: ReturnType<typeof createSupabaseClient> | null = null

try {
  supabase = createClient()
} catch (error) {
  console.error("Erro ao criar cliente Supabase do servidor:", error)
}

export { supabase }
