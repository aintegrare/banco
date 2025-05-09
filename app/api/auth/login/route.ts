import { createClient } from "@supabase/supabase-js"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()
    console.log("Tentativa de login para:", email)

    // Verificar variáveis de ambiente
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseAnonKey) {
      console.error("Variáveis de ambiente do Supabase não encontradas")
      return NextResponse.json({ error: "Configuração do Supabase não encontrada" }, { status: 500 })
    }

    // Criar cliente Supabase
    const supabase = createClient(supabaseUrl, supabaseAnonKey)

    // Tentar fazer login
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      console.error("Erro no login:", error.message)
      return NextResponse.json({ error: error.message }, { status: 401 })
    }

    if (!data.session) {
      console.error("Sessão não encontrada após login")
      return NextResponse.json({ error: "Sessão não encontrada" }, { status: 500 })
    }

    console.log("Login bem-sucedido, definindo cookie")

    // Definir cookie de sessão
    const cookieStore = cookies()

    // Definir cookie de autenticação
    cookieStore.set("auth-token", data.session.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 1 semana
      path: "/",
    })

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("Erro inesperado no login:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
