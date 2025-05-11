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

// Modificar a função PUT para remover campos que não existem na tabela
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const taskId = params.id
    const body = await request.json()

    // Remover campos que não existem na tabela (color, creator, assignee)
    const { color, creator, assignee, ...taskData } = body

    const supabase = createClient()

    const { data, error } = await supabase.from("tasks").update(taskData).eq("id", taskId).select().single()

    if (error) {
      console.error(`Erro ao atualizar tarefa ${taskId}:`, error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    if (!data) {
      return NextResponse.json({ error: "Tarefa não encontrada" }, { status: 404 })
    }

    // Adicionar os campos removidos de volta à resposta para uso no frontend
    const responseData = {
      ...data,
      color: color || "#4b7bb5",
      creator: creator || null,
      assignee: assignee || null,
    }

    return NextResponse.json(responseData)
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
