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
import { CalendarIcon, Loader2 } from "lucide-react"
import { TASK_STATUS, PRIORITY } from "@/lib/types"
import { cn } from "@/lib/utils"

interface TaskCreateDialogProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: any) => void
  initialProjectId?: number
}

export function TaskCreateDialog({ isOpen, onClose, onSubmit, initialProjectId }: TaskCreateDialogProps) {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [status, setStatus] = useState<string>(TASK_STATUS.TODO)
  const [priority, setPriority] = useState<string>(PRIORITY.MEDIUM)
  const [projectId, setProjectId] = useState<number | undefined>(initialProjectId)
  const [dueDate, setDueDate] = useState<Date | undefined>(undefined)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [projects, setProjects] = useState<any[]>([])
  const [isLoadingProjects, setIsLoadingProjects] = useState(false)

  useEffect(() => {
    if (isOpen) {
      fetchProjects()
    }
  }, [isOpen])

  const fetchProjects = async () => {
    setIsLoadingProjects(true)
    try {
      const response = await fetch("/api/projects")
      const result = await response.json()
      if (result.success) {
        setProjects(result.data || [])
      } else {
        console.error("Erro ao buscar projetos:", result.error)
      }
    } catch (error) {
      console.error("Erro ao buscar projetos:", error)
    } finally {
      setIsLoadingProjects(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!title.trim()) {
      setError("O título da tarefa é obrigatório")
      return
    }

    setIsSubmitting(true)
    setError(null)

    try {
      const taskData = {
        title: title.trim(),
        description: description.trim() || null,
        status,
        priority,
        project_id: projectId || null,
        due_date: dueDate ? format(dueDate, "yyyy-MM-dd") : null,
      }

      await onSubmit(taskData)

      // Limpar formulário
      setTitle("")
      setDescription("")
      setStatus(TASK_STATUS.TODO)
      setPriority(PRIORITY.MEDIUM)
      setDueDate(undefined)
    } catch (error: any) {
      setError(error.message || "Ocorreu um erro ao criar a tarefa")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-[#4b7bb5]">Nova Tarefa</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <label htmlFor="title" className="text-sm font-medium">
              Título
            </label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Digite o título da tarefa"
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="description" className="text-sm font-medium">
              Descrição
            </label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Descreva a tarefa brevemente"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="status" className="text-sm font-medium">
                Status
              </label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o status" />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(TASK_STATUS).map((status) => (
                    <SelectItem key={status} value={status}>
                      {status === TASK_STATUS.BACKLOG && "Backlog"}
                      {status === TASK_STATUS.TODO && "A Fazer"}
                      {status === TASK_STATUS.IN_PROGRESS && "Em Progresso"}
                      {status === TASK_STATUS.REVIEW && "Em Revisão"}
                      {status === TASK_STATUS.DONE && "Concluído"}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label htmlFor="priority" className="text-sm font-medium">
                Prioridade
              </label>
              <Select value={priority} onValueChange={setPriority}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a prioridade" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={PRIORITY.LOW}>Baixa</SelectItem>
                  <SelectItem value={PRIORITY.MEDIUM}>Média</SelectItem>
                  <SelectItem value={PRIORITY.HIGH}>Alta</SelectItem>
                  <SelectItem value={PRIORITY.URGENT}>Urgente</SelectItem>
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
                value={projectId?.toString() || "0"}
                onValueChange={(value) => setProjectId(Number(value))}
                disabled={isLoadingProjects}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o projeto" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">Sem projeto</SelectItem>
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
                    className={cn("w-full justify-start text-left font-normal", !dueDate && "text-muted-foreground")}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dueDate ? format(dueDate, "PPP", { locale: ptBR }) : <span>Selecione uma data</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" selected={dueDate} onSelect={setDueDate} initialFocus locale={ptBR} />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {error && <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm">{error}</div>}

          <DialogFooter className="mt-6">
            <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
              Cancelar
            </Button>
            <Button type="submit" className="bg-[#4b7bb5] hover:bg-[#3d649e]" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Criando...
                </>
              ) : (
                "Criar Tarefa"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
