"use client"

import { useState } from "react"
import { useTasks } from "@/hooks/use-tasks"
import { TASK_STATUS, PRIORITY } from "@/lib/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Loader2, Plus, Calendar, AlertCircle, CheckCircle, Clock } from "lucide-react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { TaskCreateDialog } from "./task-create-dialog"
import { TaskEditDialog } from "./task-edit-dialog"

export function TaskDashboard() {
  const [activeTab, setActiveTab] = useState<string>("all")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [editTaskId, setEditTaskId] = useState<number | null>(null)

  // Usar o novo hook de tarefas
  const {
    tasks,
    isLoading,
    error,
    loadTasks,
    createTask,
    updateTask,
    updateTaskStatus,
    deleteTask,
    totalTasks,
    completedTasks,
    inProgressTasks,
    overdueTasks,
  } = useTasks({ autoLoad: true })

  // Filtrar tarefas com base na tab ativa
  const filteredTasks = tasks.filter((task) => {
    if (activeTab === "all") return true
    if (activeTab === "overdue") return task.isOverdue
    if (activeTab === "in_progress") return task.status === TASK_STATUS.IN_PROGRESS
    if (activeTab === "completed") return task.status === TASK_STATUS.DONE
    return true
  })

  // Formatar data
  const formatDate = (dateString?: string | null) => {
    if (!dateString) return "Sem data"
    try {
      return format(new Date(dateString), "dd/MM/yyyy", { locale: ptBR })
    } catch (e) {
      return "Data inválida"
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

  // Obter ícone do status
  const getStatusIcon = (status: string) => {
    switch (status) {
      case TASK_STATUS.DONE:
        return <CheckCircle size={16} className="text-green-500" />
      case TASK_STATUS.IN_PROGRESS:
        return <Clock size={16} className="text-blue-500" />
      case TASK_STATUS.REVIEW:
        return <AlertCircle size={16} className="text-orange-500" />
      default:
        return null
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

  // Manipuladores de eventos
  const handleCreateTask = async (taskData: any) => {
    try {
      await createTask(taskData)
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

  const handleStatusChange = async (taskId: number, newStatus: string) => {
    try {
      await updateTaskStatus(taskId, newStatus as any)
    } catch (error) {
      console.error("Erro ao atualizar status:", error)
    }
  }

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Painel de Tarefas</h1>
        <Button onClick={() => setIsCreateDialogOpen(true)} className="bg-[#4b7bb5] hover:bg-[#3d649e]">
          <Plus className="mr-2 h-4 w-4" /> Nova Tarefa
        </Button>
      </div>

      {/* Cards de estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{totalTasks}</div>
            <p className="text-muted-foreground">Total de Tarefas</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-blue-600">{inProgressTasks}</div>
            <p className="text-muted-foreground">Em Progresso</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-green-600">{completedTasks}</div>
            <p className="text-muted-foreground">Concluídas</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-red-600">{overdueTasks}</div>
            <p className="text-muted-foreground">Atrasadas</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs e lista de tarefas */}
      <Card>
        <CardHeader>
          <CardTitle>Minhas Tarefas</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="all">Todas</TabsTrigger>
              <TabsTrigger value="in_progress">Em Progresso</TabsTrigger>
              <TabsTrigger value="completed">Concluídas</TabsTrigger>
              <TabsTrigger value="overdue">Atrasadas</TabsTrigger>
            </TabsList>

            {isLoading ? (
              <div className="flex justify-center items-center py-12">
                <Loader2 size={30} className="text-[#4b7bb5] animate-spin" />
              </div>
            ) : error ? (
              <div className="text-center py-8 text-red-500">
                <AlertCircle className="mx-auto h-8 w-8 mb-2" />
                <p>{error}</p>
              </div>
            ) : filteredTasks.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p>Nenhuma tarefa encontrada.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredTasks.map((task) => (
                  <div
                    key={task.id}
                    className="border rounded-lg p-4 hover:shadow-sm transition-shadow cursor-pointer"
                    onClick={() => setEditTaskId(task.id)}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex items-start space-x-2">
                        <div className="mt-1">{getStatusIcon(task.status)}</div>
                        <div>
                          <h3 className="font-medium text-gray-800">{task.title}</h3>
                          <p className="text-sm text-gray-500 line-clamp-1 mt-1">{task.description}</p>
                        </div>
                      </div>
                      <Badge className={getPriorityColor(task.priority)}>{getPriorityLabel(task.priority)}</Badge>
                    </div>
                    <div className="flex justify-between items-center mt-4 pt-2 border-t border-gray-100">
                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar size={14} className="mr-1" />
                        <span>{formatDate(task.due_date)}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <select
                          value={task.status}
                          onChange={(e) => {
                            e.stopPropagation()
                            handleStatusChange(task.id, e.target.value)
                          }}
                          className="text-xs border rounded px-2 py-1"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {Object.values(TASK_STATUS).map((status) => (
                            <option key={status} value={status}>
                              {getStatusLabel(status)}
                            </option>
                          ))}
                        </select>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleDeleteTask(task.id)
                          }}
                        >
                          Excluir
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Tabs>
        </CardContent>
      </Card>

      {/* Diálogos */}
      <TaskCreateDialog
        isOpen={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
        onSubmit={handleCreateTask}
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
