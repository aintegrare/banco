"use client"

import type React from "react"
import { useState } from "react"

interface SimpleCreateTaskDialogProps {
  projectId?: number
  onTaskCreated?: (task: any) => void
  isOpen: boolean
  onClose: () => void
}

export function SimpleCreateTaskDialog({ projectId, onTaskCreated, isOpen, onClose }: SimpleCreateTaskDialogProps) {
  const [isCreating, setIsCreating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "todo",
    priority: "medium",
    due_date: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsCreating(true)
    setError(null)

    try {
      if (!formData.title.trim()) {
        throw new Error("Título é obrigatório")
      }

      console.log("🔄 Criando nova tarefa...")

      const taskData = {
        title: formData.title.trim(),
        description: formData.description.trim() || null,
        status: formData.status,
        priority: formData.priority,
        project_id: projectId || null,
        due_date: formData.due_date || null,
      }

      const response = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(taskData),
      })

      const result = await response.json()

      if (!result.success) {
        throw new Error(result.error || "Erro ao criar tarefa")
      }

      console.log(`✅ Tarefa criada: ${result.data.title} (ID: ${result.data.id})`)

      // Resetar formulário
      setFormData({
        title: "",
        description: "",
        status: "todo",
        priority: "medium",
        due_date: "",
      })

      // Notificar componente pai
      if (onTaskCreated) {
        onTaskCreated(result.data)
      }

      // Fechar dialog
      onClose()
    } catch (err: any) {
      console.error("❌ Erro ao criar tarefa:", err)
      setError(err.message)
    } finally {
      setIsCreating(false)
    }
  }

  const handleClose = () => {
    if (!isCreating) {
      setFormData({
        title: "",
        description: "",
        status: "todo",
        priority: "medium",
        due_date: "",
      })
      setError(null)
      onClose()
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900">➕ Nova Tarefa</h2>
          <button
            onClick={handleClose}
            disabled={isCreating}
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

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Título */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Título *</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Digite o título da tarefa"
              required
              disabled={isCreating}
            />
          </div>

          {/* Descrição */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Digite a descrição (opcional)"
              rows={3}
              disabled={isCreating}
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
                disabled={isCreating}
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
                disabled={isCreating}
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
              disabled={isCreating}
            />
          </div>

          {/* Botões */}
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
              disabled={isCreating}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isCreating || !formData.title.trim()}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {isCreating ? "Criando..." : "Criar Tarefa"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
