import { type NextRequest, NextResponse } from "next/server"
import { v4 as uuidv4 } from "uuid"
import { getSupabaseClient } from "@/lib/supabase/server"
import { logger } from "@/lib/logger"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { path, type, expiryDays = 7, isPasswordProtected, password, isPublic } = body

    if (!path) {
      return NextResponse.json({ error: "Caminho não especificado" }, { status: 400 })
    }

    // Gerar um token único
    const token = uuidv4()

    // Calcular a data de expiração
    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + expiryDays)

    // Criar o registro no banco de dados
    const supabase = getSupabaseClient()

    const { data, error } = await supabase
      .from("shared_links")
      .insert({
        token,
        path,
        type,
        expires_at: expiresAt.toISOString(),
        is_password_protected: isPasswordProtected,
        password: isPasswordProtected ? password : null,
        is_public: isPublic,
        created_at: new Date().toISOString(),
      })
      .select()

    if (error) {
      logger.error("Erro ao criar link de compartilhamento:", { data: error })
      return NextResponse.json({ error: "Erro ao criar link de compartilhamento" }, { status: 500 })
    }

    return NextResponse.json({ token, url: data[0].url })
  } catch (error) {
    logger.error("Erro ao processar solicitação de compartilhamento:", { data: error })
    return NextResponse.json({ error: "Erro ao processar solicitação de compartilhamento" }, { status: 500 })
  }
}
