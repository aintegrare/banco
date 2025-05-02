"use client"

import { useState, useEffect } from "react"
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd"
import Link from "next/link"
import { ArrowRight, Plus, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { CreateTaskDialog } from "@/components/tasks/create-task-dialog"
import { EditTaskDialog } from "@/components/tasks/edit-task-dialog"
import { useToast } from "@/components/ui/use-toast"

// Colunas do quadro Kanban
const COLUMNS = [
  { id: "backlog", title: "Backlog" },
  { id: "todo", title: "A Fazer" },
  { id: "in-progress", title: "Em Progresso" },
  { id: "review", title: "Em Revisão" },
  { id: "done", title: "Concluído" },
]

interface Task {
  id: string | number
  title: string
  status: string
  assignee?: string
  priority: string
  due_date?: string
  project_id: string | number
}

interface ProjectKanbanProps {
  tasks: Task[]
  projectId: string | number
}

export function ProjectKanban({ tasks: initialTasks, projectId }: ProjectKanbanProps) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks || [])
  const [isLoading, setIsLoading] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [editTaskId, setEditTaskId] = useState<string | number | null>(null)
  const { toast } = useToast()

  // Buscar tarefas do projeto
  useEffect(() => {
    const fetchTasks = async () => {
      if (!projectId) return

      setIsLoading(true)
      try {
        const response = await fetch(`/api/tasks?projectId=${projectId}`)
        if (!response.ok) {
          throw new Error("Falha ao buscar tarefas")
        }
        const data = await response.json()
        setTasks(data)
      } catch (error: any) {
        console.error("Erro ao buscar tarefas:", error)
        toast({
          title: "Erro",
          description: "Não foi possível carregar as tarefas do projeto",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchTasks()
  }, [projectId, toast])

  const formatDate = (dateString?: string) => {
    if (!dateString) return "Sem data"
    const date = new Date(dateString)
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
    })
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-500"
      case "medium":
        return "bg-orange-500"
      case "low":
        return "bg-green-500"
      default:
        return "bg-gray-500"
    }
  }

  const onDragEnd = async (result: any) => {
    const { destination, source, draggableId } = result

    // Se não houver destino ou se o destino for o mesmo que a origem, não fazer nada
    if (!destination || (destination.droppableId === source.droppableId && destination.index === source.index)) {
      return
    }

    // Encontrar a tarefa que está sendo movida
    const taskToUpdate = tasks.find((task) => task.id.toString() === draggableId)

    if (!taskToUpdate) {
      console.error("Tarefa não encontrada:", draggableId)
      return
    }

    // Atualizar o status da tarefa localmente
    const updatedTasks = tasks.map((task) => {
      if (task.id.toString() === draggableId) {
        return { ...task, status: destination.droppableId }
      }
      return task
    })

    // Atualizar o estado local imediatamente para feedback visual
    setTasks(updatedTasks)
    setIsUpdating(true)

    try {
      // Atualizar o status da tarefa no servidor
      const response = await fetch(`/api/tasks/${draggableId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...taskToUpdate,
          status: destination.droppableId,
        }),
      })

      if (!response.ok) {
        throw new Error("Falha ao atualizar status da tarefa")
      }

      toast({
        title: "Status atualizado",
        description: "O status da tarefa foi atualizado com sucesso",
      })
    } catch (error: any) {
      console.error("Erro ao atualizar status da tarefa:", error)

      // Reverter a alteração local em caso de erro
      setTasks(tasks)

      toast({
        title: "Erro",
        description: "Não foi possível atualizar o status da tarefa",
        variant: "destructive",
      })
    } finally {
      setIsUpdating(false)
    }
  }

  const handleTaskCreated = (newTask: Task) => {
    setTasks((prevTasks) => [newTask, ...prevTasks])
    toast({
      title: "Tarefa criada",
      description: "A tarefa foi criada com sucesso!",
    })
  }

  const handleTaskUpdated = (updatedTask: Task) => {
    setTasks((prevTasks) => prevTasks.map((task) => (task.id === updatedTask.id ? updatedTask : task)))
    toast({
      title: "Tarefa atualizada",
      description: "A tarefa foi atualizada com sucesso!",
    })
  }

  // Organizar tarefas por coluna
  const tasksByColumn = COLUMNS.reduce((acc: any, column) => {
    acc[column.id] = tasks.filter((task) => task.status === column.id)
    return acc
  }, {})

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-medium text-gray-800">Quadro Kanban</h2>
        <div className="flex items-center space-x-2">
          <Link
            href={`/tarefas?projeto=${projectId}`}
            className="inline-flex items-center text-sm text-[#4b7bb5] hover:underline mr-2"
          >
            Ver quadro completo
            <ArrowRight size={16} className="ml-1" />
          </Link>

          <Button size="sm" onClick={() => setIsCreateDialogOpen(true)} className="bg-[#4b7bb5] hover:bg-[#3d649e]">
            <Plus size={16} className="mr-1" />
            Nova
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 size={30} className="text-[#4b7bb5] animate-spin" />
        </div>
      ) : (
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="flex overflow-x-auto pb-4 -mx-2">
            {COLUMNS.map((column) => (
              <div key={column.id} className="flex-shrink-0 w-64 mx-2 first:ml-0 last:mr-0">
                <div className="bg-gray-100 rounded-lg h-full flex flex-col">
                  <div className="p-2 font-medium text-sm text-gray-700 border-b border-gray-200 bg-gray-200 rounded-t-lg flex justify-between items-center">
                    <span>{column.title}</span>
                    <span className="bg-white text-gray-600 text-xs font-normal py-1 px-2 rounded-full">
                      {tasksByColumn[column.id]?.length || 0}
                    </span>
                  </div>

                  <Droppable droppableId={column.id}>
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className="flex-grow p-2 overflow-y-auto"
                        style={{ maxHeight: "300px", minHeight: "100px" }}
                      >
                        {tasksByColumn[column.id]?.map((task: Task, index: number) => (
                          <Draggable key={task.id} draggableId={task.id.toString()} index={index}>
                            {(provided) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className="mb-2 last:mb-0"
                                onClick={() => setEditTaskId(task.id)}
                              >
                                <div className="bg-white rounded-lg p-3 shadow-sm border border-gray-200 cursor-pointer">
                                  <div className="flex items-start justify-between">
                                    <h3 className="text-sm font-medium text-gray-800 line-clamp-2">{task.title}</h3>
                                    <div
                                      className={`w-2 h-2 rounded-full ${getPriorityColor(task.priority)} ml-2 flex-shrink-0`}
                                    ></div>
                                  </div>
                                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-100">
                                    <div className="flex items-center">
                                      <div className="w-5 h-5 rounded-full bg-[#4b7bb5] flex items-center justify-center text-white text-xs">
                                        {task.assignee ? task.assignee.charAt(0).toUpperCase() : "?"}
                                      </div>
                                    </div>
                                    <div className="text-xs text-gray-500">{formatDate(task.due_date)}</div>
                                  </div>
                                </div>
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </div>
              </div>
            ))}
          </div>
        </DragDropContext>
      )}

      {/* Diálogo de criação de tarefa */}
      <CreateTaskDialog
        isOpen={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
        initialProject={projectId}
        onTaskCreated={handleTaskCreated}
      />

      {/* Diálogo de edição de tarefa */}
      {editTaskId && (
        <EditTaskDialog
          isOpen={!!editTaskId}
          onClose={() => setEditTaskId(null)}
          taskId={editTaskId}
          onSave={handleTaskUpdated}
        />
      )}
    </div>
  )
}
