"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { CheckCircle2, Clock, AlertCircle, Calendar } from "lucide-react"

type Activity = {
  id: string | number
  type: "task" | "project" | "client" | "ad"
  title: string
  status: string
  date: string
  link: string
}

export function RecentActivity() {
  const [activities, setActivities] = useState<Activity[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchActivities = async () => {
      const supabase = createClientComponentClient()

      try {
        // Buscar tarefas recentes
        const { data: recentTasks } = await supabase
          .from("tasks")
          .select("id, title, status, updated_at")
          .order("updated_at", { ascending: false })
          .limit(5)

        // Buscar projetos recentes
        const { data: recentProjects } = await supabase
          .from("projects")
          .select("id, name, status, updated_at")
          .order("updated_at", { ascending: false })
          .limit(5)

        // Combinar e ordenar atividades
        const taskActivities = (recentTasks || []).map((task) => ({
          id: task.id,
          type: "task" as const,
          title: task.title,
          status: task.status,
          date: task.updated_at,
          link: `/admin/tarefas/${task.id}`,
        }))

        const projectActivities = (recentProjects || []).map((project) => ({
          id: project.id,
          type: "project" as const,
          title: project.name,
          status: project.status,
          date: project.updated_at,
          link: `/admin/projetos/${project.id}`,
        }))

        const allActivities = [...taskActivities, ...projectActivities]
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
          .slice(0, 10)

        setActivities(allActivities)
      } catch (error) {
        console.error("Erro ao buscar atividades recentes:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchActivities()
  }, [])

  const getStatusIcon = (type: string, status: string) => {
    if (type === "task") {
      if (status === "concluída") return <CheckCircle2 className="h-4 w-4 text-green-500" />
      if (status === "em_andamento") return <Clock className="h-4 w-4 text-amber-500" />
      if (status === "pendente") return <AlertCircle className="h-4 w-4 text-blue-500" />
    } else if (type === "project") {
      if (status === "concluído") return <CheckCircle2 className="h-4 w-4 text-green-500" />
      if (status === "ativo") return <Clock className="h-4 w-4 text-amber-500" />
      if (status === "planejamento") return <Calendar className="h-4 w-4 text-blue-500" />
    }
    return <AlertCircle className="h-4 w-4 text-gray-500" />
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date)
  }

  return (
    <Card className="h-full">
      <CardContent className="p-0">
        {loading ? (
          <div className="p-6 space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center space-x-4">
                <div className="h-8 w-8 rounded-full bg-muted animate-pulse"></div>
                <div className="space-y-2 flex-1">
                  <div className="h-4 w-3/4 bg-muted animate-pulse rounded"></div>
                  <div className="h-3 w-1/2 bg-muted animate-pulse rounded"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <ul className="divide-y">
            {activities.length > 0 ? (
              activities.map((activity) => (
                <li key={`${activity.type}-${activity.id}`} className="flex items-start p-4 hover:bg-muted/50">
                  <div className="mr-4 mt-0.5">{getStatusIcon(activity.type, activity.status)}</div>
                  <div className="flex-1 min-w-0">
                    <a href={activity.link} className="text-sm font-medium hover:underline">
                      {activity.title}
                    </a>
                    <div className="flex items-center mt-1 text-xs text-muted-foreground">
                      <span className="capitalize mr-2">{activity.type === "task" ? "Tarefa" : "Projeto"}</span>
                      <span className="capitalize">{activity.status.replace("_", " ")}</span>
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground whitespace-nowrap">{formatDate(activity.date)}</div>
                </li>
              ))
            ) : (
              <li className="p-6 text-center text-muted-foreground">Nenhuma atividade recente encontrada</li>
            )}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}
