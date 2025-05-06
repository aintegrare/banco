import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET() {
  try {
    const supabase = createClient()

    // Consulta para obter informações sobre a restrição de status
    const { data, error } = await supabase.rpc("get_enum_values", {
      enum_name: "task_status",
    })

    if (error) {
      console.error("Erro ao buscar opções de status:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Fallback para valores comuns caso a função RPC não exista
    const fallbackValues = ["pending", "in_progress", "completed"]

    return NextResponse.json({
      values: data || fallbackValues,
      message: data ? "Valores obtidos do banco de dados" : "Usando valores padrão",
    })
  } catch (error: any) {
    console.error("Erro ao processar requisição de opções de status:", error)
    return NextResponse.json({
      values: ["pending", "in_progress", "completed"],
      message: "Usando valores padrão devido a erro",
      error: error.message,
    })
  }
}
