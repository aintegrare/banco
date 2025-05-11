import { NextResponse } from "next/server"
import { getTasks, createTask } from "@/lib/unified-task-manager"
import type { TaskStatus, TaskPriority, CreateTaskInput } from "@/lib/unified-task-manager"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)

    // Extrair parâmetros de consulta
    const projectId = searchParams.get("project_id") ? Number.parseInt(searchParams.get("project_id")!) : undefined

    const status = searchParams.get("status") as TaskStatus | undefined

    const priority = searchParams.get("priority") as TaskPriority | undefined

    const assignedTo = searchParams.get("assigned_to") ? Number.parseInt(searchParams.get("assigned_to")!) : undefined

    const search = searchParams.get("search") || undefined

    // Parâmetros de paginação
    const limit = searchParams.get("limit") ? Number.parseInt(searchParams.get("limit")!) : undefined

    const offset = searchParams.get("offset") ? Number.parseInt(searchParams.get("offset")!) : undefined

    // Buscar tarefas com base nos filtros
    const tasks = await getTasks({
      project_id: projectId,
      status,
      priority,
      assigned_to: assignedTo,
      search,
      limit,
      offset,
    })

    return NextResponse.json(tasks)
  } catch (error: any) {
    console.error("Erro ao processar requisição de tarefas:", error)
    return NextResponse.json({ error: error.message || "Erro ao buscar tarefas" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()

    const {
      title,
      description,
      status,
      priority,
      project_id,
      assigned_to,
      due_date,
      estimated_hours,
      tags,
      color,
      creator,
      assignee,
    } = body

    if (!title) {
      return NextResponse.json({ error: "Título da tarefa é obrigatório" }, { status: 400 })
    }

    const taskData: CreateTaskInput = {
      title,
      description,
      status: status || "todo",
      priority: priority || "medium",
      project_id,
      assigned_to,
      due_date,
      estimated_hours,
      tags,
      color: color || "#4b7bb5",
      creator,
      assignee,
    }

    const newTask = await createTask(taskData)

    return NextResponse.json(newTask)
  } catch (error: any) {
    console.error("Erro ao processar requisição de criação de tarefa:", error)
    return NextResponse.json({ error: error.message || "Erro ao criar tarefa" }, { status: 500 })
  }
}
