"use client"

import type React from "react"
import { useState, useEffect } from "react"
import type { SimpleTask } from "@/lib/simple-task-service"

interface SimpleEditTaskDialogProps {
  taskId?: number
  isOpen: boolean
  onClose: () => void
  onTaskUpdated?: (task: SimpleTask) => void
}

export function SimpleEditTaskDialog({ taskId, isOpen, onClose, onTaskUpdated }: SimpleEditTaskDialogProps) {
  const [task, setTask] = useState<SimpleTask | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "todo",
    priority: "medium",
    due_date: "",
  })

  // Carregar tarefa quando dialog abre
  useEffect(() => {
    if (isOpen && taskId) {
      loadTask()
    }
  }, [isOpen, taskId])

  const loadTask = async () => {
    if (!taskId) return

    setIsLoading(true)
    setError(null)

    try {
      console.log(`🔄 Carregando tarefa ${taskId} para edição`)

      const response = await fetch(`/api/tasks/${taskId}`)
      const result = await response.json()

      if (!result.success) {
        throw new Error(result.error || "Erro ao carregar tarefa")
      }

      setTask(result.data)
      setFormData({
        title: result.data.title || "",
        description: result.data.description || "",
        status: result.data.status || "todo",
        priority: result.data.priority || "medium",
        due_date: result.data.due_date ? result.data.due_date.split("T")[0] : "",
      })

      console.log(`✅ Tarefa carregada: ${result.data.title}`)
    } catch (err: any) {
      console.error(`❌ Erro ao carregar tarefa ${taskId}:`, err)
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!task) return

    setIsUpdating(true)
    setError(null)

    try {
      console.log(`🔄 Atualizando tarefa ${task.id}`)

      const updateData = {
        title: formData.title.trim(),
        description: formData.description.trim() || null,
        status: formData.status,
        priority: formData.priority,
        due_date: formData.due_date || null,
      }

      const response = await fetch(`/api/tasks/${task.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updateData),
      })

      const result = await response.json()

      if (!result.success) {
        throw new Error(result.error || "Erro ao atualizar tarefa")
      }

      console.log(`✅ Tarefa ${task.id} atualizada`)

      if (onTaskUpdated) {
        onTaskUpdated(result.data)
      }

      onClose()
    } catch (err: any) {
      console.error(`❌ Erro ao atualizar tarefa:`, err)
      setError(err.message)
    } finally {
      setIsUpdating(false)
    }
  }

  const handleClose = () => {
    if (!isLoading && !isUpdating) {
      setTask(null)
      setError(null)
      setFormData({
        title: "",
        description: "",
        status: "todo",
        priority: "medium",
        due_date: "",
      })
      onClose()
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900">
            ✏️ Editar Tarefa {task && <span className="text-sm text-gray-500">#{task.id}</span>}
          </h2>
          <button
            onClick={handleClose}
            disabled={isLoading || isUpdating}
            className="text-gray-500 hover:text-gray-700 disabled:opacity-50"
          >
            ✕
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded">
            <p className="text-red-600 text-sm">❌ {error}</p>
          </div>
        )}

        {isLoading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto" />
            <p className="mt-2 text-gray-600">Carregando...</p>
          </div>
        ) : task ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Título */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Título *</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                disabled={isUpdating}
              />
            </div>

            {/* Descrição */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
                disabled={isUpdating}
              />
            </div>

            {/* Status e Prioridade */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData((prev) => ({ ...prev, status: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={isUpdating}
                >
                  <option value="backlog">Backlog</option>
                  <option value="todo">A Fazer</option>
                  <option value="in_progress">Em Progresso</option>
                  <option value="review">Em Revisão</option>
                  <option value="done">Concluído</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Prioridade</label>
                <select
                  value={formData.priority}
                  onChange={(e) => setFormData((prev) => ({ ...prev, priority: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={isUpdating}
                >
                  <option value="low">Baixa</option>
                  <option value="medium">Média</option>
                  <option value="high">Alta</option>
                  <option value="urgent">Urgente</option>
                </select>
              </div>
            </div>

            {/* Data de vencimento */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Data de Vencimento</label>
              <input
                type="date"
                value={formData.due_date}
                onChange={(e) => setFormData((prev) => ({ ...prev, due_date: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={isUpdating}
              />
            </div>

            {/* Botões */}
            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={handleClose}
                disabled={isUpdating}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isUpdating || !formData.title.trim()}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                {isUpdating ? "Salvando..." : "Salvar"}
              </button>
            </div>
          </form>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-600">Tarefa não encontrada</p>
          </div>
        )}
      </div>
    </div>
  )
}
