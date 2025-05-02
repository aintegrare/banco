import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Verificar quais variáveis de ambiente estão configuradas
    const envVars = {
      OPENAI_API_KEY: !!process.env.OPENAI_API_KEY,
      ANTHROPIC_API_KEY: !!process.env.ANTHROPIC_API_KEY,
      SUPABASE_SERVICE_ROLE_KEY: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
      NEXT_PUBLIC_SUPABASE_URL: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      NEXT_PUBLIC_SUPABASE_ANON_KEY: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    }

    return NextResponse.json({ envVars })
  } catch (error) {
    console.error("Erro ao verificar variáveis de ambiente:", error)
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Erro desconhecido",
      },
      { status: 500 },
    )
  }
}
