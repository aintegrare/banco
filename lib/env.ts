// Modificar a função checkRequiredEnvVars para ser mais flexível e fornecer feedback melhor
export function checkRequiredEnvVars() {
  const requiredVars = [
    "NEXT_PUBLIC_SUPABASE_URL",
    "NEXT_PUBLIC_SUPABASE_ANON_KEY",
    "SUPABASE_SERVICE_ROLE_KEY",
    "BUNNY_API_KEY",
    "BUNNY_STORAGE_ZONE",
  ]

  // Variáveis opcionais que melhoram a experiência mas não são críticas
  const optionalVars = [
    "ANTHROPIC_API_KEY",
    "OCR_API_KEY",
    "BUNNY_PULLZONE_ID",
    "BUNNY_PULLZONE_URL",
    "NEXT_PUBLIC_BUNNY_PULLZONE_URL",
  ]

  const missingVars = requiredVars.filter((varName) => !process.env[varName] || process.env[varName] === "")
  const missingOptionalVars = optionalVars.filter((varName) => !process.env[varName] || process.env[varName] === "")

  if (missingVars.length > 0) {
    console.warn(`⚠️ ATENÇÃO: As seguintes variáveis de ambiente OBRIGATÓRIAS estão faltando: ${missingVars.join(", ")}`)
    return false
  }

  if (missingOptionalVars.length > 0) {
    console.warn(
      `ℹ️ INFO: As seguintes variáveis de ambiente OPCIONAIS estão faltando: ${missingOptionalVars.join(", ")}`,
    )
  }

  return true
}

// Atualizar o objeto env para incluir valores padrão e verificações
export const env = {
  BUNNY_API_KEY: process.env.BUNNY_API_KEY || "",
  BUNNY_STORAGE_ZONE: process.env.BUNNY_STORAGE_ZONE || "",
  BUNNY_PULLZONE_ID: process.env.BUNNY_PULLZONE_ID || "",
  BUNNY_PULLZONE_URL: process.env.BUNNY_PULLZONE_URL || "",
  NEXT_PUBLIC_BUNNY_PULLZONE_URL: process.env.NEXT_PUBLIC_BUNNY_PULLZONE_URL || "",
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "",
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY || "",
  ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY || "",
  OCR_API_KEY: process.env.OCR_API_KEY || "",

  // Função para verificar se as variáveis essenciais do Supabase estão configuradas
  isSupabaseConfigured: () => {
    return !!(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
  },

  // Função para verificar se as variáveis essenciais do Bunny estão configuradas
  isBunnyConfigured: () => {
    return !!(process.env.BUNNY_API_KEY && process.env.BUNNY_STORAGE_ZONE)
  },
}
