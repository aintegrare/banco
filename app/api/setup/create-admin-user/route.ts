import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: Request) {
  try {
    const supabase = createClient()

    // Verifica se o usuário já existe
    const { data: existingUsers, error: checkError } = await supabase.auth.admin.listUsers()

    if (checkError) {
      throw new Error(`Erro ao verificar usuários: ${checkError.message}`)
    }

    const adminEmail = "estrategia@designmarketing.com.br"
    const userExists = existingUsers.users.some((user) => user.email === adminEmail)

    if (userExists) {
      return NextResponse.json({
        success: true,
        message: "Usuário administrador já existe",
      })
    }

    // Cria o usuário administrador
    const { data, error } = await supabase.auth.admin.createUser({
      email: adminEmail,
      password: "Jivago14#",
      email_confirm: true,
      user_metadata: { role: "admin" },
    })

    if (error) {
      throw new Error(`Erro ao criar usuário: ${error.message}`)
    }

    return NextResponse.json({
      success: true,
      message: "Usuário administrador criado com sucesso",
      user: data.user,
    })
  } catch (error: any) {
    console.error("Erro ao configurar usuário administrador:", error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
