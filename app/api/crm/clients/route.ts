import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient()
    const searchParams = request.nextUrl.searchParams
    const status = searchParams.get("status")
    const segment = searchParams.get("segment")
    const search = searchParams.get("search")

    let query = supabase.from("clients").select("*")

    if (status && status !== "todos") {
      query = query.eq("status", status)
    }

    if (segment && segment !== "todos") {
      query = query.eq("segment", segment)
    }

    if (search) {
      query = query.or(`name.ilike.%${search}%,company.ilike.%${search}%,email.ilike.%${search}%`)
    }

    const { data, error } = await query.order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching clients:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("Unexpected error:", error)
    return NextResponse.json({ error: "Erro ao buscar clientes" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient()
    const client = await request.json()

    // Validar campos obrigatórios
    const requiredFields = ["name", "company", "email", "phone", "address", "segment", "status"]
    for (const field of requiredFields) {
      if (!client[field]) {
        return NextResponse.json({ error: `Campo ${field} é obrigatório` }, { status: 400 })
      }
    }

    // Add timestamps
    client.created_at = new Date().toISOString()
    client.updated_at = new Date().toISOString()

    const { data, error } = await supabase.from("clients").insert(client).select().single()

    if (error) {
      console.error("Error creating client:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data, { status: 201 })
  } catch (error) {
    console.error("Unexpected error:", error)
    return NextResponse.json({ error: "Erro ao criar cliente" }, { status: 500 })
  }
}
