import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = createClient()
    const clientId = params.id

    const { data, error } = await supabase
      .from("client_notes")
      .select("*")
      .eq("client_id", clientId)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching notes:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("Unexpected error:", error)
    return NextResponse.json({ error: "Erro ao buscar notas" }, { status: 500 })
  }
}

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = createClient()
    const clientId = params.id
    const note = await request.json()

    // Add client_id and timestamps
    note.client_id = Number.parseInt(clientId)
    note.created_at = new Date().toISOString()
    note.updated_at = new Date().toISOString()

    // Get current user details from session
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (user) {
      note.user_id = user.id
      // Get user name from the user profile (adapt as needed for your auth setup)
      const { data: profile } = await supabase.from("profiles").select("full_name").eq("id", user.id).single()

      note.user_name = profile?.full_name || user.email
    }

    const { data, error } = await supabase.from("client_notes").insert(note).select().single()

    if (error) {
      console.error("Error creating note:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data, { status: 201 })
  } catch (error) {
    console.error("Unexpected error:", error)
    return NextResponse.json({ error: "Erro ao criar nota" }, { status: 500 })
  }
}
