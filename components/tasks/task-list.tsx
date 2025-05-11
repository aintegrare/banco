"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Loader2, Plus, Search } from "lucide-react"
import { TaskCard } from "./task-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CreateTaskDialog } from "./create-task-dialog"
import { useToast } from "@/components/ui/use-toast"

interface TaskListProps {
  projectId?: number
  initialStatus?: string
}

export function TaskList({ projectId, initialStatus }: TaskListProps) {
  const [tasks, setTasks] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState(initialStatus || "")
  const [priorityFilter, setPriorityFilter] = useState("")
  const { toast } = useToast()

  useEffect(() => {
    fetchTasks()
  }, [projectId, statusFilter, priorityFilter])

  const fetchTasks = async () => {
    setIsLoading(true)
    try {
      // Construir URL com filtros
      let url = "/api/tasks?"

      if (projectId) {
        url += `project_id=${projectId}&`
      }

      if (statusFilter) {
        url += `status=${statusFilter}&`
      }

      if (priorityFilter) {
        url += `priority=${priorityFilter}&`
      }

      if (searchQuery) {
        url += `search=${encodeURIComponent(searchQuery)}&`
      }

      const response = await fetch(url)

      if (!response.ok) {
        throw new Error("Falha ao buscar tarefas")
      }

      const data = await response.json()
      setTasks(data)
    } catch (error) {
      console.error("Erro ao buscar tarefas:", error)
      toast({
        title: "Erro",
        description: "Não foi possível carregar as tarefas",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    fetchTasks()
  }

  const handleEditTask = async (editedTask: any) => {
    try {
      const response = await fetch(`/api/tasks/${editedTask.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editedTask),
      })

      if (!response.ok) {
        throw new Error("Falha ao atualizar tarefa")
      }

      const updatedTask = await response.json()

      setTasks(tasks.map((task) => (task.id === updatedTask.id ? updatedTask : task)))

      toast({
        title: "Sucesso",
        description: "Tarefa atualizada com sucesso",
      })
    } catch (error) {
      console.error("Erro ao atualizar tarefa:", error)
      toast({
        title: "Erro",
        description: "Não foi possível atualizar a tarefa",
        variant: "destructive",
      })
    }
  }

  const handleDeleteTask = async (taskId: number) => {
    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Falha ao excluir tarefa")
      }

      setTasks(tasks.filter((task) => task.id !== taskId))

      toast({
        title: "Sucesso",
        description: "Tarefa excluída com sucesso",
      })
    } catch (error) {
      console.error("Erro ao excluir tarefa:", error)
      toast({
        title: "Erro",
        description: "Não foi possível excluir a tarefa",
        variant: "destructive",
      })
    }
  }

  const handleStatusChange = async (taskId: number, newStatus: string) => {
    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      })

      if (!response.ok) {
        throw new Error("Falha ao atualizar status da tarefa")
      }

      const updatedTask = await response.json()

      setTasks(tasks.map((task) => (task.id === updatedTask.id ? updatedTask : task)))
    } catch (error) {
      console.error("Erro ao atualizar status da tarefa:", error)
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o status da tarefa",
        variant: "destructive",
      })
    }
  }

  const handleCreateTask = async (newTask: any) => {
    try {
      // Adicionar o projectId se estiver disponível
      if (projectId) {
        newTask.project_id = projectId
      }

      const response = await fetch("/api/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newTask),
      })

      if (!response.ok) {
        throw new Error("Falha ao criar tarefa")
      }

      const createdTask = await response.json()

      setTasks([createdTask, ...tasks])

      toast({
        title: "Sucesso",
        description: "Tarefa criada com sucesso",
      })
    } catch (error) {
      console.error("Erro ao criar tarefa:", error)
      toast({
        title: "Erro",
        description: "Não foi possível criar a tarefa",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold text-gray-800">Lista de Tarefas</h2>
        <Button onClick={() => setIsCreateDialogOpen(true)} className="bg-[#4b7bb5] hover:bg-[#3d649e]">
          <Plus className="mr-2 h-4 w-4" /> Nova Tarefa
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <form onSubmit={handleSearch} className="flex-1 flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <Input
              type="text"
              placeholder="Buscar tarefas..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button type="submit" variant="outline">
            Buscar
          </Button>
        </form>

        <div className="flex gap-2">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="backlog">Backlog</SelectItem>
              <SelectItem value="todo">A Fazer</SelectItem>
              <SelectItem value="in-progress">Em Progresso</SelectItem>
              <SelectItem value="review">Em Revisão</SelectItem>
              <SelectItem value="done">Concluído</SelectItem>
            </SelectContent>
          </Select>

          <Select value={priorityFilter} onValueChange={setPriorityFilter}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Prioridade" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas</SelectItem>
              <SelectItem value="low">Baixa</SelectItem>
              <SelectItem value="medium">Média</SelectItem>
              <SelectItem value="high">Alta</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 size={40} className="text-[#4b7bb5] animate-spin" />
        </div>
      ) : tasks.length > 0 ? (
        <div className="grid grid-cols-1 gap-4">
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onEdit={handleEditTask}
              onDelete={handleDeleteTask}
              onStatusChange={handleStatusChange}
              showProject={!projectId}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-500">Nenhuma tarefa encontrada</p>
          <Button onClick={() => setIsCreateDialogOpen(true)} variant="outline" className="mt-4">
            <Plus className="mr-2 h-4 w-4" /> Criar Tarefa
          </Button>
        </div>
      )}

      <CreateTaskDialog
        isOpen={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
        initialProject={projectId}
        onTaskCreated={handleCreateTask}
      />
    </div>
  )
}
