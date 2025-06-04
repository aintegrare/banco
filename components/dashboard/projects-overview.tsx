"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Briefcase, ArrowUpRight } from "lucide-react"
import Link from "next/link"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

type ProjectStats = {
  total: number
  active: number
  completed: number
  planning: number
}

export function ProjectsOverview() {
  const [stats, setStats] = useState<ProjectStats>({
    total: 0,
    active: 0,
    completed: 0,
    planning: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      const supabase = createClientComponentClient()

      try {
        // Buscar contagem total de projetos
        const { count: total } = await supabase.from("projects").select("*", { count: "exact", head: true })

        // Buscar contagem de projetos ativos
        const { count: active } = await supabase
          .from("projects")
          .select("*", { count: "exact", head: true })
          .eq("status", "ativo")

        // Buscar contagem de projetos concluídos
        const { count: completed } = await supabase
          .from("projects")
          .select("*", { count: "exact", head: true })
          .eq("status", "concluído")

        // Buscar contagem de projetos em planejamento
        const { count: planning } = await supabase
          .from("projects")
          .select("*", { count: "exact", head: true })
          .eq("status", "planejamento")

        setStats({
          total: total || 0,
          active: active || 0,
          completed: completed || 0,
          planning: planning || 0,
        })
      } catch (error) {
        console.error("Erro ao buscar estatísticas de projetos:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  const activePercentage = stats.total > 0 ? Math.round((stats.active / stats.total) * 100) : 0

  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-[#4b7bb5]/10 flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Projetos</CardTitle>
        <Briefcase className="h-4 w-4 text-[#4b7bb5]" />
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
              <Link href="/admin/projetos" className="flex items-center text-xs text-[#4b7bb5] hover:underline">
                Ver todos
                <ArrowUpRight className="ml-1 h-3 w-3" />
              </Link>
            </div>
            <p className="text-xs text-muted-foreground">
              {stats.active} ativos, {stats.completed} concluídos
            </p>
            <div className="mt-4">
              <div className="flex items-center justify-between text-xs mb-1">
                <span>Projetos ativos</span>
                <span>{activePercentage}%</span>
              </div>
              <Progress value={activePercentage} className="h-1" />
            </div>
            <div className="mt-4 flex gap-2">
              <Badge variant="outline" className="bg-[#4b7bb5]/10 text-[#4b7bb5]">
                {stats.planning} em planejamento
              </Badge>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}
