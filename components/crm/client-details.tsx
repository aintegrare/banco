"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Building2, Globe, Mail, MapPin, Phone, User } from "lucide-react"
import { ClientDialog } from "./client-dialog"
import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useRouter } from "next/navigation"
import { toast } from "@/components/ui/use-toast"

interface ClientDetailsProps {
  clientId: number
}

type Client = {
  id: number
  name: string
  company: string
  email: string
  phone: string
  address: string
  website?: string
  cnpj?: string
  contact_name?: string
  contact_position?: string
  segment: string
  status: string
  value: number
  last_contact?: string
  notes?: string
  created_at: string
  updated_at: string
}

const statusColorMap: Record<string, string> = {
  lead: "bg-yellow-500",
  oportunidade: "bg-blue-500",
  cliente: "bg-green-500",
  inativo: "bg-gray-500",
  perdido: "bg-red-500",
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value)
}

const formatDate = (dateString: string) => {
  if (!dateString) return ""
  const date = new Date(dateString)
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date)
}

export function ClientDetails({ clientId }: ClientDetailsProps) {
  const router = useRouter()
  const [client, setClient] = useState<Client | null>(null)
  const [loading, setLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  useEffect(() => {
    fetchClient()
  }, [clientId])

  const fetchClient = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/crm/clients/${clientId}`)

      if (!response.ok) {
        throw new Error("Erro ao buscar cliente")
      }

      const data = await response.json()
      setClient(data)
    } catch (error) {
      console.error("Error fetching client:", error)
      toast({
        title: "Erro",
        description: "Não foi possível carregar os dados do cliente",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleEditClient = () => {
    setIsDialogOpen(true)
  }

  const handleSaveClient = async (clientData: Partial<Client>) => {
    try {
      const response = await fetch(`/api/crm/clients/${clientId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(clientData),
      })

      if (!response.ok) {
        throw new Error("Erro ao atualizar cliente")
      }

      const updatedClient = await response.json()
      setClient(updatedClient)

      toast({
        title: "Cliente atualizado",
        description: `As informações do cliente foram atualizadas com sucesso.`,
      })
    } catch (error) {
      console.error("Error updating client:", error)
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o cliente",
        variant: "destructive",
      })
      throw error
    }
  }

  const handleDeleteClient = async () => {
    try {
      const response = await fetch(`/api/crm/clients/${clientId}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Erro ao excluir cliente")
      }

      toast({
        title: "Cliente excluído",
        description: "Cliente foi excluído com sucesso.",
      })

      router.push("/admin/crm")
    } catch (error) {
      console.error("Error deleting client:", error)
      toast({
        title: "Erro",
        description: "Não foi possível excluir o cliente",
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return (
      <Card>
        <CardHeader className="animate-pulse">
          <div className="h-7 bg-muted rounded-md w-1/3 mb-2"></div>
          <div className="h-5 bg-muted rounded-md w-1/2"></div>
        </CardHeader>
        <CardContent className="animate-pulse">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="space-y-4">
                <div className="h-6 bg-muted rounded-md w-2/3"></div>
                <div className="space-y-2">
                  {Array.from({ length: 4 }).map((_, idx) => (
                    <div key={idx} className="h-5 bg-muted rounded-md w-full"></div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!client) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Cliente não encontrado</CardTitle>
          <CardDescription>Não foi possível encontrar os dados deste cliente.</CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="outline" onClick={() => router.push("/admin/crm")}>
            Voltar para lista de clientes
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-start justify-between">
          <div>
            <CardTitle className="text-2xl">{client.name}</CardTitle>
            <CardDescription className="text-lg mt-1">{client.company}</CardDescription>
          </div>
          <Badge variant="secondary" className={`${statusColorMap[client.status]} text-white`}>
            {client.status.charAt(0).toUpperCase() + client.status.slice(1)}
          </Badge>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Informações de Contato</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="h-4 w-4 text-[#4b7bb5]" />
                  <span>{client.email}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4 text-[#4b7bb5]" />
                  <span>{client.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-[#4b7bb5]" />
                  <span>{client.address}</span>
                </div>
                {client.website && (
                  <div className="flex items-center gap-2 text-sm">
                    <Globe className="h-4 w-4 text-[#4b7bb5]" />
                    <a
                      href={client.website.startsWith("http") ? client.website : `https://${client.website}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#4b7bb5] hover:underline"
                    >
                      {client.website}
                    </a>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Informações Empresariais</h3>
              <div className="space-y-2">
                {client.cnpj && (
                  <div className="flex items-center gap-2 text-sm">
                    <Building2 className="h-4 w-4 text-[#4b7bb5]" />
                    <span>CNPJ: {client.cnpj}</span>
                  </div>
                )}
                {client.contact_name && (
                  <div className="flex items-center gap-2 text-sm">
                    <User className="h-4 w-4 text-[#4b7bb5]" />
                    <span>
                      Contato: {client.contact_name}
                      {client.contact_position && ` (${client.contact_position})`}
                    </span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-sm">
                  <span className="font-semibold">Segmento:</span>
                  <span>{client.segment.charAt(0).toUpperCase() + client.segment.slice(1)}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span className="font-semibold">Valor:</span>
                  <span>{formatCurrency(client.value)}</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Datas</h3>
              <div className="space-y-2">
                {client.last_contact && (
                  <div className="flex items-center gap-2 text-sm">
                    <span className="font-semibold">Último contato:</span>
                    <span>{formatDate(client.last_contact)}</span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-sm">
                  <span className="font-semibold">Criado em:</span>
                  <span>{formatDate(client.created_at)}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span className="font-semibold">Atualizado em:</span>
                  <span>{formatDate(client.updated_at)}</span>
                </div>
              </div>
            </div>
          </div>

          {client.notes && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-2">Observações</h3>
              <p className="text-sm whitespace-pre-wrap">{client.notes}</p>
            </div>
          )}

          <div className="mt-6 flex gap-2 justify-end">
            <Button variant="outline" onClick={handleEditClient}>
              Editar Cliente
            </Button>
            <Button variant="destructive" onClick={() => setIsDeleteDialogOpen(true)}>
              Excluir Cliente
            </Button>
          </div>
        </CardContent>
      </Card>

      {client && (
        <ClientDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} client={client} onSave={handleSaveClient} />
      )}

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir Cliente</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este cliente? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteClient} className="bg-red-600 hover:bg-red-700 focus:ring-red-600">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
