import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET() {
  try {
    const supabase = createClient()

    // Tenta criar o usuário
    const { error } = await supabase.auth.admin.createUser({
      email: "estrategia@designmarketing.com.br",
      password: "Jivago14#",
      email_confirm: true,
    })

    // Se o erro for que o usuário já existe, isso é ok
    if (error && !error.message.includes("already registered")) {
      return NextResponse.json({ success: false, error: error.message })
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message })
  }
}
