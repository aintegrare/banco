"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Folder, Grid, List, ChevronRight, Upload, FolderPlus, Loader2, Search, SortAsc, SortDesc } from "lucide-react"
import { FileCard } from "./file-card"
import { FileRow } from "./file-row"
import { FileUploader } from "./file-uploader"
import { CreateFolderDialog } from "./create-folder-dialog"
import { StorageStats } from "./storage-stats"

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
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [currentPath, setCurrentPath] = useState("documents")
  const [breadcrumbs, setBreadcrumbs] = useState<{ name: string; path: string }[]>([])
  const [isUploaderOpen, setIsUploaderOpen] = useState(false)
  const [isFolderDialogOpen, setIsFolderDialogOpen] = useState(false)
  const [sortBy, setSortBy] = useState<"name" | "modified" | "size">("name")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedProject, setSelectedProject] = useState<string | null>(null)

  useEffect(() => {
    fetchFiles(currentPath)
  }, [currentPath])

  useEffect(() => {
    // Atualizar breadcrumbs quando o caminho mudar
    const pathParts = currentPath.split("/").filter(Boolean)
    const crumbs = [{ name: "Documentos", path: "documents" }]

    let cumulativePath = "documents"
    pathParts.forEach((part, index) => {
      if (index > 0) {
        // Pular o primeiro item que já está em crumbs
        cumulativePath += `/${part}`
        crumbs.push({
          name: part,
          path: cumulativePath,
        })
      }
    })

    setBreadcrumbs(crumbs)
  }, [currentPath])

  const fetchFiles = async (path: string) => {
    setIsLoading(true)
    try {
      // Fazer a chamada real à API
      const response = await fetch(`/api/files?directory=${path}`)

      if (!response.ok) {
        throw new Error(`Erro ao buscar arquivos: ${response.status}`)
      }

      const data = await response.json()

      // Transformar os dados da API no formato que esperamos
      const formattedFiles: FileItem[] = data.files.map((file: any) => ({
        id: file.Guid || `${file.ObjectName}-${Date.now()}`,
        name: file.ObjectName,
        type: file.IsDirectory ? "folder" : "file",
        size: file.Length,
        modified: file.LastChanged,
        path: file.Path,
        url: file.PublicUrl,
        fileType: !file.IsDirectory ? file.ObjectName.split(".").pop() : undefined,
        project: file.Metadata?.project || null,
      }))

      setFiles(formattedFiles)
    } catch (error) {
      console.error("Erro ao buscar arquivos:", error)
      // Em caso de erro, mostrar alguns dados de exemplo
      setFiles([
        {
          id: "1",
          name: "Documentos Marketing",
          type: "folder",
          modified: new Date().toISOString(),
          path: `${path}/Documentos Marketing`,
        },
        {
          id: "2",
          name: "Relatórios",
          type: "folder",
          modified: new Date().toISOString(),
          path: `${path}/Relatórios`,
        },
        {
          id: "3",
          name: "Apresentação Cliente.pdf",
          type: "file",
          size: 2.5 * 1024 * 1024,
          modified: new Date().toISOString(),
          path: `${path}/Apresentação Cliente.pdf`,
          url: "#",
          fileType: "pdf",
          project: "integrare",
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  const navigateToFolder = (path: string) => {
    setCurrentPath(path)
  }

  const handleSort = (key: "name" | "modified" | "size") => {
    if (sortBy === key) {
      // Inverter direção se já estiver ordenando por esta coluna
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      // Nova coluna, começar com ascendente
      setSortBy(key)
      setSortDirection("asc")
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // Implementar lógica de busca
    console.log(`Buscando por: ${searchQuery}`)
    // Aqui você faria uma chamada à API com o termo de busca
  }

  const handleCreateFolder = async (folderName: string) => {
    setIsFolderDialogOpen(false)
    setIsLoading(true)

    try {
      // Fazer a chamada real à API para criar pasta
      const response = await fetch("/api/create-directory", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          directory: `${currentPath}/${folderName}`,
        }),
      })

      if (!response.ok) {
        throw new Error(`Erro ao criar pasta: ${response.status}`)
      }

      // Recarregar arquivos após criar pasta
      await fetchFiles(currentPath)
    } catch (error) {
      console.error("Erro ao criar pasta:", error)
      alert("Não foi possível criar a pasta. Por favor, tente novamente.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteFile = async (filePath: string) => {
    if (!confirm("Tem certeza que deseja excluir este arquivo? Esta ação não pode ser desfeita.")) {
      return
    }

    setIsLoading(true)

    try {
      // Fazer a chamada real à API para excluir arquivo
      const response = await fetch(`/api/files/${encodeURIComponent(filePath)}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error(`Erro ao excluir arquivo: ${response.status}`)
      }

      // Recarregar arquivos após excluir
      await fetchFiles(currentPath)
    } catch (error) {
      console.error("Erro ao excluir arquivo:", error)
      alert("Não foi possível excluir o arquivo. Por favor, tente novamente.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleUploadComplete = async () => {
    setIsUploaderOpen(false)
    await fetchFiles(currentPath)
  }

  // Filtrar arquivos com base na busca e projeto selecionado
  const filteredFiles = files.filter((file) => {
    const matchesSearch = searchQuery ? file.name.toLowerCase().includes(searchQuery.toLowerCase()) : true

    const matchesProject = selectedProject ? file.project === selectedProject : true

    return matchesSearch && matchesProject
  })

  // Ordenar arquivos
  const sortedFiles = [...filteredFiles].sort((a, b) => {
    // Sempre mostrar pastas primeiro
    if (a.type !== b.type) {
      return a.type === "folder" ? -1 : 1
    }

    // Ordenar pelo campo selecionado
    if (sortBy === "name") {
      return sortDirection === "asc" ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)
    } else if (sortBy === "modified") {
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

  return (
    <div className="space-y-6">
      {/* Estatísticas de armazenamento */}
      <div className="grid md:grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <StorageStats />
        </div>
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-bold text-[#4072b0] mb-4">Informações</h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-gray-700">Tipos de Arquivos Suportados</h3>
              <ul className="mt-1 text-sm text-gray-600 list-disc list-inside">
                <li>PDF - Documentos e eBooks</li>
                <li>DOC/DOCX - Documentos do Microsoft Word</li>
                <li>TXT - Arquivos de texto simples</li>
                <li>JPG/PNG - Imagens</li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-700">Limites</h3>
              <ul className="mt-1 text-sm text-gray-600 list-disc list-inside">
                <li>Tamanho máximo por arquivo: 10MB</li>
                <li>Processamento de texto: até 100.000 caracteres por documento</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Barra de ferramentas */}
      <div className="bg-white rounded-xl shadow-md p-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          {/* Navegação de pastas */}
          <div className="flex items-center overflow-x-auto whitespace-nowrap pb-2">
            {breadcrumbs.map((crumb, index) => (
              <div key={crumb.path} className="flex items-center">
                {index > 0 && <ChevronRight size={16} className="mx-1 text-gray-400" />}
                <button
                  onClick={() => navigateToFolder(crumb.path)}
                  className={`text-sm px-2 py-1 rounded hover:bg-gray-100 ${
                    index === breadcrumbs.length - 1 ? "font-medium text-[#4072b0]" : "text-gray-600"
                  }`}
                >
                  {crumb.name}
                </button>
              </div>
            ))}
          </div>

          {/* Busca */}
          <form onSubmit={handleSearch} className="flex items-center">
            <div className="relative">
              <input
                type="text"
                placeholder="Buscar arquivos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#4b7bb5] focus:border-transparent"
              />
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            </div>
            <button
              type="submit"
              className="ml-2 px-3 py-2 bg-[#4b7bb5] text-white rounded-lg hover:bg-[#3d649e] transition-colors text-sm"
            >
              Buscar
            </button>
          </form>

          {/* Ações */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsUploaderOpen(true)}
              className="flex items-center space-x-1 px-3 py-1.5 bg-[#4b7bb5] text-white rounded-lg hover:bg-[#3d649e] transition-colors text-sm"
            >
              <Upload size={16} />
              <span>Upload</span>
            </button>

            <button
              onClick={() => setIsFolderDialogOpen(true)}
              className="flex items-center space-x-1 px-3 py-1.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm"
            >
              <FolderPlus size={16} />
              <span>Nova pasta</span>
            </button>

            <div className="flex border border-gray-300 rounded-lg overflow-hidden">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-1.5 ${
                  viewMode === "grid" ? "bg-gray-100 text-[#4b7bb5]" : "bg-white text-gray-500 hover:bg-gray-50"
                }`}
                title="Visualização em grade"
              >
                <Grid size={18} />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-1.5 ${
                  viewMode === "list" ? "bg-gray-100 text-[#4b7bb5]" : "bg-white text-gray-500 hover:bg-gray-50"
                }`}
                title="Visualização em lista"
              >
                <List size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Conteúdo principal */}
      <div className="bg-white rounded-xl shadow-md p-6">
        {/* Loading state */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 size={40} className="text-[#4b7bb5] animate-spin mb-4" />
            <p className="text-gray-500">Carregando arquivos...</p>
          </div>
        ) : sortedFiles.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Folder size={48} className="text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-700 mb-1">Pasta vazia</h3>
            <p className="text-gray-500 mb-4">Esta pasta não contém nenhum arquivo ou subpasta.</p>
            <div className="flex space-x-3">
              <button
                onClick={() => setIsUploaderOpen(true)}
                className="flex items-center space-x-1 px-3 py-1.5 bg-[#4b7bb5] text-white rounded-lg hover:bg-[#3d649e] transition-colors text-sm"
              >
                <Upload size={16} />
                <span>Upload de arquivos</span>
              </button>

              <button
                onClick={() => setIsFolderDialogOpen(true)}
                className="flex items-center space-x-1 px-3 py-1.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm"
              >
                <FolderPlus size={16} />
                <span>Criar pasta</span>
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Grid View */}
            {viewMode === "grid" ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {sortedFiles.map((file) => (
                  <FileCard
                    key={file.id}
                    file={file}
                    onFolderClick={() => navigateToFolder(file.path)}
                    onDelete={() => handleDeleteFile(file.path)}
                  />
                ))}
              </div>
            ) : (
              /* List View */
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                        onClick={() => handleSort("name")}
                      >
                        <div className="flex items-center">
                          <span>Nome</span>
                          {sortBy === "name" &&
                            (sortDirection === "asc" ? (
                              <SortAsc size={14} className="ml-1" />
                            ) : (
                              <SortDesc size={14} className="ml-1" />
                            ))}
                        </div>
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                        onClick={() => handleSort("modified")}
                      >
                        <div className="flex items-center">
                          <span>Modificado</span>
                          {sortBy === "modified" &&
                            (sortDirection === "asc" ? (
                              <SortAsc size={14} className="ml-1" />
                            ) : (
                              <SortDesc size={14} className="ml-1" />
                            ))}
                        </div>
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                        onClick={() => handleSort("size")}
                      >
                        <div className="flex items-center">
                          <span>Tamanho</span>
                          {sortBy === "size" &&
                            (sortDirection === "asc" ? (
                              <SortAsc size={14} className="ml-1" />
                            ) : (
                              <SortDesc size={14} className="ml-1" />
                            ))}
                        </div>
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
                        onDelete={() => handleDeleteFile(file.path)}
                      />
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </div>

      {/* File Uploader Dialog */}
      {isUploaderOpen && (
        <FileUploader
          currentPath={currentPath}
          onClose={() => setIsUploaderOpen(false)}
          onUploadComplete={handleUploadComplete}
        />
      )}

      {/* Create Folder Dialog */}
      {isFolderDialogOpen && (
        <CreateFolderDialog onClose={() => setIsFolderDialogOpen(false)} onCreateFolder={handleCreateFolder} />
      )}
    </div>
  )
}
