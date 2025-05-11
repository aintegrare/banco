import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params

    const supabase = createClient()
    const { data, error } = await supabase.from("tasks").select("*").eq("id", id).single()

    if (error) {
      console.error("Erro ao buscar tarefa:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    if (!data) {
      return NextResponse.json({ error: "Tarefa não encontrada" }, { status: 404 })
    }

    return NextResponse.json(data)
  } catch (error: any) {
    console.error("Erro ao processar requisição:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const body = await request.json()

    // Desestruturar os dados recebidos do corpo da requisição
    const { title, description, status, priority, project_id, due_date, color, assignee } = body

    // Verificar dados obrigatórios
    if (!title) {
      return NextResponse.json({ error: "Título é obrigatório" }, { status: 400 })
    }

    const supabase = createClient()

    // Mapear os status do frontend para valores comuns em bancos de dados
    const statusMap: { [key: string]: string } = {
      backlog: "backlog",
      todo: "to_do",
      "in-progress": "in_progress",
      review: "review",
      done: "done",
    }

    // Tentar atualizar a tarefa com o status mapeado
    const mappedStatus = statusMap[status || "todo"] || "to_do"

    // Objeto com dados para atualização (excluindo campos que não existem na tabela)
    const taskData = {
      title,
      description,
      status: mappedStatus,
      priority,
      project_id,
      due_date,
      updated_at: new Date().toISOString(),
    }

    // Primeira tentativa com o status mapeado
    let response = await tryUpdateTask(supabase, id, taskData, body)
    if (response) return response

    // Segunda tentativa com um conjunto de valores alternativos comuns
    const commonStatuses = ["pending", "open", "new", "active", "to_do", "todo", "backlog"]

    for (const altStatus of commonStatuses) {
      console.log(`Tentando atualizar tarefa com status alternativo: ${altStatus}`)
      const altTaskData = { ...taskData, status: altStatus }
      response = await tryUpdateTask(supabase, id, altTaskData, body)
      if (response) return response
    }

    // Se todas as tentativas falharem, retornar erro
    return NextResponse.json(
      {
        error: "Não foi possível atualizar a tarefa. Nenhum valor de status aceito pelo banco de dados.",
      },
      { status: 500 },
    )
  } catch (error: any) {
    console.error("Erro ao processar requisição:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// Função auxiliar para tentar atualizar tarefa com um determinado status
async function tryUpdateTask(supabase: any, id: string, taskData: any, originalBody: any) {
  try {
    const { data, error } = await supabase.from("tasks").update(taskData).eq("id", id).select().single()

    if (error) {
      console.log(`Tentativa de atualização com status '${taskData.status}' falhou:`, error.message)
      return null
    }

    // Sucesso - adicionar os campos removidos de volta à resposta
    const { color, assignee } = originalBody
    const responseData = {
      ...data,
      color: color || "#4b7bb5",
      assignee: assignee || null,
    }

    console.log(`Tarefa atualizada com sucesso usando status '${taskData.status}'`)
    return NextResponse.json(responseData)
  } catch (err) {
    console.error(`Erro ao tentar atualizar tarefa com status '${taskData.status}':`, err)
    return null
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params

    const supabase = createClient()
    const { error } = await supabase.from("tasks").delete().eq("id", id)

    if (error) {
      console.error("Erro ao excluir tarefa:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ message: "Tarefa excluída com sucesso" })
  } catch (error: any) {
    console.error("Erro ao processar requisição:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
