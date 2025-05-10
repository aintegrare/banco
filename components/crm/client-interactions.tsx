"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CalendarX, MessageSquare, Phone, Send, VideoIcon } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface ClientInteractionsProps {
  clientId: number
}

type Interaction = {
  id: number
  client_id: number
  type: string
  description: string
  outcome: string
  user_id?: string
  user_name: string
  created_at: string
}

const typeIcons: Record<string, React.ReactNode> = {
  call: <Phone className="h-4 w-4" />,
  email: <MessageSquare className="h-4 w-4" />,
  meeting: <VideoIcon className="h-4 w-4" />,
  canceled: <CalendarX className="h-4 w-4" />,
}

const outcomeColorMap: Record<string, string> = {
  positive: "bg-green-500",
  neutral: "bg-blue-500",
  negative: "bg-red-500",
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date)
}

export function ClientInteractions({ clientId }: ClientInteractionsProps) {
  const [interactions, setInteractions] = useState<Interaction[]>([])
  const [loading, setLoading] = useState(true)
  const [interactionType, setInteractionType] = useState("call")
  const [outcome, setOutcome] = useState("neutral")
  const [description, setDescription] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [filter, setFilter] = useState("all")

  useEffect(() => {
    fetchInteractions()
  }, [clientId])

  const fetchInteractions = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/crm/clients/${clientId}/interactions`)

      if (!response.ok) {
        throw new Error("Erro ao buscar interações")
      }

      const data = await response.json()
      setInteractions(data)
    } catch (error) {
      console.error("Error fetching interactions:", error)
      toast({
        title: "Erro",
        description: "Não foi possível carregar as interações",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!description.trim()) {
      toast({
        title: "Erro",
        description: "A descrição da interação é obrigatória",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      const interactionData = {
        type: interactionType,
        description,
        outcome,
      }

      const response = await fetch(`/api/crm/clients/${clientId}/interactions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(interactionData),
      })

      if (!response.ok) {
        throw new Error("Erro ao registrar interação")
      }

      // Reset form
      setDescription("")

      // Optionally, you could add the new interaction directly to the state
      // for a more responsive UI, but for simplicity we'll just refetch
      fetchInteractions()

      toast({
        title: "Interação registrada",
        description: "A interação foi registrada com sucesso.",
      })
    } catch (error) {
      console.error("Error creating interaction:", error)
      toast({
        title: "Erro",
        description: "Não foi possível registrar a interação",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const filteredInteractions = interactions.filter((interaction) => {
    if (filter === "all") return true
    return interaction.type === filter
  })

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .substring(0, 2)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="bg-[#f8fafc] border-b rounded-t-lg">
          <CardTitle className="text-lg">Nova Interação</CardTitle>
          <CardDescription>Registre uma nova interação com o cliente</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4 pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="interaction-type" className="text-sm font-medium">
                  Tipo de Interação
                </label>
                <Select value={interactionType} onValueChange={setInteractionType}>
                  <SelectTrigger id="interaction-type">
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="call">Ligação</SelectItem>
                    <SelectItem value="email">Email</SelectItem>
                    <SelectItem value="meeting">Reunião</SelectItem>
                    <SelectItem value="canceled">Cancelada</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label htmlFor="interaction-outcome" className="text-sm font-medium">
                  Resultado
                </label>
                <Select value={outcome} onValueChange={setOutcome}>
                  <SelectTrigger id="interaction-outcome">
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
            <div className="space-y-2">
              <label htmlFor="interaction-description" className="text-sm font-medium">
                Descrição
              </label>
              <Textarea
                id="interaction-description"
                placeholder="Descreva a interação..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                required
              />
            </div>
          </CardContent>
          <CardFooter className="bg-[#f8fafc] border-t">
            <Button type="submit" className="w-full md:w-auto bg-[#4b7bb5] hover:bg-[#3d649e]" disabled={isSubmitting}>
              {isSubmitting ? (
                "Salvando..."
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Registrar Interação
                </>
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <CardTitle>Histórico de Interações</CardTitle>
              <CardDescription>
                {filteredInteractions.length} {filteredInteractions.length === 1 ? "interação" : "interações"}{" "}
                registradas
              </CardDescription>
            </div>
            <Tabs defaultValue="all" onValueChange={setFilter} className="w-full sm:w-auto">
              <TabsList className="grid grid-cols-4 h-8">
                <TabsTrigger value="all" className="text-xs px-2">
                  Todas
                </TabsTrigger>
                <TabsTrigger value="call" className="text-xs px-2">
                  Ligações
                </TabsTrigger>
                <TabsTrigger value="email" className="text-xs px-2">
                  Emails
                </TabsTrigger>
                <TabsTrigger value="meeting" className="text-xs px-2">
                  Reuniões
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, index) => (
                <div key={`loading-${index}`} className="flex gap-4 p-4 border rounded-lg animate-pulse">
                  <div className="bg-muted h-10 w-10 rounded-full shrink-0"></div>
                  <div className="flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <div className="h-5 bg-muted rounded-md w-20"></div>
                        <div className="h-5 bg-muted rounded-full w-16"></div>
                      </div>
                      <div className="h-4 bg-muted rounded-md w-32"></div>
                    </div>
                    <div className="h-4 bg-muted rounded-md w-full mb-2"></div>
                    <div className="h-3 bg-muted rounded-md w-40"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : filteredInteractions.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">Nenhuma interação registrada</div>
          ) : (
            <div className="space-y-4">
              {filteredInteractions.map((interaction) => (
                <div
                  key={interaction.id}
                  className="flex gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <Avatar className="bg-[#4b7bb5] text-white h-10 w-10 flex items-center justify-center shrink-0">
                    <AvatarFallback>{typeIcons[interaction.type]}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">
                          {interaction.type === "call" && "Ligação"}
                          {interaction.type === "email" && "Email"}
                          {interaction.type === "meeting" && "Reunião"}
                          {interaction.type === "canceled" && "Cancelada"}
                        </span>
                        <Badge variant="secondary" className={`${outcomeColorMap[interaction.outcome]} text-white`}>
                          {interaction.outcome === "positive" && "Positivo"}
                          {interaction.outcome === "neutral" && "Neutro"}
                          {interaction.outcome === "negative" && "Negativo"}
                        </Badge>
                      </div>
                      <div className="text-sm text-muted-foreground">{formatDate(interaction.created_at)}</div>
                    </div>
                    <p className="text-sm">{interaction.description}</p>
                    <div className="text-xs text-muted-foreground mt-2">Registrado por {interaction.user_name}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
