"use client"

import React from "react"

import { useState, useEffect, useCallback } from "react"
import {
  File,
  FileText,
  ImageIcon,
  Film,
  Music,
  Archive,
  Trash2,
  RefreshCw,
  Loader2,
  ExternalLink,
  AlertCircle,
  FolderPlus,
  Search,
  Info,
  X,
  Download,
  CheckCircle,
  FolderOpen,
  Pencil,
  MoveIcon,
  ChevronLeft,
  ChevronRight,
  Home,
  CheckSquare,
  Square,
  ClipboardList,
} from "lucide-react"
import { getBunnyPublicUrl } from "@/lib/bunny"
import { FolderTasks } from "./folder-tasks"
import { FolderTaskBadge } from "./folder-task-badge"

interface BunnyFile {
  ObjectName: string
  Length: number
  LastChanged: string
  IsDirectory: boolean
  StorageZoneName: string
  Path: string
  ObjectType: number
  Guid: string
  ServerId: number
  UserId: string
  DateCreated: string
  StorageZoneId: number
  PublicUrl?: string
}

interface FileListProps {
  initialDirectory?: string
}

export function FileList({ initialDirectory = "documents" }: FileListProps) {
  const [files, setFiles] = useState<BunnyFile[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [deletingFile, setDeletingFile] = useState<string | null>(null)
  const [isCreatingDirectory, setIsCreatingDirectory] = useState(false)
  const [directoryCreated, setDirectoryCreated] = useState(false)
  const [directoryInfo, setDirectoryInfo] = useState<any | null>(null)
  const [isCheckingDirectory, setIsCheckingDirectory] = useState(false)
  const [debugInfo, setDebugInfo] = useState<string | null>(null)
  const [selectedDirectory, setSelectedDirectory] = useState<string>(initialDirectory)
  const [previewFile, setPreviewFile] = useState<BunnyFile | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPath, setCurrentPath] = useState<string[]>([initialDirectory])
  const [pathHistory, setPathHistory] = useState<string[][]>([])
  const [forwardHistory, setForwardHistory] = useState<string[][]>([])
  const [showRenameModal, setShowRenameModal] = useState(false)
  const [fileToRename, setFileToRename] = useState<BunnyFile | null>(null)
  const [newFileName, setNewFileName] = useState("")
  const [isRenaming, setIsRenaming] = useState(false)
  const [renameError, setRenameError] = useState<string | null>(null)
  const [showCreateFolderModal, setShowCreateFolderModal] = useState(false)
  const [newFolderName, setNewFolderName] = useState("")
  const [isCreatingFolder, setIsCreatingFolder] = useState(false)
  const [createFolderError, setCreateFolderError] = useState<string | null>(null)
  const [showMoveFileModal, setShowMoveFileModal] = useState(false)
  const [fileToMove, setFileToMove] = useState<BunnyFile | null>(null)
  const [destinationPath, setDestinationPath] = useState<string>("")
  const [availableFolders, setAvailableFolders] = useState<string[]>([])
  const [isMovingFile, setIsMovingFile] = useState(false)
  const [moveFileError, setMoveFileError] = useState<string | null>(null)
  const [selectedFiles, setSelectedFiles] = useState<BunnyFile[]>([])
  const [isSelectionMode, setIsSelectionMode] = useState(false)
  const [isMovingMultiple, setIsMovingMultiple] = useState(false)
  const [multiMoveDestination, setMultiMoveDestination] = useState<string>("")
  const [showMultiMoveModal, setShowMultiMoveModal] = useState(false)
  const [multiMoveError, setMultiMoveError] = useState<string | null>(null)
  const [showFolderTasks, setShowFolderTasks] = useState(false)
  const [selectedFolderForTasks, setSelectedFolderForTasks] = useState<string>("")
  const [folderTaskCounts, setFolderTaskCounts] = useState<Record<string, number>>({})
  const [multiMoveProgress, setMultiMoveProgress] = useState<{
    current: number
    total: number
    currentFile: string
  } | null>(null)

  const fetchFiles = async (directory = selectedDirectory) => {
    setIsLoading(true)
    setError(null)
    setDebugInfo(null)

    try {
      console.log(`Iniciando busca de arquivos no diretório: ${directory}...`)
      console.log(`Caminho atual: ${currentPath.join("/")}`)
      const response = await fetch(`/api/files?directory=${directory}`)

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || errorData.error || `Erro ao listar arquivos: ${response.status}`)
      }

      const data = await response.json()
      console.log(`Arquivos recebidos: ${data.files?.length || 0}`)

      setDebugInfo(null)

      const filesWithPublicUrls = (data.files || []).map((file: BunnyFile) => {
        if (!file.PublicUrl) {
          return {
            ...file,
            PublicUrl: getBunnyPublicUrl(file.Path),
          }
        }
        return file
      })

      setFiles(filesWithPublicUrls)

      const folders = filesWithPublicUrls.filter((file) => file.IsDirectory).map((folder) => folder.Path)

      setAvailableFolders(folders)
    } catch (err) {
      console.error("Erro ao buscar arquivos:", err)
      setError(err instanceof Error ? err.message : "Erro desconhecido ao buscar arquivos")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchFiles(getCurrentPathString())
    setSelectedFiles([])
    setIsSelectionMode(false)
  }, [currentPath])

  const getCurrentPathString = () => {
    return currentPath.join("/")
  }

  const navigateToFolder = (folderPath: string) => {
    setSelectedFiles([])
    setIsSelectionMode(false)

    setPathHistory((prev) => [...prev, currentPath])
    setForwardHistory([])

    const pathSegments = folderPath.split("/").filter((segment) => segment.length > 0)
    setCurrentPath(pathSegments)
    setSelectedDirectory(pathSegments[0] || initialDirectory)
  }

  const navigateBack = () => {
    if (pathHistory.length > 0) {
      setSelectedFiles([])
      setIsSelectionMode(false)

      const previousPath = pathHistory[pathHistory.length - 1]

      setForwardHistory((prev) => [...prev, currentPath])

      setPathHistory((prev) => prev.slice(0, prev.length - 1))

      setCurrentPath(previousPath)
      setSelectedDirectory(previousPath[0] || initialDirectory)
    }
  }

  const navigateForward = () => {
    if (forwardHistory.length > 0) {
      setSelectedFiles([])
      setIsSelectionMode(false)

      const nextPath = forwardHistory[forwardHistory.length - 1]

      setPathHistory((prev) => [...prev, currentPath])

      setForwardHistory((prev) => prev.slice(0, prev.length - 1))

      setCurrentPath(nextPath)
      setSelectedDirectory(nextPath[0] || initialDirectory)
    }
  }

  const navigateHome = () => {
    setSelectedFiles([])
    setIsSelectionMode(false)

    setPathHistory((prev) => [...prev, currentPath])
    setForwardHistory([])

    setCurrentPath([initialDirectory])
    setSelectedDirectory(initialDirectory)
  }

  const handleDelete = async (path: string) => {
    if (!confirm("Tem certeza que deseja excluir este arquivo? Esta ação não pode ser desfeita.")) {
      return
    }

    setDeletingFile(path)

    try {
      console.log(`FileList: Iniciando exclusão do arquivo: ${path}`)

      let cleanPath = path

      if (path.startsWith("http")) {
        const url = new URL(path)
        cleanPath = url.pathname.replace(/^\//, "")
      }

      console.log(`FileList: Caminho limpo para API: ${cleanPath}`)

      const response = await fetch(`/api/files/${encodeURIComponent(cleanPath)}`, {
        method: "DELETE",
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || data.error || `Erro ao excluir arquivo: ${response.status}`)
      }

      setFiles((prev) => prev.filter((file) => file.Path !== path))
      console.log(`FileList: Arquivo excluído com sucesso: ${path}`)
    } catch (err) {
      console.error("Erro ao excluir arquivo:", err)
      alert(err instanceof Error ? err.message : "Erro ao excluir arquivo")
    } finally {
      setDeletingFile(null)
    }
  }

  const handleCreateDirectory = async () => {
    console.log("Abrindo modal para criar pasta no caminho:", getCurrentPathString())
    setShowCreateFolderModal(true)
  }

  const submitCreateFolder = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!newFolderName || newFolderName.trim() === "") {
      setCreateFolderError("O nome da pasta não pode estar vazio")
      return
    }

    if (/[\\/:*?"<>|]/.test(newFolderName)) {
      setCreateFolderError("O nome da pasta contém caracteres inválidos")
      return
    }

    setIsCreatingFolder(true)
    setCreateFolderError(null)

    try {
      const currentPathString = getCurrentPathString()
      const newFolderPath = currentPathString ? `${currentPathString}/${newFolderName}` : newFolderName

      console.log(`Criando pasta: ${newFolderPath}`)

      const response = await fetch("/api/create-directory", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ directory: newFolderPath }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || data.error || `Erro ao criar pasta: ${response.status}`)
      }

      console.log("Resposta da API:", data)

      setShowCreateFolderModal(false)
      setNewFolderName("")
      setDirectoryCreated(true)

      const newFolder = {
        ObjectName: newFolderName,
        Length: 0,
        LastChanged: new Date().toISOString(),
        IsDirectory: true,
        StorageZoneName: "",
        Path: `${currentPathString}/${newFolderName}/`.replace(/\/+/g, "/"),
        ObjectType: 1,
        Guid: `temp-${Date.now()}`,
        ServerId: 0,
        UserId: "",
        DateCreated: new Date().toISOString(),
        StorageZoneId: 0,
        PublicUrl: `${process.env.NEXT_PUBLIC_BUNNY_PULLZONE_URL}/${currentPathString}/${newFolderName}/`.replace(
          /\/+/g,
          "/",
        ),
      }

      setFiles((prev) => [...prev, newFolder])

      setTimeout(() => {
        fetchFiles(getCurrentPathString())
      }, 1000)
    } catch (error) {
      console.error("Erro ao criar pasta:", error)
      setCreateFolderError(error instanceof Error ? error.message : "Erro ao criar pasta")
    } finally {
      setIsCreatingFolder(false)
    }
  }

  const checkFolderExists = async (path: string) => {
    try {
      const response = await fetch(`/api/check-folder?path=${encodeURIComponent(path)}`)
      const data = await response.json()

      console.log("Verificação de pasta:", data)

      if (response.ok) {
        alert(
          `Pasta ${path}: ${data.exists ? "Existe" : "Não existe"}\n` +
            `Arquivos: ${data.fileCount || 0}\n` +
            `Caminho: ${data.path}`,
        )
      } else {
        alert(`Erro ao verificar pasta: ${data.error || data.message || "Erro desconhecido"}`)
      }
    } catch (error) {
      console.error("Erro ao verificar pasta:", error)
      alert(`Erro ao verificar pasta: ${error instanceof Error ? error.message : "Erro desconhecido"}`)
    }
  }

  const handleCheckDirectory = async () => {
    setIsCheckingDirectory(true)
    setDirectoryInfo(null)
    setError(null)

    try {
      const response = await fetch(`/api/check-directory?directory=${getCurrentPathString()}`)

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || errorData.error || `Erro ao verificar diretório: ${response.status}`)
      }

      const data = await response.json()
      setDirectoryInfo(data)

      if (data.exists && data.files && data.files.length > 0) {
        setFiles(
          data.files.map((file: BunnyFile) => ({
            ...file,
            PublicUrl: file.PublicUrl || getBunnyPublicUrl(file.Path),
          })),
        )
      }
    } catch (err) {
      console.error("Erro ao verificar diretório:", err)
      setError(err instanceof Error ? err.message : "Erro ao verificar diretório")
    } finally {
      setIsCheckingDirectory(false)
    }
  }

  const getFileIcon = (fileName: string) => {
    const extension = fileName.split(".").pop()?.toLowerCase()

    switch (extension) {
      case "pdf":
        return <FileText className="h-5 w-5 text-red-500" />
      case "jpg":
      case "jpeg":
      case "png":
      case "gif":
      case "webp":
        return <ImageIcon className="h-5 w-5 text-blue-500" />
      case "mp4":
      case "webm":
      case "avi":
        return <Film className="h-5 w-5 text-purple-500" />
      case "mp3":
      case "wav":
      case "ogg":
        return <Music className="h-5 w-5 text-green-500" />
      case "zip":
      case "rar":
      case "7z":
        return <Archive className="h-5 w-5 text-yellow-500" />
      default:
        return <File className="h-5 w-5 text-gray-500" />
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

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

  const handleCreateTestDirectory = async () => {
    try {
      setIsLoading(true)
      setError(null)

      const response = await fetch("/api/test-directory", {
        method: "POST",
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || errorData.error || `Erro ao criar diretório de teste: ${response.status}`)
      }

      await fetchFiles(getCurrentPathString())
    } catch (err) {
      console.error("Erro ao criar diretório de teste:", err)
      setError(err instanceof Error ? err.message : "Erro ao criar diretório de teste")
    } finally {
      setIsLoading(false)
    }
  }

  const isImage = (fileName: string) => {
    const extension = fileName.split(".").pop()?.toLowerCase()
    return ["jpg", "jpeg", "png", "gif", "webp"].includes(extension || "")
  }

  const handlePreviewFile = (file: BunnyFile) => {
    if (isSelectionMode) {
      toggleFileSelection(file)
      return
    }

    if (file.IsDirectory) {
      navigateToFolder(file.Path)
    } else if (isImage(file.ObjectName)) {
      setPreviewFile(file)
    } else {
      const url = file.PublicUrl || getBunnyPublicUrl(file.Path)
      console.log(`Preview: Abrindo arquivo ${file.ObjectName} com URL: ${url}`)
      window.open(url, "_blank")
    }
  }

  const closePreview = () => {
    setPreviewFile(null)
  }

  const switchDirectory = (directory: string) => {
    setSelectedFiles([])
    setIsSelectionMode(false)

    setPathHistory((prev) => [...prev, currentPath])
    setForwardHistory([])

    setCurrentPath([directory])
    setSelectedDirectory(directory)
  }

  const filteredFiles = files.filter((file) => {
    return searchQuery ? file.ObjectName.toLowerCase().includes(searchQuery.toLowerCase()) : true
  })

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
  }

  const openRenameModal = (file: BunnyFile) => {
    setFileToRename(file)
    setNewFileName(file.ObjectName)
    setRenameError(null)
    setShowRenameModal(true)
  }

  const handleRename = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!fileToRename || !newFileName || newFileName.trim() === "") {
      setRenameError("O nome do arquivo não pode estar vazio")
      return
    }

    if (newFileName === fileToRename.ObjectName) {
      setShowRenameModal(false)
      return
    }

    if (/[\\/:*?"<>|]/.test(newFileName)) {
      setRenameError("O nome do arquivo contém caracteres inválidos")
      return
    }

    setIsRenaming(true)
    setRenameError(null)

    try {
      console.log(`Renomeando arquivo: ${fileToRename.Path} para ${newFileName}`)

      const response = await fetch("/api/files/rename", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          oldPath: fileToRename.Path,
          newName: newFileName,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || data.error || "Erro ao renomear arquivo")
      }

      console.log("Resposta da API:", data)

      const lastSlashIndex = fileToRename.Path.lastIndexOf("/")
      const directory = lastSlashIndex >= 0 ? fileToRename.Path.substring(0, lastSlashIndex + 1) : ""
      const newPath = directory + newFileName

      setFiles((prevFiles) =>
        prevFiles.map((file) => {
          if (file.Path === fileToRename.Path) {
            return {
              ...file,
              ObjectName: newFileName,
              Path: newPath,
              PublicUrl: data.newUrl || `${process.env.NEXT_PUBLIC_BUNNY_PULLZONE_URL}/${newPath}`,
            }
          }
          return file
        }),
      )

      setShowRenameModal(false)

      setTimeout(() => {
        fetchFiles(getCurrentPathString())
      }, 1000)
    } catch (error) {
      console.error("Erro ao renomear arquivo:", error)
      setRenameError(error instanceof Error ? error.message : "Erro ao renomear arquivo")
    } finally {
      setIsRenaming(false)
    }
  }

  const openMoveFileModal = (file: BunnyFile) => {
    setFileToMove(file)
    setDestinationPath("")
    setMoveFileError(null)
    setShowMoveFileModal(true)
  }

  const handleMoveFile = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!fileToMove || !destinationPath) {
      setMoveFileError("Selecione um destino para mover o arquivo")
      return
    }

    setIsMovingFile(true)
    setMoveFileError(null)

    try {
      const fileName = fileToMove.ObjectName
      const newPath = `${destinationPath}${destinationPath.endsWith("/") ? "" : "/"}${fileName}`

      console.log(`Movendo arquivo: ${fileToMove.Path} para ${newPath}`)

      const response = await fetch("/api/files/move", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sourcePath: fileToMove.Path,
          destinationPath: newPath,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || data.error || "Erro ao mover arquivo")
      }

      console.log("Resposta da API:", data)

      setFiles((prevFiles) => prevFiles.filter((file) => file.Path !== fileToMove.Path))

      setShowMoveFileModal(false)

      await fetchFiles(getCurrentPathString())
    } catch (error) {
      console.error("Erro ao mover arquivo:", error)
      setMoveFileError(error instanceof Error ? error.message : "Erro ao mover arquivo")
    } finally {
      setIsMovingFile(false)
    }
  }

  const renderBreadcrumb = () => {
    return (
      <div className="flex items-center text-sm text-gray-600 mb-4 overflow-x-auto">
        <button onClick={navigateHome} className="p-1 hover:bg-gray-100 rounded-md flex items-center" title="Início">
          <Home size={16} className="text-[#4b7bb5]" />
        </button>
        <span className="mx-1">/</span>

        {currentPath.map((segment, index) => (
          <React.Fragment key={index}>
            <button
              onClick={() => {
                if (index < currentPath.length - 1) {
                  navigateToFolder(currentPath.slice(0, index + 1).join("/"))
                }
              }}
              className={`hover:underline ${index === currentPath.length - 1 ? "font-medium text-[#4b7bb5]" : ""}`}
              disabled={index === currentPath.length - 1}
            >
              {segment}
            </button>
            {index < currentPath.length - 1 && <span className="mx-1">/</span>}
          </React.Fragment>
        ))}
      </div>
    )
  }

  const openFolderTasks = (folderPath: string) => {
    setSelectedFolderForTasks(folderPath)
    setShowFolderTasks(true)
  }

  const updateFolderTaskCount = useCallback((folderPath: string, count: number) => {
    setFolderTaskCounts((prev) => ({
      ...prev,
      [folderPath]: count,
    }))
  }, [])

  const toggleSelectionMode = () => {
    setIsSelectionMode(!isSelectionMode)
    if (!isSelectionMode) {
      setSelectedFiles([])
    }
  }

  const toggleFileSelection = (file: BunnyFile) => {
    if (selectedFiles.some((f) => f.Path === file.Path)) {
      setSelectedFiles(selectedFiles.filter((f) => f.Path !== file.Path))
    } else {
      setSelectedFiles([...selectedFiles, file])
    }
  }

  const isFileSelected = (file: BunnyFile) => {
    return selectedFiles.some((f) => f.Path === file.Path)
  }

  const selectAll = () => {
    setSelectedFiles([...filteredFiles])
  }

  const deselectAll = () => {
    setSelectedFiles([])
  }

  const openMultiMoveModal = () => {
    if (selectedFiles.length === 0) {
      alert("Selecione pelo menos um arquivo para mover")
      return
    }

    setMultiMoveDestination("")
    setMultiMoveError(null)
    setShowMultiMoveModal(true)
  }

  const handleMoveMultipleFiles = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!multiMoveDestination) {
      setMultiMoveError("Selecione um destino para mover os arquivos")
      return
    }

    if (selectedFiles.length === 0) {
      setMultiMoveError("Nenhum arquivo selecionado")
      return
    }

    setIsMovingMultiple(true)
    setMultiMoveError(null)
    setMultiMoveProgress({
      current: 0,
      total: selectedFiles.length,
      currentFile: selectedFiles[0].ObjectName,
    })

    try {
      for (let i = 0; i < selectedFiles.length; i++) {
        const file = selectedFiles[i]

        setMultiMoveProgress({
          current: i,
          total: selectedFiles.length,
          currentFile: file.ObjectName,
        })

        const fileName = file.ObjectName
        const newPath = `${multiMoveDestination}${multiMoveDestination.endsWith("/") ? "" : "/"}${fileName}`

        console.log(`Movendo arquivo ${i + 1}/${selectedFiles.length}: ${file.Path} para ${newPath}`)

        const response = await fetch("/api/files/move", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            sourcePath: file.Path,
            destinationPath: newPath,
          }),
        })

        if (!response.ok) {
          const data = await response.json()
          throw new Error(
            `Erro ao mover arquivo ${file.ObjectName}: ${data.message || data.error || "Erro desconhecido"}`,
          )
        }
      }

      setFiles((prevFiles) => prevFiles.filter((file) => !selectedFiles.some((f) => f.Path === file.Path)))

      setShowMultiMoveModal(false)
      setSelectedFiles([])
      setIsSelectionMode(false)

      await fetchFiles(getCurrentPathString())

      alert(`${selectedFiles.length} arquivo(s) movido(s) com sucesso!`)
    } catch (error) {
      console.error("Erro ao mover arquivos:", error)
      setMultiMoveError(error instanceof Error ? error.message : "Erro ao mover arquivos")
    } finally {
      setIsMovingMultiple(false)
      setMultiMoveProgress(null)
    }
  }

  const handleDeleteMultipleFiles = async () => {
    if (selectedFiles.length === 0) {
      alert("Selecione pelo menos um arquivo para excluir")
      return
    }

    if (
      !confirm(`Tem certeza que deseja excluir ${selectedFiles.length} arquivo(s)? Esta ação não pode ser desfeita.`)
    ) {
      return
    }

    try {
      for (const file of selectedFiles) {
        console.log(`Excluindo arquivo: ${file.Path}`)

        let cleanPath = file.Path

        if (file.Path.startsWith("http")) {
          const url = new URL(file.Path)
          cleanPath = url.pathname.replace(/^\//, "")
        }

        const response = await fetch(`/api/files/${encodeURIComponent(cleanPath)}`, {
          method: "DELETE",
        })

        if (!response.ok) {
          const data = await response.json()
          throw new Error(
            `Erro ao excluir arquivo ${file.ObjectName}: ${data.message || data.error || "Erro desconhecido"}`,
          )
        }
      }

      setFiles((prevFiles) => prevFiles.filter((file) => !selectedFiles.some((f) => f.Path === file.Path)))

      setSelectedFiles([])
      setIsSelectionMode(false)

      alert(`${selectedFiles.length} arquivo(s) excluído(s) com sucesso!`)
    } catch (error) {
      console.error("Erro ao excluir arquivos:", error)
      alert(error instanceof Error ? error.message : "Erro ao excluir arquivos")
    }
  }

  return (
    <>
      <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <h2 className="text-xl font-bold text-[#4072b0] flex items-center">
            <FolderOpen className="mr-2 h-6 w-6 text-[#4b7bb5]" />
            Arquivos Armazenados
          </h2>

          <div className="flex flex-wrap gap-3 w-full md:w-auto">
            <div className="flex gap-2 bg-gray-50 p-1 rounded-lg border border-gray-200">
              <button
                onClick={() => switchDirectory("documents")}
                className={`px-3 py-1.5 text-sm rounded-md transition-all ${
                  selectedDirectory === "documents"
                    ? "bg-[#4b7bb5] text-white shadow-sm"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                Documentos
              </button>
              <button
                onClick={() => switchDirectory("images")}
                className={`px-3 py-1.5 text-sm rounded-md transition-all ${
                  selectedDirectory === "images"
                    ? "bg-[#4b7bb5] text-white shadow-sm"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                Imagens
              </button>
            </div>

            <form onSubmit={handleSearch} className="relative flex-grow max-w-xs">
              <input
                type="text"
                placeholder="Buscar arquivos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#4b7bb5] focus:border-[#4b7bb5] transition-all"
              />
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            </form>
          </div>
        </div>

        <div className="mb-4 flex flex-wrap items-center gap-2">
          <div className="flex items-center space-x-2 mr-4">
            <button
              onClick={navigateBack}
              disabled={pathHistory.length === 0}
              className="p-1.5 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:hover:bg-transparent"
              title="Voltar"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={navigateForward}
              disabled={forwardHistory.length === 0}
              className="p-1.5 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:hover:bg-transparent"
              title="Avançar"
            >
              <ChevronRight size={18} />
            </button>
            <button
              onClick={navigateHome}
              className="p-1.5 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100"
              title="Início"
            >
              <Home size={18} />
            </button>
          </div>

          {renderBreadcrumb()}
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
          <button
            onClick={toggleSelectionMode}
            className={`flex items-center text-sm px-3 py-1.5 rounded-md transition-all ${
              isSelectionMode
                ? "bg-[#4b7bb5] text-white"
                : "bg-white text-[#4b7bb5] border border-[#4b7bb5] hover:bg-[#f0f4f9]"
            }`}
          >
            {isSelectionMode ? (
              <>
                <X className="h-4 w-4 mr-1.5" />
                Cancelar Seleção
              </>
            ) : (
              <>
                <CheckSquare className="h-4 w-4 mr-1.5" />
                Selecionar Arquivos
              </>
            )}
          </button>

          {isSelectionMode && (
            <>
              <button
                onClick={selectAll}
                className="flex items-center text-sm px-3 py-1.5 rounded-md transition-all bg-white text-[#4b7bb5] border border-[#4b7bb5] hover:bg-[#f0f4f9]"
                disabled={filteredFiles.length === 0}
              >
                <CheckSquare className="h-4 w-4 mr-1.5" />
                Selecionar Todos
              </button>

              <button
                onClick={deselectAll}
                className="flex items-center text-sm px-3 py-1.5 rounded-md transition-all bg-white text-[#4b7bb5] border border-[#4b7bb5] hover:bg-[#f0f4f9]"
                disabled={selectedFiles.length === 0}
              >
                <Square className="h-4 w-4 mr-1.5" />
                Limpar Seleção
              </button>

              <button
                onClick={openMultiMoveModal}
                className="flex items-center text-sm px-3 py-1.5 rounded-md transition-all bg-white text-purple-600 border border-purple-600 hover:bg-purple-50"
                disabled={selectedFiles.length === 0}
              >
                <MoveIcon className="h-4 w-4 mr-1.5" />
                Mover Selecionados ({selectedFiles.length})
              </button>

              <button
                onClick={handleDeleteMultipleFiles}
                className="flex items-center text-sm px-3 py-1.5 rounded-md transition-all bg-white text-red-600 border border-red-600 hover:bg-red-50"
                disabled={selectedFiles.length === 0}
              >
                <Trash2 className="h-4 w-4 mr-1.5" />
                Excluir Selecionados ({selectedFiles.length})
              </button>
            </>
          )}

          {!isSelectionMode && (
            <>
              <button
                onClick={() => checkFolderExists(getCurrentPathString())}
                className={`flex items-center text-sm px-3 py-1.5 rounded-md transition-all ${
                  isCheckingDirectory
                    ? "bg-gray-100 text-gray-500"
                    : "bg-white text-[#4b7bb5] border border-[#4b7bb5] hover:bg-[#f0f4f9]"
                }`}
                disabled={isCheckingDirectory}
              >
                {isCheckingDirectory ? (
                  <Loader2 className="h-4 w-4 mr-1.5 animate-spin" />
                ) : (
                  <Search className="h-4 w-4 mr-1.5" />
                )}
                Verificar Diretório
              </button>

              <button
                onClick={handleCreateDirectory}
                className={`flex items-center text-sm px-3 py-1.5 rounded-md transition-all ${
                  isCreatingDirectory
                    ? "bg-gray-100 text-gray-500"
                    : "bg-white text-[#4b7bb5] border border-[#4b7bb5] hover:bg-[#f0f4f9]"
                }`}
                disabled={isCreatingDirectory}
              >
                {isCreatingDirectory ? (
                  <Loader2 className="h-4 w-4 mr-1.5 animate-spin" />
                ) : (
                  <FolderPlus className="h-4 w-4 mr-1.5" />
                )}
                Criar Pasta
              </button>

              <button
                onClick={() => fetchFiles(getCurrentPathString())}
                className={`flex items-center text-sm px-3 py-1.5 rounded-md transition-all ${
                  isLoading
                    ? "bg-gray-100 text-gray-500"
                    : "bg-white text-[#4b7bb5] border border-[#4b7bb5] hover:bg-[#f0f4f9]"
                }`}
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 mr-1.5 animate-spin" />
                ) : (
                  <RefreshCw className="h-4 w-4 mr-1.5" />
                )}
                Atualizar
              </button>
            </>
          )}
        </div>

        {isSelectionMode && selectedFiles.length > 0 && (
          <div className="bg-blue-50 p-3 rounded-lg mb-4 border border-blue-100 flex items-center">
            <CheckSquare className="h-5 w-5 mr-2 text-[#4b7bb5]" />
            <span className="font-medium text-[#4b7bb5]">{selectedFiles.length} arquivo(s) selecionado(s)</span>
          </div>
        )}

        {directoryCreated && (
          <div className="bg-green-50 p-4 rounded-lg mb-6 border-l-4 border-green-500 flex items-start animate-fadeIn">
            <CheckCircle className="h-5 w-5 mr-2 text-green-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-green-700">Diretório criado com sucesso!</p>
              <p className="mt-1 text-green-600">
                O diretório "{selectedDirectory}" foi criado e está pronto para receber arquivos.
              </p>
            </div>
          </div>
        )}

        {directoryInfo && (
          <div className="bg-blue-50 p-4 rounded-lg mb-6 border-l-4 border-blue-500">
            <h3 className="font-medium text-blue-700 mb-2 flex items-center">
              <Info className="h-4 w-4 mr-2" />
              Informações do Diretório
            </h3>
            <div className="bg-white p-3 rounded-md border border-blue-100">
              <p className="mb-1">
                Status: <span className="font-medium">{directoryInfo.exists ? "Existe" : "Não existe"}</span>
              </p>
              {directoryInfo.exists && (
                <p>
                  Quantidade de arquivos: <span className="font-medium">{directoryInfo.fileCount}</span>
                </p>
              )}
              <details className="mt-2">
                <summary className="cursor-pointer text-blue-600 hover:text-blue-800 text-sm">
                  Detalhes técnicos
                </summary>
                <pre className="mt-2 p-2 bg-blue-50 rounded text-xs overflow-auto max-h-40 border border-blue-100">
                  {JSON.stringify(directoryInfo, null, 2)}
                </pre>
              </details>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 p-4 rounded-lg mb-6 border-l-4 border-red-500 flex items-start">
            <AlertCircle className="h-5 w-5 mr-2 text-red-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-red-700 mb-2">Erro ao carregar arquivos:</p>
              <p className="mb-3 text-red-600">{error}</p>
              <div className="bg-white p-3 rounded-md border border-red-100 text-sm space-y-2">
                <p>
                  Verifique se as variáveis de ambiente{" "}
                  <code className="bg-red-50 px-1 py-0.5 rounded">BUNNY_API_KEY</code> e{" "}
                  <code className="bg-red-50 px-1 py-0.5 rounded">BUNNY_STORAGE_ZONE</code> estão configuradas
                  corretamente.
                </p>
                <p>
                  <strong>Importante:</strong> Certifique-se de que você configurou uma Pull Zone no painel do Bunny.net
                  conectada à sua Storage Zone para acessar os arquivos publicamente.
                </p>
                <div className="mt-3">
                  <button
                    onClick={() => handleCreateDirectory()}
                    className="text-red-600 hover:text-red-800 underline font-medium"
                    disabled={isCreatingDirectory}
                  >
                    Tentar criar uma nova pasta
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {isLoading && filteredFiles.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
            <div className="animate-spin h-10 w-10 border-3 border-[#4b7bb5] border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-gray-600 font-medium">Carregando arquivos...</p>
            <p className="text-gray-500 text-sm mt-1">Aguarde enquanto buscamos os arquivos do diretório</p>
          </div>
        ) : filteredFiles.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg border border-dashed border-gray-300">
            <FolderOpen size={48} className="text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-700 mb-1">Pasta vazia</h3>
            <p className="text-gray-500 mb-6 max-w-md mx-auto">
              {searchQuery
                ? `Nenhum arquivo encontrado para "${searchQuery}". Tente outra busca.`
                : `Esta pasta não contém nenhum arquivo ou subpasta. Faça upload de arquivos ou crie uma nova pasta.`}
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <button
                onClick={() => setSearchQuery("")}
                className={`flex items-center px-4 py-2 rounded-md transition-all ${
                  searchQuery ? "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50" : "hidden"
                }`}
              >
                <X className="h-4 w-4 mr-1.5" />
                Limpar busca
              </button>

              <button
                onClick={handleCreateDirectory}
                className="flex items-center px-4 py-2 bg-[#4b7bb5] text-white rounded-md hover:bg-[#3d649e] transition-colors shadow-sm"
                disabled={isCreatingDirectory}
              >
                {isCreatingDirectory ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-1.5 animate-spin" />
                    <span>Criando...</span>
                  </>
                ) : (
                  <>
                    <FolderPlus className="h-4 w-4 mr-1.5" />
                    <span>Criar pasta</span>
                  </>
                )}
              </button>
            </div>
          </div>
        ) : (
          <div className="overflow-hidden rounded-lg border border-gray-200">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    {isSelectionMode && <th className="py-3 px-2 font-medium text-gray-600 w-10"></th>}
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Arquivo</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Tamanho</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Data</th>
                    <th className="text-right py-3 px-4 font-medium text-gray-600">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredFiles.map((file) => (
                    <tr
                      key={file.Guid || file.ObjectName}
                      className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                        isFileSelected(file) ? "bg-blue-50" : ""
                      }`}
                    >
                      {isSelectionMode && (
                        <td className="py-3 px-2 text-center">
                          <button onClick={() => toggleFileSelection(file)} className="p-1 rounded hover:bg-gray-100">
                            {isFileSelected(file) ? (
                              <CheckSquare className="h-5 w-5 text-[#4b7bb5]" />
                            ) : (
                              <Square className="h-5 w-5 text-gray-400" />
                            )}
                          </button>
                        </td>
                      )}

                      <td className="py-3 px-4">
                        <div className="flex items-center">
                          <div className="p-1.5 bg-gray-100 rounded-md mr-3">
                            {file.IsDirectory ? (
                              <FolderOpen className="h-5 w-5 text-[#4b7bb5]" />
                            ) : (
                              getFileIcon(file.ObjectName)
                            )}
                          </div>
                          <div className="flex flex-col">
                            <div className="flex items-center gap-2">
                              <span
                                className="cursor-pointer hover:text-[#4b7bb5] font-medium transition-colors"
                                onClick={() => handlePreviewFile(file)}
                              >
                                {file.ObjectName}
                              </span>
                              {file.IsDirectory && folderTaskCounts[file.Path] > 0 && (
                                <FolderTaskBadge count={folderTaskCounts[file.Path]} />
                              )}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-gray-500">
                        {file.IsDirectory ? "-" : formatFileSize(file.Length)}
                      </td>
                      <td className="py-3 px-4 text-gray-500">{formatDate(file.LastChanged)}</td>

                      <td className="py-3 px-4 text-right">
                        <div className="flex justify-end space-x-2">
                          {file.IsDirectory && (
                            <button
                              className="p-1.5 text-amber-500 hover:text-amber-700 hover:bg-amber-50 rounded-md transition-colors"
                              title="Tarefas da pasta"
                              onClick={(e) => {
                                e.stopPropagation()
                                openFolderTasks(file.Path)
                              }}
                            >
                              <ClipboardList className="h-4 w-4" />
                            </button>
                          )}
                          {!file.IsDirectory && (
                            <a
                              href={file.PublicUrl || getBunnyPublicUrl(file.Path)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-1.5 text-blue-500 hover:text-blue-700 hover:bg-blue-50 rounded-md transition-colors"
                              title="Abrir arquivo"
                            >
                              <ExternalLink className="h-4 w-4" />
                            </a>
                          )}
                          <button
                            className="p-1.5 text-orange-500 hover:text-orange-700 hover:bg-orange-50 rounded-md transition-colors"
                            title="Renomear"
                            onClick={(e) => {
                              e.stopPropagation()
                              openRenameModal(file)
                            }}
                          >
                            <Pencil className="h-4 w-4" />
                          </button>
                          {!file.IsDirectory && (
                            <button
                              className="p-1.5 text-purple-500 hover:text-purple-700 hover:bg-purple-50 rounded-md transition-colors"
                              title="Mover arquivo"
                              onClick={(e) => {
                                e.stopPropagation()
                                openMoveFileModal(file)
                              }}
                            >
                              <MoveIcon className="h-4 w-4" />
                            </button>
                          )}
                          <button
                            className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors disabled:opacity-50 disabled:hover:bg-transparent"
                            title="Excluir"
                            onClick={() => handleDelete(file.Path)}
                            disabled={deletingFile === file.Path}
                          >
                            {deletingFile === file.Path ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Trash2 className="h-4 w-4" />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {showRenameModal && fileToRename && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4 animate-fadeIn">
            <div className="bg-white rounded-xl max-w-md w-full overflow-hidden shadow-2xl">
              <div className="p-4 border-b flex justify-between items-center">
                <h3 className="font-medium flex items-center">
                  {fileToRename.IsDirectory ? (
                    <FolderOpen className="h-5 w-5 mr-2 text-[#4b7bb5]" />
                  ) : (
                    getFileIcon(fileToRename.ObjectName)
                  )}
                  <span className="ml-2">Renomear {fileToRename.IsDirectory ? "pasta" : "arquivo"}</span>
                </h3>
                <button
                  onClick={() => setShowRenameModal(false)}
                  className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <form onSubmit={handleRename}>
                <div className="p-6">
                  <div className="mb-4">
                    <p className="text-sm text-gray-500 mb-2">Nome atual:</p>
                    <p className="font-medium text-gray-700 bg-gray-50 p-2 rounded-md">{fileToRename.ObjectName}</p>
                  </div>
                  <div>
                    <label htmlFor="newFileName" className="block text-sm font-medium text-gray-700 mb-1">
                      Novo nome:
                    </label>
                    <input
                      type="text"
                      id="newFileName"
                      value={newFileName}
                      onChange={(e) => setNewFileName(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#4b7bb5] focus:border-[#4b7bb5]"
                      autoFocus
                    />
                    {renameError && <p className="mt-2 text-sm text-red-600">{renameError}</p>}
                  </div>
                </div>
                <div className="p-4 bg-gray-50 flex justify-end space-x-3 border-t">
                  <button
                    type="button"
                    onClick={() => setShowRenameModal(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={isRenaming}
                    className="px-4 py-2 bg-[#4b7bb5] border border-transparent rounded-md text-sm font-medium text-white hover:bg-[#3d649e] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#4b7bb5] disabled:opacity-50 transition-colors"
                  >
                    {isRenaming ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-1.5 inline animate-spin" />
                        Renomeando...
                      </>
                    ) : (
                      "Renomear"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {showCreateFolderModal && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4 animate-fadeIn">
            <div className="bg-white rounded-xl max-w-md w-full overflow-hidden shadow-2xl">
              <div className="p-4 border-b flex justify-between items-center">
                <h3 className="font-medium flex items-center">
                  <FolderPlus className="h-5 w-5 mr-2 text-[#4b7bb5]" />
                  <span className="ml-2">Criar nova pasta</span>
                </h3>
                <button
                  onClick={() => setShowCreateFolderModal(false)}
                  className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <form onSubmit={submitCreateFolder}>
                <div className="p-6">
                  <div>
                    <label htmlFor="newFolderName" className="block text-sm font-medium text-gray-700 mb-1">
                      Nome da pasta:
                    </label>
                    <input
                      type="text"
                      id="newFolderName"
                      value={newFolderName}
                      onChange={(e) => setNewFolderName(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#4b7bb5] focus:border-[#4b7bb5]"
                      autoFocus
                      placeholder="Nova pasta"
                    />
                    {createFolderError && <p className="mt-2 text-sm text-red-600">{createFolderError}</p>}
                  </div>
                  <p className="mt-4 text-sm text-gray-500">
                    A pasta será criada no diretório atual:{" "}
                    <span className="font-medium">{getCurrentPathString()}</span>
                  </p>
                </div>
                <div className="p-4 bg-gray-50 flex justify-end space-x-3 border-t">
                  <button
                    type="button"
                    onClick={() => setShowCreateFolderModal(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={isCreatingFolder}
                    className="px-4 py-2 bg-[#4b7bb5] border border-transparent rounded-md text-sm font-medium text-white hover:bg-[#3d649e] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#4b7bb5] disabled:opacity-50 transition-colors"
                  >
                    {isCreatingFolder ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-1.5 inline animate-spin" />
                        Criando...
                      </>
                    ) : (
                      "Criar pasta"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {showMoveFileModal && fileToMove && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4 animate-fadeIn">
            <div className="bg-white rounded-xl max-w-md w-full overflow-hidden shadow-2xl">
              <div className="p-4 border-b flex justify-between items-center">
                <h3 className="font-medium flex items-center">
                  <MoveIcon className="h-5 w-5 mr-2 text-purple-500" />
                  <span className="ml-2">Mover arquivo</span>
                </h3>
                <button
                  onClick={() => setShowMoveFileModal(false)}
                  className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <form onSubmit={handleMoveFile}>
                <div className="p-6">
                  <div className="mb-4">
                    <p className="text-sm text-gray-500 mb-2">Arquivo:</p>
                    <p className="font-medium text-gray-700 bg-gray-50 p-2 rounded-md">{fileToMove.ObjectName}</p>
                  </div>
                  <div>
                    <label htmlFor="destinationPath" className="block text-sm font-medium text-gray-700 mb-1">
                      Destino:
                    </label>
                    <select
                      id="destinationPath"
                      value={destinationPath}
                      onChange={(e) => setDestinationPath(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#4b7bb5] focus:border-[#4b7bb5]"
                    >
                      <option value="">Selecione uma pasta</option>
                      <option value="documents">Documentos (raiz)</option>
                      <option value="images">Imagens (raiz)</option>
                      {availableFolders.map((folder) => (
                        <option key={folder} value={folder}>
                          {folder}
                        </option>
                      ))}
                    </select>
                    {moveFileError && <p className="mt-2 text-sm text-red-600">{moveFileError}</p>}
                  </div>
                </div>
                <div className="p-4 bg-gray-50 flex justify-end space-x-3 border-t">
                  <button
                    type="button"
                    onClick={() => setShowMoveFileModal(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={isMovingFile || !destinationPath}
                    className="px-4 py-2 bg-[#4b7bb5] border border-transparent rounded-md text-sm font-medium text-white hover:bg-[#3d649e] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#4b7bb5] disabled:opacity-50 transition-colors"
                  >
                    {isMovingFile ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-1.5 inline animate-spin" />
                        Movendo...
                      </>
                    ) : (
                      "Mover arquivo"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {showMultiMoveModal && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4 animate-fadeIn">
            <div className="bg-white rounded-xl max-w-md w-full overflow-hidden shadow-2xl">
              <div className="p-4 border-b flex justify-between items-center">
                <h3 className="font-medium flex items-center">
                  <MoveIcon className="h-5 w-5 mr-2 text-purple-500" />
                  <span className="ml-2">Mover {selectedFiles.length} arquivo(s)</span>
                </h3>
                <button
                  onClick={() => setShowMultiMoveModal(false)}
                  className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <form onSubmit={handleMoveMultipleFiles}>
                <div className="p-6">
                  <div className="mb-4">
                    <p className="text-sm text-gray-500 mb-2">Arquivos selecionados:</p>
                    <div className="max-h-32 overflow-y-auto bg-gray-50 p-2 rounded-md">
                      {selectedFiles.map((file) => (
                        <div key={file.Path} className="flex items-center py-1">
                          <div className="p-1 bg-white rounded mr-2">
                            {file.IsDirectory ? (
                              <FolderOpen className="h-4 w-4 text-[#4b7bb5]" />
                            ) : (
                              getFileIcon(file.ObjectName)
                            )}
                          </div>
                          <span className="text-sm text-gray-700 truncate">{file.ObjectName}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label htmlFor="multiMoveDestination" className="block text-sm font-medium text-gray-700 mb-1">
                      Destino:
                    </label>
                    <select
                      id="multiMoveDestination"
                      value={multiMoveDestination}
                      onChange={(e) => setMultiMoveDestination(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#4b7bb5] focus:border-[#4b7bb5]"
                    >
                      <option value="">Selecione uma pasta</option>
                      <option value="documents">Documentos (raiz)</option>
                      <option value="images">Imagens (raiz)</option>
                      {availableFolders.map((folder) => (
                        <option key={folder} value={folder}>
                          {folder}
                        </option>
                      ))}
                    </select>
                    {multiMoveError && <p className="mt-2 text-sm text-red-600">{multiMoveError}</p>}
                  </div>

                  {multiMoveProgress && (
                    <div className="mt-4">
                      <div className="flex justify-between text-sm text-gray-600 mb-1">
                        <span>
                          Progresso: {multiMoveProgress.current + 1}/{multiMoveProgress.total}
                        </span>
                        <span>{Math.round(((multiMoveProgress.current + 1) / multiMoveProgress.total) * 100)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div
                          className="bg-[#4b7bb5] h-2.5 rounded-full"
                          style={{ width: `${((multiMoveProgress.current + 1) / multiMoveProgress.total) * 100}%` }}
                        ></div>
                      </div>
                      <p className="text-xs text-gray-500 mt-1 truncate">Movendo: {multiMoveProgress.currentFile}</p>
                    </div>
                  )}
                </div>
                <div className="p-4 bg-gray-50 flex justify-end space-x-3 border-t">
                  <button
                    type="button"
                    onClick={() => setShowMultiMoveModal(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                    disabled={isMovingMultiple}
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={isMovingMultiple || !multiMoveDestination}
                    className="px-4 py-2 bg-[#4b7bb5] border border-transparent rounded-md text-sm font-medium text-white hover:bg-[#3d649e] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#4b7bb5] disabled:opacity-50 transition-colors"
                  >
                    {isMovingMultiple ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-1.5 inline animate-spin" />
                        Movendo...
                      </>
                    ) : (
                      "Mover arquivos"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {previewFile && isImage(previewFile.ObjectName) && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4 animate-fadeIn">
            <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
              <div className="p-4 border-b flex justify-between items-center">
                <h3 className="font-medium flex items-center">
                  <ImageIcon className="h-4 w-4 mr-2 text-green-500" />
                  {previewFile.ObjectName}
                </h3>
                <button
                  onClick={closePreview}
                  className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="flex-1 overflow-auto p-6 flex items-center justify-center bg-gray-50">
                <img
                  src={previewFile.PublicUrl || getBunnyPublicUrl(previewFile.Path)}
                  alt={previewFile.ObjectName}
                  className="max-w-full max-h-[70vh] object-contain rounded-md shadow-md"
                />
              </div>
              <div className="p-4 border-t flex justify-between items-center bg-gray-50">
                <div className="text-sm text-gray-600">
                  <span className="font-medium">{formatFileSize(previewFile.Length)}</span> •{" "}
                  {formatDate(previewFile.LastChanged)}
                </div>
                <a
                  href={previewFile.PublicUrl || getBunnyPublicUrl(previewFile.Path)}
                  download
                  className="flex items-center px-3 py-1.5 bg-[#4b7bb5] text-white rounded-md hover:bg-[#3d649e] transition-colors"
                >
                  <Download className="h-4 w-4 mr-1.5" />
                  <span>Download</span>
                </a>
              </div>
            </div>
          </div>
        )}
        {showFolderTasks && selectedFolderForTasks && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4 animate-fadeIn">
            <div className="bg-white rounded-xl max-w-md w-full overflow-hidden shadow-2xl">
              <div className="p-4 border-b flex justify-between items-center">
                <h3 className="font-medium flex items-center">
                  <FolderOpen className="h-5 w-5 mr-2 text-[#4b7bb5]" />
                  <span className="ml-2">Tarefas: {selectedFolderForTasks.split("/").filter(Boolean).pop()}</span>
                </h3>
                <button
                  onClick={() => setShowFolderTasks(false)}
                  className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="p-4">
                <FolderTasks
                  folderPath={selectedFolderForTasks}
                  onTaskCountChange={(count) => updateFolderTaskCount(selectedFolderForTasks, count)}
                />
              </div>
              <div className="p-4 bg-gray-50 flex justify-end space-x-3 border-t">
                <button
                  type="button"
                  onClick={() => setShowFolderTasks(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Fechar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
