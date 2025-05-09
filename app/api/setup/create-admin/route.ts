import { createClient } from "@supabase/supabase-js"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    // Verificar se as variáveis de ambiente estão disponíveis
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !supabaseServiceKey) {
      return NextResponse.json({ error: "Configuração do Supabase não encontrada no servidor" }, { status: 500 })
    }

    // Criar cliente Supabase com chave de serviço para ter permissões de admin
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })

    // Verificar se o usuário já existe
    const { data: existingUsers } = await supabase.auth.admin.listUsers()
    const userExists = existingUsers.users.some((user) => user.email === email)

    if (userExists) {
      return NextResponse.json({ message: "Usuário já existe" })
    }

    // Criar o usuário administrador
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { role: "admin" },
    })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ success: true, user: data.user })
  } catch (error: any) {
    console.error("Erro ao criar usuário admin:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
