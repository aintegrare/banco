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

    // Verificar se o usuário já existe usando o método correto
    const { data: existingUsers, error: getUserError } = await supabase
      .from("users")
      .select("id")
      .eq("email", email)
      .maybeSingle()

    if (getUserError && getUserError.message !== "No rows found") {
      console.error("API create-admin: Erro ao verificar usuário existente:", getUserError)
      return NextResponse.json({ error: getUserError.message }, { status: 500 })
    }

    // Se o usuário já existe, tentar atualizar a senha
    if (existingUsers) {
      console.log("API create-admin: Usuário já existe, atualizando senha")

      // Usar o método de redefinição de senha
      const { error: updateError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${process.env.NEXT_PUBLIC_URL || "http://localhost:3000"}/admin/login`,
      })

      if (updateError) {
        console.error("API create-admin: Erro ao atualizar senha:", updateError)
        return NextResponse.json({ error: updateError.message }, { status: 500 })
      }

      return NextResponse.json({
        success: true,
        message: "Email de redefinição de senha enviado com sucesso",
      })
    }

    console.log("API create-admin: Criando novo usuário")

    // Criar novo usuário com o método correto
    const { data, error: createError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${process.env.NEXT_PUBLIC_URL || "http://localhost:3000"}/admin/login`,
      },
    })

    if (createError) {
      console.error("API create-admin: Erro ao criar usuário:", createError)
      return NextResponse.json({ error: createError.message }, { status: 500 })
    }

    console.log("API create-admin: Usuário criado com sucesso:", data.user?.id)

    // Adicionar o usuário à tabela de administradores se necessário
    try {
      await supabase.from("admins").insert({
        user_id: data.user?.id,
        role: "admin",
        created_at: new Date().toISOString(),
      })
    } catch (error) {
      console.warn("API create-admin: Aviso - Não foi possível adicionar à tabela de admins:", error)
      // Continuar mesmo se falhar, pois o usuário já foi criado
    }

    return NextResponse.json({
      success: true,
      message: "Usuário administrador criado com sucesso. Verifique seu email para confirmar a conta.",
    })
  } catch (error: any) {
    console.error("API create-admin: Erro inesperado:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
