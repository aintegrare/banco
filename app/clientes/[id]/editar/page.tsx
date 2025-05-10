import { PageHeader } from "@/components/layout/page-header"
import { ClientForm } from "@/components/clients/client-form"
import { ArrowLeft } from "lucide-react"
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
    segment: "saas",
    website: "www.techsolutions.com",
    cnpj: "12.345.678/0001-90",
    contactName: "João Silva",
    contactPosition: "CEO",
    notes: "Cliente desde janeiro de 2023. Interessado em expandir serviços.",
  }
}

export default async function EditClientPage({ params }: { params: { id: string } }) {
  const client = await getClient(params.id)

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-2">
        <Link href={`/clientes/${params.id}`} className="text-[#4b7bb5] hover:text-[#3d649e] flex items-center">
          <ArrowLeft className="mr-1 h-4 w-4" />
          Voltar para detalhes do cliente
        </Link>
      </div>

      <PageHeader title={`Editar Cliente: ${client.name}`} description="Atualize as informações do cliente" />

      <div className="mt-6">
        <ClientForm initialData={client} clientId={params.id} />
      </div>
    </div>
  )
}
