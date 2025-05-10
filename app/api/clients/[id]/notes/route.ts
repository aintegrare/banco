import { NextResponse } from "next/server"
import { adminSupabase } from "@/lib/api"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const clientId = params.id

    const { data, error } = await adminSupabase
      .from("client_notes")
      .select("*")
      .eq("client_id", clientId)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Erro ao buscar notas:", error)
      return NextResponse.json({ error: "Erro ao buscar notas" }, { status: 500 })
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
      .from("client_notes")
      .insert({
        client_id: clientId,
        content: body.content,
        user_id: body.userId || null,
        user_name: body.userName || "Sistema",
      })
      .select()
      .single()

    if (error) {
      console.error("Erro ao criar nota:", error)
      return NextResponse.json({ error: "Erro ao criar nota" }, { status: 500 })
    }

    return NextResponse.json(data, { status: 201 })
  } catch (error) {
    console.error("Erro ao processar requisição:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}
