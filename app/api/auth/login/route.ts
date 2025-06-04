import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

export async function POST(request: Request) {
  try {
    console.log("API login: Iniciando processo de login")

    const { email, password } = await request.json()

    // Verificar se as variáveis de ambiente estão definidas
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    // Modo de demonstração se as variáveis não estiverem disponíveis OU se as credenciais forem de demo
    const isDemoCredentials = email === "estrategia@designmarketing.com.br" && password === "Jivago14#"

    if (!supabaseUrl || !supabaseAnonKey || isDemoCredentials) {
      console.log("API login: Usando modo de demonstração")

      // Verificar credenciais de demonstração
      if (isDemoCredentials) {
        // Definir cookies para o modo de demonstração
        const cookieStore = cookies()

        cookieStore.set("auth-token", "demo-token", {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          maxAge: 60 * 60 * 24 * 7, // 1 semana
          path: "/",
        })

        cookieStore.set("refresh-token", "demo-refresh-token", {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          maxAge: 60 * 60 * 24 * 30, // 30 dias
          path: "/",
        })

        cookieStore.set("is-authenticated", "true", {
          httpOnly: false,
          secure: process.env.NODE_ENV === "production",
          maxAge: 60 * 60 * 24 * 7, // 1 semana
          path: "/",
        })

        cookieStore.set("demo-mode", "true", {
          httpOnly: false,
          secure: process.env.NODE_ENV === "production",
          maxAge: 60 * 60 * 24 * 7, // 1 semana
          path: "/",
        })

        return NextResponse.json({
          success: true,
          message: "Login em modo de demonstração",
          demoMode: true,
        })
      } else {
        return NextResponse.json(
          {
            error: "Credenciais inválidas. Use: estrategia@designmarketing.com.br / Jivago14#",
          },
          { status: 401 },
        )
      }
    }

    console.log("API login: Criando cliente Supabase")
    console.log("API login: URL do Supabase:", supabaseUrl)
    console.log("API login: Chave anônima definida:", !!supabaseAnonKey)

    // Criar cliente Supabase diretamente
    const supabase = createClient(supabaseUrl, supabaseAnonKey)

    console.log("API login: Tentando fazer login com email:", email)

    // Tentar fazer login
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      console.error("API login: Erro no login:", error.message)

      // Se for erro de credenciais inválidas, oferecer modo demo
      if (error.message.includes("Invalid login credentials")) {
        return NextResponse.json(
          {
            error:
              "Credenciais inválidas. Para modo de demonstração, use: estrategia@designmarketing.com.br / Jivago14#",
            suggestDemo: true,
          },
          { status: 401 },
        )
      }

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
    return NextResponse.json(
      {
        error:
          "Erro interno do servidor. Tente usar as credenciais de demonstração: estrategia@designmarketing.com.br / Jivago14#",
        suggestDemo: true,
      },
      { status: 500 },
    )
  }
}
