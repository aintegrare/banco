import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient()

    const { data, error } = await supabase.from("clients").select("*").order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching clients:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data || [])
  } catch (error) {
    console.error("Unexpected error:", error)
    return NextResponse.json({ error: "Erro ao buscar clientes" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient()
    const clientData = await request.json()

    // Validar campos obrigatórios
    const requiredFields = ["name", "company", "email", "phone", "address", "segment", "status"]
    for (const field of requiredFields) {
      if (!clientData[field]) {
        return NextResponse.json({ error: `Campo ${field} é obrigatório` }, { status: 400 })
      }
    }

    // Adicionar timestamps
    const now = new Date().toISOString()
    clientData.created_at = now
    clientData.updated_at = now

    // Garantir que o valor seja um número
    if (clientData.value && typeof clientData.value === "string") {
      clientData.value = Number.parseFloat(clientData.value.replace(/[^\d.,]/g, "").replace(",", ".")) || 0
    }

    const { data, error } = await supabase.from("clients").insert(clientData).select().single()

    if (error) {
      console.error("Error creating client:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("Unexpected error:", error)
    return NextResponse.json({ error: "Erro ao criar cliente" }, { status: 500 })
  }
}
