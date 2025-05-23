"use client"

import { useState, useEffect } from "react"
import { DragDropContext, Droppable, Draggable, type DropResult } from "@hello-pangea/dnd"

interface Task {
  id: number
  title: string
  description?: string | null
  status: string
  priority?: string
  project_id?: number | null
  due_date?: string | null
}

interface ProjectKanbanProps {
  projectId: number
  className?: string
}

const COLUMNS = [
  { id: "backlog", title: "Backlog", color: "bg-gray-100" },
  { id: "todo", title: "A Fazer", color: "bg-blue-100" },
  { id: "in_progress", title: "Em Progresso", color: "bg-yellow-100" },
  { id: "review", title: "Em Revisão", color: "bg-purple-100" },
  { id: "done", title: "Concluído", color: "bg-green-100" },
]

export function ProjectKanban({ projectId, className = "" }: ProjectKanbanProps) {
  const [tasks, setTasks] = useState<Task[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)

  // Função para buscar tarefas do projeto - COM VALIDAÇÃO ROBUSTA
  const fetchTasks = async () => {
    setIsLoading(true)
    setError(null)

    try {
      console.log(`🔄 [PROJECT-KANBAN] Carregando tarefas do projeto ${projectId}`)

      const response = await fetch(`/api/tasks?project_id=${projectId}`)
      const result = await response.json()

      console.log(`📋 [PROJECT-KANBAN] Resposta da API:`, result)

      if (!response.ok) {
        throw new Error(`Erro HTTP ${response.status}: ${result.error || "Erro desconhecido"}`)
      }

      if (!result.success) {
        throw new Error(result.error || "Erro ao buscar tarefas")
      }

      // VALIDAÇÃO ROBUSTA: Garantir que sempre temos um array
      let tasksData = []

      if (result.data) {
        if (Array.isArray(result.data)) {
          tasksData = result.data
        } else if (typeof result.data === "object" && result.data.tasks && Array.isArray(result.data.tasks)) {
          tasksData = result.data.tasks
        } else if (typeof result.data === "object") {
          // Se for um objeto, tenta extrair o primeiro array encontrado
          const arrayValues = Object.values(result.data).filter(Array.isArray)
          if (arrayValues.length > 0) {
            tasksData = arrayValues[0] as Task[]
          }
        }
      }

      // Filtrar apenas tarefas válidas
      const validTasks = tasksData
        .filter((task) => task && typeof task === "object" && task.id)
        .map((task) => ({
          ...task,
          id: Number.parseInt(task.id.toString(), 10),
          status: task.status || "todo",
          project_id: Number.parseInt(task.project_id?.toString() || "0", 10) || null,
        }))
        .filter((task) => !isNaN(task.id) && task.id > 0)

      console.log(`✅ [PROJECT-KANBAN] ${validTasks.length} tarefas válidas carregadas`)
      setTasks(validTasks)
    } catch (err: any) {
      console.error(`❌ [PROJECT-KANBAN] Erro ao buscar tarefas:`, err)
      setError(err.message)
      setTasks([]) // Garantir que sempre é um array
    } finally {
      setIsLoading(false)
    }
  }

  // Atualizar status da tarefa
  const updateTaskStatus = async (taskId: number, newStatus: string) => {
    try {
      console.log(`🔄 [PROJECT-KANBAN] Atualizando tarefa ${taskId} para ${newStatus}`)

      // Atualização otimista
      setTasks((prev) => prev.map((task) => (task.id === taskId ? { ...task, status: newStatus } : task)))

      const response = await fetch(`/api/tasks/${taskId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      })

      const result = await response.json()

      if (!result.success) {
        throw new Error(result.error || "Erro ao atualizar status")
      }

      // Confirmar atualização
      setTasks((prev) => prev.map((task) => (task.id === taskId ? result.data : task)))

      console.log(`✅ [PROJECT-KANBAN] Status atualizado`)
    } catch (err: any) {
      console.error(`❌ [PROJECT-KANBAN] Erro ao atualizar status:`, err)
      // Reverter mudança otimista
      await fetchTasks()
      throw err
    }
  }

  // Handle drag end
  const handleDragEnd = async (result: DropResult) => {
    setIsDragging(false)

    const { destination, source, draggableId } = result

    if (!destination || (destination.droppableId === source.droppableId && destination.index === source.index)) {
      return
    }

    try {
      const taskId = Number.parseInt(draggableId, 10)
      if (isNaN(taskId)) throw new Error(`ID inválido: ${draggableId}`)

      const newStatus = destination.droppableId
      await updateTaskStatus(taskId, newStatus)
    } catch (error: any) {
      console.error("❌ [PROJECT-KANBAN] Erro no drag and drop:", error)
      setError(error.message)
    }
  }

  // Organizar tarefas por status
  const tasksByStatus = tasks.reduce(
    (acc, task) => {
      const status = task.status || "todo"
      if (!acc[status]) acc[status] = []
      acc[status].push(task)
      return acc
    },
    {} as Record<string, Task[]>,
  )

  // Carregar tarefas quando componente monta ou projectId muda
  useEffect(() => {
    if (projectId) {
      fetchTasks()
    }
  }, [projectId])

  if (isLoading) {
    return (
      <div className={`flex items-center justify-center p-8 ${className}`}>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
        <span className="ml-2">Carregando tarefas do projeto...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className={`p-4 bg-red-50 border border-red-200 rounded-lg ${className}`}>
        <p className="text-red-600 font-medium">❌ {error}</p>
        <button onClick={fetchTasks} className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">
          🔄 Tentar Novamente
        </button>
      </div>
    )
  }

  return (
    <div className={`w-full ${className}`}>
      {/* Header */}
      <div className="mb-4 p-3 bg-green-50 rounded-lg">
        <div className="flex items-center justify-between">
          <h3 className="font-medium text-green-800">📋 Kanban do Projeto #{projectId}</h3>
          <div className="text-sm text-green-600">
            {tasks.length} tarefa{tasks.length !== 1 ? "s" : ""}
          </div>
        </div>
      </div>

      <DragDropContext onDragStart={() => setIsDragging(true)} onDragEnd={handleDragEnd}>
        <div className="flex gap-4 overflow-x-auto min-h-96 pb-4">
          {COLUMNS.map((column) => {
            const columnTasks = tasksByStatus[column.id] || []

            return (
              <div key={column.id} className="flex-shrink-0 w-80">
                {/* Header da coluna */}
                <div className={`${column.color} p-3 rounded-t-lg border-b`}>
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-gray-800">{column.title}</h4>
                    <span className="bg-white px-2 py-1 rounded-full text-xs font-medium text-gray-600">
                      {columnTasks.length}
                    </span>
                  </div>
                </div>

                {/* Lista de tarefas */}
                <Droppable droppableId={column.id}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={`
                        min-h-96 p-3 bg-gray-50 rounded-b-lg border border-t-0
                        ${snapshot.isDraggedOver ? "bg-blue-50" : ""}
                        ${isDragging ? "border-blue-300" : "border-gray-200"}
                      `}
                    >
                      {columnTasks.map((task, index) => (
                        <Draggable key={task.id} draggableId={task.id.toString()} index={index}>
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className={`
                                bg-white rounded-lg p-3 mb-3 border shadow-sm
                                hover:shadow-md transition-shadow cursor-pointer
                                ${snapshot.isDragging ? "shadow-lg rotate-2" : ""}
                              `}
                            >
                              <ProjectTaskCard task={task} />
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}

                      {/* Empty state */}
                      {columnTasks.length === 0 && (
                        <div className="text-center py-8 text-gray-400">
                          <p className="text-sm">Nenhuma tarefa</p>
                        </div>
                      )}
                    </div>
                  )}
                </Droppable>
              </div>
            )
          })}
        </div>
      </DragDropContext>
    </div>
  )
}

// Componente de card para tarefa do projeto
function ProjectTaskCard({ task }: { task: Task }) {
  const priorityColors = {
    low: "bg-green-100 text-green-800",
    medium: "bg-yellow-100 text-yellow-800",
    high: "bg-orange-100 text-orange-800",
    urgent: "bg-red-100 text-red-800",
  }

  return (
    <div className="space-y-2">
      {/* Header com ID */}
      <div className="flex items-center justify-between text-xs text-gray-400">
        <span>#{task.id}</span>
        <span className="font-mono">{task.status}</span>
      </div>

      {/* Título */}
      <h5 className="font-medium text-gray-900 line-clamp-2">{task.title}</h5>

      {/* Descrição */}
      {task.description && <p className="text-sm text-gray-600 line-clamp-2">{task.description}</p>}

      {/* Footer */}
      <div className="flex items-center justify-between pt-2">
        {/* Prioridade */}
        {task.priority && (
          <span
            className={`
            px-2 py-1 rounded-full text-xs font-medium
            ${priorityColors[task.priority as keyof typeof priorityColors] || "bg-gray-100 text-gray-800"}
          `}
          >
            {task.priority}
          </span>
        )}

        {/* Data de vencimento */}
        {task.due_date && (
          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
            📅 {new Date(task.due_date).toLocaleDateString("pt-BR")}
          </span>
        )}
      </div>
    </div>
  )
}

export default ProjectKanban
