"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Loader2 } from "lucide-react"

interface TaskStatsProps {
  projectId?: number
}

export function TaskStats({ projectId }: TaskStatsProps) {
  const [stats, setStats] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      setIsLoading(true)
      try {
        let url = "/api/tasks/stats"

        if (projectId) {
          url += `?project_id=${projectId}`
        }

        const response = await fetch(url)

        if (!response.ok) {
          throw new Error("Falha ao buscar estatísticas")
        }

        const data = await response.json()
        setStats(data)
      } catch (error) {
        console.error("Erro ao buscar estatísticas:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchStats()
  }, [projectId])

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Estatísticas de Tarefas</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center py-6">
          <Loader2 className="h-8 w-8 text-[#4b7bb5] animate-spin" />
        </CardContent>
      </Card>
    )
  }

  if (!stats) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Estatísticas de Tarefas</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500">Não foi possível carregar as estatísticas</p>
        </CardContent>
      </Card>
    )
  }

  const total = stats.total || 0
  const statusCounts = stats.byStatus || {}

  // Calcular porcentagens
  const getPercentage = (count: number) => {
    return total > 0 ? Math.round((count / total) * 100) : 0
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Estatísticas de Tarefas</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium">Total de Tarefas</span>
          <span className="text-2xl font-bold text-[#4b7bb5]">{total}</span>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>A Fazer</span>
              <span>
                {statusCounts.todo || 0} ({getPercentage(statusCounts.todo || 0)}%)
              </span>
            </div>
            <Progress value={getPercentage(statusCounts.todo || 0)} className="h-2 bg-gray-200" />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Em Progresso</span>
              <span>
                {statusCounts["in-progress"] || 0} ({getPercentage(statusCounts["in-progress"] || 0)}%)
              </span>
            </div>
            <Progress value={getPercentage(statusCounts["in-progress"] || 0)} className="h-2 bg-gray-200" />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Em Revisão</span>
              <span>
                {statusCounts.review || 0} ({getPercentage(statusCounts.review || 0)}%)
              </span>
            </div>
            <Progress value={getPercentage(statusCounts.review || 0)} className="h-2 bg-gray-200" />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Concluídas</span>
              <span>
                {statusCounts.done || 0} ({getPercentage(statusCounts.done || 0)}%)
              </span>
            </div>
            <Progress value={getPercentage(statusCounts.done || 0)} className="h-2 bg-gray-200" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
