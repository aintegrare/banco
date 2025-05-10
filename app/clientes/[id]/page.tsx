import { PageHeader } from "@/components/layout/page-header"
import { ClientDetails } from "@/components/clients/client-details"
import { ClientInteractions } from "@/components/clients/client-interactions"
import { ClientProjects } from "@/components/clients/client-projects"
import { ClientNotes } from "@/components/clients/client-notes"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Edit, ArrowLeft } from "lucide-react"
import Link from "next/link"

// Em produção, isso seria uma chamada real à API
const getClient = async (id: string) => {
  // Simulando dados para demonstração
  return {
    id,
    name: "João Silva",
    company: "Tech Solutions",
    email: "joao@techsolutions.com",
    phone: "(11) 98765-4321",
    address: "Av. Paulista, 1000, São Paulo, SP",
    status: "active",
    segment: "SaaS",
    value: 15000,
    lastContact: "2023-05-01",
    projectsCount: 3,
    website: "www.techsolutions.com",
    cnpj: "12.345.678/0001-90",
    contactName: "João Silva",
    contactPosition: "CEO",
    createdAt: "2023-01-15",
    notes: "Cliente desde janeiro de 2023. Interessado em expandir serviços.",
  }
}

export default async function ClientDetailsPage({ params }: { params: { id: string } }) {
  const client = await getClient(params.id)

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-2">
        <Link href="/clientes" className="text-[#4b7bb5] hover:text-[#3d649e] flex items-center">
          <ArrowLeft className="mr-1 h-4 w-4" />
          Voltar para lista de clientes
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
        <PageHeader title={client.name} description={client.company} />
        <Link href={`/clientes/${client.id}/editar`}>
          <Button className="bg-[#4b7bb5] hover:bg-[#3d649e]">
            <Edit className="mr-2 h-4 w-4" />
            Editar Cliente
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <ClientDetails client={client} />
        </div>

        <div className="lg:col-span-2">
          <Tabs defaultValue="interactions" className="w-full">
            <TabsList className="w-full justify-start">
              <TabsTrigger value="interactions">Interações</TabsTrigger>
              <TabsTrigger value="projects">Projetos</TabsTrigger>
              <TabsTrigger value="notes">Notas</TabsTrigger>
            </TabsList>

            <TabsContent value="interactions" className="mt-6">
              <ClientInteractions clientId={client.id} />
            </TabsContent>

            <TabsContent value="projects" className="mt-6">
              <ClientProjects clientId={client.id} />
            </TabsContent>

            <TabsContent value="notes" className="mt-6">
              <ClientNotes clientId={client.id} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
