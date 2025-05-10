import { createClient } from "@supabase/supabase-js"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    console.log("API login: Iniciando processo de login")

    const { email, password } = await request.json()

    // Verificar variáveis de ambiente
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseAnonKey) {
      console.error("API login: Variáveis de ambiente do Supabase não encontradas")
      return NextResponse.json({ error: "Configuração do Supabase não encontrada" }, { status: 500 })
    }

    // Criar cliente Supabase
    const supabase = createClient(supabaseUrl, supabaseAnonKey)

    console.log("API login: Tentando fazer login com email:", email)

    // Tentar fazer login
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      console.error("API login: Erro no login:", error.message)
      return NextResponse.json({ error: error.message }, { status: 401 })
    }

    if (!data.session) {
      console.error("API login: Sessão não encontrada após login")
      return NextResponse.json({ error: "Sessão não encontrada" }, { status: 500 })
    }

    console.log("API login: Login bem-sucedido, definindo cookies")

    // Definir cookies
    const cookieStore = cookies()

    // Cookie para o token de acesso
    cookieStore.set("auth-token", data.session.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 1 semana
      path: "/",
    })

    // Cookie para o refresh token
    cookieStore.set("refresh-token", data.session.refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 30, // 30 dias
      path: "/",
    })

    // Cookie não-httpOnly para verificação no cliente
    cookieStore.set("is-authenticated", "true", {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 1 semana
      path: "/",
    })

    console.log("API login: Cookies definidos com sucesso")

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("API login: Erro inesperado:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
