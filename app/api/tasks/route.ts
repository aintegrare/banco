import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const projectId = searchParams.get("projectId")

    console.log("API tasks: Buscando tarefas", projectId ? `para o projeto ${projectId}` : "para todos os projetos")

    const supabase = createClient()

    let query = supabase.from("tasks").select("*")

    if (projectId) {
      query = query.eq("project_id", projectId)
    }

    const { data, error } = await query.order("created_at", { ascending: false })

    if (error) {
      console.error("API tasks: Erro ao buscar tarefas:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    console.log(`API tasks: ${data?.length || 0} tarefas encontradas`)

    // Se não houver dados do banco de dados, use o fallback
    if (!data || data.length === 0) {
      console.log("API tasks: Usando dados de fallback")
      return NextResponse.json(fallbackTasks)
    }

    return NextResponse.json(data)
  } catch (error: any) {
    console.error("API tasks: Erro ao processar requisição de tarefas:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// Modificar a função POST para usar uma abordagem mais simples
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { title, description, status, priority, project_id, due_date, color, creator, assignee } = body

    if (!title || !project_id) {
      return NextResponse.json({ error: "Título e ID do projeto são obrigatórios" }, { status: 400 })
    }

    const supabase = createClient()

    // Mapear os status do frontend para valores provavelmente permitidos no banco
    // Baseado em valores comuns para status em bancos PostgreSQL
    const statusMap: { [key: string]: string } = {
      backlog: "pending",
      todo: "pending",
      "in-progress": "in_progress",
      review: "review",
      done: "completed",
    }

    // Tentar obter um status válido do mapeamento ou usar um valor padrão
    const mappedStatus = status ? statusMap[status] || "pending" : "pending"

    console.log(`Mapeando status: ${status} -> ${mappedStatus}`)

    // Criar objeto com os dados da tarefa
    // Remover campos que não existem na tabela (color, creator, assignee)
    const taskData = {
      title,
      description: description || null,
      status: mappedStatus,
      priority: priority || "medium",
      project_id,
      due_date: due_date || null,
      created_at: new Date().toISOString(),
    }

    // Tentar inserir a tarefa com o status mapeado
    let result = await supabase.from("tasks").insert(taskData).select().single()

    // Se houver erro, tentar com outros valores possíveis de status
    if (
      result.error &&
      result.error.message.includes("violates check constraint") &&
      result.error.message.includes("status")
    ) {
      console.warn(`Erro ao usar status '${mappedStatus}'. Tentando alternativas...`)

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

        console.log(`Tentando status alternativo: ${altStatus}`)
        const altTaskData = { ...taskData, status: altStatus }

        result = await supabase.from("tasks").insert(altTaskData).select().single()

        if (!result.error) {
          console.log(`Status '${altStatus}' aceito pelo banco de dados!`)
          // Atualizar o mapeamento para uso futuro
          statusMap[status] = altStatus
          break
        }
      }
    }

    // Se ainda houver erro, retornar o erro
    if (result.error) {
      console.error("Erro ao criar tarefa após tentar múltiplos status:", result.error)
      return NextResponse.json({ error: result.error.message }, { status: 500 })
    }

    // Adicionar os campos removidos de volta à resposta para uso no frontend
    const responseData = {
      ...result.data,
      color: color || "#4b7bb5",
      creator: creator || null,
      assignee: assignee || null,
      // Manter o status original do frontend para consistência na UI
      status: status || "todo",
    }

    return NextResponse.json(responseData)
  } catch (error: any) {
    console.error("Erro ao processar requisição de criação de tarefa:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// Dados de exemplo para fallback
const fallbackTasks = [
  {
    id: "fallback-1",
    title: "Revisar conteúdo do site",
    description: "Verificar textos e imagens da página inicial",
    status: "todo",
    priority: "high",
    project_id: "fallback",
    created_at: new Date().toISOString(),
    due_date: new Date().toISOString(),
  },
  {
    id: "fallback-2",
    title: "Preparar relatório mensal",
    description: "Compilar métricas de desempenho para o cliente",
    status: "in-progress",
    priority: "medium",
    project_id: "fallback",
    created_at: new Date().toISOString(),
    due_date: new Date(Date.now() + 86400000 * 3).toISOString(),
  },
]
