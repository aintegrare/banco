import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = createClient()
    const clientId = params.id

    const { data, error } = await supabase
      .from("client_interactions")
      .select("*")
      .eq("client_id", clientId)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching interactions:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("Unexpected error:", error)
    return NextResponse.json({ error: "Erro ao buscar interações" }, { status: 500 })
  }
}

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = createClient()
    const clientId = params.id
    const interaction = await request.json()

    // Add client_id and timestamp
    interaction.client_id = Number.parseInt(clientId)
    interaction.created_at = new Date().toISOString()

    // Get current user details from session
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (user) {
      interaction.user_id = user.id
      // Get user name from the user profile (adapt as needed for your auth setup)
      const { data: profile } = await supabase.from("profiles").select("full_name").eq("id", user.id).single()

      interaction.user_name = profile?.full_name || user.email
    }

    const { data, error } = await supabase.from("client_interactions").insert(interaction).select().single()

    if (error) {
      console.error("Error creating interaction:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Update last_contact field in clients table
    await supabase
      .from("clients")
      .update({
        last_contact: interaction.created_at,
        updated_at: interaction.created_at,
      })
      .eq("id", clientId)

    return NextResponse.json(data, { status: 201 })
  } catch (error) {
    console.error("Unexpected error:", error)
    return NextResponse.json({ error: "Erro ao criar interação" }, { status: 500 })
  }
}
