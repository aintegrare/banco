import { NextResponse } from "next/server"
import { taskService } from "@/lib/services/task-service"
import type { TaskStatus } from "@/lib/types"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { taskIds, newStatus } = body

    if (!Array.isArray(taskIds) || taskIds.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Lista de IDs de tarefas inválida",
        },
        { status: 400 },
      )
    }

    // Usar o serviço de tarefas para reordenar
    await taskService.reorderTasks(
      taskIds.map((id) => Number(id)),
      newStatus as TaskStatus,
    )

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("POST /api/tasks/reorder error:", error)
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Erro ao reordenar tarefas",
      },
      { status: 500 },
    )
  }
}
