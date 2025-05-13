import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const taskId = params.id

    const supabase = createClient()

    const { data, error } = await supabase.from("tasks").select("*").eq("id", taskId).single()

    if (error) {
      console.error(`Erro ao buscar tarefa ${taskId}:`, error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    if (!data) {
      return NextResponse.json({ error: "Tarefa não encontrada" }, { status: 404 })
    }

    return NextResponse.json(data)
  } catch (error: any) {
    console.error("Erro ao processar requisição de tarefa:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const taskId = params.id
    const body = await request.json()

    // Remover campos que não devem ser atualizados
    const { id, created_at, ...updateData } = body

    if (!updateData.title) {
      return NextResponse.json({ error: "Título da tarefa é obrigatório" }, { status: 400 })
    }

    const supabase = createClient()

    const { data, error } = await supabase.from("tasks").update(updateData).eq("id", taskId).select().single()

    if (error) {
      console.error(`Erro ao atualizar tarefa ${taskId}:`, error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error: any) {
    console.error("Erro ao processar requisição de atualização de tarefa:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const taskId = params.id

    const supabase = createClient()

    const { error } = await supabase.from("tasks").delete().eq("id", taskId)

    if (error) {
      console.error(`Erro ao excluir tarefa ${taskId}:`, error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("Erro ao processar requisição de exclusão de tarefa:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
