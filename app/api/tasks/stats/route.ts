import { NextResponse } from "next/server"
import { getTaskStats } from "@/lib/unified-task-manager"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const projectId = searchParams.get("project_id") ? Number.parseInt(searchParams.get("project_id")!) : undefined

    const stats = await getTaskStats(projectId)

    return NextResponse.json(stats)
  } catch (error: any) {
    console.error("Erro ao processar requisição de estatísticas de tarefas:", error)
    return NextResponse.json({ error: error.message || "Erro ao buscar estatísticas de tarefas" }, { status: 500 })
  }
}
