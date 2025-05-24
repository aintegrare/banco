import { NextResponse } from "next/server"
import { env } from "@/lib/env"

export async function GET() {
  try {
    // Usar as funções auxiliares do módulo env
    const supabaseConfigured = env.isSupabaseConfigured()
    const bunnyConfigured = env.isBunnyConfigured()

    // Verificar variáveis de ambiente específicas
    const supabaseServiceConfigured = !!process.env.SUPABASE_SERVICE_ROLE_KEY
    const anthropicConfigured = !!process.env.ANTHROPIC_API_KEY
    const ocrConfigured = !!process.env.OCR_API_KEY

    // Verificar variáveis de ambiente do Bunny adicionais
    const bunnyPullzoneConfigured = !!(process.env.BUNNY_PULLZONE_ID && process.env.BUNNY_PULLZONE_URL)

    // Verificar se todas as variáveis críticas estão configuradas
    const allCriticalConfigured = supabaseConfigured && supabaseServiceConfigured && bunnyConfigured

    // Verificar se todas as variáveis (incluindo opcionais) estão configuradas
    const allConfigured = allCriticalConfigured && anthropicConfigured && ocrConfigured && bunnyPullzoneConfigured

    // Retornar informações detalhadas sobre a configuração
    return NextResponse.json({
      supabaseConfigured,
      supabaseServiceConfigured,
      bunnyConfigured,
      bunnyPullzoneConfigured,
      anthropicConfigured,
      ocrConfigured,
      allCriticalConfigured,
      allConfigured,

      // Incluir informações sobre quais variáveis específicas estão faltando
      missingVars: {
        supabase: !supabaseConfigured
          ? ["NEXT_PUBLIC_SUPABASE_URL", "NEXT_PUBLIC_SUPABASE_ANON_KEY"].filter((v) => !process.env[v])
          : [],
        supabaseService: !supabaseServiceConfigured ? ["SUPABASE_SERVICE_ROLE_KEY"] : [],
        bunny: !bunnyConfigured ? ["BUNNY_API_KEY", "BUNNY_STORAGE_ZONE"].filter((v) => !process.env[v]) : [],
        bunnyPullzone: !bunnyPullzoneConfigured
          ? ["BUNNY_PULLZONE_ID", "BUNNY_PULLZONE_URL"].filter((v) => !process.env[v])
          : [],
        anthropic: !anthropicConfigured ? ["ANTHROPIC_API_KEY"] : [],
        ocr: !ocrConfigured ? ["OCR_API_KEY"] : [],
      },
    })
  } catch (error) {
    console.error("Erro ao verificar variáveis de ambiente:", error)
    return NextResponse.json({ error: "Erro ao verificar variáveis de ambiente" }, { status: 500 })
  }
}
