import { createClient } from "@supabase/supabase-js"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    console.log("API create-admin: Iniciando criação de usuário administrador")

    const { email, password } = await request.json()

    // Verificar variáveis de ambiente
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !supabaseServiceKey) {
      console.error("API create-admin: Variáveis de ambiente do Supabase não encontradas")
      return NextResponse.json({ error: "Configuração do Supabase não encontrada" }, { status: 500 })
    }

    // Criar cliente Supabase com chave de serviço
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })

    console.log("API create-admin: Verificando se o usuário já existe")

    // Verificar se o usuário já existe
    const { data: existingUser, error: getUserError } = await supabase.auth.admin.getUserByEmail(email)

    if (getUserError && getUserError.message !== "User not found") {
      console.error("API create-admin: Erro ao verificar usuário existente:", getUserError)
      return NextResponse.json({ error: getUserError.message }, { status: 500 })
    }

    if (existingUser) {
      console.log("API create-admin: Usuário já existe, atualizando senha")

      // Atualizar senha do usuário existente
      const { error: updateError } = await supabase.auth.admin.updateUserById(existingUser.id, { password })

      if (updateError) {
        console.error("API create-admin: Erro ao atualizar senha:", updateError)
        return NextResponse.json({ error: updateError.message }, { status: 500 })
      }

      return NextResponse.json({
        success: true,
        message: "Senha do usuário administrador atualizada com sucesso",
      })
    }

    console.log("API create-admin: Criando novo usuário")

    // Criar novo usuário
    const { data, error: createError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    })

    if (createError) {
      console.error("API create-admin: Erro ao criar usuário:", createError)
      return NextResponse.json({ error: createError.message }, { status: 500 })
    }

    console.log("API create-admin: Usuário criado com sucesso:", data.user.id)

    return NextResponse.json({
      success: true,
      message: "Usuário administrador criado com sucesso",
    })
  } catch (error: any) {
    console.error("API create-admin: Erro inesperado:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
