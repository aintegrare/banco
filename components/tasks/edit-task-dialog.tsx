"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Task {
  id: number
  title: string
  description?: string | null
  status: string
  priority: string
  project_id?: number | null
  due_date?: string | null
  created_at?: string
  updated_at?: string
}

interface EditTaskDialogProps {
  taskId?: number | string // Aceitar tanto number quanto string
  task?: Task // Opção de passar a tarefa diretamente
  trigger?: React.ReactNode
  onTaskUpdated?: (task: Task) => void
  onOpenChange?: (open: boolean) => void
}

export function EditTaskDialog({
  taskId,
  task: initialTask,
  trigger,
  onTaskUpdated,
  onOpenChange,
}: EditTaskDialogProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [task, setTask] = useState<Task | null>(initialTask || null)
  const [error, setError] = useState<string | null>(null)

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "todo",
    priority: "medium",
    project_id: null as number | null,
    due_date: "",
  })

  // Validar ID da tarefa
  const validateTaskId = (id: number | string | undefined): number | null => {
    if (!id) return null

    const stringId = String(id).trim()

    // Verificar se é um ID de exemplo (não permitir)
    if (stringId.startsWith("example-") || stringId.includes("example")) {
      console.error(`❌ ID de exemplo detectado: "${stringId}" - não é permitido`)
      return null
    }

    const numericId = Number.parseInt(stringId, 10)

    if (isNaN(numericId) || numericId <= 0) {
      console.error(`❌ ID inválido: "${stringId}"`)
      return null
    }

    return numericId
  }

  // Buscar dados da tarefa se ID for fornecido
  const fetchTaskData = async (id: number) => {
    try {
      setIsLoading(true)
      setError(null)

      console.log(`🔄 Buscando tarefa com ID: ${id}`)

      const response = await fetch(`/api/tasks/${id}`)
      const result = await response.json()

      console.log(`📋 Resposta da API:`, result)

      if (!response.ok) {
        throw new Error(`Erro HTTP ${response.status}: ${result.error || "Erro desconhecido"}`)
      }

      if (!result.success) {
        throw new Error(result.error || "Erro ao buscar tarefa")
      }

      if (!result.data) {
        throw new Error("Dados da tarefa não encontrados")
      }

      console.log(`✅ Tarefa carregada: ${result.data.title}`)
      setTask(result.data)

      // Preencher formulário
      setFormData({
        title: result.data.title || "",
        description: result.data.description || "",
        status: result.data.status || "todo",
        priority: result.data.priority || "medium",
        project_id: result.data.project_id || null,
        due_date: result.data.due_date ? result.data.due_date.split("T")[0] : "",
      })
    } catch (err: any) {
      console.error(`❌ Erro ao buscar tarefa ${id}:`, err)
      setError(err.message)
      setTask(null)
    } finally {
      setIsLoading(false)
    }
  }

  // Atualizar tarefa
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!task) {
      setError("Nenhuma tarefa carregada para editar")
      return
    }

    try {
      setIsLoading(true)
      setError(null)

      console.log(`🔄 Atualizando tarefa ${task.id}`)
      console.log(`📝 Dados do formulário:`, formData)

      const updateData = {
        title: formData.title.trim(),
        description: formData.description.trim() || null,
        status: formData.status,
        priority: formData.priority,
        project_id: formData.project_id,
        due_date: formData.due_date || null,
      }

      const response = await fetch(`/api/tasks/${task.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateData),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(`Erro HTTP ${response.status}: ${result.error || "Erro desconhecido"}`)
      }

      if (!result.success) {
        throw new Error(result.error || "Erro ao atualizar tarefa")
      }

      console.log(`✅ Tarefa atualizada com sucesso:`, result.data)

      // Atualizar estado local
      setTask(result.data)

      // Notificar componente pai
      if (onTaskUpdated) {
        onTaskUpdated(result.data)
      }

      // Fechar dialog
      setIsOpen(false)
    } catch (err: any) {
      console.error(`❌ Erro ao atualizar tarefa:`, err)
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  // Efeito para carregar tarefa quando dialog abre
  useEffect(() => {
    if (isOpen && !initialTask && taskId) {
      const validId = validateTaskId(taskId)

      if (validId) {
        fetchTaskData(validId)
      } else {
        setError(`ID de tarefa inválido: "${taskId}". Use apenas IDs numéricos de tarefas reais.`)
        setTask(null)
      }
    } else if (isOpen && initialTask) {
      // Se tarefa foi passada diretamente, usar ela
      setTask(initialTask)
      setFormData({
        title: initialTask.title || "",
        description: initialTask.description || "",
        status: initialTask.status || "todo",
        priority: initialTask.priority || "medium",
        project_id: initialTask.project_id || null,
        due_date: initialTask.due_date ? initialTask.due_date.split("T")[0] : "",
      })
    }
  }, [isOpen, taskId, initialTask])

  // Controle de abertura/fechamento
  const handleOpenChange = (open: boolean) => {
    setIsOpen(open)
    if (onOpenChange) {
      onOpenChange(open)
    }

    if (!open) {
      // Reset ao fechar
      setError(null)
      setTask(null)
      setFormData({
        title: "",
        description: "",
        status: "todo",
        priority: "medium",
        project_id: null,
        due_date: "",
      })
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm">
            ✏️ Editar
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            ✏️ Editar Tarefa
            {task && <span className="text-sm text-gray-500 ml-2">#{task.id}</span>}
          </DialogTitle>
        </DialogHeader>

        {/* Loading state */}
        {isLoading && (
          <div className="flex items-center justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
            <span className="ml-2">Carregando...</span>
          </div>
        )}

        {/* Error state */}
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 font-medium">❌ {error}</p>
            {taskId && (
              <p className="text-sm text-gray-600 mt-1">
                ID fornecido: "{taskId}" (tipo: {typeof taskId})
              </p>
            )}
          </div>
        )}

        {/* Form */}
        {task && !isLoading && !error && (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Título */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Título *
              </label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                placeholder="Digite o título da tarefa"
                required
              />
            </div>

            {/* Descrição */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Descrição
              </label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                placeholder="Digite a descrição da tarefa"
                rows={3}
              />
            </div>

            {/* Status e Prioridade */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, status: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="backlog">Backlog</SelectItem>
                    <SelectItem value="todo">A Fazer</SelectItem>
                    <SelectItem value="in_progress">Em Progresso</SelectItem>
                    <SelectItem value="review">Em Revisão</SelectItem>
                    <SelectItem value="done">Concluído</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-2">
                  Prioridade
                </label>
                <Select
                  value={formData.priority}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, priority: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Baixa</SelectItem>
                    <SelectItem value="medium">Média</SelectItem>
                    <SelectItem value="high">Alta</SelectItem>
                    <SelectItem value="urgent">Urgente</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Data de vencimento */}
            <div>
              <label htmlFor="due_date" className="block text-sm font-medium text-gray-700 mb-2">
                Data de Vencimento
              </label>
              <Input
                id="due_date"
                type="date"
                value={formData.due_date}
                onChange={(e) => setFormData((prev) => ({ ...prev, due_date: e.target.value }))}
              />
            </div>

            {/* Botões */}
            <div className="flex justify-end space-x-2 pt-4">
              <Button type="button" variant="outline" onClick={() => setIsOpen(false)} disabled={isLoading}>
                Cancelar
              </Button>
              <Button type="submit" disabled={isLoading || !formData.title.trim()}>
                {isLoading ? "Salvando..." : "Salvar Alterações"}
              </Button>
            </div>
          </form>
        )}

        {/* Estado quando não há tarefa válida */}
        {!task && !isLoading && !error && (
          <div className="text-center p-8">
            <p className="text-gray-500">Nenhuma tarefa selecionada para edição</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
