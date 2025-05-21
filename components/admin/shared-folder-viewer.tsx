"use client"

import { useState, useEffect } from "react"
import {
  Folder,
  File,
  ChevronRight,
  Download,
  ArrowLeft,
  FileText,
  ImageIcon,
  Film,
  Music,
  Archive,
  FileImage,
  BookOpen,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

interface FileItem {
  name: string
  type: "folder" | "file"
  size?: number
  modified: string
  path: string
  url?: string
  isDirectory: boolean
}

interface SharedFolderViewerProps {
  token: string
  initialPath: string
}

export default function SharedFolderViewer({ token, initialPath }: SharedFolderViewerProps) {
  const [files, setFiles] = useState<FileItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentPath, setCurrentPath] = useState<string>(initialPath)
  const [pathHistory, setPathHistory] = useState<string[]>([])

  // Função para buscar arquivos
  const fetchFiles = async (path: string) => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/files/shared-folder?path=${encodeURIComponent(path)}&token=${token}`)

      if (!response.ok) {
        throw new Error(`Erro ao buscar arquivos: ${response.status}`)
      }

      const data = await response.json()
      setFiles(data.files || [])
    } catch (err) {
      console.error("Erro ao buscar arquivos:", err)
      setError(err instanceof Error ? err.message : "Erro desconhecido ao buscar arquivos")
    } finally {
      setIsLoading(false)
    }
  }

  // Carregar arquivos quando o componente montar ou o caminho mudar
  useEffect(() => {
    fetchFiles(currentPath)
  }, [currentPath, token])

  // Navegar para uma pasta
  const navigateToFolder = (folderPath: string) => {
    setPathHistory([...pathHistory, currentPath])
    setCurrentPath(folderPath)
  }

  // Navegar para trás
  const navigateBack = () => {
    if (pathHistory.length > 0) {
      const previousPath = pathHistory[pathHistory.length - 1]
      setPathHistory(pathHistory.slice(0, -1))
      setCurrentPath(previousPath)
    }
  }

  // Renderizar breadcrumbs
  const renderBreadcrumbs = () => {
    if (!currentPath) return null

    const segments = currentPath.split("/").filter(Boolean)

    return (
      <div className="flex items-center text-sm overflow-x-auto whitespace-nowrap py-2 mb-4">
        {segments.map((segment, index) => (
          <div key={index} className="flex items-center">
            {index > 0 && <ChevronRight size={16} className="mx-1 text-gray-400" />}
            <span
              className={`px-2 py-1 rounded-md ${
                index === segments.length - 1 ? "font-medium text-[#4b7bb5]" : "text-gray-600"
              }`}
            >
              {segment}
            </span>
          </div>
        ))}
      </div>
    )
  }

  // Função para obter o ícone do arquivo
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
      case "psd":
      case "psb":
        return <FileImage className="h-5 w-5 text-purple-600" />
      case "ai":
        return <FileImage className="h-5 w-5 text-orange-500" />
      case "indd":
      case "idml":
        return <BookOpen className="h-5 w-5 text-pink-500" />
      default:
        return <File className="h-5 w-5 text-gray-500" />
    }
  }

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
    })
  }

  if (isLoading) {
    return <div className="p-8 text-center">Carregando arquivos...</div>
  }

  if (error) {
    return (
      <div className="p-8 text-center text-red-500">
        <p>Erro ao carregar arquivos:</p>
        <p>{error}</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {pathHistory.length > 0 && (
        <Button variant="outline" onClick={navigateBack} className="mb-2">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar
        </Button>
      )}

      {renderBreadcrumbs()}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {files.map((file, index) => (
          <Card key={index} className="overflow-hidden hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-start space-x-3">
                <div className="p-2 bg-gray-100 rounded-md">
                  {file.isDirectory ? <Folder className="h-5 w-5 text-[#4b7bb5]" /> : getFileIcon(file.name)}
                </div>

                <div className="flex-1 min-w-0">
                  {file.isDirectory ? (
                    <button
                      onClick={() => navigateToFolder(file.path)}
                      className="text-sm font-medium text-gray-900 hover:text-[#4b7bb5] truncate block w-full text-left"
                    >
                      {file.name}
                    </button>
                  ) : (
                    <div className="text-sm font-medium text-gray-900 truncate">{file.name}</div>
                  )}

                  <div className="flex justify-between items-center mt-2 text-xs text-gray-500">
                    <div>{formatDate(file.modified)}</div>
                    {!file.isDirectory && file.size && <div>{formatBytes(file.size)}</div>}
                  </div>
                </div>
              </div>

              {!file.isDirectory && file.url && (
                <div className="mt-3 flex justify-end">
                  <a
                    href={file.url}
                    download
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-xs text-[#4b7bb5] hover:text-[#3d649e]"
                  >
                    <Download className="h-3.5 w-3.5 mr-1" />
                    Download
                  </a>
                </div>
              )}
            </CardContent>
          </Card>
        ))}

        {files.length === 0 && (
          <div className="col-span-full p-8 text-center text-gray-500">Esta pasta está vazia.</div>
        )}
      </div>
    </div>
  )
}
