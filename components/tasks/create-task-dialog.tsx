"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { X, Calendar, Paperclip, Loader2, AlertCircle } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

interface Project {
  id: string | number
  name: string
}

// Lista de status disponíveis - mantemos os mesmos IDs para a UI
const STATUSES = [
  { id: "backlog", name: "Backlog" },
  { id: "todo", name: "A Fazer" },
  { id: "in-progress", name: "Em Progresso" },
  { id: "review", name: "Em Revisão" },
  { id: "done", name: "Concluído" },
]

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

interface CreateTaskDialogProps {
  isOpen?: boolean
  onClose: () => void
  initialProject?: string | number | null
  onTaskCreated?: (task: any) => void
}

export function CreateTaskDialog({
  isOpen = false,
  onClose,
  initialProject = null,
  onTaskCreated,
}: CreateTaskDialogProps) {
  const [taskTitle, setTaskTitle] = useState("")
  const [taskDescription, setTaskDescription] = useState("")
  const [projectId, setProjectId] = useState<string | number | null>(initialProject)
  const [status, setStatus] = useState("todo")
  const [dueDate, setDueDate] = useState("")
  const [taskColor, setTaskColor] = useState("#4b7bb5")
  const [creator, setCreator] = useState("")
  const [assignee, setAssignee] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [projects, setProjects] = useState<Project[]>([])
  const [isLoadingProjects, setIsLoadingProjects] = useState(false)
  const [debugInfo, setDebugInfo] = useState<any>(null)
  const [debugVisible, setDebugVisible] = useState(false)
  const { toast } = useToast()

  // Buscar projetos disponíveis
  useEffect(() => {
    const fetchProjects = async () => {
      setIsLoadingProjects(true)
      try {
        const response = await fetch("/api/projects")
        if (!response.ok) {
          throw new Error("Falha ao buscar projetos")
        }
        const data = await response.json()
        setProjects(data)
      } catch (error) {
        console.error("Erro ao buscar projetos:", error)
        toast({
          title: "Erro",
          description: "Não foi possível carregar a lista de projetos",
          variant: "destructive",
        })
      } finally {
        setIsLoadingProjects(false)
      }
    }

    if (isOpen) {
      fetchProjects()
    }
  }, [isOpen, toast])

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

    if (!projectId) {
      setError("Selecione um projeto")
      return
    }

    setIsSubmitting(true)
    setError(null)

    try {
      // Remover o campo status para evitar problemas de validação
      const taskData = {
        title: taskTitle,
        description: taskDescription,
        // Remover o status para depender do valor padrão do banco
        // status: status,
        project_id: projectId,
        due_date: dueDate || null,
        color: taskColor,
        creator: creator || null,
        assignee: assignee || null,
      }

      // Criar nova tarefa via API
      const response = await fetch("/api/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(taskData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Erro ao criar tarefa")
      }

      const newTask = await response.json()

      toast({
        title: "Sucesso",
        description: "Tarefa criada com sucesso!",
      })

      // Notificar o componente pai sobre a nova tarefa
      if (onTaskCreated) {
        onTaskCreated(newTask)
      }

      // Fechar o diálogo após sucesso
      onClose()
    } catch (err: any) {
      console.error("Erro ao criar tarefa:", err)
      setError(err.message || "Ocorreu um erro ao criar a tarefa. Por favor, tente novamente.")
      toast({
        title: "Erro",
        description: err.message || "Não foi possível criar a tarefa",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const toggleDebugInfo = () => {
    setDebugVisible(!debugVisible)
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
                value={projectId?.toString() || ""}
                onChange={(e) => setProjectId(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4b7bb5] focus:border-transparent"
                disabled={isLoadingProjects}
              >
                <option value="">Selecione um projeto</option>
                {projects.map((project) => (
                  <option key={project.id} value={project.id.toString()}>
                    {project.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="status-select" className="block text-sm font-medium text-gray-700 mb-1">
                Status (visual apenas)
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
              <p className="text-xs text-amber-600 mt-1 flex items-center">
                <AlertCircle size={12} className="mr-1" />
                Este campo é apenas visual e não será salvo no banco de dados
              </p>
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
            <label htmlFor="task-color" className="block text-sm font-medium text-gray-700 mb-1">
              Cor da Tarefa (visual apenas)
            </label>
            <div className="grid grid-cols-5 gap-2">
              {COLOR_OPTIONS.map((color) => (
                <button
                  key={color.id}
                  type="button"
                  title={color.name}
                  onClick={() => setTaskColor(color.id)}
                  className={`w-8 h-8 rounded-full border-2 ${
                    taskColor === color.id ? "border-gray-900" : "border-transparent"
                  } hover:border-gray-400 transition-colors`}
                  style={{ backgroundColor: color.id }}
                />
              ))}
            </div>
            <div className="mt-2 text-xs text-gray-500 flex items-center">
              <span>
                Cor selecionada:{" "}
                <span className="font-medium">{COLOR_OPTIONS.find((c) => c.id === taskColor)?.name}</span>
              </span>
              <span className="text-amber-600 ml-2 flex items-center">
                <AlertCircle size={12} className="mr-1" />
                Visual apenas
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="task-creator" className="block text-sm font-medium text-gray-700 mb-1">
                Criador da Tarefa (visual apenas)
              </label>
              <input
                type="text"
                id="task-creator"
                value={creator}
                onChange={(e) => setCreator(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4b7bb5] focus:border-transparent"
                placeholder="Nome do criador"
              />
              <p className="text-xs text-amber-600 mt-1 flex items-center">
                <AlertCircle size={12} className="mr-1" />
                Visual apenas
              </p>
            </div>
            <div>
              <label htmlFor="task-assignee" className="block text-sm font-medium text-gray-700 mb-1">
                Responsável (visual apenas)
              </label>
              <input
                type="text"
                id="task-assignee"
                value={assignee}
                onChange={(e) => setAssignee(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4b7bb5] focus:border-transparent"
                placeholder="Nome do responsável"
              />
              <p className="text-xs text-amber-600 mt-1 flex items-center">
                <AlertCircle size={12} className="mr-1" />
                Visual apenas
              </p>
            </div>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
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

          <div className="mb-4">
            <button type="button" className="flex items-center text-sm text-[#4b7bb5] hover:text-[#3d649e]">
              <Paperclip size={16} className="mr-1" />
              <span>Anexar arquivo</span>
            </button>
          </div>

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
