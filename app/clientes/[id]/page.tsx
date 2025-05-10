import { PageHeader } from "@/components/layout/page-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Edit, Building2, Mail, Phone, MapPin } from "lucide-react"
import Link from "next/link"

// Dados de exemplo simplificados
const getClient = (id) => {
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
  }
}

export default function ClientDetailsPage({ params }) {
  const client = getClient(params.id)

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800"
      case "inactive":
        return "bg-gray-100 text-gray-800"
      case "lead":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusText = (status) => {
    switch (status) {
      case "active":
        return "Ativo"
      case "inactive":
        return "Inativo"
      case "lead":
        return "Lead"
      default:
        return status
    }
  }

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
          <Card>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg font-medium text-[#4b7bb5]">Detalhes do Cliente</CardTitle>
                <Badge className={getStatusColor(client.status)}>{getStatusText(client.status)}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Informações Básicas</h3>
                  <div className="space-y-2">
                    <div className="flex items-center text-sm">
                      <Building2 className="h-4 w-4 mr-2 text-gray-400" />
                      <span className="font-medium mr-2">Empresa:</span> {client.company}
                    </div>
                    <div className="flex items-center text-sm">
                      <Mail className="h-4 w-4 mr-2 text-gray-400" />
                      <span className="font-medium mr-2">Email:</span> {client.email}
                    </div>
                    <div className="flex items-center text-sm">
                      <Phone className="h-4 w-4 mr-2 text-gray-400" />
                      <span className="font-medium mr-2">Telefone:</span> {client.phone}
                    </div>
                    <div className="flex items-center text-sm">
                      <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                      <span className="font-medium mr-2">Endereço:</span> {client.address}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Interações e Projetos</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-500">
                Esta é uma versão simplificada. Em uma implementação completa, aqui seriam exibidas as interações com o
                cliente, projetos relacionados e notas.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
