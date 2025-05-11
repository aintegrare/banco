"use client"

import { useState, useEffect } from "react"
import { Folder, ChevronRight, ChevronDown, Loader2, RefreshCw, Home } from "lucide-react"
import { Button } from "@/components/ui/button"

interface FolderSelectorProps {
  onSelect: (path: string) => void
  currentPath?: string
  excludePaths?: string[]
}

export function FolderSelector({ onSelect, currentPath = "", excludePaths = [] }: FolderSelectorProps) {
  const [folders, setFolders] = useState<{ name: string; path: string }[]>([])
  const [expandedFolders, setExpandedFolders] = useState<Record<string, boolean>>({})
  const [subfolders, setSubfolders] = useState<Record<string, { name: string; path: string }[]>>({})
  const [isLoading, setIsLoading] = useState(false)
  const [selectedFolder, setSelectedFolder] = useState<string>(currentPath)
  const [error, setError] = useState<string | null>(null)

  // Carregar pastas raiz
  useEffect(() => {
    fetchRootFolders()
  }, [])

  // Carregar subpastas para pastas expandidas
  useEffect(() => {
    Object.entries(expandedFolders).forEach(([path, isExpanded]) => {
      if (isExpanded && !subfolders[path]) {
        fetchSubfolders(path)
      }
    })
  }, [expandedFolders])

  // Modificar a função fetchRootFolders para melhorar o tratamento de erros e logging
  const fetchRootFolders = async () => {
    setIsLoading(true)
    setError(null)
    try {
      console.log("FolderSelector: Buscando pastas raiz")
      const response = await fetch("/api/files/folders")

      if (!response.ok) {
        const errorText = await response.text()
        console.error(`FolderSelector: Erro na API (${response.status}):`, errorText)
        throw new Error(`Erro ao carregar pastas: ${response.status}`)
      }

      const data = await response.json()
      console.log("FolderSelector: Dados recebidos:", data)

      if (!data.folders || !Array.isArray(data.folders)) {
        console.error("FolderSelector: Formato de resposta inválido:", data)
        throw new Error("Formato de resposta inválido")
      }

      const formattedFolders = data.folders.map((folder: any) => ({
        name: folder.name || folder.ObjectName || "Pasta sem nome",
        path: folder.path || folder.Path || "",
      }))

      console.log("FolderSelector: Pastas formatadas:", formattedFolders)
      setFolders(formattedFolders)
    } catch (error) {
      console.error("FolderSelector: Erro ao carregar pastas:", error)
      setError(error instanceof Error ? error.message : "Erro ao carregar pastas")
    } finally {
      setIsLoading(false)
    }
  }

  // Modificar a função fetchSubfolders para melhorar o tratamento de erros e logging
  const fetchSubfolders = async (path: string) => {
    try {
      console.log(`FolderSelector: Buscando subpastas de "${path}"`)
      const response = await fetch(`/api/files/folders?path=${encodeURIComponent(path)}`)

      if (!response.ok) {
        const errorText = await response.text()
        console.error(`FolderSelector: Erro na API (${response.status}):`, errorText)
        throw new Error(`Erro ao carregar subpastas: ${response.status}`)
      }

      const data = await response.json()
      console.log(`FolderSelector: Subpastas recebidas para "${path}":`, data)

      if (!data.folders || !Array.isArray(data.folders)) {
        console.error("FolderSelector: Formato de resposta inválido para subpastas:", data)
        setSubfolders((prev) => ({
          ...prev,
          [path]: [],
        }))
        return
      }

      const formattedSubfolders = data.folders.map((folder: any) => ({
        name: folder.name || folder.ObjectName || "Pasta sem nome",
        path: folder.path || folder.Path || "",
      }))

      console.log(`FolderSelector: Subpastas formatadas para "${path}":`, formattedSubfolders)
      setSubfolders((prev) => ({
        ...prev,
        [path]: formattedSubfolders,
      }))
    } catch (error) {
      console.error(`FolderSelector: Erro ao buscar subpastas de ${path}:`, error)
      // Definir um array vazio para evitar tentativas repetidas de carregar a mesma pasta com erro
      setSubfolders((prev) => ({
        ...prev,
        [path]: [],
      }))
    }
  }

  const toggleFolder = (path: string) => {
    setExpandedFolders((prev) => ({
      ...prev,
      [path]: !prev[path],
    }))
  }

  const handleSelectFolder = (path: string) => {
    if (excludePaths?.includes(path)) return
    setSelectedFolder(path)
    onSelect(path)
  }

  const renderFolderTree = (items: { name: string; path: string }[], level = 0) => {
    return items
      .filter((folder) => !excludePaths?.includes(folder.path))
      .map((folder) => (
        <div key={folder.path} style={{ marginLeft: `${level * 16}px` }}>
          <div
            className={`flex items-center py-1 px-2 rounded-md ${
              selectedFolder === folder.path ? "bg-[#4b7bb5] text-white" : "hover:bg-gray-100 cursor-pointer"
            }`}
          >
            <button
              onClick={() => toggleFolder(folder.path)}
              className={`p-1 mr-1 rounded ${
                selectedFolder === folder.path ? "hover:bg-[#3d649e] text-white" : "hover:bg-gray-200 text-gray-500"
              }`}
              aria-label={expandedFolders[folder.path] ? "Collapse folder" : "Expand folder"}
            >
              {expandedFolders[folder.path] ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </button>

            <div className="flex items-center flex-1 py-1" onClick={() => handleSelectFolder(folder.path)}>
              <Folder className={`h-4 w-4 mr-2 ${selectedFolder === folder.path ? "text-white" : "text-[#4b7bb5]"}`} />
              <span className="text-sm truncate">{folder.name}</span>
            </div>
          </div>

          {expandedFolders[folder.path] && subfolders[folder.path] && (
            <div className="ml-2 pl-2 border-l border-gray-200">
              {renderFolderTree(subfolders[folder.path], level + 1)}
            </div>
          )}
        </div>
      ))
  }

  return (
    <div className="border rounded-md p-2 bg-white h-full">
      <div className="flex items-center justify-between mb-2 pb-2 border-b">
        <h3 className="text-sm font-medium text-gray-700">Selecionar pasta</h3>
        <div className="flex space-x-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleSelectFolder("")}
            title="Pasta raiz"
            className={selectedFolder === "" ? "bg-[#4b7bb5] text-white" : ""}
          >
            <Home className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={fetchRootFolders} disabled={isLoading} title="Atualizar">
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {error && <div className="text-red-500 text-sm mb-2 p-2 bg-red-50 rounded">{error}</div>}

      <div className="max-h-60 overflow-y-auto">
        {isLoading && folders.length === 0 ? (
          <div className="flex justify-center items-center py-4">
            <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
            <span className="ml-2 text-sm text-gray-500">Carregando pastas...</span>
          </div>
        ) : folders.length === 0 ? (
          <div className="text-center py-4 text-sm text-gray-500">Nenhuma pasta encontrada</div>
        ) : (
          <div className="space-y-1">
            <div
              className={`flex items-center py-1 px-2 rounded-md hover:bg-gray-100 cursor-pointer ${
                selectedFolder === "" ? "bg-[#4b7bb5] text-white" : ""
              }`}
              onClick={() => handleSelectFolder("")}
            >
              <Folder className={`h-4 w-4 mr-2 ${selectedFolder === "" ? "text-white" : "text-[#4b7bb5]"}`} />
              <span className="text-sm">Pasta raiz</span>
            </div>
            {renderFolderTree(folders)}
          </div>
        )}
      </div>
    </div>
  )
}
