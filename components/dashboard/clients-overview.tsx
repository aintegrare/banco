"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, ArrowUpRight } from "lucide-react"
import Link from "next/link"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

type ClientStats = {
  total: number
  active: number
  leads: number
  newThisMonth: number
}

export function ClientsOverview() {
  const [stats, setStats] = useState<ClientStats>({
    total: 0,
    active: 0,
    leads: 0,
    newThisMonth: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      const supabase = createClientComponentClient()

      try {
        // Buscar contagem total de clientes
        const { count: total } = await supabase.from("clients").select("*", { count: "exact", head: true })

        // Buscar contagem de clientes ativos
        const { count: active } = await supabase
          .from("clients")
          .select("*", { count: "exact", head: true })
          .eq("status", "active")

        // Buscar contagem de leads
        const { count: leads } = await supabase
          .from("clients")
          .select("*", { count: "exact", head: true })
          .eq("status", "lead")

        // Buscar contagem de clientes novos este mês
        const firstDayOfMonth = new Date()
        firstDayOfMonth.setDate(1)
        firstDayOfMonth.setHours(0, 0, 0, 0)

        const { count: newThisMonth } = await supabase
          .from("clients")
          .select("*", { count: "exact", head: true })
          .gte("created_at", firstDayOfMonth.toISOString())

        setStats({
          total: total || 0,
          active: active || 0,
          leads: leads || 0,
          newThisMonth: newThisMonth || 0,
        })
      } catch (error) {
        console.error("Erro ao buscar estatísticas de clientes:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  return (
    <Card>
      <CardHeader className="bg-[#6b91c1]/10 flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Clientes</CardTitle>
        <Users className="h-4 w-4 text-[#6b91c1]" />
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
              <Link href="/admin/clientes" className="flex items-center text-xs text-[#6b91c1] hover:underline">
                Ver todos
                <ArrowUpRight className="ml-1 h-3 w-3" />
              </Link>
            </div>
            <p className="text-xs text-muted-foreground">{stats.active} clientes ativos</p>
            <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
              <div className="flex flex-col">
                <span className="text-muted-foreground">Leads</span>
                <span className="font-medium">{stats.leads}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-muted-foreground">Novos este mês</span>
                <span className="font-medium">{stats.newThisMonth}</span>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}
