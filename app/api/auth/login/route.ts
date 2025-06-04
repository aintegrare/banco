import { createClient } from "@supabase/supabase-js"
import { NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function POST(request: Request) {
  try {
    console.log("API login: Iniciando processo de login")

    const { email, password } = await request.json()

    // Verificar variáveis de ambiente
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseAnonKey) {
      console.error("API login: Variáveis de ambiente do Supabase não encontradas")
      return NextResponse.json(
        {
          error: "Configuração do Supabase não encontrada",
          suggestDemo: true,
        },
        { status: 500 },
      )
    }

    // Criar cliente Supabase
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })

    console.log("API login: Tentando fazer login com credenciais fornecidas")

    // Tentar fazer login
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      console.error("API login: Erro no login:", error)

      // Verificar se são as credenciais de demonstração
      if (email === "estrategia@designmarketing.com.br" && password === "Jivago14#") {
        console.log("API login: Usando credenciais de demonstração")

        // Definir cookies para autenticação
        const cookieStore = cookies()
        cookieStore.set("auth-token", "demo-token", {
          path: "/",
          maxAge: 60 * 60 * 24, // 1 dia
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
        })

        return NextResponse.json({
          success: true,
          demoMode: true,
          message: "Login em modo de demonstração realizado com sucesso",
        })
      }

      return NextResponse.json(
        {
          error: error.message,
          suggestDemo: true,
        },
        { status: 401 },
      )
    }

    console.log("API login: Login bem-sucedido")

    // Definir cookies para autenticação
    const cookieStore = cookies()
    cookieStore.set("auth-token", data.session?.access_token || "", {
      path: "/",
      maxAge: 60 * 60 * 24, // 1 dia
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    })

    return NextResponse.json({
      success: true,
      message: "Login realizado com sucesso",
    })
  } catch (error: any) {
    console.error("API login: Erro inesperado:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
