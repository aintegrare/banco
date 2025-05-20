import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Verificar variáveis de ambiente do Supabase
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    // Verificar variáveis de ambiente do Bunny
    const bunnyApiKey = process.env.BUNNY_API_KEY
    const bunnyStorageZone = process.env.BUNNY_STORAGE_ZONE

    // Verificar variáveis de ambiente do Anthropic
    const anthropicApiKey = process.env.ANTHROPIC_API_KEY

    // Verificar variáveis de ambiente do OpenAI
    const openaiApiKey = process.env.OPENAI_API_KEY

    // Verificar variáveis de ambiente do OCR
    const ocrApiKey = process.env.OCR_API_KEY

    // Verificar variáveis de ambiente do App
    const appUrl = process.env.NEXT_PUBLIC_APP_URL
    const appVersion = process.env.NEXT_PUBLIC_APP_VERSION

    return NextResponse.json({
      supabaseConfigured: !!(supabaseUrl && supabaseAnonKey && supabaseServiceKey),
      bunnyConfigured: !!(bunnyApiKey && bunnyStorageZone),
      anthropicConfigured: !!anthropicApiKey,
      openaiConfigured: !!openaiApiKey,
      ocrConfigured: !!ocrApiKey,
      appConfigured: !!(appUrl || appVersion),

      // Detalhes para depuração (não incluir em produção)
      debug: {
        supabaseUrl: !!supabaseUrl,
        supabaseAnonKey: !!supabaseAnonKey,
        supabaseServiceKey: !!supabaseServiceKey,
        bunnyApiKey: !!bunnyApiKey,
        bunnyStorageZone: !!bunnyStorageZone,
        anthropicApiKey: !!anthropicApiKey,
        openaiApiKey: !!openaiApiKey,
        ocrApiKey: !!ocrApiKey,
        appUrl: !!appUrl,
        appVersion: !!appVersion,
      },
    })
  } catch (error) {
    console.error("Erro ao verificar variáveis de ambiente:", error)
    return NextResponse.json({ error: "Erro ao verificar variáveis de ambiente" }, { status: 500 })
  }
}
