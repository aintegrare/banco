"use client"

import type React from "react"
import { useState, useEffect, useCallback, useRef } from "react"
import { CheckCircle, Circle, Plus, Trash2, Loader2, ClipboardList, AlertCircle, Edit, X, Save } from "lucide-react"
import { getSupabaseClient } from "@/lib/supabase/client"

interface FolderTask {
  id: string
  folder_path: string
  description: string | null // Tornando description explicitamente opcional
  is_completed: boolean
  created_at: string
}

interface FolderTasksProps {
  folderPath: string
  onTaskCountChange?: (count: number) => void
}

export function FolderTasks({ folderPath, onTaskCountChange }: FolderTasksProps) {
  const [tasks, setTasks] = useState<FolderTask[]>([])
  const [newTaskDescription, setNewTaskDescription] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [isAdding, setIsAdding] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [pendingTaskCount, setPendingTaskCount] = useState(0)
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null)
  const [editDescription, setEditDescription] = useState("")

  // Usar uma ref para evitar loops infinitos com o callback
  const onTaskCountChangeRef = useRef(onTaskCountChange)

  // Atualizar a ref quando o callback mudar
  useEffect(() => {
    onTaskCountChangeRef.current = onTaskCountChange
  }, [onTaskCountChange])

  // Função para notificar a contagem de tarefas de forma segura
  const notifyTaskCount = useCallback((count: number) => {
    if (onTaskCountChangeRef.current) {
      onTaskCountChangeRef.current(count)
    }
  }, [])

  // Carregar tarefas da pasta
  useEffect(() => {
    let isMounted = true

    const fetchTasks = async () => {
      if (!folderPath) return

      setIsLoading(true)
      setError(null)

      try {
        const supabase = getSupabaseClient()
        const { data, error } = await supabase
          .from("folder_tasks")
          .select("*")
          .eq("folder_path", folderPath)
          .order("created_at", { ascending: false })

        if (error) throw error

        if (isMounted) {
          setTasks(data || [])
          const pendingCount = (data || []).filter((task) => !task.is_completed).length
          setPendingTaskCount(pendingCount)

          // Notificar o componente pai sobre a contagem de tarefas
          // Mas apenas uma vez após o carregamento inicial
          notifyTaskCount(pendingCount)
        }
      } catch (err) {
        console.error("Erro ao carregar tarefas da pasta:", err)
        if (isMounted) {
          setError("Não foi possível carregar as tarefas desta pasta.")
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    fetchTasks()

    // Cleanup function
    return () => {
      isMounted = false
    }
  }, [folderPath, notifyTaskCount])

  // Adicionar nova tarefa
  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!newTaskDescription || !newTaskDescription.trim()) return

    setIsAdding(true)
    setError(null)

    try {
      const supabase = getSupabaseClient()
      const newTask = {
        folder_path: folderPath,
        description: newTaskDescription.trim(),
        is_completed: false,
      }

      const { data, error } = await supabase.from("folder_tasks").insert([newTask]).select()

      if (error) throw error

      if (data && data.length > 0) {
        setTasks([data[0], ...tasks])
        const newPendingCount = pendingTaskCount + 1
        setPendingTaskCount(newPendingCount)

        // Notificar o componente pai sobre a contagem de tarefas
        notifyTaskCount(newPendingCount)
      }

      setNewTaskDescription("")
    } catch (err) {
      console.error("Erro ao adicionar tarefa:", err)
      setError("Não foi possível adicionar a tarefa.")
    } finally {
      setIsAdding(false)
    }
  }

  // Alternar status da tarefa (concluída/pendente)
  const toggleTaskStatus = async (taskId: string, currentStatus: boolean) => {
    try {
      const supabase = getSupabaseClient()
      const { error } = await supabase.from("folder_tasks").update({ is_completed: !currentStatus }).eq("id", taskId)

      if (error) throw error

      // Atualizar estado local
      const updatedTasks = tasks.map((task) => {
        if (task.id === taskId) {
          return { ...task, is_completed: !currentStatus }
        }
        return task
      })

      setTasks(updatedTasks)

      // Atualizar contagem de tarefas pendentes
      const newPendingCount = updatedTasks.filter((task) => !task.is_completed).length
      setPendingTaskCount(newPendingCount)

      // Notificar o componente pai sobre a contagem de tarefas
      notifyTaskCount(newPendingCount)
    } catch (err) {
      console.error("Erro ao atualizar status da tarefa:", err)
      setError("Não foi possível atualizar o status da tarefa.")
    }
  }

  // Excluir tarefa
  const deleteTask = async (taskId: string, isCompleted: boolean) => {
    try {
      const supabase = getSupabaseClient()
      const { error } = await supabase.from("folder_tasks").delete().eq("id", taskId)

      if (error) throw error

      // Atualizar estado local
      const updatedTasks = tasks.filter((task) => task.id !== taskId)
      setTasks(updatedTasks)

      // Atualizar contagem de tarefas pendentes se a tarefa excluída estava pendente
      if (!isCompleted) {
        const newPendingCount = pendingTaskCount - 1
        setPendingTaskCount(newPendingCount)

        // Notificar o componente pai sobre a contagem de tarefas
        notifyTaskCount(newPendingCount)
      }
    } catch (err) {
      console.error("Erro ao excluir tarefa:", err)
      setError("Não foi possível excluir a tarefa.")
    }
  }

  // Iniciar edição de tarefa
  const startEditTask = (task: FolderTask) => {
    setEditingTaskId(task.id)
    setEditDescription(task.description || "")
  }

  // Salvar edição de tarefa
  const saveEditTask = async (taskId: string) => {
    if (!editDescription || !editDescription.trim()) return

    try {
      const supabase = getSupabaseClient()
      const { error } = await supabase
        .from("folder_tasks")
        .update({ description: editDescription.trim() })
        .eq("id", taskId)

      if (error) throw error

      // Atualizar estado local
      const updatedTasks = tasks.map((task) => {
        if (task.id === taskId) {
          return { ...task, description: editDescription.trim() }
        }
        return task
      })

      setTasks(updatedTasks)
      setEditingTaskId(null)
      setEditDescription("")
    } catch (err) {
      console.error("Erro ao atualizar tarefa:", err)
      setError("Não foi possível atualizar a tarefa.")
    }
  }

  // Cancelar edição
  const cancelEdit = () => {
    setEditingTaskId(null)
    setEditDescription("")
  }

  // Formatar data
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  if (isLoading) {
    return (
      <div className="p-4 flex justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-[#4b7bb5]" />
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <div className="p-4 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
        <h3 className="font-medium text-[#4072b0] flex items-center">
          <ClipboardList className="h-5 w-5 mr-2" />
          Tarefas da Pasta
        </h3>
        <span className="text-sm text-gray-500">
          {pendingTaskCount} pendente{pendingTaskCount !== 1 ? "s" : ""}
        </span>
      </div>

      {error && (
        <div className="p-3 bg-red-50 border-b border-red-100 flex items-center text-sm text-red-600">
          <AlertCircle className="h-4 w-4 mr-2 flex-shrink-0" />
          {error}
        </div>
      )}

      <form onSubmit={handleAddTask} className="p-4 border-b border-gray-200">
        <div className="flex flex-col gap-2">
          <textarea
            value={newTaskDescription}
            onChange={(e) => setNewTaskDescription(e.target.value)}
            placeholder="Adicionar nova tarefa com descrição..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#4b7bb5] focus:border-[#4b7bb5] min-h-[80px]"
            disabled={isAdding}
          />
          <button
            type="submit"
            disabled={isAdding || !newTaskDescription.trim()}
            className="px-3 py-2 bg-[#4b7bb5] text-white rounded-md hover:bg-[#3d649e] transition-colors disabled:opacity-50 disabled:hover:bg-[#4b7bb5] flex items-center justify-center"
          >
            {isAdding ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
            <span className="ml-1">{isAdding ? "Adicionando..." : "Adicionar"}</span>
          </button>
        </div>
      </form>

      <div className="max-h-64 overflow-y-auto">
        {tasks.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            <p>Nenhuma tarefa para esta pasta.</p>
            <p className="text-sm mt-1">Adicione tarefas para organizar seu trabalho.</p>
          </div>
        ) : (
          <ul className="divide-y divide-gray-100">
            {tasks.map((task) => (
              <li key={task.id} className="p-3 hover:bg-gray-50 transition-colors">
                {editingTaskId === task.id ? (
                  <div className="flex flex-col gap-2">
                    <textarea
                      value={editDescription}
                      onChange={(e) => setEditDescription(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#4b7bb5] focus:border-[#4b7bb5] min-h-[80px]"
                      autoFocus
                    />
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => saveEditTask(task.id)}
                        disabled={!editDescription.trim()}
                        className="px-2 py-1 bg-[#4b7bb5] text-white text-xs rounded hover:bg-[#3d649e] transition-colors flex items-center"
                      >
                        <Save className="h-3 w-3 mr-1" />
                        Salvar
                      </button>
                      <button
                        type="button"
                        onClick={cancelEdit}
                        className="px-2 py-1 bg-gray-200 text-gray-700 text-xs rounded hover:bg-gray-300 transition-colors flex items-center"
                      >
                        <X className="h-3 w-3 mr-1" />
                        Cancelar
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start gap-3">
                    <button
                      onClick={() => toggleTaskStatus(task.id, task.is_completed)}
                      className="mt-0.5 flex-shrink-0 text-[#4b7bb5] hover:text-[#3d649e] transition-colors"
                      title={task.is_completed ? "Marcar como pendente" : "Marcar como concluída"}
                    >
                      {task.is_completed ? <CheckCircle className="h-5 w-5" /> : <Circle className="h-5 w-5" />}
                    </button>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm ${task.is_completed ? "line-through text-gray-400" : "text-gray-700"}`}>
                        {task.description}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">{formatDate(task.created_at)}</p>
                    </div>
                    <div className="flex gap-1">
                      <button
                        onClick={() => startEditTask(task)}
                        className="flex-shrink-0 p-1 text-gray-400 hover:text-[#4b7bb5] transition-colors rounded-full hover:bg-blue-50"
                        title="Editar tarefa"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => deleteTask(task.id, task.is_completed)}
                        className="flex-shrink-0 p-1 text-gray-400 hover:text-red-500 transition-colors rounded-full hover:bg-red-50"
                        title="Excluir tarefa"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
