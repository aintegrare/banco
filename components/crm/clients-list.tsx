"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ClientDialog } from "./client-dialog"
import {
  AlertCircle,
  ArrowUpDown,
  Building2,
  Calendar,
  Clock,
  DollarSign,
  Filter,
  Mail,
  MoreHorizontal,
  Phone,
  Plus,
  Search,
  User,
  Trash,
} from "lucide-react"
import { useRouter } from "next/navigation"
import { toast } from "@/components/ui/use-toast"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
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

type Client = {
  id: number
  name: string
  company: string
  email: string
  phone: string
  segment: string
  status: string
  value: number
  address: string
  website?: string
  cnpj?: string
  contact_name?: string
  contact_position?: string
  notes?: string
  last_contact?: string
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

const segmentIcons: Record<string, React.ReactNode> = {
  tecnologia: <Building2 className="h-4 w-4" />,
  marketing: <Building2 className="h-4 w-4" />,
  "e-commerce": <Building2 className="h-4 w-4" />,
  saude: <Building2 className="h-4 w-4" />,
  educacao: <Building2 className="h-4 w-4" />,
  financeiro: <Building2 className="h-4 w-4" />,
  other: <Building2 className="h-4 w-4" />,
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value)
}

interface CrmClientsListProps {
  defaultFilter?: string
}

export function CrmClientsList({ defaultFilter = "todos" }: CrmClientsListProps) {
  const router = useRouter()
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState(defaultFilter)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedClient, setSelectedClient] = useState<Client | undefined>(undefined)
  const [sortField, setSortField] = useState<string>("name")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false)
  const [segmentFilter, setSegmentFilter] = useState("todos")
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [clientToDelete, setClientToDelete] = useState<number | null>(null)
  const [deleteLoading, setDeleteLoading] = useState(false)

  useEffect(() => {
    fetchClients()
  }, [])

  useEffect(() => {
    // Atualiza o filtro quando o defaultFilter muda
    setStatusFilter(defaultFilter)
  }, [defaultFilter])

  const fetchClients = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/crm/clients")

      if (!response.ok) {
        throw new Error("Erro ao buscar clientes")
      }

      const data = await response.json()
      setClients(data)
    } catch (error) {
      console.error("Error fetching clients:", error)
      toast({
        title: "Erro",
        description: "Não foi possível carregar os clientes",
        variant: "destructive",
      })
      // Definir uma lista vazia para evitar erros
      setClients([])
    } finally {
      setLoading(false)
    }
  }

  const handleCreateClient = () => {
    setSelectedClient(undefined)
    setIsDialogOpen(true)
  }

  const handleEditClient = (client: Client) => {
    setSelectedClient({ ...client })
    setIsDialogOpen(true)
  }

  const handleSaveClient = async (clientData: Partial<Client>) => {
    try {
      let response

      if (clientData.id) {
        // Update existing client
        response = await fetch(`/api/crm/clients/${clientData.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(clientData),
        })
      } else {
        // Create new client
        response = await fetch("/api/crm/clients", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(clientData),
        })
      }

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Erro ao salvar cliente")
      }

      const savedClient = await response.json()

      toast({
        title: clientData.id ? "Cliente atualizado" : "Cliente criado",
        description: `Cliente ${savedClient.name} foi ${clientData.id ? "atualizado" : "criado"} com sucesso.`,
      })

      // Atualizar a lista de clientes
      await fetchClients()
    } catch (error: any) {
      console.error("Error saving client:", error)
      toast({
        title: "Erro",
        description: error.message || "Não foi possível salvar o cliente",
        variant: "destructive",
      })
      throw error
    }
  }

  const confirmDeleteClient = (clientId: number) => {
    setClientToDelete(clientId)
    setIsDeleteDialogOpen(true)
  }

  const handleDeleteClient = async () => {
    if (!clientToDelete) return

    try {
      setDeleteLoading(true)

      // Abordagem mais robusta para exclusão
      const response = await fetch(`/api/crm/clients/${clientToDelete}`, {
        method: "DELETE",
      })

      // Verificar se a resposta é ok, independentemente do conteúdo
      if (!response.ok) {
        let errorMessage = "Erro ao excluir cliente"

        try {
          const errorData = await response.json()
          errorMessage = errorData.error || errorData.details || errorMessage
        } catch (e) {
          // Se não conseguir analisar o JSON, usa a mensagem padrão
          console.error("Error parsing error response:", e)
        }

        throw new Error(errorMessage)
      }

      toast({
        title: "Cliente excluído",
        description: "Cliente foi excluído com sucesso.",
      })

      // Atualizar a lista após exclusão bem-sucedida
      await fetchClients()
    } catch (error: any) {
      console.error("Error deleting client:", error)
      toast({
        title: "Erro ao excluir",
        description: error.message || "Não foi possível excluir o cliente",
        variant: "destructive",
      })
    } finally {
      setDeleteLoading(false)
      setIsDeleteDialogOpen(false)
      setClientToDelete(null)
    }
  }

  const handleViewClient = (clientId: number) => {
    router.push(`/admin/crm/${clientId}`)
  }

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  const sortedClients = [...clients].sort((a, b) => {
    let comparison = 0

    if (sortField === "name") {
      comparison = a.name.localeCompare(b.name)
    } else if (sortField === "company") {
      comparison = a.company.localeCompare(b.company)
    } else if (sortField === "value") {
      comparison = a.value - b.value
    } else if (sortField === "status") {
      comparison = (a.status || "").localeCompare(b.status || "")
    }

    return sortDirection === "asc" ? comparison : -comparison
  })

  const filteredClients = sortedClients.filter(
    (client) =>
      (client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        client.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
        client.email.toLowerCase().includes(searchQuery.toLowerCase())) &&
      (statusFilter === "todos" || client.status === statusFilter) &&
      (segmentFilter === "todos" || client.segment === segmentFilter),
  )

  const getInitials = (name: string) => {
    if (!name) return "??"
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .substring(0, 2)
  }

  // Função segura para capitalizar a primeira letra
  const capitalizeFirstLetter = (text?: string) => {
    if (!text) return ""
    return text.charAt(0).toUpperCase() + text.slice(1)
  }

  return (
    <>
      <Card className="w-full">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <CardTitle>
                {statusFilter === "todos" && "Todos os Clientes"}
                {statusFilter === "cliente" && "Clientes Ativos"}
                {statusFilter === "lead" && "Leads"}
                {statusFilter === "oportunidade" && "Oportunidades"}
                {statusFilter === "inativo" && "Clientes Inativos"}
                {statusFilter === "perdido" && "Clientes Perdidos"}
              </CardTitle>
              <CardDescription>
                {filteredClients.length} {filteredClients.length === 1 ? "registro" : "registros"} encontrados
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                className={showAdvancedFilters ? "bg-muted" : ""}
              >
                <Filter className="h-4 w-4" />
              </Button>
              <Button className="bg-[#4b7bb5] hover:bg-[#3d649e] sm:self-start" onClick={handleCreateClient}>
                <Plus className="h-4 w-4 mr-2" />
                Novo Cliente
              </Button>
            </div>
          </div>
          <div className="flex flex-col gap-4 mt-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Buscar por nome, empresa ou email..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {showAdvancedFilters && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos os status</SelectItem>
                    <SelectItem value="lead">Lead</SelectItem>
                    <SelectItem value="oportunidade">Oportunidade</SelectItem>
                    <SelectItem value="cliente">Cliente</SelectItem>
                    <SelectItem value="inativo">Inativo</SelectItem>
                    <SelectItem value="perdido">Perdido</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={segmentFilter} onValueChange={setSegmentFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Segmento" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos os segmentos</SelectItem>
                    <SelectItem value="tecnologia">Tecnologia</SelectItem>
                    <SelectItem value="marketing">Marketing</SelectItem>
                    <SelectItem value="e-commerce">E-commerce</SelectItem>
                    <SelectItem value="saude">Saúde</SelectItem>
                    <SelectItem value="educacao">Educação</SelectItem>
                    <SelectItem value="financeiro">Financeiro</SelectItem>
                    <SelectItem value="other">Outro</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[250px]">
                    <Button
                      variant="ghost"
                      className="p-0 font-medium flex items-center"
                      onClick={() => handleSort("name")}
                    >
                      Cliente / Empresa
                      <ArrowUpDown className={`ml-2 h-3 w-3 ${sortField === "name" ? "opacity-100" : "opacity-50"}`} />
                    </Button>
                  </TableHead>
                  <TableHead>Contato</TableHead>
                  <TableHead>Segmento</TableHead>
                  <TableHead>
                    <Button
                      variant="ghost"
                      className="p-0 font-medium flex items-center"
                      onClick={() => handleSort("status")}
                    >
                      Status
                      <ArrowUpDown
                        className={`ml-2 h-3 w-3 ${sortField === "status" ? "opacity-100" : "opacity-50"}`}
                      />
                    </Button>
                  </TableHead>
                  <TableHead className="text-right">
                    <Button
                      variant="ghost"
                      className="p-0 font-medium flex items-center ml-auto"
                      onClick={() => handleSort("value")}
                    >
                      Valor
                      <ArrowUpDown className={`ml-2 h-3 w-3 ${sortField === "value" ? "opacity-100" : "opacity-50"}`} />
                    </Button>
                  </TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  Array.from({ length: 5 }).map((_, index) => (
                    <TableRow key={`loading-${index}`}>
                      <TableCell colSpan={6} className="h-12 animate-pulse bg-muted/50"></TableCell>
                    </TableRow>
                  ))
                ) : filteredClients.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      Nenhum cliente encontrado
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredClients.map((client) => (
                    <TableRow
                      key={client.id}
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => handleViewClient(client.id)}
                    >
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-9 w-9 bg-[#4b7bb5] text-white">
                            <AvatarFallback>{getInitials(client.name)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{client.name}</div>
                            <div className="text-sm text-muted-foreground">{client.company}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div className="flex items-center gap-1">
                                <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                                <span className="text-sm truncate max-w-[120px]">{client.email}</span>
                              </div>
                            </TooltipTrigger>
                            <TooltipContent side="top">
                              <p>{client.email}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                        <div className="flex items-center gap-1 mt-1">
                          <Phone className="h-3.5 w-3.5 text-muted-foreground" />
                          <span className="text-sm">{client.phone}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1.5">
                          {segmentIcons[client.segment] || <Building2 className="h-4 w-4 text-[#4b7bb5]" />}
                          <span className="capitalize">{client.segment}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {client.status ? (
                          <Badge
                            variant="secondary"
                            className={`${statusColorMap[client.status] || "bg-gray-400"} text-white`}
                          >
                            {capitalizeFirstLetter(client.status)}
                          </Badge>
                        ) : (
                          <Badge variant="outline">Não definido</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right font-medium">{formatCurrency(client.value || 0)}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Ações</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={(e) => {
                                e.stopPropagation()
                                handleViewClient(client.id)
                              }}
                            >
                              <User className="h-4 w-4 mr-2" />
                              Ver detalhes
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={(e) => {
                                e.stopPropagation()
                                handleEditClient(client)
                              }}
                            >
                              <Calendar className="h-4 w-4 mr-2" />
                              Agendar interação
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={(e) => {
                                e.stopPropagation()
                                handleEditClient(client)
                              }}
                            >
                              <Clock className="h-4 w-4 mr-2" />
                              Registrar contato
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={(e) => {
                                e.stopPropagation()
                                handleEditClient(client)
                              }}
                            >
                              <DollarSign className="h-4 w-4 mr-2" />
                              Editar
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-red-600"
                              onClick={(e) => {
                                e.stopPropagation()
                                confirmDeleteClient(client.id)
                              }}
                            >
                              <Trash className="h-4 w-4 mr-2" />
                              Excluir
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <ClientDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        client={selectedClient}
        onSave={handleSaveClient}
      />

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-red-500" />
              Confirmar exclusão
            </AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este cliente? Esta ação não pode ser desfeita e todos os dados relacionados
              (interações, notas) também serão excluídos.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteLoading}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteClient}
              disabled={deleteLoading}
              className="bg-red-600 hover:bg-red-700"
            >
              {deleteLoading ? "Excluindo..." : "Excluir"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
