import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const projectId = searchParams.get("projectId")

    const supabase = createClient()

    let query = supabase.from("tasks").select("*")

    if (projectId) {
      query = query.eq("project_id", projectId)
    }

    const { data, error } = await query.order("created_at", { ascending: false })

    if (error) {
      console.error("Erro ao buscar tarefas:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data || [])
  } catch (error: any) {
    console.error("Erro ao processar requisição de tarefas:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { title, description, status, priority, project_id, due_date } = body

    if (!title || !project_id) {
      return NextResponse.json({ error: "Título e ID do projeto são obrigatórios" }, { status: 400 })
    }

    const supabase = createClient()

    // Verificar se a tabela tasks existe usando uma abordagem mais direta
    try {
      // Tentar fazer uma consulta simples para verificar se a tabela existe
      const { count, error: countError } = await supabase.from("tasks").select("*", { count: "exact", head: true })

      if (countError) {
        console.error("Erro ao verificar tabela tasks:", countError)
        // Se houver erro, provavelmente a tabela não existe ou há um problema de permissão
        return NextResponse.json({ error: "Erro ao verificar tabela de tarefas" }, { status: 500 })
      }

      console.log("Tabela tasks verificada com sucesso")
    } catch (tableError) {
      console.error("Exceção ao verificar tabela tasks:", tableError)
      return NextResponse.json({ error: "Erro ao verificar estrutura da tabela" }, { status: 500 })
    }

    // Criar objeto com os dados da tarefa
    // Removida a propriedade assignee_id que estava causando o erro
    const taskData = {
      title,
      description: description || null,
      status: status || "todo",
      priority: priority || "medium",
      project_id,
      due_date: due_date || null,
      created_at: new Date().toISOString(),
    }

    const { data, error } = await supabase.from("tasks").insert(taskData).select().single()

    if (error) {
      console.error("Erro ao criar tarefa:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error: any) {
    console.error("Erro ao processar requisição de criação de tarefa:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
