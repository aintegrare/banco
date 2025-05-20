import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Building2, Mail, Phone, MapPin, Globe, FileText, User, Briefcase, Calendar, BarChart3 } from "lucide-react"
import { formatCurrency, formatDate } from "@/lib/utils"

interface ClientDetailsProps {
  client: {
    id: string
    name: string
    company: string
    email: string
    phone: string
    address: string
    status: string
    segment: string
    value?: number
    lastContact?: string
    website?: string
    cnpj?: string
    contactName?: string
    contactPosition?: string
    createdAt?: string
    notes?: string
  }
}

export function ClientDetails({ client }: ClientDetailsProps) {
  const getStatusColor = (status: string) => {
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

  const getStatusText = (status: string) => {
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
              {client.website && (
                <div className="flex items-center text-sm">
                  <Globe className="h-4 w-4 mr-2 text-gray-400" />
                  <span className="font-medium mr-2">Website:</span> {client.website}
                </div>
              )}
              {client.cnpj && (
                <div className="flex items-center text-sm">
                  <FileText className="h-4 w-4 mr-2 text-gray-400" />
                  <span className="font-medium mr-2">CNPJ:</span> {client.cnpj}
                </div>
              )}
            </div>
          </div>

          <div className="border-t pt-4">
            <h3 className="text-sm font-medium text-gray-500 mb-1">Contato Principal</h3>
            <div className="space-y-2">
              <div className="flex items-center text-sm">
                <User className="h-4 w-4 mr-2 text-gray-400" />
                <span className="font-medium mr-2">Nome:</span> {client.contactName || client.name}
              </div>
              {client.contactPosition && (
                <div className="flex items-center text-sm">
                  <Briefcase className="h-4 w-4 mr-2 text-gray-400" />
                  <span className="font-medium mr-2">Cargo:</span> {client.contactPosition}
                </div>
              )}
            </div>
          </div>

          <div className="border-t pt-4">
            <h3 className="text-sm font-medium text-gray-500 mb-1">Informações Adicionais</h3>
            <div className="space-y-2">
              <div className="flex items-center text-sm">
                <BarChart3 className="h-4 w-4 mr-2 text-gray-400" />
                <span className="font-medium mr-2">Segmento:</span> {client.segment}
              </div>
              <div className="flex items-center text-sm">
                <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                <span className="font-medium mr-2">Cliente desde:</span>{" "}
                {client.createdAt ? formatDate(client.createdAt) : "N/A"}
              </div>
              <div className="flex items-center text-sm">
                <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                <span className="font-medium mr-2">Último contato:</span>{" "}
                {client.lastContact ? formatDate(client.lastContact) : "N/A"}
              </div>
              <div className="flex items-center text-sm font-medium">
                <span className="mr-2">Valor total:</span>
                <span className="text-[#4b7bb5]">{formatCurrency(client.value || 0)}</span>
              </div>
            </div>
          </div>

          {client.notes && (
            <div className="border-t pt-4">
              <h3 className="text-sm font-medium text-gray-500 mb-1">Observações</h3>
              <p className="text-sm text-gray-600">{client.notes}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
