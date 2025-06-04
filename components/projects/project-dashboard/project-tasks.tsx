"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Calendar, Clock, CheckCircle, AlertTriangle, ArrowRight, Plus, Loader2, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { CreateTaskDialog } from "@/components/tasks/create-task-dialog"
import { EditTaskDialog } from "@/components/tasks/edit-task-dialog"
import { useToast } from "@/components/ui/use-toast"
import { DeleteTaskConfirmation } from "@/components/tasks/delete-task-confirmation"

interface Task {
  id: string | number
  title: string
  description: string
  status: string
  due_date?: string
  assignee?: string
  priority: string
  project_id: string | number
}

interface ProjectTasksProps {
  tasks: Task[]
  projectId: string | number
}

export function ProjectTasks({ tasks: initialTasks, projectId }: ProjectTasksProps) {
  const [filter, setFilter] = useState("all")
  const [tasks, setTasks] = useState<Task[]>(initialTasks || [])
  const [isLoading, setIsLoading] = useState(false)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [editTaskId, setEditTaskId] = useState<string | number | null>(null)
  const [deleteTaskId, setDeleteTaskId] = useState<string | number | null>(null)
  const { toast } = useToast()

  // Buscar tarefas do projeto
  useEffect(() => {
    const fetchTasks = async () => {
      if (!projectId) return

      setIsLoading(true)
      try {
        // Adicionando logs para debug
        console.log(`Buscando tarefas para o projeto ID: ${projectId}`)

        const response = await fetch(`/api/tasks?project_id=${projectId}`)
        if (!response.ok) {
          throw new Error("Falha ao buscar tarefas")
        }

        const result = await response.json()
        console.log(`Resposta recebida:`, result)

        // Verificar a estrutura da resposta e extrair o array de tarefas
        let tasksArray: Task[] = []

        if (result && result.success === true && Array.isArray(result.data)) {
          console.log("Usando result.data como fonte de dados")
          tasksArray = result.data
        } else if (Array.isArray(result)) {
          console.log("A resposta já é um array")
          tasksArray = result
        } else if (result && Array.isArray(result.tasks)) {
          console.log("Usando result.tasks como fonte de dados")
          tasksArray = result.tasks
        } else {
          console.error("Estrutura de dados não reconhecida:", result)
          tasksArray = []
        }

        // Filtrando explicitamente pelo project_id para garantir
        const filteredTasks = tasksArray.filter(
          (task: Task) => task.project_id && task.project_id.toString() === projectId.toString(),
        )

        console.log(`Tarefas filtradas: ${filteredTasks.length}`, filteredTasks)
        setTasks(filteredTasks)
      } catch (error: any) {
        console.error("Erro ao buscar tarefas:", error)
        toast({
          title: "Erro",
          description: "Não foi possível carregar as tarefas do projeto",
          variant: "destructive",
        })
        // Em caso de erro, inicializa com array vazio
        setTasks([])
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

  const isOverdue = (dateString?: string) => {
    if (!dateString) return false
    const today = new Date()
    const dueDate = new Date(dateString)
    return dueDate < today
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "text-red-500 bg-red-50"
      case "medium":
        return "text-orange-500 bg-orange-50"
      case "low":
        return "text-green-500 bg-green-50"
      default:
        return "text-gray-500 bg-gray-50"
    }
  }

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case "high":
        return "Alta"
      case "medium":
        return "Média"
      case "low":
        return "Baixa"
      default:
        return "Normal"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "done":
        return <CheckCircle size={16} className="text-green-500" />
      case "in-progress":
        return <Clock size={16} className="text-blue-500" />
      case "review":
        return <AlertTriangle size={16} className="text-orange-500" />
      default:
        return null
    }
  }

  // Filtrar tarefas
  const filteredTasks = tasks.filter((task) => {
    if (filter === "all") return true
    if (filter === "pending") return task.status !== "done"
    if (filter === "completed") return task.status === "done"
    if (filter === "overdue") return isOverdue(task.due_date) && task.status !== "done"
    return true
  })

  // Ordenar tarefas por data de vencimento
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (!a.due_date) return 1
    if (!b.due_date) return -1
    const dateA = new Date(a.due_date)
    const dateB = new Date(b.due_date)
    return dateA.getTime() - dateB.getTime()
  })

  // Limitar a 5 tarefas
  const displayTasks = sortedTasks.slice(0, 5)

  const handleTaskCreated = (newTask: Task) => {
    // Verificar se a tarefa pertence a este projeto
    if (newTask.project_id && newTask.project_id.toString() === projectId.toString()) {
      setTasks((prevTasks) => [newTask, ...prevTasks])
      toast({
        title: "Tarefa criada",
        description: "A tarefa foi criada com sucesso!",
      })
    }
  }

  const handleTaskUpdated = (updatedTask: Task) => {
    // Verificar se a tarefa ainda pertence a este projeto após a atualização
    if (updatedTask.project_id && updatedTask.project_id.toString() === projectId.toString()) {
      setTasks((prevTasks) => prevTasks.map((task) => (task.id === updatedTask.id ? updatedTask : task)))
    } else {
      // Se a tarefa foi movida para outro projeto, remova-a da lista
      setTasks((prevTasks) => prevTasks.filter((task) => task.id !== updatedTask.id))
    }

    toast({
      title: "Tarefa atualizada",
      description: "A tarefa foi atualizada com sucesso!",
    })
  }

  const handleDeleteTask = async (taskId: string | number) => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Falha ao excluir tarefa")
      }

      setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId))
      toast({
        title: "Tarefa excluída",
        description: "A tarefa foi excluída com sucesso!",
      })
    } catch (error: any) {
      console.error("Erro ao excluir tarefa:", error)
      toast({
        title: "Erro",
        description: "Não foi possível excluir a tarefa",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
      setDeleteTaskId(null)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-medium text-gray-800">Tarefas</h2>

        <div className="flex items-center space-x-4">
          <div className="flex space-x-2">
            <button
              onClick={() => setFilter("all")}
              className={`px-3 py-1 text-xs rounded-full ${
                filter === "all" ? "bg-[#4b7bb5] text-white" : "bg-gray-100 text-gray-600"
              }`}
            >
              Todas
            </button>
            <button
              onClick={() => setFilter("pending")}
              className={`px-3 py-1 text-xs rounded-full ${
                filter === "pending" ? "bg-[#4b7bb5] text-white" : "bg-gray-100 text-gray-600"
              }`}
            >
              Pendentes
            </button>
            <button
              onClick={() => setFilter("completed")}
              className={`px-3 py-1 text-xs rounded-full ${
                filter === "completed" ? "bg-[#4b7bb5] text-white" : "bg-gray-100 text-gray-600"
              }`}
            >
              Concluídas
            </button>
            <button
              onClick={() => setFilter("overdue")}
              className={`px-3 py-1 text-xs rounded-full ${
                filter === "overdue" ? "bg-[#4b7bb5] text-white" : "bg-gray-100 text-gray-600"
              }`}
            >
              Atrasadas
            </button>
          </div>

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
        <div className="space-y-3">
          {displayTasks.length > 0 ? (
            displayTasks.map((task) => (
              <div key={task.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow">
                <div className="flex items-start justify-between">
                  <div
                    className="flex items-start space-x-3 cursor-pointer flex-1"
                    onClick={() => setEditTaskId(task.id)}
                  >
                    <div className="mt-1">{getStatusIcon(task.status)}</div>
                    <div>
                      <h3 className="font-medium text-gray-800">{task.title}</h3>
                      <p className="text-sm text-gray-500 line-clamp-1 mt-1">{task.description}</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className={`text-xs px-2 py-1 rounded-full ${getPriorityColor(task.priority)}`}>
                      {getPriorityLabel(task.priority)}
                    </span>
                    <div
                      className={`flex items-center mt-2 text-xs ${
                        isOverdue(task.due_date) && task.status !== "done" ? "text-red-500" : "text-gray-500"
                      }`}
                    >
                      <Calendar size={14} className="mr-1" />
                      <span>{formatDate(task.due_date)}</span>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        setDeleteTaskId(task.id)
                      }}
                      className="mt-2 text-gray-400 hover:text-red-500 transition-colors"
                      title="Excluir tarefa"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
                <div className="flex items-center justify-between mt-3 pt-2 border-t border-gray-100">
                  <span className="text-xs text-gray-500">Responsável: {task.assignee || "Não atribuído"}</span>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-6 text-gray-500">
              {tasks.length === 0
                ? "Nenhuma tarefa encontrada para este projeto"
                : "Nenhuma tarefa encontrada para os filtros selecionados"}
            </div>
          )}
        </div>
      )}

      {tasks.length > 5 && (
        <div className="mt-4 text-center">
          <Link
            href={`/tarefas?projeto=${projectId}`}
            className="inline-flex items-center text-sm text-[#4b7bb5] hover:underline"
          >
            Ver todas as tarefas
            <ArrowRight size={16} className="ml-1" />
          </Link>
        </div>
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

      {/* Diálogo de confirmação de exclusão */}
      {deleteTaskId && (
        <DeleteTaskConfirmation
          isOpen={!!deleteTaskId}
          onClose={() => setDeleteTaskId(null)}
          onConfirm={() => handleDeleteTask(deleteTaskId)}
          taskTitle={tasks.find((t) => t.id === deleteTaskId)?.title || "esta tarefa"}
        />
      )}
    </div>
  )
}
