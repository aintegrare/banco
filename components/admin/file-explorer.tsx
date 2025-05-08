"use client"

import type React from "react"

import { useState, useEffect, useCallback } from "react"
import {
  Folder,
  FolderOpen,
  ChevronRight,
  Home,
  Grid3X3,
  List,
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
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { FileUploader } from "./file-uploader"

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
}

export function FileExplorer() {
  const [files, setFiles] = useState<FileItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentPath, setCurrentPath] = useState<string[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [showUploader, setShowUploader] = useState(false)
  const [showCreateFolderDialog, setShowCreateFolderDialog] = useState(false)
  const [newFolderName, setNewFolderName] = useState("")
  const [isCreatingFolder, setIsCreatingFolder] = useState(false)
  const [sortBy, setSortBy] = useState<"name" | "date" | "size">("name")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")
  const [selectedFileType, setSelectedFileType] = useState<string | null>(null)

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
      }))

      setFiles(fileItems)
    } catch (err) {
      console.error("Erro ao buscar arquivos:", err)
      setError(err instanceof Error ? err.message : "Erro desconhecido ao buscar arquivos")
    } finally {
      setIsLoading(false)
    }
  }, [currentPath])

  // Carregar arquivos quando o componente montar ou o caminho mudar
  useEffect(() => {
    fetchFiles()
  }, [fetchFiles])

  // Navegar para uma pasta
  const navigateToFolder = (folderPath: string) => {
    const pathSegments = folderPath.split("/").filter((segment) => segment.length > 0)
    setCurrentPath(pathSegments)
  }

  // Navegar para a pasta pai
  const navigateUp = () => {
    if (currentPath.length > 0) {
      setCurrentPath(currentPath.slice(0, -1))
    }
  }

  // Navegar para a pasta raiz
  const navigateHome = () => {
    setCurrentPath([])
  }

  // Navegar para um segmento específico do caminho
  const navigateToPathSegment = (index: number) => {
    setCurrentPath(currentPath.slice(0, index + 1))
  }

  // Excluir um arquivo ou pasta
  const handleDelete = async (path: string) => {
    if (!confirm("Tem certeza que deseja excluir este item? Esta ação não pode ser desfeita.")) {
      return
    }

    try {
      let cleanPath = path
      if (path.startsWith("http")) {
        const url = new URL(path)
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
      setFiles((prev) => prev.filter((file) => file.path !== path))
    } catch (err) {
      console.error("Erro ao excluir:", err)
      alert(err instanceof Error ? err.message : "Erro ao excluir")
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
    } catch (err) {
      console.error("Erro ao renomear:", err)
      alert(err instanceof Error ? err.message : "Erro ao renomear")
    }
  }

  // Criar uma nova pasta
  const handleCreateFolder = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!newFolderName || newFolderName.trim() === "") {
      return
    }

    if (/[\\/:*?"<>|]/.test(newFolderName)) {
      alert("O nome da pasta contém caracteres inválidos")
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
    } catch (err) {
      console.error("Erro ao criar pasta:", err)
      alert(err instanceof Error ? err.message : "Erro ao criar pasta")
    } finally {
      setIsCreatingFolder(false)
    }
  }

  // Filtrar arquivos com base na pesquisa e no tipo selecionado
  const filteredFiles = files.filter((file) => {
    const matchesSearch = searchQuery ? file.name.toLowerCase().includes(searchQuery.toLowerCase()) : true

    const matchesType = selectedFileType
      ? file.type === "folder"
        ? selectedFileType === "folder"
        : file.fileType === selectedFileType
      : true

    return matchesSearch && matchesType
  })

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

  return (
    <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 shadow-sm">
      <div className="flex flex-col space-y-4">
        {/* Cabeçalho */}
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold text-[#4072b0] flex items-center">
            <FolderOpen className="mr-2 h-6 w-6 text-[#4b7bb5]" />
            Gerenciador de Arquivos
          </h2>

          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowUploader(true)}
              className="bg-white border-[#4b7bb5] text-[#4b7bb5] hover:bg-[#f0f4f9]"
            >
              <Upload className="h-4 w-4 mr-2" />
              Upload
            </Button>

            <Button
              variant="default"
              size="sm"
              onClick={() => setShowCreateFolderDialog(true)}
              className="bg-[#4b7bb5] hover:bg-[#3d649e]"
            >
              <FolderPlus className="h-4 w-4 mr-2" />
              Nova Pasta
            </Button>
          </div>
        </div>

        {/* Barra de navegação */}
        <div className="flex flex-col md:flex-row justify-between gap-3">
          <div className="flex-1">{renderBreadcrumbs()}</div>

          <div className="flex items-center gap-2">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Buscar arquivos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 bg-white border-gray-200"
              />
              {searchQuery && (
                <button
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  onClick={() => setSearchQuery("")}
                >
                  <X size={14} />
                </button>
              )}
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" className="bg-white">
                  <Filter size={16} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
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
                <Button variant="outline" size="icon" className="bg-white">
                  {sortDirection === "asc" ? <SortAsc size={16} /> : <SortDesc size={16} />}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
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

            <Button
              variant="outline"
              size="icon"
              onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}
              className="bg-white"
            >
              {viewMode === "grid" ? <List size={16} /> : <Grid3X3 size={16} />}
            </Button>

            <Button variant="outline" size="icon" onClick={fetchFiles} disabled={isLoading} className="bg-white">
              {isLoading ? <Loader2 size={16} className="animate-spin" /> : <RefreshCw size={16} />}
            </Button>

            {currentPath.length > 0 && (
              <Button variant="outline" size="icon" onClick={navigateUp} className="bg-white">
                <ArrowUp size={16} />
              </Button>
            )}
          </div>
        </div>

        {/* Conteúdo principal */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 min-h-[400px]">
          {error ? (
            <div className="flex items-center justify-center h-64 text-red-500">
              <AlertCircle className="h-5 w-5 mr-2" />
              <span>{error}</span>
            </div>
          ) : isLoading ? (
            <div className="flex flex-col items-center justify-center h-64">
              <Loader2 className="h-8 w-8 text-[#4b7bb5] animate-spin mb-4" />
              <p className="text-gray-500">Carregando arquivos...</p>
            </div>
          ) : sortedFiles.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-gray-500">
              <FolderOpen className="h-16 w-16 text-gray-300 mb-4" />
              <p className="text-lg font-medium text-gray-600 mb-2">Pasta vazia</p>
              <p className="text-sm text-gray-500 mb-4">
                {searchQuery
                  ? `Nenhum resultado encontrado para "${searchQuery}"`
                  : "Esta pasta não contém nenhum arquivo ou subpasta"}
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
                      onDelete={() => handleDelete(file.path)}
                      onRename={handleRename}
                    />
                  ))}
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
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
                          Projeto
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
                          onDelete={() => handleDelete(file.path)}
                        />
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
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
    </div>
  )
}
