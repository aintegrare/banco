import { NextResponse } from "next/server"
import {
  getSimpleTasks,
  createSimpleTask,
  type SimpleTaskFilters,
  type SimpleCreateTaskInput,
} from "@/lib/simple-task-service"

export async function GET(request: Request) {
  try {
    console.log("🌐 GET /api/tasks iniciado (versão simples)")

    const { searchParams } = new URL(request.url)

    const filters: SimpleTaskFilters = {}

    if (searchParams.get("project_id")) {
      filters.project_id = Number.parseInt(searchParams.get("project_id")!)
    }

    if (searchParams.get("status")) {
      filters.status = searchParams.get("status")!
    }

    if (searchParams.get("priority")) {
      filters.priority = searchParams.get("priority")!
    }

    if (searchParams.get("search")) {
      filters.search = searchParams.get("search")!
    }

    if (searchParams.get("limit")) {
      filters.limit = Number.parseInt(searchParams.get("limit")!)
    }

    if (searchParams.get("offset")) {
      filters.offset = Number.parseInt(searchParams.get("offset")!)
    }

    console.log("📋 Filtros processados:", filters)

    const tasks = await getSimpleTasks(filters)

    console.log(`✅ GET /api/tasks concluído: ${tasks.length} tarefas`)

    return NextResponse.json({
      success: true,
      data: tasks,
      count: tasks.length,
    })
  } catch (error: any) {
    console.error("❌ GET /api/tasks error:", error)
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 },
    )
  }
}

export async function POST(request: Request) {
  try {
    console.log("🌐 POST /api/tasks iniciado (versão simples)")

    const body = await request.json()
    console.log("📝 Dados recebidos:", body)

    const input: SimpleCreateTaskInput = {
      title: body.title,
      description: body.description,
      status: body.status,
      priority: body.priority,
      project_id: body.project_id,
      assigned_to: body.assigned_to,
      due_date: body.due_date,
      estimated_hours: body.estimated_hours,
    }

    const task = await createSimpleTask(input)

    console.log(`✅ POST /api/tasks concluído: tarefa ${task.id} criada`)

    return NextResponse.json(
      {
        success: true,
        data: task,
      },
      { status: 201 },
    )
  } catch (error: any) {
    console.error("❌ POST /api/tasks error:", error)
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 400 },
    )
  }
}
