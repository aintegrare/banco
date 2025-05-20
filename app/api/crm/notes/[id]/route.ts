import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = createClient()
    const noteId = params.id
    const updates = await request.json()

    // Add updated timestamp
    updates.updated_at = new Date().toISOString()

    const { data, error } = await supabase.from("client_notes").update(updates).eq("id", noteId).select().single()

    if (error) {
      console.error("Error updating note:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("Unexpected error:", error)
    return NextResponse.json({ error: "Erro ao atualizar nota" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = createClient()
    const noteId = params.id

    const { error } = await supabase.from("client_notes").delete().eq("id", noteId)

    if (error) {
      console.error("Error deleting note:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Unexpected error:", error)
    return NextResponse.json({ error: "Erro ao excluir nota" }, { status: 500 })
  }
}
