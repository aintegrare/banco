// Verificar se as variáveis de ambiente necessárias estão definidas
export function checkRequiredEnvVars() {
  const requiredVars = [
    "ANTHROPIC_API_KEY",
    "NEXT_PUBLIC_SUPABASE_URL",
    "NEXT_PUBLIC_SUPABASE_ANON_KEY",
    "SUPABASE_SERVICE_ROLE_KEY",
    "BUNNY_API_KEY",
    "BUNNY_STORAGE_ZONE",
  ]

  const missingVars = requiredVars.filter((varName) => !process.env[varName])

  if (missingVars.length > 0) {
    console.warn(`Atenção: As seguintes variáveis de ambiente estão faltando: ${missingVars.join(", ")}`)
    return false
  }

  return true
}
