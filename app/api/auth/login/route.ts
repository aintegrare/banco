import { createClient } from "@supabase/supabase-js"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    // Verificar se as variáveis de ambiente estão disponíveis
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseAnonKey) {
      return NextResponse.json({ error: "Configuração do Supabase não encontrada no servidor" }, { status: 500 })
    }

    // Criar cliente Supabase no servidor
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: false,
      },
    })

    // Tentar fazer login
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    // Definir cookies de autenticação
    const cookieStore = cookies()
    cookieStore.set("sb-auth-token", data.session?.access_token || "", {
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 1 semana
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    })

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("Erro no login:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
