import { NextResponse } from "next/server"
import { projectService } from "@/lib/services/project-service"

export async function GET(request: Request) {
  try {
    // Buscar todos os projetos
    const projects = await projectService.getProjects()

    // Estatísticas gerais
    const stats = {
      totalProjects: projects.length,
      activeProjects: projects.filter((p) => p.status === "active").length,
      completedProjects: projects.filter((p) => p.status === "completed").length,
      overdueProjects: projects.filter((p) => p.isOverdue).length,

      // Estatísticas por status
      byStatus: {
        planning: projects.filter((p) => p.status === "planning").length,
        active: projects.filter((p) => p.status === "active").length,
        on_hold: projects.filter((p) => p.status === "on_hold").length,
        completed: projects.filter((p) => p.status === "completed").length,
        cancelled: projects.filter((p) => p.status === "cancelled").length,
      },

      // Projetos recentes
      recentProjects: projects
        .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
        .slice(0, 5)
        .map((p) => ({
          id: p.id,
          name: p.name,
          status: p.status,
          statusLabel: p.statusLabel,
          progress: p.progress,
          updated_at: p.updated_at,
        })),
    }

    return NextResponse.json({
      success: true,
      data: stats,
    })
  } catch (error: any) {
    console.error("GET /api/projects/stats error:", error)
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 },
    )
  }
}
