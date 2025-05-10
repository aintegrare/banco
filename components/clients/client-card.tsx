import Link from "next/link"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Building2, Calendar, Phone, Mail, MapPin } from "lucide-react"

export function ClientCard({ client }) {
  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 hover:bg-green-200"
      case "inactive":
        return "bg-gray-100 text-gray-800 hover:bg-gray-200"
      case "lead":
        return "bg-blue-100 text-blue-800 hover:bg-blue-200"
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-200"
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

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value || 0)
  }

  const formatDate = (dateString) => {
    if (!dateString) return "N/A"
    try {
      const date = new Date(dateString)
      return new Intl.DateTimeFormat("pt-BR").format(date)
    } catch (e) {
      return "Data inválida"
    }
  }

  return (
    <Link href={`/clientes/${client.id}`}>
      <Card className="h-full hover:shadow-md transition-shadow cursor-pointer border-gray-200">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-semibold text-lg text-[#3d649e]">{client.name}</h3>
              <div className="flex items-center text-gray-500 text-sm">
                <Building2 className="h-3.5 w-3.5 mr-1" />
                {client.company}
              </div>
            </div>
            <Badge className={getStatusColor(client.status)}>{getStatusText(client.status)}</Badge>
          </div>
        </CardHeader>
        <CardContent className="pb-2">
          <div className="space-y-2 text-sm">
            <div className="flex items-center text-gray-600">
              <Mail className="h-3.5 w-3.5 mr-2" />
              {client.email}
            </div>
            <div className="flex items-center text-gray-600">
              <Phone className="h-3.5 w-3.5 mr-2" />
              {client.phone}
            </div>
            <div className="flex items-center text-gray-600">
              <MapPin className="h-3.5 w-3.5 mr-2" />
              {client.address}
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between border-t pt-4 text-xs text-gray-500">
          <div className="flex items-center">
            <Calendar className="h-3.5 w-3.5 mr-1" />
            Último contato: {formatDate(client.lastContact)}
          </div>
          <div>
            <span className="font-medium text-[#4b7bb5]">{formatCurrency(client.value)}</span>
          </div>
        </CardFooter>
      </Card>
    </Link>
  )
}
