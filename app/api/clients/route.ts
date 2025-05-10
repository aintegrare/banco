import { NextResponse } from "next/server"
import { adminSupabase } from "@/lib/api"

export async function GET() {
  try {
    const { data, error } = await adminSupabase.from("clients").select("*").order("created_at", { ascending: false })

    if (error) {
      console.error("Erro ao buscar clientes:", error)
      return NextResponse.json({ error: "Erro ao buscar clientes" }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("Erro ao processar requisição:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()

    const { data, error } = await adminSupabase
      .from("clients")
      .insert({
        name: body.name,
        company: body.company,
        email: body.email,
        phone: body.phone,
        address: body.address,
        website: body.website || null,
        cnpj: body.cnpj || null,
        contact_name: body.contactName || null,
        contact_position: body.contactPosition || null,
        segment: body.segment,
        status: body.status,
        notes: body.notes || null,
      })
      .select()
      .single()

    if (error) {
      console.error("Erro ao criar cliente:", error)
      return NextResponse.json({ error: "Erro ao criar cliente" }, { status: 500 })
    }

    return NextResponse.json(data, { status: 201 })
  } catch (error) {
    console.error("Erro ao processar requisição:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}
