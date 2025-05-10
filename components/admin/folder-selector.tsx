"use client"

import { useState } from "react"
import { ChevronRight, Folder, FolderOpen, Loader2 } from "lucide-react"

interface FolderSelectorProps {
  onSelect: (path: string) => void
  currentPath?: string
  excludePaths?: string[]
}

interface FolderItem {
  name: string
  path: string
  isExpanded?: boolean
  children?: FolderItem[]
  isLoading?: boolean
}

export function FolderSelector({ onSelect, currentPath, excludePaths = [] }: FolderSelectorProps) {
  const [rootFolders, setRootFolders] = useState<FolderItem[]>([
    { name: "documents", path: "documents", isExpanded: false },
    { name: "images", path: "images", isExpanded: false },
  ])
  const [selectedFolder, setSelectedFolder] = useState<string>(currentPath || "")
  const [isLoading, setIsLoading] = useState(false)

  // Função para buscar subpastas
  const fetchSubfolders = async (folderPath: string): Promise<FolderItem[]> => {
    try {
      const response = await fetch(`/api/files?directory=${folderPath}`)

      if (!response.ok) {
        throw new Error(`Erro ao listar pastas: ${response.status}`)
      }

      const data = await response.json()

      // Filtrar apenas as pastas
      const folders = (data.files || [])
        .filter((file: any) => file.IsDirectory)
        .map((folder: any) => ({
          name: folder.ObjectName,
          path: folder.Path,
          isExpanded: false,
          children: [],
        }))

      return folders
    } catch (error) {
      console.error("Erro ao buscar subpastas:", error)
      return []
    }
  }

  // Função para expandir/colapsar uma pasta
  const toggleFolder = async (path: string) => {
    setRootFolders((prevFolders) => {
      const updateFolders = (folders: FolderItem[]): FolderItem[] => {
        return folders.map((folder) => {
          if (folder.path === path) {
            // Se a pasta já está expandida, apenas colapsa
            if (folder.isExpanded) {
              return { ...folder, isExpanded: false }
            }

            // Se não está expandida e não tem filhos, marca como carregando
            if (!folder.children || folder.children.length === 0) {
              // Vamos buscar as subpastas de forma assíncrona
              fetchSubfolders(folder.path).then((subfolders) => {
                setRootFolders((prevState) => {
                  const updateWithChildren = (items: FolderItem[]): FolderItem[] => {
                    return items.map((item) => {
                      if (item.path === path) {
                        return {
                          ...item,
                          children: subfolders,
                          isLoading: false,
                        }
                      } else if (item.children && item.children.length > 0) {
                        return {
                          ...item,
                          children: updateWithChildren(item.children),
                        }
                      }
                      return item
                    })
                  }

                  return updateWithChildren(prevState)
                })
              })

              // Enquanto isso, mostra o indicador de carregamento
              return { ...folder, isExpanded: true, isLoading: true }
            }

            // Se já tem filhos, apenas expande
            return { ...folder, isExpanded: true }
          } else if (folder.children && folder.children.length > 0) {
            return {
              ...folder,
              children: updateFolders(folder.children),
            }
          }
          return folder
        })
      }

      return updateFolders(prevFolders)
    })
  }

  // Função para selecionar uma pasta
  const handleSelectFolder = (path: string) => {
    setSelectedFolder(path)
    onSelect(path)
  }

  // Renderizar a árvore de pastas
  const renderFolderTree = (folders: FolderItem[], level = 0) => {
    return folders
      .map((folder) => {
        // Verificar se esta pasta deve ser excluída
        const isExcluded = excludePaths.some((path) => folder.path === path || folder.path.startsWith(`${path}/`))

        if (isExcluded) return null

        return (
          <div key={folder.path} style={{ marginLeft: `${level * 16}px` }}>
            <div
              className={`flex items-center py-1.5 px-2 rounded-md cursor-pointer ${
                selectedFolder === folder.path ? "bg-[#4b7bb5] text-white" : "hover:bg-gray-100"
              }`}
            >
              <button
                onClick={() => toggleFolder(folder.path)}
                className="p-1 mr-1 rounded-md hover:bg-gray-200 hover:bg-opacity-20"
              >
                <ChevronRight
                  size={16}
                  className={`transition-transform ${folder.isExpanded ? "transform rotate-90" : ""}`}
                />
              </button>

              <div className="flex items-center flex-1 cursor-pointer" onClick={() => handleSelectFolder(folder.path)}>
                {folder.isExpanded ? (
                  <FolderOpen size={18} className="mr-1.5 text-[#4b7bb5]" />
                ) : (
                  <Folder size={18} className="mr-1.5 text-[#4b7bb5]" />
                )}
                <span className="text-sm">{folder.name}</span>
              </div>

              {folder.isLoading && <Loader2 size={16} className="animate-spin ml-1 text-gray-400" />}
            </div>

            {folder.isExpanded && folder.children && (
              <div className="mt-1">{renderFolderTree(folder.children, level + 1)}</div>
            )}
          </div>
        )
      })
      .filter(Boolean) // Filtrar os nulos (pastas excluídas)
  }

  return (
    <div className="border rounded-md p-2 max-h-60 overflow-y-auto bg-white">
      <div className="mb-2 text-sm text-gray-500">Selecione a pasta de destino:</div>
      {renderFolderTree(rootFolders)}
    </div>
  )
}
