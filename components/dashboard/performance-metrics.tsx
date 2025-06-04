"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

type ProjectMetrics = {
  month: string
  completed: number
  active: number
}

export function PerformanceMetrics() {
  const [metrics, setMetrics] = useState<ProjectMetrics[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchMetrics = async () => {
      const supabase = createClientComponentClient()

      try {
        // Buscar projetos dos últimos 6 meses
        const sixMonthsAgo = new Date()
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)

        const { data: projects } = await supabase
          .from("projects")
          .select("start_date, end_date, status")
          .gte("start_date", sixMonthsAgo.toISOString())

        // Processar dados para o gráfico
        const monthlyData: Record<string, { completed: number; active: number }> = {}

        // Inicializar os últimos 6 meses
        for (let i = 0; i < 6; i++) {
          const date = new Date()
          date.setMonth(date.getMonth() - i)
          const monthKey = date.toISOString().substring(0, 7) // YYYY-MM
          const monthName = date.toLocaleString("pt-BR", { month: "short" })
          monthlyData[monthKey] = { month: monthName, completed: 0, active: 0 }
        }

        // Contar projetos por mês
        projects?.forEach((project) => {
          const startMonth = project.start_date.substring(0, 7)
          const endMonth = project.end_date?.substring(0, 7)

          if (monthlyData[startMonth]) {
            if (project.status === "concluído") {
              monthlyData[startMonth].completed += 1
            } else {
              monthlyData[startMonth].active += 1
            }
          }

          // Se o projeto terminou em um mês diferente, contar como concluído nesse mês
          if (endMonth && endMonth !== startMonth && monthlyData[endMonth] && project.status === "concluído") {
            monthlyData[endMonth].completed += 1
          }
        })

        // Converter para array e ordenar por mês
        const chartData = Object.entries(monthlyData)
          .map(([key, value]) => ({
            month: value.month,
            completed: value.completed,
            active: value.active,
            key,
          }))
          .sort((a, b) => a.key.localeCompare(b.key))
          .map(({ month, completed, active }) => ({ month, completed, active }))

        setMetrics(chartData)
      } catch (error) {
        console.error("Erro ao buscar métricas de desempenho:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchMetrics()
  }, [])

  // Se não houver dados reais, usar dados de exemplo
  useEffect(() => {
    if (!loading && metrics.length === 0) {
      const demoData: ProjectMetrics[] = [
        { month: "Jan", completed: 3, active: 5 },
        { month: "Fev", completed: 4, active: 6 },
        { month: "Mar", completed: 2, active: 8 },
        { month: "Abr", completed: 5, active: 7 },
        { month: "Mai", completed: 6, active: 4 },
        { month: "Jun", completed: 4, active: 6 },
      ]
      setMetrics(demoData)
    }
  }, [loading, metrics])

  return (
    <Card className="h-full">
      <CardContent className="p-6">
        {loading ? (
          <div className="h-[250px] w-full animate-pulse bg-muted rounded"></div>
        ) : (
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={metrics} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="month" />
              <YAxis allowDecimals={false} />
              <Tooltip
                formatter={(value, name) => [value, name === "completed" ? "Concluídos" : "Ativos"]}
                labelFormatter={(label) => `Mês: ${label}`}
              />
              <Bar dataKey="active" name="Ativos" fill="#4b7bb5" radius={[4, 4, 0, 0]} />
              <Bar dataKey="completed" name="Concluídos" fill="#6b91c1" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  )
}
