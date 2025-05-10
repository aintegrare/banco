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

    // Validar campos obrigatórios se estiverem presentes
    const requiredFields = ["name", "company", "email", "phone", "address", "segment", "status"]
    for (const field of requiredFields) {
      if (updates[field] !== undefined && !updates[field]) {
        return NextResponse.json({ error: `Campo ${field} é obrigatório` }, { status: 400 })
      }
    }

    // Add updated timestamp
    updates.updated_at = new Date().toISOString()

    const { data, error } = await supabase.from("clients").update(updates).eq("id", id).select().single()

    if (error) {
      console.error("Error updating client:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    if (!data) {
      return NextResponse.json({ error: "Cliente não encontrado" }, { status: 404 })
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
    const id = Number.parseInt(params.id, 10) // Converter para número

    if (isNaN(id)) {
      return NextResponse.json({ error: "ID de cliente inválido" }, { status: 400 })
    }

    console.log(`Attempting to delete client with ID: ${id}`)

    // Primeiro, verificamos se o cliente existe
    const { data: clientExists, error: checkError } = await supabase.from("clients").select("id").eq("id", id).single()

    if (checkError || !clientExists) {
      console.error("Client not found:", checkError)
      return NextResponse.json({ error: "Cliente não encontrado" }, { status: 404 })
    }

    // Excluir interações do cliente
    try {
      await supabase.from("client_interactions").delete().eq("client_id", id)
    } catch (interactionsError) {
      console.error("Error deleting client interactions:", interactionsError)
      // Continuamos mesmo com erro, pois pode não haver interações
    }

    // Excluir notas do cliente
    try {
      await supabase.from("client_notes").delete().eq("client_id", id)
    } catch (notesError) {
      console.error("Error deleting client notes:", notesError)
      // Continuamos mesmo com erro, pois pode não haver notas
    }

    // Agora excluímos o cliente usando a função RPC que criamos
    const { error: deleteError } = await supabase.rpc("delete_client", { client_id: id })

    if (deleteError) {
      console.error("Error deleting client using RPC:", deleteError)

      // Se o RPC falhar, tentamos uma abordagem alternativa com SQL bruto
      const { error: rawError } = await supabase.from("clients").delete().eq("id", id)

      if (rawError) {
        console.error("Error deleting client with raw query:", rawError)
        return NextResponse.json({ error: rawError.message }, { status: 500 })
      }
    }

    console.log(`Successfully deleted client with ID: ${id}`)
    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("Unexpected error during client deletion:", error)
    return NextResponse.json(
      {
        error: "Erro ao excluir cliente",
        details: error?.message || "Erro desconhecido",
      },
      { status: 500 },
    )
  }
}
