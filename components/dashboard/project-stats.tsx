"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Loader2, AlertCircle, Calendar, CheckCircle, Clock, PauseCircle, XCircle } from "lucide-react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"

export function ProjectStats() {
  const [stats, setStats] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/projects/stats")
      const result = await response.json()

      if (!result.success) {
        throw new Error(result.error || "Erro ao buscar estatísticas")
      }

      setStats(result.data)
    } catch (error: any) {
      console.error("Erro ao buscar estatísticas:", error)
      setError(error.message || "Erro ao carregar estatísticas")
    } finally {
      setIsLoading(false)
    }
  }

  // Formatar data
  const formatDate = (dateString?: string) => {
    if (!dateString) return "Sem data"
    try {
      return format(new Date(dateString), "dd/MM/yyyy", { locale: ptBR })
    } catch (e) {
      return "Data inválida"
    }
  }

  // Obter ícone do status
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle size={16} className="text-green-500" />
      case "active":
        return <Clock size={16} className="text-blue-500" />
      case "on_hold":
        return <PauseCircle size={16} className="text-orange-500" />
      case "cancelled":
        return <XCircle size={16} className="text-red-500" />
      default:
        return null
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Estatísticas de Projetos</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center items-center py-8">
            <Loader2 size={30} className="text-[#4b7bb5] animate-spin" />
          </div>
        ) : error ? (
          <div className="text-center py-8 text-red-500">
            <AlertCircle className="mx-auto h-8 w-8 mb-2" />
            <p>{error}</p>
          </div>
        ) : stats ? (
          <Tabs defaultValue="overview">
            <TabsList className="mb-4">
              <TabsTrigger value="overview">Visão Geral</TabsTrigger>
              <TabsTrigger value="recent">Projetos Recentes</TabsTrigger>
            </TabsList>

            <TabsContent value="overview">
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="space-y-2">
                  <p className="text-sm text-gray-500">Total de Projetos</p>
                  <p className="text-2xl font-bold">{stats.totalProjects}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-gray-500">Projetos Ativos</p>
                  <p className="text-2xl font-bold text-blue-600">{stats.activeProjects}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-gray-500">Projetos Concluídos</p>
                  <p className="text-2xl font-bold text-green-600">{stats.completedProjects}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-gray-500">Projetos Atrasados</p>
                  <p className="text-2xl font-bold text-red-600">{stats.overdueProjects}</p>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-sm font-medium">Distribuição por Status</h3>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Planejamento</span>
                    <span>{stats.byStatus.planning}</span>
                  </div>
                  <Progress value={(stats.byStatus.planning / stats.totalProjects) * 100} className="h-2" />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Ativos</span>
                    <span>{stats.byStatus.active}</span>
                  </div>
                  <Progress value={(stats.byStatus.active / stats.totalProjects) * 100} className="h-2 bg-blue-100">
                    <div className="h-full bg-blue-500 rounded-full" />
                  </Progress>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Em Espera</span>
                    <span>{stats.byStatus.on_hold}</span>
                  </div>
                  <Progress value={(stats.byStatus.on_hold / stats.totalProjects) * 100} className="h-2 bg-orange-100">
                    <div className="h-full bg-orange-500 rounded-full" />
                  </Progress>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Concluídos</span>
                    <span>{stats.byStatus.completed}</span>
                  </div>
                  <Progress value={(stats.byStatus.completed / stats.totalProjects) * 100} className="h-2 bg-green-100">
                    <div className="h-full bg-green-500 rounded-full" />
                  </Progress>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Cancelados</span>
                    <span>{stats.byStatus.cancelled}</span>
                  </div>
                  <Progress value={(stats.byStatus.cancelled / stats.totalProjects) * 100} className="h-2 bg-red-100">
                    <div className="h-full bg-red-500 rounded-full" />
                  </Progress>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="recent">
              <div className="space-y-4">
                {stats.recentProjects.map((project: any) => (
                  <div key={project.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center">
                          {getStatusIcon(project.status)}
                          <h3 className="font-medium ml-2">{project.name}</h3>
                        </div>
                        <p className="text-sm text-gray-500 mt-1">Status: {project.statusLabel}</p>
                      </div>
                      <div className="text-sm text-gray-500 flex items-center">
                        <Calendar size={14} className="mr-1" />
                        <span>{formatDate(project.updated_at)}</span>
                      </div>
                    </div>

                    <div className="mt-3">
                      <div className="flex justify-between text-sm mb-1">
                        <span>Progresso</span>
                        <span>{project.progress || 0}%</span>
                      </div>
                      <Progress value={project.progress || 0} className="h-2" />
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <p>Nenhuma estatística disponível.</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
