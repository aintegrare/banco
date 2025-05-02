"use client"

import type React from "react"

import { useState } from "react"
import { X, Calendar, Paperclip, Loader2 } from "lucide-react"

// Lista de projetos disponíveis
const PROJECTS = [
  { id: "dr-joel", name: "Dr. Joel" },
  { id: "vanessa-dentista", name: "Vanessa Dentista" },
  { id: "vanessa-cardiologista", name: "Vanessa Cardiologista" },
  { id: "eora", name: "Eora" },
  { id: "medeiros-advogados", name: "Medeiros Advogados" },
  { id: "mateus-arquiteto", name: "Mateus Arquiteto" },
  { id: "billions", name: "Billions" },
  { id: "plucio", name: "Plúcio" },
  { id: "integrare", name: "Integrare" },
]

// Lista de status disponíveis
const STATUSES = [
  { id: "backlog", name: "Backlog" },
  { id: "todo", name: "A Fazer" },
  { id: "in-progress", name: "Em Progresso" },
  { id: "review", name: "Em Revisão" },
  { id: "done", name: "Concluído" },
]

interface CreateTaskDialogProps {
  isOpen?: boolean
  onClose: () => void
  initialProject?: string | null
  onTaskCreated?: (task: any) => void
  onCreateTask?: (task: any) => void
}

export function CreateTaskDialog({
  isOpen = false,
  onClose,
  initialProject = null,
  onTaskCreated,
  onCreateTask,
}: CreateTaskDialogProps) {
  const [taskTitle, setTaskTitle] = useState("")
  const [taskDescription, setTaskDescription] = useState("")
  const [projectId, setProjectId] = useState(initialProject || "integrare")
  const [status, setStatus] = useState("todo")
  const [dueDate, setDueDate] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Se o diálogo não estiver aberto, não renderize nada
  if (!isOpen) {
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!taskTitle.trim()) {
      setError("O título da tarefa é obrigatório")
      return
    }

    setIsSubmitting(true)
    setError(null)

    try {
      // Simular chamada à API
      await new Promise((resolve) => setTimeout(resolve, 800))

      // Criar nova tarefa
      const newTask = {
        id: `task-${Math.floor(Math.random() * 10000)}`,
        title: taskTitle,
        description: taskDescription,
        status: status,
        projectId: projectId,
        projectName: PROJECTS.find((p) => p.id === projectId)?.name || "Projeto",
        dueDate: dueDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
        assignee: "Usuário Atual",
        comments: 0,
        attachments: 0,
        createdAt: new Date().toISOString(),
      }

      // Notificar o componente pai sobre a nova tarefa
      if (onTaskCreated) {
        onTaskCreated(newTask)
      }

      if (onCreateTask) {
        onCreateTask(newTask)
      }

      // Fechar o diálogo após sucesso
      onClose()
    } catch (err) {
      setError("Ocorreu um erro ao criar a tarefa. Por favor, tente novamente.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center border-b border-gray-200 px-6 py-4">
          <h2 className="text-xl font-semibold text-gray-800">Nova Tarefa</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600" type="button">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="mb-4">
            <label htmlFor="task-title" className="block text-sm font-medium text-gray-700 mb-1">
              Título
            </label>
            <input
              type="text"
              id="task-title"
              value={taskTitle}
              onChange={(e) => {
                setTaskTitle(e.target.value)
                setError(null)
              }}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4b7bb5] focus:border-transparent"
              placeholder="Digite o título da tarefa"
              autoFocus
            />
          </div>

          <div className="mb-4">
            <label htmlFor="task-description" className="block text-sm font-medium text-gray-700 mb-1">
              Descrição (opcional)
            </label>
            <textarea
              id="task-description"
              value={taskDescription}
              onChange={(e) => setTaskDescription(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4b7bb5] focus:border-transparent"
              placeholder="Descreva a tarefa brevemente"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="project-select" className="block text-sm font-medium text-gray-700 mb-1">
                Projeto
              </label>
              <select
                id="project-select"
                value={projectId}
                onChange={(e) => setProjectId(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4b7bb5] focus:border-transparent"
              >
                {PROJECTS.map((project) => (
                  <option key={project.id} value={project.id}>
                    {project.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="status-select" className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                id="status-select"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4b7bb5] focus:border-transparent"
              >
                {STATUSES.map((status) => (
                  <option key={status.id} value={status.id}>
                    {status.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mb-4">
            <label htmlFor="due-date" className="block text-sm font-medium text-gray-700 mb-1">
              Data de Entrega (opcional)
            </label>
            <div className="relative">
              <input
                type="date"
                id="due-date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4b7bb5] focus:border-transparent pl-10"
              />
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            </div>
          </div>

          <div className="mb-4">
            <button type="button" className="flex items-center text-sm text-[#4b7bb5] hover:text-[#3d649e]">
              <Paperclip size={16} className="mr-1" />
              <span>Anexar arquivo</span>
            </button>
          </div>

          {error && <p className="text-red-600 text-sm mb-4">{error}</p>}

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              disabled={isSubmitting}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-[#4b7bb5] text-white rounded-lg hover:bg-[#3d649e] transition-colors flex items-center justify-center min-w-[100px]"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={16} className="mr-2 animate-spin" />
                  <span>Criando...</span>
                </>
              ) : (
                "Criar Tarefa"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
