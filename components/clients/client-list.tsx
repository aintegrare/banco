"use client"

import { useState, useEffect } from "react"
import { ClientCard } from "./client-card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

// Dados de exemplo - seriam substituídos por dados reais da API
const mockClients = [
  {
    id: "1",
    name: "João Silva",
    company: "Tech Solutions",
    email: "joao@techsolutions.com",
    phone: "(11) 98765-4321",
    address: "São Paulo, SP",
    status: "active",
    segment: "SaaS",
    value: 15000,
    lastContact: "2023-05-01",
    projectsCount: 3,
  },
  {
    id: "2",
    name: "Maria Oliveira",
    company: "Moda Express",
    email: "maria@modaexpress.com",
    phone: "(11) 91234-5678",
    address: "São Paulo, SP",
    status: "active",
    segment: "E-commerce",
    value: 8500,
    lastContact: "2023-05-10",
    projectsCount: 1,
  },
  {
    id: "3",
    name: "Carlos Mendes",
    company: "Saúde Total",
    email: "carlos@saudetotal.com",
    phone: "(21) 99876-5432",
    address: "Rio de Janeiro, RJ",
    status: "inactive",
    segment: "Saúde",
    value: 12000,
    lastContact: "2023-04-15",
    projectsCount: 2,
  },
  {
    id: "4",
    name: "Ana Souza",
    company: "Edu Plus",
    email: "ana@eduplus.com",
    phone: "(31) 98765-1234",
    address: "Belo Horizonte, MG",
    status: "lead",
    segment: "Educação",
    value: 0,
    lastContact: "2023-05-18",
    projectsCount: 0,
  },
  {
    id: "5",
    name: "Roberto Almeida",
    company: "Varejo Moderno",
    email: "roberto@varejomoderno.com",
    phone: "(11) 97654-3210",
    address: "Campinas, SP",
    status: "active",
    segment: "Varejo",
    value: 20000,
    lastContact: "2023-05-05",
    projectsCount: 2,
  },
  {
    id: "6",
    name: "Fernanda Lima",
    company: "Digital Marketing",
    email: "fernanda@digitalmarketing.com",
    phone: "(11) 91234-8765",
    address: "São Paulo, SP",
    status: "lead",
    segment: "Marketing",
    value: 0,
    lastContact: "2023-05-20",
    projectsCount: 0,
  },
] as const

export function ClientList() {
  const [clients, setClients] = useState<typeof mockClients>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Simulando uma chamada de API
    const fetchClients = async () => {
      try {
        // Em produção, isso seria uma chamada real à API
        // const response = await fetch('/api/clients')
        // const data = await response.json()

        // Simulando um pequeno atraso
        await new Promise((resolve) => setTimeout(resolve, 800))

        setClients(mockClients)
        setLoading(false)
      } catch (err) {
        setError("Erro ao carregar clientes. Tente novamente mais tarde.")
        setLoading(false)
      }
    }

    fetchClients()
  }, [])

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array(6)
          .fill(0)
          .map((_, i) => (
            <div key={i} className="h-[220px] bg-gray-100 animate-pulse rounded-lg"></div>
          ))}
      </div>
    )
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )
  }

  return (
    <div>
      <Tabs defaultValue="all" className="mb-6">
        <TabsList>
          <TabsTrigger value="all">Todos</TabsTrigger>
          <TabsTrigger value="active">Ativos</TabsTrigger>
          <TabsTrigger value="lead">Leads</TabsTrigger>
          <TabsTrigger value="inactive">Inativos</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {clients.map((client) => (
              <ClientCard key={client.id} client={client} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="active" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {clients
              .filter((client) => client.status === "active")
              .map((client) => (
                <ClientCard key={client.id} client={client} />
              ))}
          </div>
        </TabsContent>

        <TabsContent value="lead" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {clients
              .filter((client) => client.status === "lead")
              .map((client) => (
                <ClientCard key={client.id} client={client} />
              ))}
          </div>
        </TabsContent>

        <TabsContent value="inactive" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {clients
              .filter((client) => client.status === "inactive")
              .map((client) => (
                <ClientCard key={client.id} client={client} />
              ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
