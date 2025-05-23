"use client"

import { useState, useEffect, useCallback } from "react"
import type { Task, TaskFilters, CreateTaskInput, UpdateTaskInput, TaskStatus } from "@/lib/types"

interface UseTasksOptions {
  filters?: TaskFilters
  autoLoad?: boolean
}

export function useTasks(options: UseTasksOptions = {}) {
  const [tasks, setTasks] = useState<Task[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [stats, setStats] = useState<{
    total: number
    byStatus: Record<TaskStatus, number>
    byPriority: Record<string, number>
  } | null>(null)

  // Construir URL com filtros
  const buildUrl = useCallback(
    (endpoint: string, params: Record<string, any> = {}) => {
      const url = new URL(endpoint, window.location.origin)

      // Combinar filtros das opções com parâmetros adicionais
      const allParams = { ...options.filters, ...params }

      Object.entries(allParams).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (Array.isArray(value)) {
            url.searchParams.set(key, value.join(","))
          } else {
            url.searchParams.set(key, value.toString())
          }
        }
      })

      return url.toString()
    },
    [options.filters],
  )

  // Carregar tarefas
  const loadTasks = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)

      console.log("🔄 useTasks.loadTasks iniciado")
      console.log("📋 Filtros:", options.filters)

      const url = buildUrl("/api/tasks")
      console.log("🌐 URL:", url)

      const response = await fetch(url)
      const result = await response.json()

      if (!response.ok) {
        throw new Error(`Erro HTTP ${response.status}: ${result.error || "Erro desconhecido"}`)
      }

      if (!result.success) {
        throw new Error(result.error || "Erro ao carregar tarefas")
      }

      console.log(`✅ ${result.data.length} tarefas carregadas`)
      setTasks(result.data)
    } catch (err: any) {
      console.error("❌ useTasks.loadTasks error:", err)
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }, [buildUrl, options.filters])

  // Criar tarefa
  const createTask = useCallback(async (input: CreateTaskInput): Promise<Task> => {
    try {
      console.log("🔄 useTasks.createTask iniciado")
      console.log("📝 Dados:", input)

      const response = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(`Erro HTTP ${response.status}: ${result.error || "Erro desconhecido"}`)
      }

      if (!result.success) {
        throw new Error(result.error || "Erro ao criar tarefa")
      }

      console.log("✅ Tarefa criada:", result.data)

      // Atualizar lista local
      setTasks((prev) => [result.data, ...prev])

      return result.data
    } catch (err: any) {
      console.error("❌ useTasks.createTask error:", err)
      setError(err.message)
      throw err
    }
  }, [])

  // Atualizar tarefa
  const updateTask = useCallback(async (id: number, input: UpdateTaskInput): Promise<Task> => {
    try {
      console.log(`🔄 useTasks.updateTask: ${id}`)
      console.log("📝 Dados:", input)

      const response = await fetch(`/api/tasks/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(`Erro HTTP ${response.status}: ${result.error || "Erro desconhecido"}`)
      }

      if (!result.success) {
        throw new Error(result.error || "Erro ao atualizar tarefa")
      }

      console.log("✅ Tarefa atualizada:", result.data)

      // Atualizar lista local
      setTasks((prev) => prev.map((task) => (task.id === id ? result.data : task)))

      return result.data
    } catch (err: any) {
      console.error(`❌ useTasks.updateTask error:`, err)
      setError(err.message)
      throw err
    }
  }, [])

  // Atualizar status (para Kanban)
  const updateTaskStatus = useCallback(
    async (id: number, status: TaskStatus): Promise<Task> => {
      try {
        console.log(`🔄 useTasks.updateTaskStatus: ${id} → ${status}`)

        // Atualização otimista
        setTasks((prev) => prev.map((task) => (task.id === id ? { ...task, status } : task)))

        const response = await fetch(`/api/tasks/${id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status }),
        })

        const result = await response.json()

        if (!response.ok) {
          throw new Error(`Erro HTTP ${response.status}: ${result.error || "Erro desconhecido"}`)
        }

        if (!result.success) {
          throw new Error(result.error || "Erro ao atualizar status")
        }

        console.log("✅ Status atualizado:", result.data)

        // Confirmar atualização
        setTasks((prev) => prev.map((task) => (task.id === id ? result.data : task)))

        return result.data
      } catch (err: any) {
        console.error(`❌ useTasks.updateTaskStatus error:`, err)
        // Reverter atualização otimista
        await loadTasks()
        throw err
      }
    },
    [loadTasks],
  )

  // Deletar tarefa
  const deleteTask = useCallback(async (id: number): Promise<void> => {
    try {
      console.log(`🔄 useTasks.deleteTask: ${id}`)

      const response = await fetch(`/api/tasks/${id}`, {
        method: "DELETE",
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(`Erro HTTP ${response.status}: ${result.error || "Erro desconhecido"}`)
      }

      if (!result.success) {
        throw new Error(result.error || "Erro ao deletar tarefa")
      }

      console.log("✅ Tarefa deletada")

      // Remover da lista local
      setTasks((prev) => prev.filter((task) => task.id !== id))
    } catch (err: any) {
      console.error(`❌ useTasks.deleteTask error:`, err)
      setError(err.message)
      throw err
    }
  }, [])

  // Carregar estatísticas
  const loadStats = useCallback(async () => {
    try {
      console.log("🔄 useTasks.loadStats iniciado")

      const url = buildUrl("/api/tasks/stats")
      const response = await fetch(url)
      const result = await response.json()

      if (!response.ok) {
        throw new Error(`Erro HTTP ${response.status}: ${result.error || "Erro desconhecido"}`)
      }

      if (!result.success) {
        throw new Error(result.error || "Erro ao carregar estatísticas")
      }

      console.log("✅ Estatísticas carregadas:", result.data)
      setStats(result.data)
    } catch (err: any) {
      console.error("❌ useTasks.loadStats error:", err)
      // Não definir erro para stats, pois é opcional
    }
  }, [buildUrl])

  // Agrupar tarefas por status
  const tasksByStatus = useCallback(() => {
    return tasks.reduce(
      (acc, task) => {
        const status = task.status
        if (!acc[status]) acc[status] = []
        acc[status].push(task)
        return acc
      },
      {} as Record<TaskStatus, Task[]>,
    )
  }, [tasks])

  // Auto-carregar na inicialização
  useEffect(() => {
    if (options.autoLoad !== false) {
      loadTasks()
      loadStats()
    }
  }, [loadTasks, loadStats, options.autoLoad])

  return {
    // Estado
    tasks,
    isLoading,
    error,
    stats,

    // Ações
    loadTasks,
    createTask,
    updateTask,
    updateTaskStatus,
    deleteTask,
    loadStats,

    // Utilitários
    tasksByStatus,

    // Estatísticas calculadas
    totalTasks: tasks.length,
    completedTasks: tasks.filter((t) => t.status === "done").length,
    inProgressTasks: tasks.filter((t) => t.status === "in_progress").length,
    overdueTasks: tasks.filter((t) => t.isOverdue).length,
  }
}
