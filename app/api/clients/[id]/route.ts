import { NextResponse } from "next/server"
import { adminSupabase } from "@/lib/api"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id

    const { data, error } = await adminSupabase.from("clients").select("*").eq("id", id).single()

    if (error) {
      if (error.code === "PGRST116") {
        return NextResponse.json({ error: "Cliente não encontrado" }, { status: 404 })
      }
      console.error("Erro ao buscar cliente:", error)
      return NextResponse.json({ error: "Erro ao buscar cliente" }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("Erro ao processar requisição:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id
    const body = await request.json()

    const { data, error } = await adminSupabase
      .from("clients")
      .update({
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
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single()

    if (error) {
      console.error("Erro ao atualizar cliente:", error)
      return NextResponse.json({ error: "Erro ao atualizar cliente" }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("Erro ao processar requisição:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id

    const { error } = await adminSupabase.from("clients").delete().eq("id", id)

    if (error) {
      console.error("Erro ao excluir cliente:", error)
      return NextResponse.json({ error: "Erro ao excluir cliente" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Erro ao processar requisição:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}
