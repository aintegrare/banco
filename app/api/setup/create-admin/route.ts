import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    // Validar dados
    if (!email || !password) {
      return NextResponse.json({ error: "Email e senha são obrigatórios" }, { status: 400 })
    }

    // Criar cliente Supabase
    const supabase = createRouteHandlerClient({ cookies })

    // Verificar se o usuário já existe
    const { data: existingUser } = await supabase.from("users").select("*").eq("email", email).single()

    if (existingUser) {
      return NextResponse.json({ message: "Usuário já existe" }, { status: 200 })
    }

    // Criar usuário
    const { error } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    })

    if (error) {
      throw error
    }

    return NextResponse.json({ message: "Usuário administrador criado com sucesso" }, { status: 201 })
  } catch (error: any) {
    console.error("Erro ao criar usuário:", error)
    return NextResponse.json({ error: error.message || "Erro ao criar usuário administrador" }, { status: 500 })
  }
}
