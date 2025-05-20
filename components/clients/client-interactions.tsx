"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PlusCircle, Phone, Mail, Calendar, MessageSquare, User } from "lucide-react"
import { formatDate } from "@/lib/utils"

// Dados de exemplo - seriam substituídos por dados reais da API
const mockInteractions = [
  {
    id: "1",
    type: "call",
    date: "2023-05-15T14:30:00",
    description: "Ligação para discutir renovação de contrato",
    user: "Ana Oliveira",
    outcome: "positive",
  },
  {
    id: "2",
    type: "email",
    date: "2023-05-10T09:15:00",
    description: "Email sobre nova proposta de serviços",
    user: "Carlos Santos",
    outcome: "neutral",
  },
  {
    id: "3",
    type: "meeting",
    date: "2023-04-28T10:00:00",
    description: "Reunião presencial para apresentação de resultados",
    user: "Ana Oliveira",
    outcome: "positive",
  },
  {
    id: "4",
    type: "note",
    date: "2023-04-20T16:45:00",
    description: "Cliente mencionou interesse em expandir para novas áreas",
    user: "Carlos Santos",
    outcome: "neutral",
  },
]

interface ClientInteractionsProps {
  clientId: string
}

export function ClientInteractions({ clientId }: ClientInteractionsProps) {
  const [interactions, setInteractions] = useState(mockInteractions)

  const handleAddInteraction = (data: any) => {
    const newInteraction = {
      id: Date.now().toString(),
      ...data,
      date: new Date().toISOString(),
      user: "Usuário Atual",
    }

    setInteractions([newInteraction, ...interactions])
  }

  const getInteractionIcon = (type: string) => {
    switch (type) {
      case "call":
        return <Phone className="h-4 w-4" />
      case "email":
        return <Mail className="h-4 w-4" />
      case "meeting":
        return <Calendar className="h-4 w-4" />
      case "note":
        return <MessageSquare className="h-4 w-4" />
      default:
        return <MessageSquare className="h-4 w-4" />
    }
  }

  const getInteractionTitle = (type: string) => {
    switch (type) {
      case "call":
        return "Ligação"
      case "email":
        return "Email"
      case "meeting":
        return "Reunião"
      case "note":
        return "Nota"
      default:
        return type
    }
  }

  const getOutcomeColor = (outcome: string) => {
    switch (outcome) {
      case "positive":
        return "text-green-600"
      case "negative":
        return "text-red-600"
      case "neutral":
      default:
        return "text-gray-600"
    }
  }

  const getOutcomeText = (outcome: string) => {
    switch (outcome) {
      case "positive":
        return "Positivo"
      case "negative":
        return "Negativo"
      case "neutral":
      default:
        return "Neutro"
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">Histórico de Interações</h3>

        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-[#4b7bb5] hover:bg-[#3d649e]">
              <PlusCircle className="mr-2 h-4 w-4" />
              Nova Interação
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Adicionar Nova Interação</DialogTitle>
            </DialogHeader>

            <form
              onSubmit={(e) => {
                e.preventDefault()
                const formData = new FormData(e.currentTarget)
                const data = {
                  type: formData.get("type") as string,
                  description: formData.get("description") as string,
                  outcome: formData.get("outcome") as string,
                }
                handleAddInteraction(data)
                e.currentTarget.reset()
                document.querySelector("[data-dialog-close]")?.click()
              }}
            >
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <label htmlFor="type" className="text-sm font-medium">
                    Tipo de Interação
                  </label>
                  <Select name="type" defaultValue="note">
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="call">Ligação</SelectItem>
                      <SelectItem value="email">Email</SelectItem>
                      <SelectItem value="meeting">Reunião</SelectItem>
                      <SelectItem value="note">Nota</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-2">
                  <label htmlFor="description" className="text-sm font-medium">
                    Descrição
                  </label>
                  <Textarea
                    name="description"
                    placeholder="Descreva a interação..."
                    className="min-h-[100px]"
                    required
                  />
                </div>

                <div className="grid gap-2">
                  <label htmlFor="outcome" className="text-sm font-medium">
                    Resultado
                  </label>
                  <Select name="outcome" defaultValue="neutral">
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o resultado" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="positive">Positivo</SelectItem>
                      <SelectItem value="neutral">Neutro</SelectItem>
                      <SelectItem value="negative">Negativo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <DialogFooter>
                <DialogClose asChild>
                  <Button type="button" variant="outline">
                    Cancelar
                  </Button>
                </DialogClose>
                <Button type="submit" className="bg-[#4b7bb5] hover:bg-[#3d649e]">
                  Salvar
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-4">
        {interactions.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center text-gray-500">Nenhuma interação registrada.</CardContent>
          </Card>
        ) : (
          interactions.map((interaction) => (
            <Card key={interaction.id} className="overflow-hidden">
              <CardContent className="p-0">
                <div className="flex border-l-4 border-[#4b7bb5]">
                  <div className="p-4 bg-[#4b7bb5]/5 flex items-center justify-center">
                    <div className="h-10 w-10 rounded-full bg-[#4b7bb5]/10 flex items-center justify-center text-[#4b7bb5]">
                      {getInteractionIcon(interaction.type)}
                    </div>
                  </div>

                  <div className="flex-1 p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-medium text-[#3d649e]">{getInteractionTitle(interaction.type)}</h4>
                        <div className="text-sm text-gray-500 flex items-center">
                          <Calendar className="h-3.5 w-3.5 mr-1" />
                          {interaction.date ? formatDate(interaction.date, true) : "N/A"}
                        </div>
                      </div>
                      <div className={`text-sm font-medium ${getOutcomeColor(interaction.outcome)}`}>
                        {getOutcomeText(interaction.outcome)}
                      </div>
                    </div>

                    <p className="text-gray-700 mb-2">{interaction.description}</p>

                    <div className="text-sm text-gray-500 flex items-center">
                      <User className="h-3.5 w-3.5 mr-1" />
                      {interaction.user}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
