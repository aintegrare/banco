"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, Clock, ArrowUpRight } from "lucide-react"
import Link from "next/link"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

type TaskStats = {
  total: number
  completed: number
  pending: number
  inProgress: number
  dueToday: number
}

export function TasksOverview() {
  const [stats, setStats] = useState<TaskStats>({
    total: 0,
    completed: 0,
    pending: 0,
    inProgress: 0,
    dueToday: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      const supabase = createClientComponentClient()

      try {
        // Buscar contagem total de tarefas
        const { count: total } = await supabase.from("tasks").select("*", { count: "exact", head: true })

        // Buscar contagem de tarefas concluídas
        const { count: completed } = await supabase
          .from("tasks")
          .select("*", { count: "exact", head: true })
          .eq("status", "concluída")

        // Buscar contagem de tarefas pendentes
        const { count: pending } = await supabase
          .from("tasks")
          .select("*", { count: "exact", head: true })
          .eq("status", "pendente")

        // Buscar contagem de tarefas em andamento
        const { count: inProgress } = await supabase
          .from("tasks")
          .select("*", { count: "exact", head: true })
          .eq("status", "em_andamento")

        // Buscar contagem de tarefas com vencimento hoje
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        const tomorrow = new Date(today)
        tomorrow.setDate(tomorrow.getDate() + 1)

        const { count: dueToday } = await supabase
          .from("tasks")
          .select("*", { count: "exact", head: true })
          .gte("due_date", today.toISOString())
          .lt("due_date", tomorrow.toISOString())

        setStats({
          total: total || 0,
          completed: completed || 0,
          pending: pending || 0,
          inProgress: inProgress || 0,
          dueToday: dueToday || 0,
        })
      } catch (error) {
        console.error("Erro ao buscar estatísticas de tarefas:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  const completionRate = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0

  return (
    <Card>
      <CardHeader className="bg-[#3d649e]/10 flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Tarefas</CardTitle>
        <CheckCircle className="h-4 w-4 text-[#3d649e]" />
      </CardHeader>
      <CardContent className="pt-4">
        {loading ? (
          <div className="space-y-2">
            <div className="h-4 w-1/2 animate-pulse rounded bg-muted"></div>
            <div className="h-4 w-full animate-pulse rounded bg-muted"></div>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">{stats.total}</div>
              <Link href="/admin/tarefas" className="flex items-center text-xs text-[#3d649e] hover:underline">
                Ver todas
                <ArrowUpRight className="ml-1 h-3 w-3" />
              </Link>
            </div>
            <p className="text-xs text-muted-foreground">{completionRate}% concluídas</p>
            <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
              <div className="flex flex-col">
                <span className="text-muted-foreground">Pendentes</span>
                <span className="font-medium">{stats.pending}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-muted-foreground">Em andamento</span>
                <span className="font-medium">{stats.inProgress}</span>
              </div>
            </div>
            {stats.dueToday > 0 && (
              <div className="mt-4 flex items-center text-xs text-amber-600">
                <Clock className="mr-1 h-3 w-3" />
                <span>{stats.dueToday} tarefas vencem hoje</span>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  )
}
