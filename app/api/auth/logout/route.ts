import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function POST() {
  try {
    const cookieStore = cookies()

    // Remover cookie de autenticação
    cookieStore.delete("auth-token")

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: "Erro ao fazer logout" }, { status: 500 })
  }
}
