import { NextResponse } from "next/server"
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"

export async function GET() {
  const supabase = createRouteHandlerClient({ cookies })

  try {
    // Verificar autenticação
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    // Buscar estatísticas de projetos
    const { count: totalProjects } = await supabase.from("projects").select("*", { count: "exact", head: true })

    const { count: activeProjects } = await supabase
      .from("projects")
      .select("*", { count: "exact", head: true })
      .eq("status", "ativo")

    // Buscar estatísticas de tarefas
    const { count: totalTasks } = await supabase.from("tasks").select("*", { count: "exact", head: true })

    const { count: completedTasks } = await supabase
      .from("tasks")
      .select("*", { count: "exact", head: true })
      .eq("status", "concluída")

    // Buscar estatísticas de clientes
    const { count: totalClients } = await supabase.from("clients").select("*", { count: "exact", head: true })

    // Buscar estatísticas de anúncios
    const { count: totalAds } = await supabase.from("ads").select("*", { count: "exact", head: true })

    return NextResponse.json({
      projects: {
        total: totalProjects || 0,
        active: activeProjects || 0,
      },
      tasks: {
        total: totalTasks || 0,
        completed: completedTasks || 0,
      },
      clients: {
        total: totalClients || 0,
      },
      ads: {
        total: totalAds || 0,
      },
    })
  } catch (error) {
    console.error("Erro ao buscar estatísticas do dashboard:", error)
    return NextResponse.json({ error: "Erro ao buscar estatísticas" }, { status: 500 })
  }
}
