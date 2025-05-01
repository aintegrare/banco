import { type NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/api"

export async function GET(request: NextRequest) {
  try {
    const { data, error } = await supabase.from("documents").select("*").order("created_at", { ascending: false })

    if (error) throw error

    return NextResponse.json({ documents: data })
  } catch (error) {
    console.error("Erro ao listar documentos:", error)
    return NextResponse.json({ error: "Erro ao listar documentos" }, { status: 500 })
  }
}
