"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Pencil, Trash2, RefreshCw, Download, Eye, Upload } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useSearchParams, useRouter } from "next/navigation"
import { deleteContact, getContacts, exportContactsToCSV } from "@/app/actions"
import { ImportModal } from "@/components/import-modal"
import { Pagination } from "@/components/pagination"
import Link from "next/link"

export type Contact = {
  id: string
  name: string
  email: string
  phone: string
  cpf?: string
  city?: string
  category?: string
  business_category?: string
  temperature?: string
  client_value?: string
  contact_preference?: string
  lead_source?: string
  last_contact_date?: string
  discovery_date?: string
  notes?: string
  category_name?: string
  category_color?: string
  business_category_name?: string
  temperature_name?: string
  temperature_color?: string
  client_value_name?: string
  client_value_color?: string
  contact_preference_name?: string
  contact_preference_icon?: string
  lead_source_name?: string
}

export type PaginationInfo = {
  total: number
  page: number
  pageSize: number
  pageCount: number
}

export function ContactList() {
  const [contacts, setContacts] = useState<Contact[]>([])
  const [pagination, setPagination] = useState<PaginationInfo>({
    total: 0,
    page: 1,
    pageSize: 100,
    pageCount: 0,
  })
  const [loading, setLoading] = useState(true)
  const [exporting, setExporting] = useState(false)
  const [importModalOpen, setImportModalOpen] = useState(false)
  const { toast } = useToast()
  const searchParams = useSearchParams()
  const router = useRouter()
  const searchQuery = searchParams.get("q") || ""
  const categoryFilter = searchParams.get("categoria") || ""
  const currentPage = Number(searchParams.get("pagina") || "1")

  const fetchContacts = async (page: number = currentPage) => {
    setLoading(true)
    try {
      const data = await getContacts(searchQuery, categoryFilter, undefined, undefined, page, pagination.pageSize)

      setContacts(data.contacts)
      setPagination(data.pagination)
    } catch (error) {
      toast({
        title: "Erro ao carregar contatos",
        description: "Não foi possível carregar a lista de contatos.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchContacts()
  }, [searchQuery, categoryFilter, currentPage])

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams)
    params.set("pagina", page.toString())
    router.push(`/?${params.toString()}`)
  }

  const handleEdit = (contact: Contact) => {
    // Disparar um evento personalizado para editar o contato
    const event = new CustomEvent("edit-contact", { detail: contact })
    window.dispatchEvent(event)
  }

  const handleDelete = async (id: string) => {
    try {
      const result = await deleteContact(id)

      if (result.success) {
        // Atualizar a lista após exclusão
        fetchContacts()

        toast({
          title: "Contato excluído",
          description: "O contato foi removido com sucesso.",
        })
      } else {
        throw new Error("Falha ao excluir")
      }
    } catch (error) {
      toast({
        title: "Erro ao excluir",
        description: "Não foi possível excluir o contato.",
        variant: "destructive",
      })
    }
  }

  const handleExportCSV = async () => {
    setExporting(true)
    try {
      const result = await exportContactsToCSV()

      if (result.success && result.data) {
        // Criar um blob com os dados CSV
        const blob = new Blob([result.data], { type: "text/csv;charset=utf-8;" })

        // Criar um link para download
        const url = URL.createObjectURL(blob)
        const link = document.createElement("a")
        link.setAttribute("href", url)
        link.setAttribute("download", `contatos-${new Date().toISOString().split("T")[0]}.csv`)
        document.body.appendChild(link)

        // Simular clique para iniciar o download
        link.click()

        // Limpar
        document.body.removeChild(link)
        URL.revokeObjectURL(url)

        toast({
          title: "Exportação concluída",
          description: "Os contatos foram exportados com sucesso.",
        })
      } else {
        throw new Error((result.error as string) || "Falha na exportação")
      }
    } catch (error) {
      toast({
        title: "Erro na exportação",
        description: error instanceof Error ? error.message : "Não foi possível exportar os contatos.",
        variant: "destructive",
      })
    } finally {
      setExporting(false)
    }
  }

  return (
    <>
      <Card className="border-primary/20">
        <CardContent className="p-0">
          <div className="flex justify-between p-2 items-center bg-primary/5 border-b border-primary/10">
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setImportModalOpen(true)}
                className="border-primary/30 hover:bg-primary/10 hover:text-primary-700"
              >
                <Upload className="h-4 w-4 mr-2" />
                Importar
              </Button>
              {contacts.length > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleExportCSV}
                  disabled={exporting || contacts.length === 0}
                  className="border-primary/30 hover:bg-primary/10 hover:text-primary-700"
                >
                  <Download className="h-4 w-4 mr-2" />
                  {exporting ? "Exportando..." : "Exportar"}
                </Button>
              )}
            </div>
            <div className="flex items-center gap-2">
              {pagination.total > 0 && (
                <span className="text-sm text-muted-foreground">
                  {pagination.total} contato{pagination.total !== 1 ? "s" : ""}
                </span>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => fetchContacts(currentPage)}
                disabled={loading}
                className="hover:bg-primary/10 hover:text-primary-700"
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
                Atualizar
              </Button>
            </div>
          </div>

          {loading ? (
            <div className="p-6 text-center text-muted-foreground">Carregando contatos...</div>
          ) : contacts.length === 0 ? (
            <div className="p-6 text-center text-muted-foreground">
              {searchQuery || categoryFilter
                ? "Nenhum contato encontrado para esta pesquisa."
                : "Nenhum contato cadastrado. Adicione seu primeiro contato!"}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-primary/5 hover:bg-primary/10">
                    <TableHead className="text-primary-700">Nome</TableHead>
                    <TableHead className="text-primary-700">Email</TableHead>
                    <TableHead className="text-primary-700">Telefone</TableHead>
                    <TableHead className="text-primary-700">Categoria</TableHead>
                    <TableHead className="text-primary-700 w-[120px]">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {contacts.map((contact) => (
                    <TableRow key={contact.id} className="hover:bg-primary/5">
                      <TableCell className="font-medium">{contact.name}</TableCell>
                      <TableCell>{contact.email}</TableCell>
                      <TableCell>{contact.phone}</TableCell>
                      <TableCell>
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
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            asChild
                            className="hover:text-primary-700 hover:bg-primary/10"
                          >
                            <Link href={`/contato/${contact.id}`}>
                              <Eye className="h-4 w-4" />
                              <span className="sr-only">Detalhes</span>
                            </Link>
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEdit(contact)}
                            className="hover:text-primary-700 hover:bg-primary/10"
                          >
                            <Pencil className="h-4 w-4" />
                            <span className="sr-only">Editar</span>
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(contact.id)}
                            className="hover:text-destructive hover:bg-destructive/10"
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                            <span className="sr-only">Excluir</span>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {/* Componente de paginação */}
              <div className="p-4 border-t border-primary/10">
                <Pagination
                  currentPage={pagination.page}
                  totalPages={pagination.pageCount}
                  onPageChange={handlePageChange}
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <ImportModal open={importModalOpen} onOpenChange={setImportModalOpen} onSuccess={() => fetchContacts(1)} />
    </>
  )
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
