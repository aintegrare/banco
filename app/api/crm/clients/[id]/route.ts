import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = createClient()
    const id = params.id

    const { data, error } = await supabase.from("clients").select("*").eq("id", id).single()

    if (error) {
      console.error("Error fetching client:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    if (!data) {
      return NextResponse.json({ error: "Cliente não encontrado" }, { status: 404 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("Unexpected error:", error)
    return NextResponse.json({ error: "Erro ao buscar cliente" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = createClient()
    const id = params.id
    const updates = await request.json()

    // Add updated timestamp
    updates.updated_at = new Date().toISOString()

    const { data, error } = await supabase.from("clients").update(updates).eq("id", id).select().single()

    if (error) {
      console.error("Error updating client:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("Unexpected error:", error)
    return NextResponse.json({ error: "Erro ao atualizar cliente" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = createClient()
    const id = params.id

    // Primeiro, desabilite o trigger que atualiza o updated_at
    // Isso é necessário porque o trigger está causando o erro
    await supabase.rpc("disable_client_triggers")

    // Agora exclua o cliente
    const { error } = await supabase.from("clients").delete().eq("id", id)

    // Reative o trigger após a exclusão
    await supabase.rpc("enable_client_triggers")

    if (error) {
      console.error("Error deleting client:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Unexpected error:", error)
    return NextResponse.json({ error: "Erro ao excluir cliente" }, { status: 500 })
  }
}
