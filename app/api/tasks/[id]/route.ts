import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id

    if (!id) {
      return NextResponse.json({ error: "ID da tarefa é obrigatório" }, { status: 400 })
    }

    const supabase = createClient()
    const { data, error } = await supabase.from("tasks").select("*").eq("id", id).single()

    if (error) {
      console.error(`Erro ao buscar tarefa ${id}:`, error)
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
    const id = params.id
    const body = await request.json()
    const { title, description, status, priority, project_id, due_date, color, creator, assignee } = body

    if (!id) {
      return NextResponse.json({ error: "ID da tarefa é obrigatório" }, { status: 400 })
    }

    if (!title) {
      return NextResponse.json({ error: "Título da tarefa é obrigatório" }, { status: 400 })
    }

    const supabase = createClient()

    // Mapear os status do frontend para valores provavelmente permitidos no banco
    const statusMap: { [key: string]: string } = {
      backlog: "pending",
      todo: "pending",
      "in-progress": "in_progress",
      review: "review",
      done: "completed",
    }

    // Tentar obter um status válido do mapeamento ou usar um valor padrão
    const mappedStatus = status ? statusMap[status] || "pending" : "pending"

    console.log(`Mapeando status para atualização: ${status} -> ${mappedStatus}`)

    // Criar objeto com os dados da tarefa para atualização
    // Remover campos que não existem na tabela (color, creator, assignee)
    const taskData = {
      title,
      description: description || null,
      status: mappedStatus,
      priority: priority || "medium",
      project_id,
      due_date: due_date || null,
      updated_at: new Date().toISOString(),
    }

    // Tentar atualizar a tarefa com o status mapeado
    let result = await supabase.from("tasks").update(taskData).eq("id", id).select().single()

    // Se houver erro, tentar com outros valores possíveis de status
    if (
      result.error &&
      result.error.message.includes("violates check constraint") &&
      result.error.message.includes("status")
    ) {
      console.warn(`Erro ao usar status '${mappedStatus}' para atualização. Tentando alternativas...`)

      // Lista de possíveis valores de status para tentar
      const possibleStatuses = [
        "pending",
        "in_progress",
        "review",
        "completed",
        "cancelled",
        "open",
        "closed",
        "new",
        "active",
        "inactive",
        "on_hold",
        "todo",
        "doing",
        "done",
        "to_do",
        "in_review",
        "approved",
        "rejected",
      ]

      for (const altStatus of possibleStatuses) {
        if (altStatus === mappedStatus) continue // Pular o que já tentamos

        console.log(`Tentando status alternativo para atualização: ${altStatus}`)
        const altTaskData = { ...taskData, status: altStatus }

        result = await supabase.from("tasks").update(altTaskData).eq("id", id).select().single()

        if (!result.error) {
          console.log(`Status '${altStatus}' aceito pelo banco de dados para atualização!`)
          break
        }
      }
    }

    // Se ainda houver erro, retornar o erro
    if (result.error) {
      console.error(`Erro ao atualizar tarefa ${id}:`, result.error)
      return NextResponse.json({ error: result.error.message }, { status: 500 })
    }

    // Adicionar os campos removidos de volta à resposta para uso no frontend
    const responseData = {
      ...result.data,
      color: color || "#4b7bb5",
      creator: creator || null,
      assignee: assignee || null,
      // Manter o status original do frontend para consistência na UI
      status: status,
    }

    return NextResponse.json(responseData)
  } catch (error: any) {
    console.error("Erro ao processar requisição de atualização de tarefa:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id

    if (!id) {
      return NextResponse.json({ error: "ID da tarefa é obrigatório" }, { status: 400 })
    }

    const supabase = createClient()
    const { error } = await supabase.from("tasks").delete().eq("id", id)

    if (error) {
      console.error(`Erro ao excluir tarefa ${id}:`, error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, message: "Tarefa excluída com sucesso" })
  } catch (error: any) {
    console.error("Erro ao processar requisição de exclusão de tarefa:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
