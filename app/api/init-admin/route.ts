import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET() {
  try {
    const supabase = createClient()

    // Tenta criar o usuário
    const { data, error } = await supabase.auth.admin.createUser({
      email: "estrategia@designmarketing.com.br",
      password: "Jivago14#",
      email_confirm: true,
    })

    if (error && error.message !== "User already registered") {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: "Usuário administrador configurado com sucesso",
      isNewUser: !error,
    })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
