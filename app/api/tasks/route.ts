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
    const { title, description, status, priority, project_id, assignee_id, due_date } = body

    if (!title || !project_id) {
      return NextResponse.json({ error: "Título e ID do projeto são obrigatórios" }, { status: 400 })
    }

    const supabase = createClient()

    // Verificar se a tabela tasks existe
    const { data: tableInfo, error: tableError } = await supabase
      .from("information_schema.tables")
      .select("table_name")
      .eq("table_name", "tasks")
      .eq("table_schema", "public")
      .single()

    if (tableError || !tableInfo) {
      console.log("Tabela tasks não encontrada, verificando colunas disponíveis...")

      // Obter colunas disponíveis na tabela tasks usando a função RPC
      const { data: columns, error: columnsError } = await supabase.rpc("get_table_columns", { table_name: "tasks" })

      if (columnsError) {
        console.error("Erro ao obter colunas da tabela tasks:", columnsError)
        return NextResponse.json({ error: "Erro ao verificar estrutura da tabela" }, { status: 500 })
      }

      console.log("Colunas disponíveis na tabela tasks:", columns)
    }

    // Criar objeto com os dados da tarefa
    const taskData = {
      title,
      description: description || null,
      status: status || "todo",
      priority: priority || "medium",
      project_id,
      assignee_id: assignee_id || null,
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
