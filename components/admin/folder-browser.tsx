"use client"

import { useState, useEffect } from "react"
import { Folder, FolderPlus, ChevronRight, ChevronDown, Loader2, RefreshCw, Home } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"

interface FolderItem {
  name: string
  path: string
  fullPath: string
}

interface FolderBrowserProps {
  onSelectFolder: (path: string) => void
  initialPath?: string
  showCreateFolder?: boolean
}

export function FolderBrowser({ onSelectFolder, initialPath = "", showCreateFolder = true }: FolderBrowserProps) {
  const [folders, setFolders] = useState<FolderItem[]>([])
  const [expandedFolders, setExpandedFolders] = useState<Record<string, boolean>>({})
  const [subfolders, setSubfolders] = useState<Record<string, FolderItem[]>>({})
  const [isLoading, setIsLoading] = useState(false)
  const [selectedFolder, setSelectedFolder] = useState<string>(initialPath)
  const [showNewFolderDialog, setShowNewFolderDialog] = useState(false)
  const [newFolderParent, setNewFolderParent] = useState<string>("")
  const [newFolderName, setNewFolderName] = useState("")
  const [isCreatingFolder, setIsCreatingFolder] = useState(false)
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

  const fetchRootFolders = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await fetch("/api/files/folders")
      if (response.ok) {
        const data = await response.json()
        setFolders(data.folders || [])
      } else {
        setError("Erro ao carregar pastas")
        console.error("Erro ao buscar pastas:", await response.text())
      }
    } catch (error) {
      setError("Erro ao carregar pastas")
      console.error("Erro ao buscar pastas:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchSubfolders = async (path: string) => {
    try {
      const response = await fetch(`/api/files/folders?path=${encodeURIComponent(path)}`)
      if (response.ok) {
        const data = await response.json()
        setSubfolders((prev) => ({
          ...prev,
          [path]: data.folders || [],
        }))
      } else {
        console.error(`Erro ao buscar subpastas de ${path}:`, await response.text())
      }
    } catch (error) {
      console.error(`Erro ao buscar subpastas de ${path}:`, error)
    }
  }

  const toggleFolder = (path: string) => {
    setExpandedFolders((prev) => ({
      ...prev,
      [path]: !prev[path],
    }))
  }

  const handleSelectFolder = (path: string) => {
    setSelectedFolder(path)
    onSelectFolder(path)
  }

  const openNewFolderDialog = (parentPath: string) => {
    setNewFolderParent(parentPath)
    setNewFolderName("")
    setShowNewFolderDialog(true)
  }

  const createNewFolder = async () => {
    if (!newFolderName.trim()) {
      return
    }

    setIsCreatingFolder(true)
    try {
      // Construir o caminho completo da nova pasta
      const newFolderPath = newFolderParent
        ? `${newFolderParent}${newFolderParent.endsWith("/") ? "" : "/"}${newFolderName}`
        : newFolderName

      const response = await fetch("/api/files/create-folder", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ path: newFolderPath }),
      })

      if (response.ok) {
        // Atualizar a lista de pastas
        if (newFolderParent) {
          // Se tem pasta pai, atualizar as subpastas
          fetchSubfolders(newFolderParent)
          // Garantir que a pasta pai esteja expandida
          setExpandedFolders((prev) => ({
            ...prev,
            [newFolderParent]: true,
          }))
        } else {
          // Se é uma pasta raiz, atualizar a lista principal
          fetchRootFolders()
        }
        setShowNewFolderDialog(false)
      } else {
        const data = await response.json()
        console.error("Erro ao criar pasta:", data.error || data.message)
      }
    } catch (error) {
      console.error("Erro ao criar pasta:", error)
    } finally {
      setIsCreatingFolder(false)
    }
  }

  const renderFolderTree = (items: FolderItem[], level = 0) => {
    return items.map((folder) => (
      <div key={folder.path} style={{ marginLeft: `${level * 16}px` }}>
        <div
          className={`flex items-center py-1 px-2 rounded-md hover:bg-gray-100 cursor-pointer ${
            selectedFolder === folder.path ? "bg-blue-50 text-blue-600" : ""
          }`}
        >
          <button onClick={() => toggleFolder(folder.path)} className="p-1 mr-1 hover:bg-gray-200 rounded">
            {expandedFolders[folder.path] ? (
              <ChevronDown className="h-4 w-4 text-gray-500" />
            ) : (
              <ChevronRight className="h-4 w-4 text-gray-500" />
            )}
          </button>

          <div className="flex items-center flex-1 py-1" onClick={() => handleSelectFolder(folder.path)}>
            <Folder className="h-4 w-4 mr-2 text-[#4b7bb5]" />
            <span className="text-sm truncate">{folder.name}</span>
          </div>

          {showCreateFolder && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                openNewFolderDialog(folder.path)
              }}
              className="p-1 hover:bg-gray-200 rounded opacity-50 hover:opacity-100"
              title="Criar subpasta"
            >
              <FolderPlus className="h-4 w-4 text-gray-500" />
            </button>
          )}
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
    <div className="border rounded-md p-2 bg-white">
      <div className="flex items-center justify-between mb-2 pb-2 border-b">
        <h3 className="text-sm font-medium text-gray-700">Selecionar pasta</h3>
        <div className="flex space-x-1">
          <Button variant="ghost" size="sm" onClick={() => handleSelectFolder("")} title="Pasta raiz">
            <Home className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={fetchRootFolders} disabled={isLoading} title="Atualizar">
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
          </Button>
          {showCreateFolder && (
            <Button variant="ghost" size="sm" onClick={() => openNewFolderDialog("")} title="Nova pasta">
              <FolderPlus className="h-4 w-4" />
            </Button>
          )}
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
                selectedFolder === "" ? "bg-blue-50 text-blue-600" : ""
              }`}
              onClick={() => handleSelectFolder("")}
            >
              <Folder className="h-4 w-4 mr-2 text-[#4b7bb5]" />
              <span className="text-sm">Pasta raiz</span>
            </div>
            {renderFolderTree(folders)}
          </div>
        )}
      </div>

      <Dialog open={showNewFolderDialog} onOpenChange={setShowNewFolderDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Criar nova pasta</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Pasta pai</label>
              <Input value={newFolderParent || "Pasta raiz"} disabled className="bg-gray-50" />
            </div>
            <div>
              <label htmlFor="folder-name" className="block text-sm font-medium text-gray-700 mb-1">
                Nome da pasta
              </label>
              <Input
                id="folder-name"
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                placeholder="Digite o nome da pasta"
                autoFocus
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowNewFolderDialog(false)} disabled={isCreatingFolder}>
              Cancelar
            </Button>
            <Button onClick={createNewFolder} disabled={!newFolderName.trim() || isCreatingFolder}>
              {isCreatingFolder ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Criando...
                </>
              ) : (
                "Criar pasta"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
