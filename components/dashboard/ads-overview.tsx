"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, ArrowUpRight } from "lucide-react"
import Link from "next/link"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

type AdStats = {
  total: number
  active: number
  totalBudget: number
}

export function AdsOverview() {
  const [stats, setStats] = useState<AdStats>({
    total: 0,
    active: 0,
    totalBudget: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      const supabase = createClientComponentClient()

      try {
        // Buscar contagem total de anúncios
        const { count: total } = await supabase.from("ads").select("*", { count: "exact", head: true })

        // Buscar contagem de anúncios ativos
        const { count: active } = await supabase
          .from("ads")
          .select("*", { count: "exact", head: true })
          .eq("status", "active")

        // Buscar orçamento total
        const { data: budgetData } = await supabase.from("ads").select("budget")

        const totalBudget = budgetData?.reduce((sum, ad) => sum + (Number.parseFloat(ad.budget) || 0), 0) || 0

        setStats({
          total: total || 0,
          active: active || 0,
          totalBudget,
        })
      } catch (error) {
        console.error("Erro ao buscar estatísticas de anúncios:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  return (
    <Card>
      <CardHeader className="bg-[#4072b0]/10 flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Campanhas</CardTitle>
        <TrendingUp className="h-4 w-4 text-[#4072b0]" />
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
              <Link href="/admin/campanhas" className="flex items-center text-xs text-[#4072b0] hover:underline">
                Ver todas
                <ArrowUpRight className="ml-1 h-3 w-3" />
              </Link>
            </div>
            <p className="text-xs text-muted-foreground">{stats.active} campanhas ativas</p>
            <div className="mt-4">
              <div className="flex flex-col">
                <span className="text-xs text-muted-foreground">Orçamento total</span>
                <span className="text-sm font-medium">
                  {new Intl.NumberFormat("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  }).format(stats.totalBudget)}
                </span>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}
