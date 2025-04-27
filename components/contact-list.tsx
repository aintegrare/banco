"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Pencil, Trash2, RefreshCw } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useSearchParams } from "next/navigation"
import { deleteContact, getContacts } from "@/app/actions"

export type Contact = {
  id: string
  name: string
  email: string
  phone: string
}

export function ContactList() {
  const [contacts, setContacts] = useState<Contact[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()
  const searchParams = useSearchParams()
  const searchQuery = searchParams.get("q") || ""

  const fetchContacts = async () => {
    setLoading(true)
    try {
      const data = await getContacts(searchQuery)
      setContacts(data)
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
  }, [searchQuery])

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

  return (
    <Card>
      <CardContent className="p-0">
        <div className="flex justify-end p-2">
          <Button variant="ghost" size="sm" onClick={fetchContacts} disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
            Atualizar
          </Button>
        </div>

        {loading ? (
          <div className="p-6 text-center text-muted-foreground">Carregando contatos...</div>
        ) : contacts.length === 0 ? (
          <div className="p-6 text-center text-muted-foreground">
            {searchQuery
              ? "Nenhum contato encontrado para esta pesquisa."
              : "Nenhum contato cadastrado. Adicione seu primeiro contato!"}
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Telefone</TableHead>
                <TableHead className="w-[100px]">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {contacts.map((contact) => (
                <TableRow key={contact.id}>
                  <TableCell className="font-medium">{contact.name}</TableCell>
                  <TableCell>{contact.email}</TableCell>
                  <TableCell>{contact.phone}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(contact)}>
                        <Pencil className="h-4 w-4" />
                        <span className="sr-only">Editar</span>
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(contact.id)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                        <span className="sr-only">Excluir</span>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  )
}
