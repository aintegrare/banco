import { NextResponse } from "next/server"
import { taskService } from "@/lib/services/task-service"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const projectId = searchParams.get("project_id") ? Number.parseInt(searchParams.get("project_id")!) : undefined

    console.log("📊 Buscando estatísticas de tarefas", projectId ? `para projeto ${projectId}` : "gerais")

    const stats = await taskService.getTaskStats(projectId)

    console.log("✅ Estatísticas calculadas:", stats)

    return NextResponse.json({
      success: true,
      data: stats,
    })
  } catch (error: any) {
    console.error("❌ Erro em GET /api/tasks/stats:", error)
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 },
    )
  }
}
