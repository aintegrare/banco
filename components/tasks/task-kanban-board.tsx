"use client"

import { useState } from "react"
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Plus, Edit, Trash2 } from "lucide-react"
import { useTasks } from "@/hooks/use-tasks"
import { TASK_STATUS, type Task, type TaskStatus, type TaskFilters } from "@/lib/types"
import { useToast } from "@/components/ui/use-toast"

interface TaskKanbanBoardProps {
  filters?: TaskFilters
}

const COLUMNS = [
  { id: TASK_STATUS.BACKLOG, title: "Backlog", color: "bg-gray-100" },
  { id: TASK_STATUS.TODO, title: "A Fazer", color: "bg-blue-100" },
  { id: TASK_STATUS.IN_PROGRESS, title: "Em Progresso", color: "bg-yellow-100" },
  { id: TASK_STATUS.REVIEW, title: "Em Revisão", color: "bg-purple-100" },
  { id: TASK_STATUS.DONE, title: "Concluído", color: "bg-green-100" },
]

export function TaskKanbanBoard({ filters }: TaskKanbanBoardProps) {
  const { toast } = useToast()
  const { tasks, isLoading, error, updateTaskStatus, deleteTask, stats } = useTasks({ filters, autoLoad: true })

  const [isDragging, setIsDragging] = useState(false)

  // Organizar tarefas por status
  const tasksByStatus = tasks.reduce(
    (acc, task) => {
      const status = task.status || TASK_STATUS.TODO
      if (!acc[status]) acc[status] = []
      acc[status].push(task)
      return acc
    },
    {} as Record<TaskStatus, Task[]>,
  )

  // Handle drag end
  const handleDragEnd = async (result: any) => {
    setIsDragging(false)

    const { destination, source, draggableId } = result

    if (!destination) return

    if (destination.droppableId === source.droppableId && destination.index === source.index) {
      return
    }

    try {
      const taskId = Number.parseInt(draggableId.replace("task-", ""))
      const newStatus = destination.droppableId as TaskStatus

      console.log(`🎯 Movendo tarefa ${taskId} para ${newStatus}`)

      await updateTaskStatus(taskId, newStatus)

      toast({
        title: "Status atualizado",
        description: `Tarefa movida para ${COLUMNS.find((c) => c.id === newStatus)?.title}`,
      })
    } catch (error: any) {
      console.error("❌ Erro no drag and drop:", error)
      toast({
        title: "Erro",
        description: "Não foi possível mover a tarefa",
        variant: "destructive",
      })
    }
  }

  const handleDeleteTask = async (taskId: number) => {
    if (!confirm("Tem certeza que deseja deletar esta tarefa?")) return

    try {
      await deleteTask(taskId)
      toast({
        title: "Tarefa deletada",
        description: "A tarefa foi removida com sucesso",
      })
    } catch (error: any) {
      toast({
        title: "Erro",
        description: "Não foi possível deletar a tarefa",
        variant: "destructive",
      })
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
        <span className="ml-2">Carregando tarefas...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-red-600 font-medium">❌ {error}</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Header com estatísticas */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Quadro Kanban</h2>
          <p className="text-gray-600">
            {tasks.length} tarefa{tasks.length !== 1 ? "s" : ""} total
          </p>
        </div>

        {stats && (
          <div className="flex gap-2">
            {Object.entries(stats.byStatus).map(([status, count]) => (
              <Badge key={status} variant="outline">
                {COLUMNS.find((c) => c.id === status)?.title}: {count}
              </Badge>
            ))}
          </div>
        )}
      </div>

      {/* Quadro Kanban */}
      <DragDropContext onDragStart={() => setIsDragging(true)} onDragEnd={handleDragEnd}>
        <div className="flex gap-4 overflow-x-auto min-h-96 pb-4">
          {COLUMNS.map((column) => {
            const columnTasks = tasksByStatus[column.id] || []

            return (
              <div key={column.id} className="flex-shrink-0 w-80">
                {/* Header da coluna */}
                <div className={`${column.color} p-3 rounded-t-lg border-b`}>
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-gray-800">{column.title}</h3>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">{columnTasks.length}</Badge>
                      <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                        <Plus size={14} />
                      </Button>
                    </div>
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
                        <Draggable key={task.id} draggableId={`task-${task.id}`} index={index}>
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
                              <TaskCard task={task} onDelete={() => handleDeleteTask(task.id)} />
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

// Componente de Card da Tarefa
function TaskCard({ task, onDelete }: { task: Task; onDelete: () => void }) {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "low":
        return "bg-green-100 text-green-800"
      case "urgent":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-2">
      {/* Header com ações */}
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h4 className="font-medium text-gray-900 line-clamp-2">{task.title}</h4>
          <div className="text-xs text-gray-400 mt-1">#{task.id}</div>
        </div>

        <div className="flex gap-1 ml-2">
          <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
            <Edit size={12} />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="h-6 w-6 p-0 text-red-600 hover:text-red-700"
            onClick={(e) => {
              e.stopPropagation()
              onDelete()
            }}
          >
            <Trash2 size={12} />
          </Button>
        </div>
      </div>

      {/* Descrição */}
      {task.description && <p className="text-sm text-gray-600 line-clamp-2">{task.description}</p>}

      {/* Footer com metadados */}
      <div className="flex items-center justify-between pt-2">
        {/* Prioridade */}
        {task.priority && <Badge className={getPriorityColor(task.priority)}>{task.priorityLabel}</Badge>}

        {/* Data de vencimento */}
        {task.due_date && (
          <span
            className={`text-xs px-2 py-1 rounded ${
              task.isOverdue ? "bg-red-100 text-red-600" : "bg-gray-100 text-gray-600"
            }`}
          >
            {new Date(task.due_date).toLocaleDateString("pt-BR")}
          </span>
        )}
      </div>
    </div>
  )
}
