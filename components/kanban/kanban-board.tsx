"use client"

import { useState, useEffect } from "react"
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Loader2, Plus, Calendar, AlertCircle } from "lucide-react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { useTasks } from "@/hooks/use-tasks"
import { TASK_STATUS, PRIORITY, type Task } from "@/lib/types"
import { TaskCreateDialog } from "@/components/tasks/task-create-dialog"
import { TaskEditDialog } from "@/components/tasks/task-edit-dialog"

interface KanbanBoardProps {
  projectId?: number
}

export function KanbanBoard({ projectId }: KanbanBoardProps) {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [editTaskId, setEditTaskId] = useState<number | null>(null)

  // Usar o hook de tarefas
  const { tasks, isLoading, error, loadTasks, createTask, updateTask, updateTaskStatus, deleteTask } = useTasks({
    initialFilters: projectId ? { project_id: projectId } : undefined,
    autoLoad: true,
  })

  // Agrupar tarefas por status
  const [columns, setColumns] = useState<Record<string, Task[]>>({})

  useEffect(() => {
    // Inicializar colunas vazias para todos os status
    const initialColumns: Record<string, Task[]> = {}
    Object.values(TASK_STATUS).forEach((status) => {
      initialColumns[status] = []
    })

    // Preencher colunas com tarefas
    tasks.forEach((task) => {
      const status = task.status
      if (!initialColumns[status]) initialColumns[status] = []
      initialColumns[status].push(task)
    })

    setColumns(initialColumns)
  }, [tasks])

  // Formatar data
  const formatDate = (dateString?: string | null) => {
    if (!dateString) return null
    try {
      return format(new Date(dateString), "dd/MM/yyyy", { locale: ptBR })
    } catch (e) {
      return null
    }
  }

  // Obter cor da prioridade
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case PRIORITY.HIGH:
        return "bg-red-100 text-red-800 border-red-300"
      case PRIORITY.MEDIUM:
        return "bg-orange-100 text-orange-800 border-orange-300"
      case PRIORITY.LOW:
        return "bg-green-100 text-green-800 border-green-300"
      case PRIORITY.URGENT:
        return "bg-purple-100 text-purple-800 border-purple-300"
      default:
        return "bg-gray-100 text-gray-800 border-gray-300"
    }
  }

  // Obter label da prioridade
  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case PRIORITY.HIGH:
        return "Alta"
      case PRIORITY.MEDIUM:
        return "Média"
      case PRIORITY.LOW:
        return "Baixa"
      case PRIORITY.URGENT:
        return "Urgente"
      default:
        return priority
    }
  }

  // Obter label do status
  const getStatusLabel = (status: string) => {
    switch (status) {
      case TASK_STATUS.BACKLOG:
        return "Backlog"
      case TASK_STATUS.TODO:
        return "A Fazer"
      case TASK_STATUS.IN_PROGRESS:
        return "Em Progresso"
      case TASK_STATUS.REVIEW:
        return "Em Revisão"
      case TASK_STATUS.DONE:
        return "Concluído"
      default:
        return status
    }
  }

  // Obter cor do status
  const getStatusColor = (status: string) => {
    switch (status) {
      case TASK_STATUS.BACKLOG:
        return "bg-gray-100"
      case TASK_STATUS.TODO:
        return "bg-blue-50"
      case TASK_STATUS.IN_PROGRESS:
        return "bg-yellow-50"
      case TASK_STATUS.REVIEW:
        return "bg-orange-50"
      case TASK_STATUS.DONE:
        return "bg-green-50"
      default:
        return "bg-gray-50"
    }
  }

  // Manipuladores de eventos
  const handleCreateTask = async (taskData: any) => {
    try {
      await createTask({
        ...taskData,
        project_id: projectId,
      })
      setIsCreateDialogOpen(false)
    } catch (error) {
      console.error("Erro ao criar tarefa:", error)
    }
  }

  const handleUpdateTask = async (taskId: number, taskData: any) => {
    try {
      await updateTask(taskId, taskData)
      setEditTaskId(null)
    } catch (error) {
      console.error("Erro ao atualizar tarefa:", error)
    }
  }

  const handleDeleteTask = async (taskId: number) => {
    if (confirm("Tem certeza que deseja excluir esta tarefa?")) {
      try {
        await deleteTask(taskId)
      } catch (error) {
        console.error("Erro ao excluir tarefa:", error)
      }
    }
  }

  // Manipulador de drag and drop
  const handleDragEnd = async (result: any) => {
    const { destination, source, draggableId } = result

    // Se não houver destino ou o destino for o mesmo que a origem, não fazer nada
    if (!destination || (destination.droppableId === source.droppableId && destination.index === source.index)) {
      return
    }

    // Obter o ID da tarefa arrastada
    const taskId = Number(draggableId.replace("task-", ""))

    // Obter o status de origem e destino
    const sourceStatus = source.droppableId
    const destinationStatus = destination.droppableId

    // Atualizar colunas localmente (otimista)
    const newColumns = { ...columns }

    // Remover da coluna de origem
    const sourceColumn = [...newColumns[sourceStatus]]
    const [movedTask] = sourceColumn.splice(source.index, 1)
    newColumns[sourceStatus] = sourceColumn

    // Adicionar à coluna de destino
    const destinationColumn = [...newColumns[destinationStatus]]
    destinationColumn.splice(destination.index, 0, {
      ...movedTask,
      status: destinationStatus,
    })
    newColumns[destinationStatus] = destinationColumn

    // Atualizar estado local
    setColumns(newColumns)

    try {
      // Se o status mudou, atualizar no servidor
      if (sourceStatus !== destinationStatus) {
        await updateTaskStatus(taskId, destinationStatus as any)
      }

      // Reordenar tarefas no servidor
      const taskIds = newColumns[destinationStatus].map((task) => task.id)

      await fetch("/api/tasks/reorder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          taskIds,
          newStatus: destinationStatus,
        }),
      })
    } catch (error) {
      console.error("Erro ao atualizar ordem das tarefas:", error)
      // Em caso de erro, recarregar tarefas
      loadTasks()
    }
  }

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Quadro Kanban</h1>
        <Button onClick={() => setIsCreateDialogOpen(true)} className="bg-[#4b7bb5] hover:bg-[#3d649e]">
          <Plus className="mr-2 h-4 w-4" /> Nova Tarefa
        </Button>
      </div>

      {/* Quadro Kanban */}
      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 size={30} className="text-[#4b7bb5] animate-spin" />
        </div>
      ) : error ? (
        <div className="text-center py-8 text-red-500">
          <AlertCircle className="mx-auto h-8 w-8 mb-2" />
          <p>{error}</p>
        </div>
      ) : (
        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 overflow-x-auto pb-4">
            {Object.entries(columns).map(([status, tasks]) => (
              <div key={status} className="min-w-[280px]">
                <Card className={`${getStatusColor(status)} border-t-4 border-t-[#4b7bb5]`}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium flex justify-between items-center">
                      <span>{getStatusLabel(status)}</span>
                      <Badge variant="outline">{tasks.length}</Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-2">
                    <Droppable droppableId={status}>
                      {(provided) => (
                        <div ref={provided.innerRef} {...provided.droppableProps} className="min-h-[200px]">
                          {tasks.map((task, index) => (
                            <Draggable key={`task-${task.id}`} draggableId={`task-${task.id}`} index={index}>
                              {(provided) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  className="mb-2"
                                >
                                  <Card
                                    className="bg-white hover:shadow-md transition-shadow cursor-pointer"
                                    onClick={() => setEditTaskId(task.id)}
                                  >
                                    <CardContent className="p-3">
                                      <div className="flex justify-between items-start mb-2">
                                        <h3 className="font-medium text-sm line-clamp-2">{task.title}</h3>
                                        <Badge className={`ml-2 ${getPriorityColor(task.priority)}`}>
                                          {getPriorityLabel(task.priority)}
                                        </Badge>
                                      </div>

                                      {task.description && (
                                        <p className="text-xs text-gray-500 line-clamp-2 mb-2">{task.description}</p>
                                      )}

                                      {task.due_date && formatDate(task.due_date) && (
                                        <div className="flex items-center text-xs text-gray-500 mt-2">
                                          <Calendar size={12} className="mr-1" />
                                          <span>{formatDate(task.due_date)}</span>
                                          {task.isOverdue && (
                                            <Badge variant="destructive" className="ml-2 text-[10px] py-0 px-1">
                                              Atrasada
                                            </Badge>
                                          )}
                                        </div>
                                      )}
                                    </CardContent>
                                  </Card>
                                </div>
                              )}
                            </Draggable>
                          ))}
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </DragDropContext>
      )}

      {/* Diálogos */}
      <TaskCreateDialog
        isOpen={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
        onSubmit={handleCreateTask}
        initialProjectId={projectId}
      />

      {editTaskId && (
        <TaskEditDialog
          isOpen={!!editTaskId}
          taskId={editTaskId}
          onClose={() => setEditTaskId(null)}
          onSubmit={(data) => handleUpdateTask(editTaskId, data)}
          onDelete={() => handleDeleteTask(editTaskId)}
        />
      )}
    </div>
  )
}
