"use client"

import type React from "react"
import { useState, useEffect, useCallback, useRef } from "react"
import {
  CheckCircle,
  Circle,
  Plus,
  Trash2,
  Loader2,
  ClipboardList,
  AlertCircle,
  Edit,
  X,
  Save,
  Calendar,
  MessageSquare,
  Tag,
} from "lucide-react"
import { getSupabaseClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { format, parseISO } from "date-fns"
import { ptBR } from "date-fns/locale"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/use-toast"

interface FolderTask {
  id: string
  folder_path: string
  description: string | null
  is_completed: boolean
  created_at: string
  updated_at?: string
  due_date: string | null
  color: string | null
  comments: string | null
}

interface FolderTasksProps {
  folderPath: string
  onTaskCountChange?: (count: number) => void
}

// Cores disponíveis para tarefas
const TASK_COLORS = [
  { name: "blue", value: "#4b7bb5", label: "Azul" },
  { name: "green", value: "#4caf50", label: "Verde" },
  { name: "red", value: "#f44336", label: "Vermelho" },
  { name: "orange", value: "#ff9800", label: "Laranja" },
  { name: "purple", value: "#9c27b0", label: "Roxo" },
  { name: "teal", value: "#009688", label: "Turquesa" },
]

export function FolderTasks({ folderPath, onTaskCountChange }: FolderTasksProps) {
  const [tasks, setTasks] = useState<FolderTask[]>([])
  const [newTaskDescription, setNewTaskDescription] = useState("")
  const [newTaskDueDate, setNewTaskDueDate] = useState<Date | undefined>(undefined)
  const [newTaskColor, setNewTaskColor] = useState<string>("blue")
  const [newTaskComments, setNewTaskComments] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [isAdding, setIsAdding] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [pendingTaskCount, setPendingTaskCount] = useState(0)
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null)
  const [editDescription, setEditDescription] = useState("")
  const [editDueDate, setEditDueDate] = useState<Date | undefined>(undefined)
  const [editColor, setEditColor] = useState<string>("blue")
  const [editComments, setEditComments] = useState("")
  const [showNewTaskDetails, setShowNewTaskDetails] = useState(false)
  const [showComments, setShowComments] = useState<Record<string, boolean>>({})
  const { toast } = useToast()

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
        console.log("Buscando tarefas para a pasta:", folderPath)
        const supabase = getSupabaseClient()

        // Normalizar o caminho da pasta para busca
        const normalizedPath = folderPath.endsWith("/") ? folderPath : `${folderPath}`
        const pathWithSlash = folderPath.endsWith("/") ? folderPath : `${folderPath}/`

        // Buscar tarefas com path exato e também com / no final
        const { data, error } = await supabase
          .from("folder_tasks")
          .select("*")
          .or(`folder_path.eq.${normalizedPath},folder_path.eq.${pathWithSlash}`)
          .order("created_at", { ascending: false })

        if (error) {
          console.error("Erro na consulta:", error)
          throw error
        }

        console.log("Tarefas encontradas:", data?.length || 0)

        if (isMounted) {
          if (data && data.length > 0) {
            // Mapear os dados para garantir que todos os campos estejam presentes
            const mappedTasks = data.map((task) => ({
              id: task.id,
              folder_path: task.folder_path,
              description: task.description,
              is_completed: task.is_completed || false,
              created_at: task.created_at,
              updated_at: task.updated_at,
              due_date: task.due_date,
              color: task.color || "blue",
              comments: task.comments,
            }))

            setTasks(mappedTasks)
            const pendingCount = mappedTasks.filter((task) => !task.is_completed).length
            setPendingTaskCount(pendingCount)
            notifyTaskCount(pendingCount)
          } else {
            setTasks([])
            setPendingTaskCount(0)
            notifyTaskCount(0)
          }
        }
      } catch (err: any) {
        console.error("Erro ao carregar tarefas da pasta:", err)
        if (isMounted) {
          setError(err.message || "Não foi possível carregar as tarefas desta pasta.")
          toast({
            title: "Erro",
            description: "Não foi possível carregar as tarefas desta pasta.",
            variant: "destructive",
          })
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
  }, [folderPath, notifyTaskCount, toast])

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
        due_date: newTaskDueDate ? newTaskDueDate.toISOString() : null,
        color: newTaskColor,
        comments: newTaskComments.trim() || null,
      }

      const { data, error } = await supabase.from("folder_tasks").insert([newTask]).select()

      if (error) throw error

      if (data && data.length > 0) {
        setTasks([data[0], ...tasks])
        const newPendingCount = pendingTaskCount + 1
        setPendingTaskCount(newPendingCount)

        // Notificar o componente pai sobre a contagem de tarefas
        notifyTaskCount(newPendingCount)

        toast({
          title: "Sucesso",
          description: "Tarefa adicionada com sucesso!",
        })
      }

      // Limpar formulário
      setNewTaskDescription("")
      setNewTaskDueDate(undefined)
      setNewTaskColor("blue")
      setNewTaskComments("")
      setShowNewTaskDetails(false)
    } catch (err: any) {
      console.error("Erro ao adicionar tarefa:", err)
      setError("Não foi possível adicionar a tarefa.")
      toast({
        title: "Erro",
        description: "Não foi possível adicionar a tarefa.",
        variant: "destructive",
      })
    } finally {
      setIsAdding(false)
    }
  }

  // Alternar status da tarefa (concluída/pendente)
  const toggleTaskStatus = async (taskId: string, currentStatus: boolean) => {
    try {
      const supabase = getSupabaseClient()
      const { error } = await supabase
        .from("folder_tasks")
        .update({
          is_completed: !currentStatus,
          updated_at: new Date().toISOString(),
        })
        .eq("id", taskId)

      if (error) throw error

      // Atualizar estado local
      const updatedTasks = tasks.map((task) => {
        if (task.id === taskId) {
          return {
            ...task,
            is_completed: !currentStatus,
            updated_at: new Date().toISOString(),
          }
        }
        return task
      })

      setTasks(updatedTasks)

      // Atualizar contagem de tarefas pendentes
      const newPendingCount = updatedTasks.filter((task) => !task.is_completed).length
      setPendingTaskCount(newPendingCount)

      // Notificar o componente pai sobre a contagem de tarefas
      notifyTaskCount(newPendingCount)

      toast({
        title: "Sucesso",
        description: !currentStatus ? "Tarefa marcada como concluída!" : "Tarefa marcada como pendente!",
      })
    } catch (err: any) {
      console.error("Erro ao atualizar status da tarefa:", err)
      setError("Não foi possível atualizar o status da tarefa.")
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o status da tarefa.",
        variant: "destructive",
      })
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

      toast({
        title: "Sucesso",
        description: "Tarefa excluída com sucesso!",
      })
    } catch (err: any) {
      console.error("Erro ao excluir tarefa:", err)
      setError("Não foi possível excluir a tarefa.")
      toast({
        title: "Erro",
        description: "Não foi possível excluir a tarefa.",
        variant: "destructive",
      })
    }
  }

  // Iniciar edição de tarefa
  const startEditTask = (task: FolderTask) => {
    setEditingTaskId(task.id)
    setEditDescription(task.description || "")
    setEditDueDate(task.due_date ? parseISO(task.due_date) : undefined)
    setEditColor(task.color || "blue")
    setEditComments(task.comments || "")
  }

  // Salvar edição de tarefa
  const saveEditTask = async (taskId: string) => {
    if (!editDescription || !editDescription.trim()) return

    try {
      const supabase = getSupabaseClient()
      const updateData = {
        description: editDescription.trim(),
        due_date: editDueDate ? editDueDate.toISOString() : null,
        color: editColor,
        comments: editComments.trim() || null,
        updated_at: new Date().toISOString(),
      }

      const { error } = await supabase.from("folder_tasks").update(updateData).eq("id", taskId)

      if (error) throw error

      // Atualizar estado local
      const updatedTasks = tasks.map((task) => {
        if (task.id === taskId) {
          return {
            ...task,
            description: editDescription.trim(),
            due_date: editDueDate ? editDueDate.toISOString() : null,
            color: editColor,
            comments: editComments.trim() || null,
            updated_at: new Date().toISOString(),
          }
        }
        return task
      })

      setTasks(updatedTasks)
      setEditingTaskId(null)
      resetEditForm()

      toast({
        title: "Sucesso",
        description: "Tarefa atualizada com sucesso!",
      })
    } catch (err: any) {
      console.error("Erro ao atualizar tarefa:", err)
      setError("Não foi possível atualizar a tarefa.")
      toast({
        title: "Erro",
        description: "Não foi possível atualizar a tarefa.",
        variant: "destructive",
      })
    }
  }

  // Cancelar edição
  const cancelEdit = () => {
    setEditingTaskId(null)
    resetEditForm()
  }

  // Resetar formulário de edição
  const resetEditForm = () => {
    setEditDescription("")
    setEditDueDate(undefined)
    setEditColor("blue")
    setEditComments("")
  }

  // Alternar exibição de comentários
  const toggleComments = (taskId: string) => {
    setShowComments((prev) => ({
      ...prev,
      [taskId]: !prev[taskId],
    }))
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

  // Verificar se a data de vencimento está próxima ou vencida
  const getDueDateStatus = (dueDateString: string | null) => {
    if (!dueDateString) return null

    const dueDate = new Date(dueDateString)
    const today = new Date()

    // Remover horas, minutos e segundos para comparação apenas de datas
    today.setHours(0, 0, 0, 0)
    const dueDateOnly = new Date(dueDate)
    dueDateOnly.setHours(0, 0, 0, 0)

    const diffTime = dueDateOnly.getTime() - today.getTime()
    const diffDays = diffTime / (1000 * 60 * 60 * 24)

    if (diffDays < 0) return "overdue" // Vencida
    if (diffDays <= 2) return "soon" // Vence em breve (2 dias ou menos)
    return "ok" // Prazo ok
  }

  // Obter cor de fundo baseada na cor da tarefa
  const getTaskColorClass = (color: string | null) => {
    if (!color) return "bg-gray-100"

    switch (color) {
      case "blue":
        return "bg-blue-100"
      case "green":
        return "bg-green-100"
      case "red":
        return "bg-red-100"
      case "orange":
        return "bg-orange-100"
      case "purple":
        return "bg-purple-100"
      case "teal":
        return "bg-teal-100"
      default:
        return "bg-gray-100"
    }
  }

  // Obter cor de texto baseada na cor da tarefa
  const getTaskTextColorClass = (color: string | null) => {
    if (!color) return "text-gray-700"

    switch (color) {
      case "blue":
        return "text-blue-700"
      case "green":
        return "text-green-700"
      case "red":
        return "text-red-700"
      case "orange":
        return "text-orange-700"
      case "purple":
        return "text-purple-700"
      case "teal":
        return "text-teal-700"
      default:
        return "text-gray-700"
    }
  }

  // Obter cor de borda baseada na cor da tarefa
  const getTaskBorderColorClass = (color: string | null) => {
    if (!color) return "border-gray-200"

    switch (color) {
      case "blue":
        return "border-blue-200"
      case "green":
        return "border-green-200"
      case "red":
        return "border-red-200"
      case "orange":
        return "border-orange-200"
      case "purple":
        return "border-purple-200"
      case "teal":
        return "border-teal-200"
      default:
        return "border-gray-200"
    }
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

          {showNewTaskDetails && (
            <div className="space-y-3 p-3 bg-gray-50 rounded-md">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-gray-700 flex items-center">
                  <Calendar className="h-3.5 w-3.5 mr-1" />
                  Data de vencimento
                </label>
                <div className="flex items-center">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className={`w-full justify-start text-left font-normal ${!newTaskDueDate ? "text-gray-400" : ""}`}
                      >
                        {newTaskDueDate ? format(newTaskDueDate, "dd/MM/yyyy", { locale: ptBR }) : "Selecionar data"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <CalendarComponent
                        mode="single"
                        selected={newTaskDueDate}
                        onSelect={setNewTaskDueDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  {newTaskDueDate && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setNewTaskDueDate(undefined)}
                      className="ml-2"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-gray-700 flex items-center">
                  <Tag className="h-3.5 w-3.5 mr-1" />
                  Cor
                </label>
                <div className="flex flex-wrap gap-2">
                  {TASK_COLORS.map((color) => (
                    <button
                      key={color.name}
                      type="button"
                      onClick={() => setNewTaskColor(color.name)}
                      className={`w-6 h-6 rounded-full border ${
                        newTaskColor === color.name ? "ring-2 ring-offset-2 ring-[#4b7bb5]" : ""
                      }`}
                      style={{ backgroundColor: color.value }}
                      title={color.label}
                    />
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-gray-700 flex items-center">
                  <MessageSquare className="h-3.5 w-3.5 mr-1" />
                  Comentários
                </label>
                <textarea
                  value={newTaskComments}
                  onChange={(e) => setNewTaskComments(e.target.value)}
                  placeholder="Adicionar comentários (opcional)"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#4b7bb5] focus:border-[#4b7bb5] min-h-[60px]"
                  disabled={isAdding}
                />
              </div>
            </div>
          )}

          <div className="flex justify-between">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setShowNewTaskDetails(!showNewTaskDetails)}
              className="text-[#4b7bb5] border-[#4b7bb5]"
            >
              {showNewTaskDetails ? "Ocultar detalhes" : "Mostrar mais opções"}
            </Button>

            <Button
              type="submit"
              disabled={isAdding || !newTaskDescription.trim()}
              className="px-3 py-2 bg-[#4b7bb5] text-white rounded-md hover:bg-[#3d649e] transition-colors disabled:opacity-50 disabled:hover:bg-[#4b7bb5] flex items-center justify-center"
            >
              {isAdding ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
              <span className="ml-1">{isAdding ? "Adicionando..." : "Adicionar"}</span>
            </Button>
          </div>
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
              <li
                key={task.id}
                className={`p-3 hover:bg-gray-50 transition-colors ${getTaskColorClass(
                  task.color,
                )} ${getTaskBorderColorClass(task.color)} border-l-4`}
              >
                {editingTaskId === task.id ? (
                  <div className="flex flex-col gap-3">
                    <textarea
                      value={editDescription}
                      onChange={(e) => setEditDescription(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#4b7bb5] focus:border-[#4b7bb5] min-h-[80px]"
                      autoFocus
                    />

                    <div className="flex flex-col gap-3 p-3 bg-gray-50 rounded-md">
                      <div className="flex flex-col gap-1">
                        <label className="text-xs font-medium text-gray-700 flex items-center">
                          <Calendar className="h-3.5 w-3.5 mr-1" />
                          Data de vencimento
                        </label>
                        <div className="flex items-center">
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                className={`w-full justify-start text-left font-normal ${!editDueDate ? "text-gray-400" : ""}`}
                              >
                                {editDueDate ? format(editDueDate, "dd/MM/yyyy", { locale: ptBR }) : "Selecionar data"}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <CalendarComponent
                                mode="single"
                                selected={editDueDate}
                                onSelect={setEditDueDate}
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                          {editDueDate && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => setEditDueDate(undefined)}
                              className="ml-2"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-col gap-1">
                        <label className="text-xs font-medium text-gray-700 flex items-center">
                          <Tag className="h-3.5 w-3.5 mr-1" />
                          Cor
                        </label>
                        <div className="flex flex-wrap gap-2">
                          {TASK_COLORS.map((color) => (
                            <button
                              key={color.name}
                              type="button"
                              onClick={() => setEditColor(color.name)}
                              className={`w-6 h-6 rounded-full border ${
                                editColor === color.name ? "ring-2 ring-offset-2 ring-[#4b7bb5]" : ""
                              }`}
                              style={{ backgroundColor: color.value }}
                              title={color.label}
                            />
                          ))}
                        </div>
                      </div>

                      <div className="flex flex-col gap-1">
                        <label className="text-xs font-medium text-gray-700 flex items-center">
                          <MessageSquare className="h-3.5 w-3.5 mr-1" />
                          Comentários
                        </label>
                        <textarea
                          value={editComments}
                          onChange={(e) => setEditComments(e.target.value)}
                          placeholder="Adicionar comentários (opcional)"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#4b7bb5] focus:border-[#4b7bb5] min-h-[60px]"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end gap-2">
                      <Button
                        type="button"
                        onClick={() => saveEditTask(task.id)}
                        disabled={!editDescription.trim()}
                        className="px-2 py-1 bg-[#4b7bb5] text-white text-xs rounded hover:bg-[#3d649e] transition-colors flex items-center"
                      >
                        <Save className="h-3 w-3 mr-1" />
                        Salvar
                      </Button>
                      <Button
                        type="button"
                        onClick={cancelEdit}
                        className="px-2 py-1 bg-gray-200 text-gray-700 text-xs rounded hover:bg-gray-300 transition-colors flex items-center"
                      >
                        <X className="h-3 w-3 mr-1" />
                        Cancelar
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col gap-2">
                    <div className="flex items-start gap-3">
                      <button
                        onClick={() => toggleTaskStatus(task.id, task.is_completed)}
                        className={`mt-0.5 flex-shrink-0 ${getTaskTextColorClass(task.color)} hover:opacity-80 transition-colors`}
                        title={task.is_completed ? "Marcar como pendente" : "Marcar como concluída"}
                      >
                        {task.is_completed ? <CheckCircle className="h-5 w-5" /> : <Circle className="h-5 w-5" />}
                      </button>
                      <div className="flex-1 min-w-0">
                        <p
                          className={`text-sm ${task.is_completed ? "line-through text-gray-400" : getTaskTextColorClass(task.color)}`}
                        >
                          {task.description}
                        </p>
                        <div className="flex flex-wrap items-center gap-2 mt-1">
                          <span className="text-xs text-gray-400">{formatDate(task.created_at)}</span>

                          {task.due_date && (
                            <Badge
                              variant="outline"
                              className={`text-xs flex items-center ${
                                task.is_completed
                                  ? "bg-gray-100 text-gray-500"
                                  : getDueDateStatus(task.due_date) === "overdue"
                                    ? "bg-red-50 text-red-600 border-red-200"
                                    : getDueDateStatus(task.due_date) === "soon"
                                      ? "bg-orange-50 text-orange-600 border-orange-200"
                                      : "bg-green-50 text-green-600 border-green-200"
                              }`}
                            >
                              <Calendar className="h-3 w-3 mr-1" />
                              {format(new Date(task.due_date), "dd/MM/yyyy", { locale: ptBR })}
                              {getDueDateStatus(task.due_date) === "overdue" && !task.is_completed && (
                                <span className="ml-1 font-semibold">(Vencida)</span>
                              )}
                            </Badge>
                          )}

                          {task.comments && (
                            <button
                              onClick={() => toggleComments(task.id)}
                              className="text-xs flex items-center text-gray-500 hover:text-gray-700"
                            >
                              <MessageSquare className="h-3 w-3 mr-1" />
                              {showComments[task.id] ? "Ocultar comentários" : "Ver comentários"}
                            </button>
                          )}
                        </div>
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

                    {showComments[task.id] && task.comments && (
                      <div className="ml-8 mt-1 p-2 bg-white rounded border border-gray-200 text-xs text-gray-700">
                        {task.comments}
                      </div>
                    )}
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
