"use client"

import { DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

import type React from "react"

import { useState, useEffect, useCallback, useRef } from "react"
import {
  Folder,
  FolderOpen,
  ChevronRight,
  Home,
  Search,
  Upload,
  RefreshCw,
  Loader2,
  ArrowUp,
  Filter,
  SortAsc,
  SortDesc,
  AlertCircle,
  X,
  FolderPlus,
  Download,
  Clock,
  Star,
  StarOff,
  Trash2,
  FileText,
  ImageIcon,
  Film,
  Music,
  Archive,
  FileIcon,
  MoreVertical,
  Share2,
  ExternalLink,
  HelpCircle,
  Bookmark,
  Layers,
  LayoutGrid,
  LayoutList,
  Maximize2,
  Minimize2,
  ClipboardList,
  CheckCircle,
  Circle,
  Plus,
  Edit,
  Save,
  Calendar,
  Info,
} from "lucide-react"
import { FileCard } from "./file-card"
import { FileRow } from "./file-row"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
  DropdownMenuGroup,
} from "@/components/ui/dropdown-menu"
import { FileUploader } from "./file-uploader"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Skeleton } from "@/components/ui/skeleton"
import { ShareLinkDialog } from "./share-link-dialog"
import { ToastNotification } from "./toast-notification"
import { DeleteConfirmationDialog } from "./delete-confirmation-dialog"
import { Textarea } from "@/components/ui/textarea"
import { getSupabaseClient } from "@/lib/supabase/client"

// Adicionar importações para os componentes de tarefas
import { fetchFolderTaskCounts } from "@/lib/folder-tasks-manager"

interface FileItem {
  id: string
  name: string
  type: "folder" | "file"
  size?: number
  modified: string
  path: string
  url?: string
  fileType?: string
  project?: string
  isFavorite?: boolean
}

interface FolderTask {
  id: string
  folder_path: string
  description: string | null
  is_completed: boolean
  created_at: string
}

export function FileExplorer() {
  const [files, setFiles] = useState<FileItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentPath, setCurrentPath] = useState<string[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [viewMode, setViewMode] = useState<"grid" | "list" | "details">("grid")
  const [showUploader, setShowUploader] = useState(false)
  const [showCreateFolderDialog, setShowCreateFolderDialog] = useState(false)
  const [newFolderName, setNewFolderName] = useState("")
  const [isCreatingFolder, setIsCreatingFolder] = useState(false)
  const [sortBy, setSortBy] = useState<"name" | "date" | "size">("name")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")
  const [selectedFileType, setSelectedFileType] = useState<string | null>(null)
  const [selectedFiles, setSelectedFiles] = useState<FileItem[]>([])
  const [isSelectionMode, setIsSelectionMode] = useState(false)
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false)
  const [itemToDelete, setItemToDelete] = useState<FileItem | null>(null)
  const [showShareDialog, setShowShareDialog] = useState(false)
  const [itemToShare, setItemToShare] = useState<FileItem | null>(null)
  const [toast, setToast] = useState<{ visible: boolean; message: string; type: "success" | "error" }>({
    visible: false,
    message: "",
    type: "success",
  })
  const [favorites, setFavorites] = useState<string[]>([])
  const [activeTab, setActiveTab] = useState<"all" | "recent" | "favorites" | "shared">("all")
  const [recentFiles, setRecentFiles] = useState<FileItem[]>([])
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showHelp, setShowHelp] = useState(false)
  const [storageUsage, setStorageUsage] = useState({ used: 0, total: 1024 * 1024 * 1024 * 10 }) // 10GB default
  const fileExplorerRef = useRef<HTMLDivElement>(null)

  // Estados para gerenciar tarefas
  const [taskCounts, setTaskCounts] = useState<Record<string, number>>({})
  const [tasks, setTasks] = useState<FolderTask[]>([])
  const [isLoadingTasks, setIsLoadingTasks] = useState(false)
  const [newTaskDescription, setNewTaskDescription] = useState("")
  const [isAddingTask, setIsAddingTask] = useState(false)
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null)
  const [editDescription, setEditDescription] = useState("")
  const [viewType, setViewType] = useState<"files" | "tasks">("files")
  const [selectedTask, setSelectedTask] = useState<FolderTask | null>(null)
  const [showTaskDetails, setShowTaskDetails] = useState(false)
  const [taskSortBy, setTaskSortBy] = useState<"date" | "status">("date")
  const [taskSortDirection, setTaskSortDirection] = useState<"asc" | "desc">("desc")
  const [taskFilter, setTaskFilter] = useState<"all" | "pending" | "completed">("all")
  const [taskSearchQuery, setTaskSearchQuery] = useState("")

  // Função para buscar arquivos e pastas
  const fetchFiles = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      const pathString = currentPath.join("/")
      const response = await fetch(`/api/files?directory=${pathString || "documents"}`)

      if (!response.ok) {
        throw new Error(`Erro ao buscar arquivos: ${response.status}`)
      }

      const data = await response.json()

      // Transformar os dados para o formato FileItem
      const fileItems: FileItem[] = data.files.map((file: any) => ({
        id: file.Guid || file.ObjectName,
        name: file.ObjectName,
        type: file.IsDirectory ? "folder" : "file",
        size: file.Length,
        modified: file.LastChanged,
        path: file.Path,
        url: file.PublicUrl,
        fileType: file.IsDirectory ? undefined : file.ObjectName.split(".").pop(),
        project: null, // Adicionar projeto se necessário
        isFavorite: favorites.includes(file.Path),
      }))

      setFiles(fileItems)

      // Atualizar arquivos recentes
      const newRecentFiles = fileItems
        .filter((file) => file.type === "file")
        .sort((a, b) => new Date(b.modified).getTime() - new Date(a.modified).getTime())
        .slice(0, 10)

      setRecentFiles(newRecentFiles)

      // Simular cálculo de uso de armazenamento
      const totalSize = fileItems.reduce((acc, file) => acc + (file.size || 0), 0)
      setStorageUsage((prev) => ({ ...prev, used: totalSize }))
    } catch (err) {
      console.error("Erro ao buscar arquivos:", err)
      setError(err instanceof Error ? err.message : "Erro desconhecido ao buscar arquivos")
    } finally {
      setIsLoading(false)
    }
  }, [currentPath, favorites])

  // Função para buscar contagens de tarefas
  const fetchTaskCounts = useCallback(async () => {
    try {
      // Obter apenas os caminhos das pastas
      const folderPaths = files.filter((file) => file.type === "folder").map((folder) => folder.path)

      if (folderPaths.length === 0) return

      const counts = await fetchFolderTaskCounts(folderPaths)
      setTaskCounts(counts)
    } catch (error) {
      console.error("Erro ao buscar contagens de tarefas:", error)
    }
  }, [files])

  // Função para buscar tarefas da pasta atual
  const fetchTasks = useCallback(async () => {
    if (!currentPath.length) return

    setIsLoadingTasks(true)
    try {
      const folderPath = currentPath.join("/")
      const supabase = getSupabaseClient()
      const { data, error } = await supabase
        .from("folder_tasks")
        .select("*")
        .eq("folder_path", folderPath)
        .order("created_at", { ascending: false })

      if (error) throw error

      setTasks(data || [])
    } catch (err) {
      console.error("Erro ao carregar tarefas da pasta:", err)
    } finally {
      setIsLoadingTasks(false)
    }
  }, [currentPath])

  // Carregar arquivos quando o componente montar ou o caminho mudar
  useEffect(() => {
    fetchFiles()
  }, [fetchFiles])

  // Buscar contagens de tarefas quando os arquivos mudarem
  useEffect(() => {
    if (!isLoading && files.length > 0) {
      fetchTaskCounts()
    }
  }, [fetchTaskCounts, isLoading, files])

  // Buscar tarefas quando o caminho mudar ou quando alternar para a aba de tarefas
  useEffect(() => {
    if (viewType === "tasks" || currentPath.length > 0) {
      fetchTasks()
    }
  }, [fetchTasks, viewType, currentPath])

  // Carregar favoritos do localStorage
  useEffect(() => {
    const savedFavorites = localStorage.getItem("fileFavorites")
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites))
    }
  }, [])

  // Navegar para uma pasta
  const navigateToFolder = (folderPath: string) => {
    const pathSegments = folderPath.split("/").filter((segment) => segment.length > 0)
    setCurrentPath(pathSegments)
    setSelectedFiles([])
    setIsSelectionMode(false)
  }

  // Navegar para a pasta pai
  const navigateUp = () => {
    if (currentPath.length > 0) {
      setCurrentPath(currentPath.slice(0, -1))
      setSelectedFiles([])
      setIsSelectionMode(false)
    }
  }

  // Navegar para a pasta raiz
  const navigateHome = () => {
    setCurrentPath([])
    setSelectedFiles([])
    setIsSelectionMode(false)
  }

  // Navegar para um segmento específico do caminho
  const navigateToPathSegment = (index: number) => {
    setCurrentPath(currentPath.slice(0, index + 1))
    setSelectedFiles([])
    setIsSelectionMode(false)
  }

  // Excluir um arquivo ou pasta
  const handleDelete = (file: FileItem) => {
    setItemToDelete(file)
    setShowDeleteConfirmation(true)
  }

  // Confirmar exclusão
  const confirmDelete = async () => {
    if (!itemToDelete) return

    try {
      let cleanPath = itemToDelete.path
      if (cleanPath.startsWith("http")) {
        const url = new URL(cleanPath)
        cleanPath = url.pathname.replace(/^\//, "")
      }

      const response = await fetch(`/api/files/${encodeURIComponent(cleanPath)}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.message || data.error || `Erro ao excluir: ${response.status}`)
      }

      // Remover o arquivo da lista
      setFiles((prev) => prev.filter((file) => file.path !== itemToDelete.path))

      // Mostrar toast de sucesso
      setToast({
        visible: true,
        message: `${itemToDelete.type === "folder" ? "Pasta" : "Arquivo"} excluído com sucesso!`,
        type: "success",
      })

      // Esconder o toast após 3 segundos
      setTimeout(() => {
        setToast((prev) => ({ ...prev, visible: false }))
      }, 3000)
    } catch (err) {
      console.error("Erro ao excluir:", err)
      setToast({
        visible: true,
        message: err instanceof Error ? err.message : "Erro ao excluir",
        type: "error",
      })
    } finally {
      setShowDeleteConfirmation(false)
      setItemToDelete(null)
    }
  }

  // Renomear um arquivo ou pasta
  const handleRename = async (oldPath: string, newName: string) => {
    try {
      // Atualizar a UI imediatamente para feedback rápido
      setFiles((prev) =>
        prev.map((file) => {
          if (file.path === oldPath) {
            const pathParts = file.path.split("/")
            pathParts[pathParts.length - 1] = newName
            const newPath = pathParts.join("/")

            return {
              ...file,
              name: newName,
              path: newPath,
              url: file.url ? file.url.replace(file.name, newName) : undefined,
            }
          }
          return file
        }),
      )

      // Buscar arquivos novamente para garantir que tudo esteja atualizado
      setTimeout(() => {
        fetchFiles()
      }, 500)

      // Mostrar toast de sucesso
      setToast({
        visible: true,
        message: "Item renomeado com sucesso!",
        type: "success",
      })

      // Esconder o toast após 3 segundos
      setTimeout(() => {
        setToast((prev) => ({ ...prev, visible: false }))
      }, 3000)
    } catch (err) {
      console.error("Erro ao renomear:", err)
      setToast({
        visible: true,
        message: err instanceof Error ? err.message : "Erro ao renomear",
        type: "error",
      })
    }
  }

  // Criar uma nova pasta
  const handleCreateFolder = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!newFolderName || newFolderName.trim() === "") {
      return
    }

    if (/[\\/:*?"<>|]/.test(newFolderName)) {
      setToast({
        visible: true,
        message: "O nome da pasta contém caracteres inválidos",
        type: "error",
      })
      return
    }

    setIsCreatingFolder(true)

    try {
      const currentPathString = currentPath.join("/")
      const newFolderPath = currentPathString ? `${currentPathString}/${newFolderName}` : newFolderName

      const response = await fetch("/api/create-directory", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ directory: newFolderPath }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.message || data.error || `Erro ao criar pasta: ${response.status}`)
      }

      setShowCreateFolderDialog(false)
      setNewFolderName("")

      // Adicionar a nova pasta à lista
      const newFolder: FileItem = {
        id: `folder-${Date.now()}`,
        name: newFolderName,
        type: "folder",
        modified: new Date().toISOString(),
        path: `${currentPathString}/${newFolderName}/`.replace(/\/+/g, "/"),
      }

      setFiles((prev) => [...prev, newFolder])

      // Buscar arquivos novamente para garantir que tudo esteja atualizado
      setTimeout(() => {
        fetchFiles()
      }, 500)

      // Mostrar toast de sucesso
      setToast({
        visible: true,
        message: "Pasta criada com sucesso!",
        type: "success",
      })

      // Esconder o toast após 3 segundos
      setTimeout(() => {
        setToast((prev) => ({ ...prev, visible: false }))
      }, 3000)
    } catch (err) {
      console.error("Erro ao criar pasta:", err)
      setToast({
        visible: true,
        message: err instanceof Error ? err.message : "Erro ao criar pasta",
        type: "error",
      })
    } finally {
      setIsCreatingFolder(false)
    }
  }

  // Compartilhar arquivo ou pasta
  const handleShare = (file: FileItem) => {
    setItemToShare(file)
    setShowShareDialog(true)
  }

  // Alternar favorito
  const toggleFavorite = (file: FileItem) => {
    const newFavorites = favorites.includes(file.path)
      ? favorites.filter((path) => path !== file.path)
      : [...favorites, file.path]

    setFavorites(newFavorites)
    localStorage.setItem("fileFavorites", JSON.stringify(newFavorites))

    // Atualizar o estado do arquivo
    setFiles((prev) =>
      prev.map((item) => {
        if (item.path === file.path) {
          return { ...item, isFavorite: !item.isFavorite }
        }
        return item
      }),
    )

    // Mostrar toast
    setToast({
      visible: true,
      message: favorites.includes(file.path) ? "Removido dos favoritos" : "Adicionado aos favoritos",
      type: "success",
    })

    // Esconder o toast após 3 segundos
    setTimeout(() => {
      setToast((prev) => ({ ...prev, visible: false }))
    }, 3000)
  }

  // Alternar modo de seleção
  const toggleSelectionMode = () => {
    setIsSelectionMode(!isSelectionMode)
    if (isSelectionMode) {
      setSelectedFiles([])
    }
  }

  // Selecionar/deselecionar arquivo
  const toggleFileSelection = (file: FileItem) => {
    if (selectedFiles.some((f) => f.id === file.id)) {
      setSelectedFiles(selectedFiles.filter((f) => f.id !== file.id))
    } else {
      setSelectedFiles([...selectedFiles, file])
    }
  }

  // Selecionar todos os arquivos
  const selectAllFiles = () => {
    if (selectedFiles.length === filteredFiles.length) {
      setSelectedFiles([])
    } else {
      setSelectedFiles([...filteredFiles])
    }
  }

  // Excluir arquivos selecionados
  const deleteSelectedFiles = () => {
    if (selectedFiles.length === 0) return

    // Mostrar confirmação para cada arquivo
    setItemToDelete({
      ...selectedFiles[0],
      name: `${selectedFiles.length} itens selecionados`,
    })
    setShowDeleteConfirmation(true)
  }

  // Alternar modo de tela cheia
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      fileExplorerRef.current?.requestFullscreen()
      setIsFullscreen(true)
    } else {
      document.exitFullscreen()
      setIsFullscreen(false)
    }
  }

  // Adicionar nova tarefa
  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!newTaskDescription || !newTaskDescription.trim()) return
    if (currentPath.length === 0) return

    setIsAddingTask(true)

    try {
      const supabase = getSupabaseClient()
      const folderPath = currentPath.join("/")
      const newTask = {
        folder_path: folderPath,
        description: newTaskDescription.trim(),
        is_completed: false,
      }

      const { data, error } = await supabase.from("folder_tasks").insert([newTask]).select()

      if (error) throw error

      if (data && data.length > 0) {
        setTasks([data[0], ...tasks])

        // Atualizar contagem de tarefas
        setTaskCounts((prev) => ({
          ...prev,
          [folderPath]: (prev[folderPath] || 0) + 1,
        }))
      }

      setNewTaskDescription("")

      // Mostrar toast de sucesso
      setToast({
        visible: true,
        message: "Tarefa adicionada com sucesso!",
        type: "success",
      })

      // Esconder o toast após 3 segundos
      setTimeout(() => {
        setToast((prev) => ({ ...prev, visible: false }))
      }, 3000)
    } catch (err) {
      console.error("Erro ao adicionar tarefa:", err)
      setToast({
        visible: true,
        message: "Erro ao adicionar tarefa",
        type: "error",
      })
    } finally {
      setIsAddingTask(false)
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
      const folderPath = currentPath.join("/")
      const pendingCount = updatedTasks.filter((task) => !task.is_completed).length

      setTaskCounts((prev) => ({
        ...prev,
        [folderPath]: pendingCount,
      }))
    } catch (err) {
      console.error("Erro ao atualizar status da tarefa:", err)
      setToast({
        visible: true,
        message: "Erro ao atualizar status da tarefa",
        type: "error",
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
        const folderPath = currentPath.join("/")
        const pendingCount = updatedTasks.filter((task) => !task.is_completed).length

        setTaskCounts((prev) => ({
          ...prev,
          [folderPath]: pendingCount,
        }))
      }

      // Mostrar toast de sucesso
      setToast({
        visible: true,
        message: "Tarefa excluída com sucesso!",
        type: "success",
      })

      // Esconder o toast após 3 segundos
      setTimeout(() => {
        setToast((prev) => ({ ...prev, visible: false }))
      }, 3000)
    } catch (err) {
      console.error("Erro ao excluir tarefa:", err)
      setToast({
        visible: true,
        message: "Erro ao excluir tarefa",
        type: "error",
      })
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

      // Mostrar toast de sucesso
      setToast({
        visible: true,
        message: "Tarefa atualizada com sucesso!",
        type: "success",
      })

      // Esconder o toast após 3 segundos
      setTimeout(() => {
        setToast((prev) => ({ ...prev, visible: false }))
      }, 3000)
    } catch (err) {
      console.error("Erro ao atualizar tarefa:", err)
      setToast({
        visible: true,
        message: "Erro ao atualizar tarefa",
        type: "error",
      })
    }
  }

  // Cancelar edição
  const cancelEdit = () => {
    setEditingTaskId(null)
    setEditDescription("")
  }

  // Abrir detalhes da tarefa
  const openTaskDetails = (task: FolderTask) => {
    setSelectedTask(task)
    setShowTaskDetails(true)
  }

  // Filtrar arquivos com base na pesquisa, tipo e aba ativa
  const getFilteredFiles = () => {
    let filtered = files

    // Filtrar por pesquisa
    if (searchQuery) {
      filtered = filtered.filter((file) => file.name.toLowerCase().includes(searchQuery.toLowerCase()))
    }

    // Filtrar por tipo de arquivo
    if (selectedFileType) {
      filtered = filtered.filter((file) => {
        if (selectedFileType === "folder") return file.type === "folder"
        if (file.type === "file") {
          return file.fileType === selectedFileType
        }
        return false
      })
    }

    // Filtrar por aba ativa
    if (activeTab === "favorites") {
      filtered = filtered.filter((file) => favorites.includes(file.path))
    } else if (activeTab === "recent") {
      // Mostrar apenas os 20 arquivos mais recentes
      const recentOnly = filtered
        .filter((file) => file.type === "file")
        .sort((a, b) => new Date(b.modified).getTime() - new Date(a.modified).getTime())
        .slice(0, 20)

      filtered = recentOnly
    }

    return filtered
  }

  // Filtrar tarefas
  const getFilteredTasks = () => {
    let filtered = tasks

    // Filtrar por pesquisa
    if (taskSearchQuery) {
      filtered = filtered.filter((task) => task.description?.toLowerCase().includes(taskSearchQuery.toLowerCase()))
    }

    // Filtrar por status
    if (taskFilter === "pending") {
      filtered = filtered.filter((task) => !task.is_completed)
    } else if (taskFilter === "completed") {
      filtered = filtered.filter((task) => task.is_completed)
    }

    return filtered
  }

  // Ordenar tarefas
  const getSortedTasks = (filteredTasks: FolderTask[]) => {
    return [...filteredTasks].sort((a, b) => {
      if (taskSortBy === "date") {
        return taskSortDirection === "asc"
          ? new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
          : new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      } else if (taskSortBy === "status") {
        if (taskSortDirection === "asc") {
          return a.is_completed === b.is_completed ? 0 : a.is_completed ? 1 : -1
        } else {
          return a.is_completed === b.is_completed ? 0 : a.is_completed ? -1 : 1
        }
      }
      return 0
    })
  }

  const filteredFiles = getFilteredFiles()
  const filteredTasks = getFilteredTasks()
  const sortedTasks = getSortedTasks(filteredTasks)

  // Ordenar arquivos
  const sortedFiles = [...filteredFiles].sort((a, b) => {
    // Sempre mostrar pastas primeiro
    if (a.type === "folder" && b.type !== "folder") return -1
    if (a.type !== "folder" && b.type === "folder") return 1

    // Ordenar pelo campo selecionado
    if (sortBy === "name") {
      return sortDirection === "asc" ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)
    } else if (sortBy === "date") {
      return sortDirection === "asc"
        ? new Date(a.modified).getTime() - new Date(b.modified).getTime()
        : new Date(b.modified).getTime() - new Date(a.modified).getTime()
    } else if (sortBy === "size") {
      const aSize = a.size || 0
      const bSize = b.size || 0
      return sortDirection === "asc" ? aSize - bSize : bSize - aSize
    }

    return 0
  })

  // Agrupar arquivos por tipo para exibição
  const fileTypes = Array.from(
    new Set(files.filter((file) => file.type === "file").map((file) => file.fileType || "outros")),
  )

  // Formatar bytes em unidades legíveis
  const formatBytes = (bytes = 0) => {
    if (bytes === 0) return "0 Bytes"

    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))

    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
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

  // Renderizar breadcrumbs
  const renderBreadcrumbs = () => {
    return (
      <div className="flex items-center text-sm overflow-x-auto whitespace-nowrap py-2 px-1 bg-white rounded-md shadow-sm border border-gray-100">
        <button
          onClick={navigateHome}
          className="p-1.5 hover:bg-blue-50 rounded-md flex items-center text-[#4b7bb5]"
          title="Início"
        >
          <Home size={16} />
        </button>

        {currentPath.length > 0 && <ChevronRight size={16} className="mx-1 text-gray-400" />}

        {currentPath.map((segment, index) => (
          <div key={index} className="flex items-center">
            <button
              onClick={() => navigateToPathSegment(index)}
              className={`px-2 py-1 rounded-md hover:bg-blue-50 ${
                index === currentPath.length - 1 ? "font-medium text-[#4b7bb5] bg-blue-50" : "text-gray-600"
              }`}
            >
              {segment}
            </button>
            {index < currentPath.length - 1 && <ChevronRight size={16} className="mx-1 text-gray-400" />}
          </div>
        ))}
      </div>
    )
  }

  // Renderizar estatísticas de armazenamento
  const renderStorageStats = () => {
    const usedPercentage = (storageUsage.used / storageUsage.total) * 100

    return (
      <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-sm font-medium text-gray-700">Armazenamento</h3>
          <span className="text-xs text-gray-500">
            {formatBytes(storageUsage.used)} de {formatBytes(storageUsage.total)}
          </span>
        </div>
        <Progress value={usedPercentage} className="h-2" />
        <p className="mt-2 text-xs text-gray-500">
          {usedPercentage < 80
            ? "Espaço suficiente disponível"
            : usedPercentage < 90
              ? "Espaço limitado disponível"
              : "Pouco espaço disponível"}
        </p>
      </div>
    )
  }

  return (
    <div
      ref={fileExplorerRef}
      className={`bg-gray-50 rounded-xl border border-gray-200 shadow-sm overflow-hidden transition-all ${
        isFullscreen ? "fixed inset-0 z-50" : ""
      }`}
    >
      <div className="flex flex-col h-full">
        {/* Cabeçalho */}
        <div className="bg-white border-b border-gray-200 p-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex items-center">
              <FolderOpen className="mr-2 h-6 w-6 text-[#4b7bb5]" />
              <h2 className="text-xl font-bold text-[#4072b0]">
                {activeTab === "all"
                  ? "Todos os Arquivos"
                  : activeTab === "recent"
                    ? "Arquivos Recentes"
                    : activeTab === "favorites"
                      ? "Favoritos"
                      : "Compartilhados"}
              </h2>
            </div>

            <div className="flex items-center gap-2 w-full md:w-auto">
              <div className="relative flex-1 md:max-w-xs">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder={viewType === "files" ? "Buscar arquivos..." : "Buscar tarefas..."}
                  value={viewType === "files" ? searchQuery : taskSearchQuery}
                  onChange={(e) =>
                    viewType === "files" ? setSearchQuery(e.target.value) : setTaskSearchQuery(e.target.value)
                  }
                  className="pl-9 bg-white border-gray-200"
                />
                {(viewType === "files" ? searchQuery : taskSearchQuery) && (
                  <button
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    onClick={() => (viewType === "files" ? setSearchQuery("") : setTaskSearchQuery(""))}
                  >
                    <X size={14} />
                  </button>
                )}
              </div>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={toggleFullscreen}
                      className="bg-white hidden md:flex"
                    >
                      {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{isFullscreen ? "Sair da tela cheia" : "Tela cheia"}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              {viewType === "files" ? (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowUploader(true)}
                    className="bg-white border-[#4b7bb5] text-[#4b7bb5] hover:bg-[#f0f4f9]"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    <span className="hidden sm:inline">Upload</span>
                  </Button>

                  <Button
                    variant="default"
                    size="sm"
                    onClick={() => setShowCreateFolderDialog(true)}
                    className="bg-[#4b7bb5] hover:bg-[#3d649e]"
                  >
                    <FolderPlus className="h-4 w-4 mr-2" />
                    <span className="hidden sm:inline">Nova Pasta</span>
                  </Button>
                </>
              ) : (
                <Button
                  variant="default"
                  size="sm"
                  onClick={() => document.getElementById("add-task-form")?.scrollIntoView({ behavior: "smooth" })}
                  className="bg-[#4b7bb5] hover:bg-[#3d649e]"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">Nova Tarefa</span>
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Abas e navegação */}
        <div className="bg-white border-b border-gray-200 px-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <Tabs
              defaultValue="all"
              value={activeTab}
              onValueChange={(value) => setActiveTab(value as "all" | "recent" | "favorites" | "shared")}
              className="w-full"
            >
              <TabsList className="mb-4 md:mb-0">
                <TabsTrigger value="all" className="data-[state=active]:bg-[#4b7bb5] data-[state=active]:text-white">
                  Todos
                </TabsTrigger>
                <TabsTrigger value="recent" className="data-[state=active]:bg-[#4b7bb5] data-[state=active]:text-white">
                  Recentes
                </TabsTrigger>
                <TabsTrigger
                  value="favorites"
                  className="data-[state=active]:bg-[#4b7bb5] data-[state=active]:text-white"
                >
                  Favoritos
                </TabsTrigger>
                <TabsTrigger value="shared" className="data-[state=active]:bg-[#4b7bb5] data-[state=active]:text-white">
                  Compartilhados
                </TabsTrigger>
              </TabsList>
            </Tabs>

            <div className="flex items-center gap-2 mb-4 md:mb-0 w-full md:w-auto">
              {viewType === "files" ? (
                <>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm" className="bg-white">
                        <Filter size={16} className="mr-2" />
                        <span className="hidden sm:inline">Filtrar</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      <DropdownMenuLabel>Tipo de arquivo</DropdownMenuLabel>
                      <DropdownMenuItem
                        className={!selectedFileType ? "bg-blue-50 text-blue-600" : ""}
                        onClick={() => setSelectedFileType(null)}
                      >
                        Todos os arquivos
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className={selectedFileType === "folder" ? "bg-blue-50 text-blue-600" : ""}
                        onClick={() => setSelectedFileType("folder")}
                      >
                        <Folder className="h-4 w-4 mr-2 text-[#4b7bb5]" />
                        Pastas
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      {fileTypes.map((type) => (
                        <DropdownMenuItem
                          key={type}
                          className={selectedFileType === type ? "bg-blue-50 text-blue-600" : ""}
                          onClick={() => setSelectedFileType(type)}
                        >
                          {type}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm" className="bg-white">
                        {sortDirection === "asc" ? (
                          <SortAsc size={16} className="mr-2" />
                        ) : (
                          <SortDesc size={16} className="mr-2" />
                        )}
                        <span className="hidden sm:inline">Ordenar</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Ordenar por</DropdownMenuLabel>
                      <DropdownMenuItem
                        className={sortBy === "name" ? "bg-blue-50 text-blue-600" : ""}
                        onClick={() => {
                          setSortBy("name")
                          setSortDirection(sortBy === "name" && sortDirection === "asc" ? "desc" : "asc")
                        }}
                      >
                        Nome
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className={sortBy === "date" ? "bg-blue-50 text-blue-600" : ""}
                        onClick={() => {
                          setSortBy("date")
                          setSortDirection(sortBy === "date" && sortDirection === "asc" ? "desc" : "asc")
                        }}
                      >
                        Data
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className={sortBy === "size" ? "bg-blue-50 text-blue-600" : ""}
                        onClick={() => {
                          setSortBy("size")
                          setSortDirection(sortBy === "size" && sortDirection === "asc" ? "desc" : "asc")
                        }}
                      >
                        Tamanho
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm" className="bg-white">
                        {viewMode === "grid" ? (
                          <LayoutGrid size={16} className="mr-2" />
                        ) : viewMode === "list" ? (
                          <LayoutList size={16} className="mr-2" />
                        ) : (
                          <Layers size={16} className="mr-2" />
                        )}
                        <span className="hidden sm:inline">Visualização</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        className={viewMode === "grid" ? "bg-blue-50 text-blue-600" : ""}
                        onClick={() => setViewMode("grid")}
                      >
                        <LayoutGrid className="h-4 w-4 mr-2" />
                        Grade
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className={viewMode === "list" ? "bg-blue-50 text-blue-600" : ""}
                        onClick={() => setViewMode("list")}
                      >
                        <LayoutList className="h-4 w-4 mr-2" />
                        Lista
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className={viewMode === "details" ? "bg-blue-50 text-blue-600" : ""}
                        onClick={() => setViewMode("details")}
                      >
                        <Layers className="h-4 w-4 mr-2" />
                        Detalhes
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={toggleSelectionMode}
                    className={`bg-white ${isSelectionMode ? "border-[#4b7bb5] text-[#4b7bb5]" : ""}`}
                  >
                    {isSelectionMode ? (
                      <>
                        <X className="h-4 w-4 mr-2" />
                        <span className="hidden sm:inline">Cancelar</span>
                      </>
                    ) : (
                      <>
                        <Bookmark className="h-4 w-4 mr-2" />
                        <span className="hidden sm:inline">Selecionar</span>
                      </>
                    )}
                  </Button>
                </>
              ) : (
                <>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm" className="bg-white">
                        <Filter size={16} className="mr-2" />
                        <span className="hidden sm:inline">Status</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        className={taskFilter === "all" ? "bg-blue-50 text-blue-600" : ""}
                        onClick={() => setTaskFilter("all")}
                      >
                        Todas as tarefas
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className={taskFilter === "pending" ? "bg-blue-50 text-blue-600" : ""}
                        onClick={() => setTaskFilter("pending")}
                      >
                        Pendentes
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className={taskFilter === "completed" ? "bg-blue-50 text-blue-600" : ""}
                        onClick={() => setTaskFilter("completed")}
                      >
                        Concluídas
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm" className="bg-white">
                        {taskSortDirection === "asc" ? (
                          <SortAsc size={16} className="mr-2" />
                        ) : (
                          <SortDesc size={16} className="mr-2" />
                        )}
                        <span className="hidden sm:inline">Ordenar</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        className={taskSortBy === "date" ? "bg-blue-50 text-blue-600" : ""}
                        onClick={() => {
                          setTaskSortBy("date")
                          setTaskSortDirection(taskSortBy === "date" && taskSortDirection === "asc" ? "desc" : "asc")
                        }}
                      >
                        Data
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className={taskSortBy === "status" ? "bg-blue-50 text-blue-600" : ""}
                        onClick={() => {
                          setTaskSortBy("status")
                          setTaskSortDirection(taskSortBy === "status" && taskSortDirection === "asc" ? "desc" : "asc")
                        }}
                      >
                        Status
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </>
              )}

              <Button variant="outline" size="sm" onClick={fetchFiles} disabled={isLoading} className="bg-white">
                {isLoading ? <Loader2 size={16} className="animate-spin" /> : <RefreshCw size={16} />}
              </Button>

              {currentPath.length > 0 && (
                <Button variant="outline" size="sm" onClick={navigateUp} className="bg-white">
                  <ArrowUp size={16} />
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Barra de seleção */}
        {viewType === "files" && isSelectionMode && selectedFiles.length > 0 && (
          <div className="bg-blue-50 p-3 border-b border-blue-100 flex items-center justify-between">
            <div className="flex items-center">
              <Bookmark className="h-5 w-5 mr-2 text-[#4b7bb5]" />
              <span className="font-medium text-[#4b7bb5]">{selectedFiles.length} item(s) selecionado(s)</span>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={selectAllFiles}
                className="bg-white border-[#4b7bb5] text-[#4b7bb5]"
              >
                {selectedFiles.length === filteredFiles.length ? "Desmarcar Todos" : "Selecionar Todos"}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={deleteSelectedFiles}
                className="bg-white border-red-500 text-red-500 hover:bg-red-50"
                disabled={selectedFiles.length === 0}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Excluir Selecionados
              </Button>
            </div>
          </div>
        )}

        {/* Navegação de pastas */}
        <div className="p-4 bg-gray-50">{renderBreadcrumbs()}</div>

        {/* Abas para alternar entre arquivos e tarefas */}
        <div className="px-4 bg-gray-50">
          <Tabs
            defaultValue="files"
            value={viewType}
            onValueChange={(value) => setViewType(value as "files" | "tasks")}
            className="w-full"
          >
            <TabsList className="grid w-full max-w-md grid-cols-2 mb-4">
              <TabsTrigger value="files" className="data-[state=active]:bg-[#4b7bb5] data-[state=active]:text-white">
                <Folder className="h-4 w-4 mr-2" />
                Arquivos
              </TabsTrigger>
              <TabsTrigger value="tasks" className="data-[state=active]:bg-[#4b7bb5] data-[state=active]:text-white">
                <ClipboardList className="h-4 w-4 mr-2" />
                Tarefas
                {taskCounts[currentPath.join("/")] ? (
                  <Badge className="ml-2 bg-[#3d649e]">{taskCounts[currentPath.join("/")]}</Badge>
                ) : null}
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Conteúdo principal */}
        <div className="flex-1 overflow-auto p-4 bg-gray-50">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Área principal de arquivos ou tarefas */}
            <div className="md:col-span-3">
              <div className="bg-white rounded-lg border border-gray-200 p-4 min-h-[400px]">
                {viewType === "files" ? (
                  // Visualização de arquivos
                  error ? (
                    <div className="flex items-center justify-center h-64 text-red-500">
                      <AlertCircle className="h-5 w-5 mr-2" />
                      <span>{error}</span>
                    </div>
                  ) : isLoading ? (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Skeleton className="h-8 w-48" />
                        <Skeleton className="h-8 w-24" />
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                        {Array.from({ length: 8 }).map((_, i) => (
                          <Skeleton key={i} className="h-32 w-full rounded-md" />
                        ))}
                      </div>
                    </div>
                  ) : sortedFiles.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                      <FolderOpen className="h-16 w-16 text-gray-300 mb-4" />
                      <p className="text-lg font-medium text-gray-600 mb-2">
                        {activeTab === "all"
                          ? "Pasta vazia"
                          : activeTab === "recent"
                            ? "Nenhum arquivo recente"
                            : activeTab === "favorites"
                              ? "Nenhum favorito"
                              : "Nenhum arquivo compartilhado"}
                      </p>
                      <p className="text-sm text-gray-500 mb-4">
                        {searchQuery
                          ? `Nenhum resultado encontrado para "${searchQuery}"`
                          : activeTab === "all"
                            ? "Esta pasta não contém nenhum arquivo ou subpasta"
                            : activeTab === "recent"
                              ? "Você não tem arquivos recentes"
                              : activeTab === "favorites"
                                ? "Você não tem favoritos"
                                : "Você não tem arquivos compartilhados"}
                      </p>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setShowUploader(true)}
                          className="border-[#4b7bb5] text-[#4b7bb5]"
                        >
                          <Upload className="h-4 w-4 mr-2" />
                          Upload
                        </Button>
                        <Button
                          variant="default"
                          size="sm"
                          onClick={() => setShowCreateFolderDialog(true)}
                          className="bg-[#4b7bb5]"
                        >
                          <FolderPlus className="h-4 w-4 mr-2" />
                          Nova Pasta
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      {viewMode === "grid" ? (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                          {sortedFiles.map((file) => (
                            <FileCard
                              key={file.id}
                              file={file}
                              onFolderClick={() => navigateToFolder(file.path)}
                              onDelete={() => handleDelete(file)}
                              onRename={handleRename}
                              onShare={() => handleShare(file)}
                              onToggleFavorite={() => toggleFavorite(file)}
                              isSelected={selectedFiles.some((f) => f.id === file.id)}
                              onToggleSelect={isSelectionMode ? () => toggleFileSelection(file) : undefined}
                              taskCount={file.type === "folder" ? taskCounts[file.path] : undefined}
                              onOpenTasks={
                                file.type === "folder"
                                  ? () => {
                                      navigateToFolder(file.path)
                                      setViewType("tasks")
                                    }
                                  : undefined
                              }
                            />
                          ))}
                        </div>
                      ) : viewMode === "list" ? (
                        <div className="overflow-x-auto">
                          <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                              <tr>
                                {isSelectionMode && (
                                  <th
                                    scope="col"
                                    className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                  >
                                    <input
                                      type="checkbox"
                                      checked={
                                        selectedFiles.length > 0 && selectedFiles.length === filteredFiles.length
                                      }
                                      onChange={selectAllFiles}
                                      className="rounded border-gray-300 text-[#4b7bb5] focus:ring-[#4b7bb5]"
                                    />
                                  </th>
                                )}
                                <th
                                  scope="col"
                                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                >
                                  Nome
                                </th>
                                <th
                                  scope="col"
                                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                >
                                  Data
                                </th>
                                <th
                                  scope="col"
                                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                >
                                  Tamanho
                                </th>
                                <th
                                  scope="col"
                                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                >
                                  Tipo
                                </th>
                                <th scope="col" className="relative px-6 py-3">
                                  <span className="sr-only">Ações</span>
                                </th>
                              </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                              {sortedFiles.map((file) => (
                                <FileRow
                                  key={file.id}
                                  file={file}
                                  onFolderClick={() => navigateToFolder(file.path)}
                                  onDelete={() => handleDelete(file)}
                                  onShare={() => handleShare(file)}
                                  onToggleFavorite={() => toggleFavorite(file)}
                                  isSelected={selectedFiles.some((f) => f.id === file.id)}
                                  onToggleSelect={isSelectionMode ? () => toggleFileSelection(file) : undefined}
                                  showCheckbox={isSelectionMode}
                                  taskCount={file.type === "folder" ? taskCounts[file.path] : undefined}
                                  onOpenTasks={
                                    file.type === "folder"
                                      ? () => {
                                          navigateToFolder(file.path)
                                          setViewType("tasks")
                                        }
                                      : undefined
                                  }
                                />
                              ))}
                            </tbody>
                          </table>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          {sortedFiles.map((file) => (
                            <Card
                              key={file.id}
                              className={`hover:bg-gray-50 transition-colors ${
                                selectedFiles.some((f) => f.id === file.id) ? "bg-blue-50 border-blue-200" : ""
                              }`}
                            >
                              <CardHeader className="p-4 pb-2">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-3">
                                    {isSelectionMode && (
                                      <input
                                        type="checkbox"
                                        checked={selectedFiles.some((f) => f.id === file.id)}
                                        onChange={() => toggleFileSelection(file)}
                                        className="rounded border-gray-300 text-[#4b7bb5] focus:ring-[#4b7bb5]"
                                      />
                                    )}
                                    <div className="p-2 bg-gray-100 rounded-md">
                                      {file.type === "folder" ? (
                                        <Folder className="h-5 w-5 text-[#4b7bb5]" />
                                      ) : file.fileType === "pdf" ? (
                                        <FileText className="h-5 w-5 text-red-500" />
                                      ) : ["jpg", "jpeg", "png", "gif", "webp"].includes(file.fileType || "") ? (
                                        <ImageIcon className="h-5 w-5 text-green-500" />
                                      ) : ["mp4", "avi", "mov", "webm"].includes(file.fileType || "") ? (
                                        <Film className="h-5 w-5 text-purple-500" />
                                      ) : ["mp3", "wav", "ogg"].includes(file.fileType || "") ? (
                                        <Music className="h-5 w-5 text-blue-500" />
                                      ) : ["zip", "rar", "7z", "tar", "gz"].includes(file.fileType || "") ? (
                                        <Archive className="h-5 w-5 text-amber-500" />
                                      ) : (
                                        <FileIcon className="h-5 w-5 text-gray-500" />
                                      )}
                                    </div>
                                    <div>
                                      <CardTitle className="text-base font-medium">
                                        <button
                                          onClick={
                                            file.type === "folder" ? () => navigateToFolder(file.path) : undefined
                                          }
                                          className={
                                            file.type === "folder" ? "hover:text-[#4b7bb5] transition-colors" : ""
                                          }
                                        >
                                          {file.name}
                                        </button>
                                      </CardTitle>
                                      <CardDescription className="text-xs">
                                        {file.type === "folder" ? "Pasta" : file.fileType?.toUpperCase()}
                                      </CardDescription>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    {file.isFavorite && (
                                      <Badge variant="outline" className="bg-amber-50 text-amber-600 border-amber-200">
                                        <Star className="h-3 w-3 mr-1 fill-amber-500 text-amber-500" />
                                        Favorito
                                      </Badge>
                                    )}
                                    {file.type === "folder" && taskCounts[file.path] > 0 && (
                                      <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-200">
                                        <ClipboardList className="h-3 w-3 mr-1" />
                                        {taskCounts[file.path]} tarefa{taskCounts[file.path] !== 1 ? "s" : ""}
                                      </Badge>
                                    )}
                                    <DropdownMenu>
                                      <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon">
                                          <MoreVertical size={16} />
                                        </Button>
                                      </DropdownMenuTrigger>
                                      <DropdownMenuContent align="end">
                                        <DropdownMenuGroup>
                                          {file.type === "file" && (
                                            <>
                                              <DropdownMenuItem onClick={() => window.open(file.url, "_blank")}>
                                                <ExternalLink className="h-4 w-4 mr-2" />
                                                Abrir
                                              </DropdownMenuItem>
                                              <DropdownMenuItem onClick={() => handleShare(file)}>
                                                <Share2 className="h-4 w-4 mr-2" />
                                                Compartilhar
                                              </DropdownMenuItem>
                                              <DropdownMenuItem asChild>
                                                <a href={file.url} download>
                                                  <Download className="h-4 w-4 mr-2" />
                                                  Download
                                                </a>
                                              </DropdownMenuItem>
                                            </>
                                          )}
                                          {file.type === "folder" && (
                                            <DropdownMenuItem
                                              onClick={() => {
                                                navigateToFolder(file.path)
                                                setViewType("tasks")
                                              }}
                                            >
                                              <ClipboardList className="h-4 w-4 mr-2" />
                                              Ver Tarefas
                                            </DropdownMenuItem>
                                          )}
                                          <DropdownMenuItem onClick={() => toggleFavorite(file)}>
                                            {file.isFavorite ? (
                                              <>
                                                <StarOff className="h-4 w-4 mr-2" />
                                                Remover dos favoritos
                                              </>
                                            ) : (
                                              <>
                                                <Star className="h-4 w-4 mr-2" />
                                                Adicionar aos favoritos
                                              </>
                                            )}
                                          </DropdownMenuItem>
                                          <DropdownMenuSeparator />
                                          <DropdownMenuItem onClick={() => handleDelete(file)} className="text-red-600">
                                            <Trash2 className="h-4 w-4 mr-2" />
                                            Excluir
                                          </DropdownMenuItem>
                                        </DropdownMenuGroup>
                                      </DropdownMenuContent>
                                    </DropdownMenu>
                                  </div>
                                </div>
                              </CardHeader>
                              <CardContent className="p-4 pt-0">
                                <div className="flex justify-between text-xs text-gray-500">
                                  <div className="flex items-center">
                                    <Clock className="h-3 w-3 mr-1" />
                                    {new Date(file.modified).toLocaleDateString("pt-BR", {
                                      day: "2-digit",
                                      month: "2-digit",
                                      year: "numeric",
                                    })}
                                  </div>
                                  {file.type === "file" && file.size && <div>{formatBytes(file.size)}</div>}
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      )}
                    </div>
                  )
                ) : (
                  // Visualização de tarefas
                  <>
                    {currentPath.length === 0 ? (
                      <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                        <ClipboardList className="h-16 w-16 text-gray-300 mb-4" />
                        <p className="text-lg font-medium text-gray-600 mb-2">Nenhuma pasta selecionada</p>
                        <p className="text-sm text-gray-500 mb-4">
                          Selecione uma pasta para visualizar e gerenciar suas tarefas
                        </p>
                      </div>
                    ) : isLoadingTasks ? (
                      <div className="flex flex-col items-center justify-center h-64">
                        <Loader2 className="h-8 w-8 text-[#4b7bb5] animate-spin mb-4" />
                        <p className="text-gray-500">Carregando tarefas...</p>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        {/* Formulário para adicionar nova tarefa */}
                        <form
                          onSubmit={handleAddTask}
                          id="add-task-form"
                          className="p-4 border border-gray-200 rounded-lg bg-gray-50"
                        >
                          <div className="flex flex-col gap-2">
                            <h3 className="text-sm font-medium text-gray-700 mb-2">Adicionar Nova Tarefa</h3>
                            <Textarea
                              value={newTaskDescription}
                              onChange={(e) => setNewTaskDescription(e.target.value)}
                              placeholder="Descreva a tarefa..."
                              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#4b7bb5] focus:border-[#4b7bb5] min-h-[80px]"
                              disabled={isAddingTask}
                            />
                            <Button
                              type="submit"
                              disabled={isAddingTask || !newTaskDescription.trim()}
                              className="px-3 py-2 bg-[#4b7bb5] text-white rounded-md hover:bg-[#3d649e] transition-colors disabled:opacity-50 disabled:hover:bg-[#4b7bb5] flex items-center justify-center w-full md:w-auto md:self-end"
                            >
                              {isAddingTask ? (
                                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                              ) : (
                                <Plus className="h-4 w-4 mr-2" />
                              )}
                              <span>{isAddingTask ? "Adicionando..." : "Adicionar Tarefa"}</span>
                            </Button>
                          </div>
                        </form>

                        {/* Lista de tarefas */}
                        <div className="border border-gray-200 rounded-lg overflow-hidden">
                          <div className="bg-gray-50 p-3 border-b border-gray-200 flex justify-between items-center">
                            <h3 className="font-medium text-[#4072b0] flex items-center">
                              <ClipboardList className="h-5 w-5 mr-2" />
                              Tarefas da Pasta: {currentPath[currentPath.length - 1]}
                            </h3>
                            <span className="text-sm text-gray-500">
                              {tasks.filter((t) => !t.is_completed).length} pendente
                              {tasks.filter((t) => !t.is_completed).length !== 1 ? "s" : ""}
                            </span>
                          </div>

                          {sortedTasks.length === 0 ? (
                            <div className="p-6 text-center text-gray-500">
                              <p>Nenhuma tarefa para esta pasta.</p>
                              <p className="text-sm mt-1">Adicione tarefas para organizar seu trabalho.</p>
                            </div>
                          ) : (
                            <ul className="divide-y divide-gray-100">
                              {sortedTasks.map((task) => (
                                <li key={task.id} className="p-3 hover:bg-gray-50 transition-colors">
                                  {editingTaskId === task.id ? (
                                    <div className="flex flex-col gap-2">
                                      <Textarea
                                        value={editDescription}
                                        onChange={(e) => setEditDescription(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#4b7bb5] focus:border-[#4b7bb5] min-h-[80px]"
                                        autoFocus
                                      />
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
                                    <div className="flex items-start gap-3">
                                      <button
                                        onClick={() => toggleTaskStatus(task.id, task.is_completed)}
                                        className="mt-0.5 flex-shrink-0 text-[#4b7bb5] hover:text-[#3d649e] transition-colors"
                                        title={task.is_completed ? "Marcar como pendente" : "Marcar como concluída"}
                                      >
                                        {task.is_completed ? (
                                          <CheckCircle className="h-5 w-5" />
                                        ) : (
                                          <Circle className="h-5 w-5" />
                                        )}
                                      </button>
                                      <div className="flex-1 min-w-0">
                                        <button
                                          onClick={() => openTaskDetails(task)}
                                          className={`text-sm text-left w-full ${task.is_completed ? "line-through text-gray-400" : "text-gray-700"}`}
                                        >
                                          {task.description}
                                        </button>
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
                    )}
                  </>
                )}
              </div>
            </div>

            {/* Sidebar com informações e estatísticas */}
            <div className="space-y-4">
              {/* Estatísticas de armazenamento */}
              {renderStorageStats()}

              {/* Arquivos recentes */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center">
                    <Clock className="h-4 w-4 mr-2 text-[#4b7bb5]" />
                    Arquivos Recentes
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-3">
                  {recentFiles.length === 0 ? (
                    <p className="text-xs text-gray-500 text-center py-2">Nenhum arquivo recente</p>
                  ) : (
                    <ul className="space-y-2">
                      {recentFiles.slice(0, 5).map((file) => (
                        <li key={file.id} className="text-sm">
                          <button
                            onClick={() => window.open(file.url, "_blank")}
                            className="flex items-center hover:bg-gray-50 p-1.5 rounded-md w-full text-left"
                          >
                            {file.fileType === "pdf" ? (
                              <FileText className="h-4 w-4 mr-2 text-red-500" />
                            ) : ["jpg", "jpeg", "png", "gif", "webp"].includes(file.fileType || "") ? (
                              <ImageIcon className="h-4 w-4 mr-2 text-green-500" />
                            ) : ["mp4", "avi", "mov", "webm"].includes(file.fileType || "") ? (
                              <Film className="h-4 w-4 mr-2 text-purple-500" />
                            ) : ["mp3", "wav", "ogg"].includes(file.fileType || "") ? (
                              <Music className="h-4 w-4 mr-2 text-blue-500" />
                            ) : ["zip", "rar", "7z", "tar", "gz"].includes(file.fileType || "") ? (
                              <Archive className="h-4 w-4 mr-2 text-amber-500" />
                            ) : (
                              <FileIcon className="h-4 w-4 mr-2 text-gray-500" />
                            )}
                            <span className="truncate flex-1">{file.name}</span>
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </CardContent>
                <CardFooter className="pt-0 pb-3 px-3">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full text-xs text-[#4b7bb5]"
                    onClick={() => setActiveTab("recent")}
                  >
                    Ver todos
                  </Button>
                </CardFooter>
              </Card>

              {/* Favoritos */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center">
                    <Star className="h-4 w-4 mr-2 text-amber-500" />
                    Favoritos
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-3">
                  {favorites.length === 0 ? (
                    <p className="text-xs text-gray-500 text-center py-2">Nenhum favorito</p>
                  ) : (
                    <ul className="space-y-2">
                      {files
                        .filter((file) => favorites.includes(file.path))
                        .slice(0, 5)
                        .map((file) => (
                          <li key={file.id} className="text-sm">
                            <button
                              onClick={
                                file.type === "folder"
                                  ? () => navigateToFolder(file.path)
                                  : () => window.open(file.url, "_blank")
                              }
                              className="flex items-center hover:bg-gray-50 p-1.5 rounded-md w-full text-left"
                            >
                              {file.type === "folder" ? (
                                <Folder className="h-4 w-4 mr-2 text-[#4b7bb5]" />
                              ) : file.fileType === "pdf" ? (
                                <FileText className="h-4 w-4 mr-2 text-red-500" />
                              ) : ["jpg", "jpeg", "png", "gif", "webp"].includes(file.fileType || "") ? (
                                <ImageIcon className="h-4 w-4 mr-2 text-green-500" />
                              ) : ["mp4", "avi", "mov", "webm"].includes(file.fileType || "") ? (
                                <Film className="h-4 w-4 mr-2 text-purple-500" />
                              ) : ["mp3", "wav", "ogg"].includes(file.fileType || "") ? (
                                <Music className="h-4 w-4 mr-2 text-blue-500" />
                              ) : ["zip", "rar", "7z", "tar", "gz"].includes(file.fileType || "") ? (
                                <Archive className="h-4 w-4 mr-2 text-amber-500" />
                              ) : (
                                <FileIcon className="h-4 w-4 mr-2 text-gray-500" />
                              )}
                              <span className="truncate flex-1">{file.name}</span>
                            </button>
                          </li>
                        ))}
                    </ul>
                  )}
                </CardContent>
                <CardFooter className="pt-0 pb-3 px-3">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full text-xs text-[#4b7bb5]"
                    onClick={() => setActiveTab("favorites")}
                  >
                    Ver todos
                  </Button>
                </CardFooter>
              </Card>

              {/* Ajuda rápida */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center">
                    <HelpCircle className="h-4 w-4 mr-2 text-[#4b7bb5]" />
                    Ajuda Rápida
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-3">
                  <ul className="space-y-2 text-xs text-gray-600">
                    <li className="flex items-start">
                      <Upload className="h-3 w-3 mr-2 mt-0.5 text-[#4b7bb5]" />
                      <span>
                        Clique em <strong>Upload</strong> para enviar arquivos
                      </span>
                    </li>
                    <li className="flex items-start">
                      <FolderPlus className="h-3 w-3 mr-2 mt-0.5 text-[#4b7bb5]" />
                      <span>
                        Clique em <strong>Nova Pasta</strong> para criar pastas
                      </span>
                    </li>
                    <li className="flex items-start">
                      <ClipboardList className="h-3 w-3 mr-2 mt-0.5 text-[#4b7bb5]" />
                      <span>
                        Alterne para a aba <strong>Tarefas</strong> para gerenciar tarefas
                      </span>
                    </li>
                    <li className="flex items-start">
                      <Star className="h-3 w-3 mr-2 mt-0.5 text-amber-500" />
                      <span>
                        Adicione <strong>favoritos</strong> para acesso rápido
                      </span>
                    </li>
                  </ul>
                </CardContent>
                <CardFooter className="pt-0 pb-3 px-3">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full text-xs text-[#4b7bb5]"
                    onClick={() => setShowHelp(true)}
                  >
                    Ver mais dicas
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de upload */}
      <Dialog open={showUploader} onOpenChange={setShowUploader}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Upload de Arquivos</DialogTitle>
          </DialogHeader>
          <FileUploader
            onUploadSuccess={() => {
              setShowUploader(false)
              fetchFiles()
            }}
          />
        </DialogContent>
      </Dialog>

      {/* Modal de criar pasta */}
      <Dialog open={showCreateFolderDialog} onOpenChange={setShowCreateFolderDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Criar Nova Pasta</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCreateFolder}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <label htmlFor="folderName" className="text-sm font-medium">
                  Nome da pasta
                </label>
                <Input
                  id="folderName"
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                  placeholder="Digite o nome da pasta"
                  autoFocus
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowCreateFolderDialog(false)}
                disabled={isCreatingFolder}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={!newFolderName.trim() || isCreatingFolder}
                className="bg-[#4b7bb5] hover:bg-[#3d649e]"
              >
                {isCreatingFolder ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Criando...
                  </>
                ) : (
                  "Criar Pasta"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Diálogo de confirmação de exclusão */}
      {showDeleteConfirmation && itemToDelete && (
        <DeleteConfirmationDialog
          isOpen={showDeleteConfirmation}
          onClose={() => setShowDeleteConfirmation(false)}
          onConfirm={confirmDelete}
          itemName={itemToDelete.name}
          isFolder={itemToDelete.type === "folder"}
        />
      )}

      {/* Diálogo de compartilhamento */}
      {showShareDialog && itemToShare && (
        <ShareLinkDialog
          isOpen={showShareDialog}
          onClose={() => setShowShareDialog(false)}
          fileUrl={itemToShare.url || `${window.location.origin}/shared/${encodeURIComponent(itemToShare.path)}`}
          fileName={itemToShare.name}
        />
      )}

      {/* Diálogo de detalhes da tarefa */}
      <Dialog open={showTaskDetails} onOpenChange={setShowTaskDetails}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <Info className="h-5 w-5 mr-2 text-[#4b7bb5]" />
              Detalhes da Tarefa
            </DialogTitle>
          </DialogHeader>
          {selectedTask && (
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex items-center gap-2 mb-2">
                  <div className={`p-1 rounded-full ${selectedTask.is_completed ? "bg-green-100" : "bg-blue-100"}`}>
                    {selectedTask.is_completed ? (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    ) : (
                      <Circle className="h-5 w-5 text-blue-600" />
                    )}
                  </div>
                  <span className="font-medium">Status: {selectedTask.is_completed ? "Concluída" : "Pendente"}</span>
                </div>
                <p className="text-gray-700 whitespace-pre-wrap">{selectedTask.description}</p>
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Calendar className="h-4 w-4" />
                <span>Criada em: {formatDate(selectedTask.created_at)}</span>
              </div>

              <div className="flex justify-between pt-4">
                <Button variant="outline" onClick={() => toggleTaskStatus(selectedTask.id, selectedTask.is_completed)}>
                  {selectedTask.is_completed ? (
                    <>
                      <Circle className="h-4 w-4 mr-2" />
                      Marcar como pendente
                    </>
                  ) : (
                    <>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Marcar como concluída
                    </>
                  )}
                </Button>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      startEditTask(selectedTask)
                      setShowTaskDetails(false)
                    }}
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Editar
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => {
                      deleteTask(selectedTask.id, selectedTask.is_completed)
                      setShowTaskDetails(false)
                    }}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Excluir
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Diálogo de ajuda */}
      <Dialog open={showHelp} onOpenChange={setShowHelp}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Dicas e Atalhos</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Navegação</CardTitle>
              </CardHeader>
              <CardContent className="p-3">
                <ul className="space-y-2 text-xs text-gray-600">
                  <li className="flex items-start">
                    <Home className="h-3 w-3 mr-2 mt-0.5 text-[#4b7bb5]" />
                    <span>Clique no ícone de casa para voltar à pasta raiz</span>
                  </li>
                  <li className="flex items-start">
                    <ArrowUp className="h-3 w-3 mr-2 mt-0.5 text-[#4b7bb5]" />
                    <span>Clique na seta para cima para subir um nível</span>
                  </li>
                  <li className="flex items-start">
                    <ChevronRight className="h-3 w-3 mr-2 mt-0.5 text-[#4b7bb5]" />
                    <span>Clique em qualquer parte do caminho para navegar</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Visualização</CardTitle>
              </CardHeader>
              <CardContent className="p-3">
                <ul className="space-y-2 text-xs text-gray-600">
                  <li className="flex items-start">
                    <LayoutGrid className="h-3 w-3 mr-2 mt-0.5 text-[#4b7bb5]" />
                    <span>Visualização em grade para ver miniaturas</span>
                  </li>
                  <li className="flex items-start">
                    <LayoutList className="h-3 w-3 mr-2 mt-0.5 text-[#4b7bb5]" />
                    <span>Visualização em lista para ver mais detalhes</span>
                  </li>
                  <li className="flex items-start">
                    <Layers className="h-3 w-3 mr-2 mt-0.5 text-[#4b7bb5]" />
                    <span>Visualização detalhada para informações completas</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Gerenciamento</CardTitle>
              </CardHeader>
              <CardContent className="p-3">
                <ul className="space-y-2 text-xs text-gray-600">
                  <li className="flex items-start">
                    <Upload className="h-3 w-3 mr-2 mt-0.5 text-[#4b7bb5]" />
                    <span>Faça upload de múltiplos arquivos de uma vez</span>
                  </li>
                  <li className="flex items-start">
                    <FolderPlus className="h-3 w-3 mr-2 mt-0.5 text-[#4b7bb5]" />
                    <span>Crie pastas para organizar seus arquivos</span>
                  </li>
                  <li className="flex items-start">
                    <Bookmark className="h-3 w-3 mr-2 mt-0.5 text-[#4b7bb5]" />
                    <span>Use o modo de seleção para operações em lote</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Tarefas</CardTitle>
              </CardHeader>
              <CardContent className="p-3">
                <ul className="space-y-2 text-xs text-gray-600">
                  <li className="flex items-start">
                    <ClipboardList className="h-3 w-3 mr-2 mt-0.5 text-[#4b7bb5]" />
                    <span>Alterne para a aba Tarefas para gerenciar tarefas da pasta</span>
                  </li>
                  <li className="flex items-start">
                    <Plus className="h-3 w-3 mr-2 mt-0.5 text-[#4b7bb5]" />
                    <span>Adicione novas tarefas para organizar seu trabalho</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-3 w-3 mr-2 mt-0.5 text-green-500" />
                    <span>Marque tarefas como concluídas quando finalizadas</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </DialogContent>
      </Dialog>

      {/* Toast de notificação */}
      {toast.visible && (
        <ToastNotification
          message={toast.message}
          type={toast.type}
          onClose={() => setToast((prev) => ({ ...prev, visible: false }))}
        />
      )}
    </div>
  )
}
