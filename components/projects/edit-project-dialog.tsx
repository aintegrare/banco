"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { CalendarIcon, Loader2, Plus, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"

interface User {
  id: number
  name: string
  email: string
  role?: string
}

interface ProjectMember {
  id: number
  user_id: number
  project_id: number
  role: string
  user: User
}

interface Project {
  id: number
  name: string
  description: string
  status: string
  start_date: string | null
  end_date: string | null
  progress: number
  client?: string
  budget?: string
  members: ProjectMember[]
}

interface EditProjectDialogProps {
  project: Project
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
}

export function EditProjectDialog({ project, isOpen, onClose, onSuccess }: EditProjectDialogProps) {
  const [formData, setFormData] = useState<Partial<Project>>({})
  const [isLoading, setIsLoading] = useState(false)
  const [isSaved, setIsSaved] = useState(false)
  const [availableUsers, setAvailableUsers] = useState<User[]>([])
  const [selectedMembers, setSelectedMembers] = useState<ProjectMember[]>([])
  const [newMemberUserId, setNewMemberUserId] = useState<number | null>(null)
  const [newMemberRole, setNewMemberRole] = useState("")
  const { toast } = useToast()
  const router = useRouter()

  // Verificar quais campos existem no projeto
  const [availableFields, setAvailableFields] = useState<Record<string, boolean>>({})

  // Reset form state when dialog opens/closes
  useEffect(() => {
    if (isOpen) {
      setIsSaved(false)
    }
  }, [isOpen])

  // Load project data when dialog opens
  useEffect(() => {
    if (project && isOpen) {
      // Determinar quais campos existem no projeto
      const fields: Record<string, boolean> = {}
      Object.keys(project).forEach((key) => {
        fields[key] = true
      })
      setAvailableFields(fields)

      setFormData({
        name: project.name || "",
        description: project.description || "",
        status: project.status || "em_andamento",
        start_date: project.start_date || null,
        end_date: project.end_date || null,
        progress: project.progress || 0,
      })

      // Adicionar client e budget apenas se existirem no projeto
      if (project.hasOwnProperty("client")) {
        setFormData((prev) => ({ ...prev, client: project.client || "" }))
      }

      if (project.hasOwnProperty("budget")) {
        setFormData((prev) => ({ ...prev, budget: project.budget || "" }))
      }

      setSelectedMembers(project.members || [])
    }
  }, [project, isOpen])

  // Fetch available users when dialog opens
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("/api/users")
        if (response.ok) {
          const data = await response.json()
          setAvailableUsers(data)
        }
      } catch (error) {
        console.error("Erro ao buscar usuários:", error)
        toast({
          title: "Erro",
          description: "Não foi possível carregar a lista de usuários.",
          variant: "destructive",
        })
      }
    }

    if (isOpen) {
      fetchUsers()
    }
  }, [isOpen, toast])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target

    // Tratamento especial para campos numéricos
    if (name === "progress") {
      setFormData((prev) => ({ ...prev, [name]: value === "" ? 0 : Number(value) }))
    } else if (name === "budget") {
      setFormData((prev) => ({ ...prev, [name]: value })) // Mantém como string para formatação
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }))
    }
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleDateChange = (name: string, date: Date | undefined) => {
    if (date) {
      setFormData((prev) => ({ ...prev, [name]: date.toISOString() }))
    }
  }

  const handleAddMember = () => {
    if (!newMemberUserId || !newMemberRole) return

    const userToAdd = availableUsers.find((user) => user.id === newMemberUserId)
    if (!userToAdd) return

    const newMember: ProjectMember = {
      id: -Date.now(), // ID temporário negativo para novos membros
      user_id: userToAdd.id,
      project_id: project.id,
      role: newMemberRole,
      user: userToAdd,
    }

    setSelectedMembers((prev) => [...prev, newMember])
    setNewMemberUserId(null)
    setNewMemberRole("")
  }

  const handleRemoveMember = (memberId: number) => {
    setSelectedMembers((prev) => prev.filter((member) => member.id !== memberId))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validação básica
    if (!formData.name || formData.name.trim() === "") {
      toast({
        title: "Erro de validação",
        description: "O nome do projeto é obrigatório",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      // Criar um objeto com apenas os campos necessários para a atualização
      const updateData: Record<string, any> = {
        name: formData.name,
        description: formData.description,
        status: formData.status,
        start_date: formData.start_date,
        end_date: formData.end_date,
        progress: formData.progress,
      }

      // Adicionar membros
      updateData.members = selectedMembers.map((member) => ({
        user_id: member.user_id,
        role: member.role,
        id: member.id > 0 ? member.id : undefined, // Enviar ID apenas se for um membro existente
      }))

      const response = await fetch(`/api/projects/${project.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateData),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || "Erro ao atualizar projeto")
      }

      setIsSaved(true)
      toast({
        title: "Projeto atualizado",
        description: "As alterações foram salvas com sucesso.",
      })

      // Aguardar um momento para mostrar o feedback visual antes de fechar
      setTimeout(() => {
        if (onSuccess) onSuccess()
        onClose()
        router.refresh()
      }, 1000)
    } catch (error: any) {
      console.error("Erro ao atualizar projeto:", error)
      toast({
        title: "Erro",
        description: error.message || "Não foi possível atualizar o projeto. Tente novamente.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open && !isLoading) onClose()
      }}
    >
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar Projeto</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Nome do Projeto</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name || ""}
                  onChange={handleInputChange}
                  required
                  data-testid="project-name-input"
                />
              </div>

              {availableFields.client && (
                <div>
                  <Label htmlFor="client">Cliente</Label>
                  <Input id="client" name="client" value={formData.client || ""} onChange={handleInputChange} />
                </div>
              )}

              {availableFields.budget && (
                <div>
                  <Label htmlFor="budget">Orçamento</Label>
                  <Input id="budget" name="budget" value={formData.budget || ""} onChange={handleInputChange} />
                </div>
              )}

              <div>
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.status || "em_andamento"}
                  onValueChange={(value) => handleSelectChange("status", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="planejamento">Planejamento</SelectItem>
                    <SelectItem value="em_andamento">Em andamento</SelectItem>
                    <SelectItem value="pausado">Pausado</SelectItem>
                    <SelectItem value="concluido">Concluído</SelectItem>
                    <SelectItem value="cancelado">Cancelado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description || ""}
                  onChange={handleInputChange}
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Data de Início</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !formData.start_date && "text-muted-foreground",
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {formData.start_date ? (
                          format(new Date(formData.start_date), "dd/MM/yyyy", { locale: ptBR })
                        ) : (
                          <span>Selecione a data</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={formData.start_date ? new Date(formData.start_date) : undefined}
                        onSelect={(date) => handleDateChange("start_date", date)}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div>
                  <Label>Data de Término</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !formData.end_date && "text-muted-foreground",
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {formData.end_date ? (
                          format(new Date(formData.end_date), "dd/MM/yyyy", { locale: ptBR })
                        ) : (
                          <span>Selecione a data</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={formData.end_date ? new Date(formData.end_date) : undefined}
                        onSelect={(date) => handleDateChange("end_date", date)}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              <div>
                <Label htmlFor="progress">Progresso ({formData.progress || 0}%)</Label>
                <Input
                  id="progress"
                  name="progress"
                  type="range"
                  min="0"
                  max="100"
                  value={formData.progress || 0}
                  onChange={handleInputChange}
                  className="w-full"
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <Label>Membros da Equipe</Label>
              <div className="mt-2 space-y-2">
                {selectedMembers.map((member) => (
                  <div key={member.id} className="flex items-center justify-between bg-gray-50 p-2 rounded-md">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 rounded-full bg-[#4b7bb5] flex items-center justify-center text-white">
                        {member.user.name.substring(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-medium">{member.user.name}</p>
                        <p className="text-xs text-gray-500">{member.role}</p>
                      </div>
                    </div>
                    <Button type="button" variant="ghost" size="sm" onClick={() => handleRemoveMember(member.id)}>
                      <X size={16} />
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-end space-x-2">
              <div className="flex-1">
                <Label htmlFor="newMemberUserId">Adicionar Membro</Label>
                <Select onValueChange={(value) => setNewMemberUserId(Number(value))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um usuário" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableUsers
                      .filter((user) => !selectedMembers.some((member) => member.user_id === user.id))
                      .map((user) => (
                        <SelectItem key={user.id} value={user.id.toString()}>
                          {user.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex-1">
                <Label htmlFor="newMemberRole">Função</Label>
                <Input
                  id="newMemberRole"
                  value={newMemberRole}
                  onChange={(e) => setNewMemberRole(e.target.value)}
                  placeholder="Ex: Designer, Desenvolvedor"
                />
              </div>
              <Button
                type="button"
                onClick={handleAddMember}
                disabled={!newMemberUserId || !newMemberRole}
                className="mb-0"
              >
                <Plus size={16} className="mr-1" /> Adicionar
              </Button>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isLoading || isSaved}
              className={cn(isSaved && "bg-green-600 hover:bg-green-700")}
              data-testid="save-project-button"
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isSaved ? "Salvo!" : "Salvar Alterações"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
