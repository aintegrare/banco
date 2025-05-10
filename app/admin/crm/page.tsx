"use client"

import { useState, useEffect } from "react"
import { PageHeader } from "@/components/page-header"
import { CrmClientsList } from "@/components/crm/clients-list"
import { Button } from "@/components/ui/button"
import { ClientDialog } from "@/components/crm/client-dialog"
import { toast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Building2, Calendar, ChevronUp, Clock, DollarSign, Plus, Users } from "lucide-react"

type ClientStats = {
  totalClients: number
  activeClients: number
  leads: number
  opportunities: number
  totalValue: number
  recentInteractions: number
  recentNotes: number
}

export default function CrmPage() {
  const router = useRouter()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [stats, setStats] = useState<ClientStats>({
    totalClients: 0,
    activeClients: 0,
    leads: 0,
    opportunities: 0,
    totalValue: 0,
    recentInteractions: 0,
    recentNotes: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Em um cenário real, buscaríamos essas estatísticas da API
    // Por enquanto, vamos simular com dados estáticos
    const fetchStats = async () => {
      setLoading(true)
      try {
        // Em um cenário real, buscaríamos essas estatísticas da API
        // Por enquanto, deixamos os valores zerados
        await new Promise((resolve) => setTimeout(resolve, 800))

        // Mantemos os valores zerados definidos no useState
      } catch (error) {
        console.error("Erro ao buscar estatísticas:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  const handleSaveClient = async (clientData: any) => {
    try {
      const response = await fetch("/api/crm/clients", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(clientData),
      })

      if (!response.ok) {
        throw new Error("Erro ao criar cliente")
      }

      const savedClient = await response.json()

      toast({
        title: "Cliente criado",
        description: `Cliente ${savedClient.name} foi criado com sucesso.`,
      })

      router.refresh()
    } catch (error) {
      console.error("Error creating client:", error)
      toast({
        title: "Erro",
        description: "Não foi possível criar o cliente",
        variant: "destructive",
      })
      throw error
    }
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value)
  }

  return (
    <div className="flex flex-col h-full">
      <PageHeader
        title="CRM"
        description="Gerencie seus clientes, leads e oportunidades de negócio"
        actions={
          <Button className="bg-[#4b7bb5] hover:bg-[#3d649e]" onClick={() => setIsDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Novo Cliente
          </Button>
        }
      />

      <div className="p-4 space-y-6">
        {/* Dashboard Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-gradient-to-br from-[#4b7bb5] to-[#3d649e] text-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total de Clientes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold">
                  {loading ? <div className="h-8 w-16 bg-white/20 rounded animate-pulse"></div> : stats.totalClients}
                </div>
                <Users className="h-5 w-5 text-white/80" />
              </div>
              <p className="text-xs text-white/80 mt-2">
                <span className="flex items-center">
                  <ChevronUp className="h-3 w-3 mr-1" />
                  {loading ? (
                    <div className="h-3 w-12 bg-white/20 rounded animate-pulse"></div>
                  ) : (
                    "12% desde o mês passado"
                  )}
                </span>
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Valor Total</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold">
                  {loading ? (
                    <div className="h-8 w-24 bg-muted rounded animate-pulse"></div>
                  ) : (
                    formatCurrency(stats.totalValue)
                  )}
                </div>
                <DollarSign className="h-5 w-5 text-[#4b7bb5]" />
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                <span className="flex items-center">
                  <ChevronUp className="h-3 w-3 mr-1" />
                  {loading ? <div className="h-3 w-12 bg-muted rounded animate-pulse"></div> : "8% desde o mês passado"}
                </span>
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Leads Ativos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold">
                  {loading ? <div className="h-8 w-16 bg-muted rounded animate-pulse"></div> : stats.leads}
                </div>
                <Building2 className="h-5 w-5 text-[#4b7bb5]" />
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                <span className="flex items-center">
                  <ChevronUp className="h-3 w-3 mr-1" />
                  {loading ? <div className="h-3 w-12 bg-muted rounded animate-pulse"></div> : "5 novos este mês"}
                </span>
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Interações Recentes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold">
                  {loading ? <div className="h-8 w-16 bg-muted rounded animate-pulse"></div> : stats.recentInteractions}
                </div>
                <Calendar className="h-5 w-5 text-[#4b7bb5]" />
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                <span className="flex items-center">
                  <Clock className="h-3 w-3 mr-1" />
                  {loading ? <div className="h-3 w-20 bg-muted rounded animate-pulse"></div> : "Nos últimos 7 dias"}
                </span>
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs para diferentes visualizações */}
        <Tabs defaultValue="todos" className="w-full">
          <TabsList className="grid grid-cols-4 w-full max-w-md mb-4">
            <TabsTrigger value="todos">Todos</TabsTrigger>
            <TabsTrigger value="clientes">Clientes</TabsTrigger>
            <TabsTrigger value="leads">Leads</TabsTrigger>
            <TabsTrigger value="oportunidades">Oportunidades</TabsTrigger>
          </TabsList>

          <TabsContent value="todos" className="mt-0">
            <CrmClientsList />
          </TabsContent>

          <TabsContent value="clientes" className="mt-0">
            <CrmClientsList defaultFilter="cliente" />
          </TabsContent>

          <TabsContent value="leads" className="mt-0">
            <CrmClientsList defaultFilter="lead" />
          </TabsContent>

          <TabsContent value="oportunidades" className="mt-0">
            <CrmClientsList defaultFilter="oportunidade" />
          </TabsContent>
        </Tabs>
      </div>

      <ClientDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} onSave={handleSaveClient} />
    </div>
  )
}
