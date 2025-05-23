"use client"

import { useState } from "react"
import { DragDropContext, Droppable, Draggable, type DropResult } from "@hello-pangea/dnd"
import { useSimpleTasks } from "@/hooks/use-simple-tasks"
import { SimpleCreateTaskDialog } from "./simple-create-task-dialog"
import { SimpleEditTaskDialog } from "./simple-edit-task-dialog"
import type { SimpleTask } from "@/lib/simple-task-service"

interface CompleteKanbanSystemProps {
  projectId?: number
  className?: string
}

const COLUMNS = [
  { id: "backlog", title: "Backlog", color: "bg-gray-100" },
  { id: "todo", title: "A Fazer", color: "bg-blue-100" },
  { id: "in_progress", title: "Em Progresso", color: "bg-yellow-100" },
  { id: "review", title: "Em Revisão", color: "bg-purple-100" },
  { id: "done", title: "Concluído", color: "bg-green-100" },
]

export function CompleteKanbanSystem({ projectId, className = "" }: CompleteKanbanSystemProps) {
  const { tasks, isLoading, error, updateTaskStatus, tasksByStatus, loadTasks } = useSimpleTasks(projectId)

  const [isDragging, setIsDragging] = useState(false)
  const [dragError, setDragError] = useState<string | null>(null)

  // Estados dos dialogs
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [editingTaskId, setEditingTaskId] = useState<number | undefined>()

  // Handle drag end
  const handleDragEnd = async (result: DropResult) => {
    setIsDragging(false)
    setDragError(null)

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
      console.error("❌ Erro no drag and drop:", error)
      setDragError(error.message)
    }
  }

  // Handle task created
  const handleTaskCreated = () => {
    loadTasks() // Recarregar lista
  }

  // Handle task updated
  const handleTaskUpdated = () => {
    loadTasks() // Recarregar lista
  }

  // Handle edit task
  const handleEditTask = (taskId: number) => {
    setEditingTaskId(taskId)
    setEditDialogOpen(true)
  }

  // Handle delete task
  const handleDeleteTask = async (taskId: number) => {
    if (!confirm("Tem certeza que deseja excluir esta tarefa?")) return

    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: "DELETE",
      })

      const result = await response.json()

      if (!result.success) {
        throw new Error(result.error || "Erro ao excluir tarefa")
      }

      loadTasks() // Recarregar lista
    } catch (error: any) {
      console.error("❌ Erro ao excluir tarefa:", error)
      alert(`Erro ao excluir tarefa: ${error.message}`)
    }
  }

  if (isLoading) {
    return (
      <div className={`flex items-center justify-center p-8 ${className}`}>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
        <span className="ml-2">Carregando tarefas...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className={`p-4 bg-red-50 border border-red-200 rounded-lg ${className}`}>
        <p className="text-red-600 font-medium">❌ {error}</p>
        <button onClick={loadTasks} className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">
          🔄 Tentar Novamente
        </button>
      </div>
    )
  }

  const organizedTasks = tasksByStatus()

  return (
    <div className={`w-full ${className}`}>
      {/* Header com botão de criar tarefa */}
      <div className="mb-4 p-3 bg-blue-50 rounded-lg">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-medium text-blue-800">📋 Quadro Kanban {projectId ? `- Projeto ${projectId}` : ""}</h2>
            <p className="text-sm text-blue-600">
              {tasks.length} tarefa{tasks.length !== 1 ? "s" : ""} total
            </p>
          </div>
          <button
            onClick={() => setCreateDialogOpen(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center gap-2"
          >
            ➕ Nova Tarefa
          </button>
        </div>
      </div>

      {/* Erro de drag & drop */}
      {dragError && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600 text-sm">❌ {dragError}</p>
          <button onClick={() => setDragError(null)} className="mt-1 text-xs text-red-500 hover:text-red-700">
            Fechar
          </button>
        </div>
      )}

      {/* Kanban Board */}
      <DragDropContext onDragStart={() => setIsDragging(true)} onDragEnd={handleDragEnd}>
        <div className="flex gap-4 overflow-x-auto min-h-96 pb-4">
          {COLUMNS.map((column) => {
            const columnTasks = organizedTasks[column.id] || []

            return (
              <div key={column.id} className="flex-shrink-0 w-80">
                {/* Header da coluna */}
                <div className={`${column.color} p-3 rounded-t-lg border-b`}>
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-gray-800">{column.title}</h3>
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
                              <TaskCard
                                task={task}
                                onEdit={() => handleEditTask(task.id)}
                                onDelete={() => handleDeleteTask(task.id)}
                              />
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

      {/* Dialogs */}
      <SimpleCreateTaskDialog
        projectId={projectId}
        isOpen={createDialogOpen}
        onClose={() => setCreateDialogOpen(false)}
        onTaskCreated={handleTaskCreated}
      />

      <SimpleEditTaskDialog
        taskId={editingTaskId}
        isOpen={editDialogOpen}
        onClose={() => {
          setEditDialogOpen(false)
          setEditingTaskId(undefined)
        }}
        onTaskUpdated={handleTaskUpdated}
      />
    </div>
  )
}

// Componente de Card com botões de ação
function TaskCard({
  task,
  onEdit,
  onDelete,
}: {
  task: SimpleTask
  onEdit: () => void
  onDelete: () => void
}) {
  const priorityColors = {
    low: "bg-green-100 text-green-800",
    medium: "bg-yellow-100 text-yellow-800",
    high: "bg-orange-100 text-orange-800",
    urgent: "bg-red-100 text-red-800",
  }

  const priorityLabels = {
    low: "Baixa",
    medium: "Média",
    high: "Alta",
    urgent: "Urgente",
  }

  return (
    <div className="space-y-2">
      {/* Header com ID e botões */}
      <div className="flex items-center justify-between text-xs">
        <span className="text-gray-400">#{task.id}</span>
        <div className="flex items-center space-x-1">
          <button
            onClick={(e) => {
              e.stopPropagation()
              onEdit()
            }}
            className="text-blue-500 hover:text-blue-700 p-1"
            title="Editar"
          >
            ✏️
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation()
              onDelete()
            }}
            className="text-red-500 hover:text-red-700 p-1"
            title="Excluir"
          >
            🗑️
          </button>
        </div>
      </div>

      {/* Título */}
      <h4 className="font-medium text-gray-900 line-clamp-2">{task.title}</h4>

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
            {priorityLabels[task.priority as keyof typeof priorityLabels] || task.priority}
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
