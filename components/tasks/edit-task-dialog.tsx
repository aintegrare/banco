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
import { CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface EditTaskDialogProps {
  isOpen: boolean
  onClose: () => void
  task: any
  onSave: (task: any) => void
  projects: any[]
}

export function EditTaskDialog({ isOpen, onClose, task, onSave, projects }: EditTaskDialogProps) {
  const [editedTask, setEditedTask] = useState<any>(task)
  const [date, setDate] = useState<Date | undefined>(task.dueDate ? new Date(task.dueDate) : undefined)

  useEffect(() => {
    if (isOpen) {
      setEditedTask(task)
      setDate(task.dueDate ? new Date(task.dueDate) : undefined)
    }
  }, [task, isOpen])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setEditedTask((prev: any) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setEditedTask((prev: any) => ({ ...prev, [name]: value }))
  }

  const handleDateChange = (date: Date | undefined) => {
    setDate(date)
    if (date) {
      const formattedDate = format(date, "yyyy-MM-dd")
      setEditedTask((prev: any) => ({ ...prev, dueDate: formattedDate }))
    } else {
      setEditedTask((prev: any) => ({ ...prev, dueDate: null }))
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Atualizar o nome do projeto com base no ID selecionado
    const selectedProject = projects.find((p) => p.id === editedTask.projectId)
    const updatedTask = {
      ...editedTask,
      projectName: selectedProject ? selectedProject.name : editedTask.projectName,
    }

    if (typeof onSave === "function") {
      onSave(updatedTask)
      onClose()
    } else {
      console.error("onSave is not a function")
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-[#4b7bb5]">Editar Tarefa</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <label htmlFor="title" className="text-sm font-medium">
              Título
            </label>
            <Input
              id="title"
              name="title"
              value={editedTask.title || ""}
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
              value={editedTask.description || ""}
              onChange={handleChange}
              rows={3}
              className="border-[#4b7bb5] focus:ring-[#4b7bb5]"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="status" className="text-sm font-medium">
                Status
              </label>
              <Select value={editedTask.status} onValueChange={(value) => handleSelectChange("status", value)}>
                <SelectTrigger className="border-[#4b7bb5]">
                  <SelectValue placeholder="Selecione o status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="backlog">Backlog</SelectItem>
                  <SelectItem value="todo">A Fazer</SelectItem>
                  <SelectItem value="in-progress">Em Progresso</SelectItem>
                  <SelectItem value="review">Em Revisão</SelectItem>
                  <SelectItem value="done">Concluído</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label htmlFor="priority" className="text-sm font-medium">
                Prioridade
              </label>
              <Select
                value={editedTask.priority || "medium"}
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
              <Select value={editedTask.projectId} onValueChange={(value) => handleSelectChange("projectId", value)}>
                <SelectTrigger className="border-[#4b7bb5]">
                  <SelectValue placeholder="Selecione o projeto" />
                </SelectTrigger>
                <SelectContent>
                  {projects.map((project) => (
                    <SelectItem key={project.id} value={project.id}>
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
            <label htmlFor="assignee" className="text-sm font-medium">
              Responsável
            </label>
            <Input
              id="assignee"
              name="assignee"
              value={editedTask.assignee || ""}
              onChange={handleChange}
              className="border-[#4b7bb5] focus:ring-[#4b7bb5]"
            />
          </div>
          <DialogFooter className="mt-6">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" className="bg-[#4b7bb5] hover:bg-[#3d649e]">
              Salvar Alterações
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
