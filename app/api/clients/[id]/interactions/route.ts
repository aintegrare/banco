import { NextResponse } from "next/server"
import { adminSupabase } from "@/lib/api"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const clientId = params.id

    const { data, error } = await adminSupabase
      .from("client_interactions")
      .select("*")
      .eq("client_id", clientId)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Erro ao buscar interações:", error)
      return NextResponse.json({ error: "Erro ao buscar interações" }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("Erro ao processar requisição:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const clientId = params.id
    const body = await request.json()

    const { data, error } = await adminSupabase
      .from("client_interactions")
      .insert({
        client_id: clientId,
        type: body.type,
        description: body.description,
        outcome: body.outcome,
        user_id: body.userId || null,
        user_name: body.userName || "Sistema",
      })
      .select()
      .single()

    if (error) {
      console.error("Erro ao criar interação:", error)
      return NextResponse.json({ error: "Erro ao criar interação" }, { status: 500 })
    }

    // Atualizar a data do último contato do cliente
    await adminSupabase
      .from("clients")
      .update({
        last_contact: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq("id", clientId)

    return NextResponse.json(data, { status: 201 })
  } catch (error) {
    console.error("Erro ao processar requisição:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}
