"use client"

import { useState, useEffect, useCallback } from "react"
import type { SimpleTask } from "@/lib/simple-task-service"

export function useSimpleTasks(projectId?: number) {
  const [tasks, setTasks] = useState<SimpleTask[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loadTasks = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      console.log("🔄 useSimpleTasks.loadTasks iniciado")

      const params = new URLSearchParams()
      if (projectId) {
        params.append("project_id", projectId.toString())
      }

      const response = await fetch(`/api/tasks?${params}`)
      const result = await response.json()

      if (!result.success) {
        throw new Error(result.error || "Erro ao carregar tarefas")
      }

      console.log(`✅ useSimpleTasks: ${result.data.length} tarefas carregadas`)
      setTasks(result.data)
    } catch (err: any) {
      console.error("❌ useSimpleTasks.loadTasks error:", err)
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }, [projectId])

  const updateTaskStatus = useCallback(
    async (id: number, status: string) => {
      try {
        console.log(`🔄 useSimpleTasks.updateTaskStatus: ${id} → ${status}`)

        // Atualização otimista
        setTasks((prev) => prev.map((task) => (task.id === id ? { ...task, status } : task)))

        const response = await fetch(`/api/tasks/${id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status }),
        })

        const result = await response.json()

        if (!result.success) {
          throw new Error(result.error || "Erro ao atualizar status")
        }

        // Confirmar atualização
        setTasks((prev) => prev.map((task) => (task.id === id ? result.data : task)))

        console.log(`✅ useSimpleTasks.updateTaskStatus concluído`)
        return result.data
      } catch (err: any) {
        console.error(`❌ useSimpleTasks.updateTaskStatus error:`, err)
        await loadTasks() // Reverter mudança
        throw err
      }
    },
    [loadTasks],
  )

  const tasksByStatus = useCallback(() => {
    return tasks.reduce(
      (acc, task) => {
        const status = task.status || "todo"
        if (!acc[status]) acc[status] = []
        acc[status].push(task)
        return acc
      },
      {} as Record<string, SimpleTask[]>,
    )
  }, [tasks])

  useEffect(() => {
    loadTasks()
  }, [loadTasks])

  return {
    tasks,
    isLoading,
    error,
    loadTasks,
    updateTaskStatus,
    tasksByStatus,
  }
}
