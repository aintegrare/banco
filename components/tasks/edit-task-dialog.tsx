"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { CalendarIcon, Loader2, AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import { useToast } from "@/components/ui/use-toast"

interface Project {
  id: string | number
  name: string
}

interface EditTaskDialogProps {
  isOpen: boolean
  onClose: () => void
  taskId: string | number
  onSave?: (task: any) => void
}

const COLOR_OPTIONS = [
  { id: "#4b7bb5", name: "Azul (Padrão)" },
  { id: "#e11d48", name: "Vermelho" },
  { id: "#22c55e", name: "Verde" },
  { id: "#f97316", name: "Laranja" },
  { id: "#8b5cf6", name: "Roxo" },
  { id: "#f59e0b", name: "Amarelo" },
  { id: "#3d649e", name: "Azul Escuro" },
  { id: "#6b91c1", name: "Azul Claro" },
  { id: "#64748b", name: "Cinza" },
]

// Lista de status disponíveis - mantemos os mesmos IDs para a UI
const STATUSES = [
  { id: "backlog", name: "Backlog" },
  { id: "todo", name: "A Fazer" },
  { id: "in-progress", name: "Em Progresso" },
  { id: "review", name: "Em Revisão" },
  { id: "done", name: "Concluído" },
]

export function EditTaskDialog({ isOpen, onClose, taskId, onSave }: EditTaskDialogProps) {
  const [task, setTask] = useState<any>(null)
  const [date, setDate] = useState<Date | undefined>(undefined)
  const [projects, setProjects] = useState<Project[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [debugInfo, setDebugInfo] = useState<any>(null)
  const [debugVisible, setDebugVisible] = useState(false)
  const { toast } = useToast()

  // Buscar dados da tarefa
  useEffect(() => {
    const fetchTaskData = async () => {
      if (!isOpen || !taskId) return

      setIsLoading(true)
      setError(null)

      try {
        // Buscar tarefa
        const taskResponse = await fetch(`/api/tasks/${taskId}`)
        if (!taskResponse.ok) {
          throw new Error("Falha ao buscar dados da tarefa")
        }
        const taskData = await taskResponse.json()

        if (taskData.color) {
          // Se a tarefa já tem uma cor
          setTask(taskData)
        } else {
          // Se a tarefa não tem cor, adicione a cor padrão
          setTask({ ...taskData, color: "#4b7bb5" })
        }

        // Definir data se houver
        if (taskData.due_date) {
          setDate(new Date(taskData.due_date))
        } else {
          setDate(undefined)
        }

        // Buscar projetos
        const projectsResponse = await fetch("/api/projects")
        if (!projectsResponse.ok) {
          throw new Error("Falha ao buscar projetos")
        }
        const projectsData = await projectsResponse.json()
        setProjects(projectsData)
      } catch (error: any) {
        console.error("Erro ao buscar dados:", error)
        setError(error.message || "Erro ao carregar dados")
        toast({
          title: "Erro",
          description: error.message || "Não foi possível carregar os dados da tarefa",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchTaskData()
  }, [isOpen, taskId, toast])

  // Buscar informações de depuração da tabela tasks
  useEffect(() => {
    if (isOpen && debugVisible) {
      const fetchDebugInfo = async () => {
        try {
          const response = await fetch("/api/debug-tasks-table")
          if (!response.ok) {
            throw new Error("Falha ao buscar informações de depuração")
          }
          const data = await response.json()
          setDebugInfo(data)
        } catch (error) {
          console.error("Erro ao buscar informações de depuração:", error)
        }
      }

      fetchDebugInfo()
    }
  }, [isOpen, debugVisible])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setTask((prev: any) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setTask((prev: any) => ({ ...prev, [name]: value }))
  }

  const handleDateChange = (date: Date | undefined) => {
    setDate(date)
    if (date) {
      const formattedDate = format(date, "yyyy-MM-dd")
      setTask((prev: any) => ({ ...prev, [name]: formattedDate }))
    } else {
      setTask((prev: any) => ({ ...prev, due_date: null }))
    }
  }

  const toggleDebugInfo = () => {
    setDebugVisible(!debugVisible)
  }

  // Modificar a função handleSubmit para remover o campo status ao enviar os dados
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!task) return

    if (!task.title) {
      setError("O título da tarefa é obrigatório")
      return
    }

    setIsSaving(true)
    setError(null)

    try {
      // Preparar dados para envio
      // Remover campos que são apenas visuais ou que não existem na tabela
      const { color, creator, assignee, status, ...updateData } = task

      const dataToSend = {
        ...updateData,
        project_id: updateData.project_id || updateData.projectId, // Garantir compatibilidade
      }

      // Atualizar tarefa via API
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSend),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Erro ao atualizar tarefa")
      }

      const updatedTask = await response.json()

      // Adicionar os campos visuais de volta ao objeto retornado
      const updatedTaskWithVisualFields = {
        ...updatedTask,
        color: color || "#4b7bb5",
        creator: creator || null,
        assignee: assignee || null,
        status: status || "todo", // Manter o status visual
      }

      toast({
        title: "Sucesso",
        description: "Tarefa atualizada com sucesso!",
      })

      // Notificar o componente pai sobre a atualização
      if (onSave) {
        onSave(updatedTaskWithVisualFields)
      }

      // Fechar o diálogo após sucesso
      onClose()
    } catch (err: any) {
      console.error("Erro ao atualizar tarefa:", err)
      setError(err.message || "Ocorreu um erro ao atualizar a tarefa. Por favor, tente novamente.")
      toast({
        title: "Erro",
        description: err.message || "Não foi possível atualizar a tarefa",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-[#4b7bb5]">Editar Tarefa</DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="flex justify-center items-center py-8">
            <Loader2 size={30} className="text-[#4b7bb5] animate-spin" />
          </div>
        ) : task ? (
          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            <div className="space-y-2">
              <label htmlFor="title" className="text-sm font-medium">
                Título
              </label>
              <Input
                id="title"
                name="title"
                value={task.title || ""}
                onChange={handleChange}
                required
                className="border-[#4b7bb5] focus:ring-[#4b7bb5]"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="description" className="text-sm font-medium">
                Descrição
              </label>
              <Textarea
                id="description"
                name="description"
                value={task.description || ""}
                onChange={handleChange}
                rows={3}
                className="border-[#4b7bb5] focus:ring-[#4b7bb5]"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="status" className="text-sm font-medium">
                  Status (visual apenas)
                </label>
                <Select value={task.status} onValueChange={(value) => handleSelectChange("status", value)}>
                  <SelectTrigger className="border-[#4b7bb5]">
                    <SelectValue placeholder="Selecione o status" />
                  </SelectTrigger>
                  <SelectContent>
                    {STATUSES.map((status) => (
                      <SelectItem key={status.id} value={status.id}>
                        {status.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-amber-600 mt-1 flex items-center">
                  <AlertCircle size={12} className="mr-1" />
                  Este campo é apenas visual e não será salvo no banco de dados
                </p>
              </div>
              <div className="space-y-2">
                <label htmlFor="priority" className="text-sm font-medium">
                  Prioridade
                </label>
                <Select
                  value={task.priority || "medium"}
                  onValueChange={(value) => handleSelectChange("priority", value)}
                >
                  <SelectTrigger className="border-[#4b7bb5]">
                    <SelectValue placeholder="Selecione a prioridade" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Baixa</SelectItem>
                    <SelectItem value="medium">Média</SelectItem>
                    <SelectItem value="high">Alta</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="project" className="text-sm font-medium">
                  Projeto
                </label>
                <Select
                  value={task.project_id?.toString() || task.projectId?.toString() || ""}
                  onValueChange={(value) => handleSelectChange("project_id", value)}
                >
                  <SelectTrigger className="border-[#4b7bb5]">
                    <SelectValue placeholder="Selecione o projeto" />
                  </SelectTrigger>
                  <SelectContent>
                    {projects.map((project) => (
                      <SelectItem key={project.id} value={project.id.toString()}>
                        {project.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label htmlFor="dueDate" className="text-sm font-medium">
                  Data de Entrega
                </label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal border-[#4b7bb5]",
                        !date && "text-muted-foreground",
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, "PPP", { locale: ptBR }) : <span>Selecione uma data</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar mode="single" selected={date} onSelect={handleDateChange} initialFocus locale={ptBR} />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Cor da Tarefa (visual apenas)</label>
              <div className="grid grid-cols-5 gap-2">
                {COLOR_OPTIONS.map((color) => (
                  <button
                    key={color.id}
                    type="button"
                    title={color.name}
                    onClick={() => handleSelectChange("color", color.id)}
                    className={`w-8 h-8 rounded-full border-2 ${
                      task.color === color.id ? "border-gray-900" : "border-transparent"
                    } hover:border-gray-400 transition-colors`}
                    style={{ backgroundColor: color.id }}
                  />
                ))}
              </div>
              <div className="text-xs text-gray-500 flex items-center">
                <span>
                  Cor selecionada:{" "}
                  <span className="font-medium">
                    {COLOR_OPTIONS.find((c) => c.id === task.color)?.name || "Padrão"}
                  </span>
                </span>
                <span className="text-amber-600 ml-2 flex items-center">
                  <AlertCircle size={12} className="mr-1" />
                  Visual apenas
                </span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="creator" className="text-sm font-medium">
                  Criador da Tarefa (visual apenas)
                </label>
                <Input
                  id="creator"
                  name="creator"
                  value={task.creator || ""}
                  onChange={handleChange}
                  className="border-[#4b7bb5] focus:ring-[#4b7bb5]"
                  placeholder="Nome do criador"
                />
                <p className="text-xs text-amber-600 mt-1 flex items-center">
                  <AlertCircle size={12} className="mr-1" />
                  Visual apenas
                </p>
              </div>
              <div className="space-y-2">
                <label htmlFor="assignee" className="text-sm font-medium">
                  Responsável (visual apenas)
                </label>
                <Input
                  id="assignee"
                  name="assignee"
                  value={task.assignee || ""}
                  onChange={handleChange}
                  className="border-[#4b7bb5] focus:ring-[#4b7bb5]"
                  placeholder="Nome do responsável"
                />
                <p className="text-xs text-amber-600 mt-1 flex items-center">
                  <AlertCircle size={12} className="mr-1" />
                  Visual apenas
                </p>
              </div>
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-red-600 text-sm flex items-start">
                  <AlertCircle size={16} className="mr-2 mt-0.5 flex-shrink-0" />
                  <span>{error}</span>
                </p>
                <button type="button" onClick={toggleDebugInfo} className="text-xs text-blue-600 hover:underline mt-2">
                  {debugVisible ? "Ocultar informações de depuração" : "Mostrar informações de depuração"}
                </button>

                {debugVisible && debugInfo && (
                  <div className="mt-2 text-xs overflow-auto max-h-40 bg-gray-100 p-2 rounded">
                    <p className="font-semibold">Informações da tabela tasks:</p>
                    <pre className="whitespace-pre-wrap break-all">{JSON.stringify(debugInfo, null, 2)}</pre>
                  </div>
                )}
              </div>
            )}

            <DialogFooter className="mt-6">
              <Button type="button" variant="outline" onClick={onClose} disabled={isSaving}>
                Cancelar
              </Button>
              <Button type="submit" className="bg-[#4b7bb5] hover:bg-[#3d649e]" disabled={isSaving}>
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  "Salvar Alterações"
                )}
              </Button>
            </DialogFooter>
          </form>
        ) : (
          <div className="py-4 text-center text-gray-500">
            {error || "Não foi possível carregar os dados da tarefa"}
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
