import { createClient } from "@supabase/supabase-js"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  console.log("Iniciando criação de usuário administrador")

  try {
    // Verificar variáveis de ambiente
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !supabaseServiceKey) {
      console.error("Variáveis de ambiente do Supabase não encontradas")
      return NextResponse.json({ error: "Configuração do Supabase não encontrada" }, { status: 500 })
    }

    console.log("Variáveis de ambiente verificadas, criando cliente Supabase")

    // Criar cliente Supabase
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Dados do usuário admin
    const email = "estrategia@designmarketing.com.br"
    const password = "Jivago14#"

    console.log(`Tentando criar usuário: ${email}`)

    // Criar usuário diretamente
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    })

    if (error) {
      console.error("Erro ao criar usuário:", error)

      // Se o erro for de usuário já existente, tentar redefinir a senha
      if (error.message.includes("already exists")) {
        console.log("Usuário já existe, tentando redefinir senha")

        // Buscar o usuário existente
        const { data: userData } = await supabase.auth.admin.listUsers()
        const existingUser = userData.users.find((user) => user.email === email)

        if (existingUser) {
          // Atualizar a senha do usuário existente
          const { error: updateError } = await supabase.auth.admin.updateUserById(existingUser.id, { password })

          if (updateError) {
            console.error("Erro ao atualizar senha:", updateError)
            return NextResponse.json({ error: "Erro ao atualizar senha: " + updateError.message }, { status: 500 })
          }

          console.log("Senha atualizada com sucesso")
          return NextResponse.json({ success: true, message: "Senha do usuário atualizada com sucesso" })
        }
      }

      return NextResponse.json({ error: "Erro ao criar usuário: " + error.message }, { status: 500 })
    }

    console.log("Usuário criado com sucesso:", data.user.id)

    return NextResponse.json({ success: true, message: "Usuário administrador criado com sucesso" })
  } catch (error: any) {
    console.error("Erro inesperado:", error)
    return NextResponse.json({ error: "Erro inesperado: " + error.message }, { status: 500 })
  }
}
