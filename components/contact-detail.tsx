import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Mail,
  Phone,
  Calendar,
  MapPin,
  User,
  Thermometer,
  DollarSign,
  MessageCircle,
  Globe,
  FileText,
} from "lucide-react"
import type { Contact } from "@/app/actions"

interface ContactDetailProps {
  contact: Contact & {
    category_name?: string
    category_color?: string
    created_at?: string
  }
}

export function ContactDetail({ contact }: ContactDetailProps) {
  return (
    <Card className="border-primary/20">
      <CardHeader className="bg-primary/5">
        <div className="flex items-center justify-between">
          <CardTitle className="text-2xl text-primary-700">{contact.name}</CardTitle>
          {contact.category_name && (
            <Badge
              style={{
                backgroundColor: contact.category_color || "#4b7bb5",
                color: isLightColor(contact.category_color || "#4b7bb5") ? "#000" : "#f2f1ef",
              }}
            >
              {contact.category_name}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4 pt-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center">
            <Mail className="h-4 w-4 mr-2 text-primary" />
            <a href={`mailto:${contact.email}`} className="text-primary hover:underline">
              {contact.email}
            </a>
          </div>

          <div className="flex items-center">
            <Phone className="h-4 w-4 mr-2 text-primary" />
            <a href={`tel:${contact.phone}`} className="text-primary hover:underline">
              {contact.phone}
            </a>
          </div>

          {contact.cpf && (
            <div className="flex items-center">
              <User className="h-4 w-4 mr-2 text-primary" />
              <span>{contact.cpf}</span>
            </div>
          )}

          {contact.city && (
            <div className="flex items-center">
              <MapPin className="h-4 w-4 mr-2 text-primary" />
              <span>{contact.city}</span>
            </div>
          )}

          {contact.business_category_name && (
            <div className="flex items-center">
              <Globe className="h-4 w-4 mr-2 text-primary" />
              <span>{contact.business_category_name}</span>
            </div>
          )}

          {contact.temperature_name && (
            <div className="flex items-center">
              <Thermometer className="h-4 w-4 mr-2 text-primary" />
              <Badge
                style={{
                  backgroundColor: contact.temperature_color || "#4b7bb5",
                  color: isLightColor(contact.temperature_color || "#4b7bb5") ? "#000" : "#f2f1ef",
                }}
              >
                {contact.temperature_name}
              </Badge>
            </div>
          )}

          {contact.client_value_name && (
            <div className="flex items-center">
              <DollarSign className="h-4 w-4 mr-2 text-primary" />
              <Badge
                style={{
                  backgroundColor: contact.client_value_color || "#4b7bb5",
                  color: isLightColor(contact.client_value_color || "#4b7bb5") ? "#000" : "#f2f1ef",
                }}
              >
                {contact.client_value_name}
              </Badge>
            </div>
          )}

          {contact.contact_preference_name && (
            <div className="flex items-center">
              <MessageCircle className="h-4 w-4 mr-2 text-primary" />
              <span>Prefere: {contact.contact_preference_name}</span>
            </div>
          )}

          {contact.lead_source_name && (
            <div className="flex items-center">
              <Globe className="h-4 w-4 mr-2 text-primary" />
              <span>Origem: {contact.lead_source_name}</span>
            </div>
          )}
        </div>

        {contact.notes && (
          <div className="mt-4 pt-4 border-t border-primary/10">
            <div className="flex items-start mb-2">
              <FileText className="h-4 w-4 mr-2 mt-1 text-primary" />
              <span className="font-medium text-primary-700">Observações:</span>
            </div>
            <p className="text-sm pl-6">{contact.notes}</p>
          </div>
        )}

        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mt-4 pt-4 border-t border-primary/10">
          {contact.last_contact_date && (
            <div className="flex items-center">
              <Calendar className="h-3 w-3 mr-2 text-primary" />
              <span>Último contato: {formatDate(contact.last_contact_date)}</span>
            </div>
          )}

          {contact.discovery_date && (
            <div className="flex items-center">
              <Calendar className="h-3 w-3 mr-2 text-primary" />
              <span>Descoberta: {formatDate(contact.discovery_date)}</span>
            </div>
          )}

          {contact.created_at && (
            <div className="flex items-center">
              <Calendar className="h-3 w-3 mr-2 text-primary" />
              <span>Adicionado em: {formatDate(contact.created_at)}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

// Função auxiliar para formatar data
function formatDate(dateString: string) {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date)
}

// Função auxiliar para determinar se uma cor é clara
function isLightColor(color: string) {
  // Converter hex para RGB
  const hex = color.replace("#", "")
  const r = Number.parseInt(hex.substr(0, 2), 16)
  const g = Number.parseInt(hex.substr(2, 2), 16)
  const b = Number.parseInt(hex.substr(4, 2), 16)

  // Calcular luminância
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255

  return luminance > 0.5
}
