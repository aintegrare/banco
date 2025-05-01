"use client"

import { useState, useEffect } from "react"
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
} from "lucide-react"

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
}

export function FileList() {
  const [files, setFiles] = useState<BunnyFile[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [deletingFile, setDeletingFile] = useState<string | null>(null)

  const fetchFiles = async () => {
    setIsLoading(true)
    setError(null)

    try {
      console.log("Iniciando busca de arquivos...")
      const response = await fetch("/api/files?directory=documents")

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || errorData.error || `Erro ao listar arquivos: ${response.status}`)
      }

      const data = await response.json()
      console.log(`Arquivos recebidos: ${data.files?.length || 0}`)

      setFiles(data.files || [])
    } catch (err) {
      console.error("Erro ao buscar arquivos:", err)
      setError(err instanceof Error ? err.message : "Erro desconhecido ao buscar arquivos")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchFiles()
  }, [])

  const handleDelete = async (path: string) => {
    if (!confirm("Tem certeza que deseja excluir este arquivo? Esta ação não pode ser desfeita.")) {
      return
    }

    setDeletingFile(path)

    try {
      const response = await fetch(`/api/files/${encodeURIComponent(path)}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || errorData.error || `Erro ao excluir arquivo: ${response.status}`)
      }

      const data = await response.json()

      // Atualizar a lista de arquivos
      setFiles((prevFiles) => prevFiles.filter((file) => file.Path !== path))
    } catch (err) {
      console.error("Erro ao excluir arquivo:", err)
      setError(err instanceof Error ? err.message : "Erro ao excluir arquivo")
    } finally {
      setDeletingFile(null)
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

      // Criar um arquivo de teste para verificar se a API está funcionando
      const response = await fetch("/api/test-directory", {
        method: "POST",
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || errorData.error || `Erro ao criar diretório de teste: ${response.status}`)
      }

      await fetchFiles()
    } catch (err) {
      console.error("Erro ao criar diretório de teste:", err)
      setError(err instanceof Error ? err.message : "Erro ao criar diretório de teste")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-[#4072b0]">Arquivos Armazenados</h2>
        <div className="flex space-x-2">
          <button
            onClick={handleCreateTestDirectory}
            className="flex items-center text-sm text-[#4b7bb5] hover:text-[#3d649e] px-2 py-1 border border-[#4b7bb5] rounded-md"
            disabled={isLoading}
          >
            Criar Teste
          </button>
          <button
            onClick={fetchFiles}
            className="flex items-center text-sm text-[#4b7bb5] hover:text-[#3d649e]"
            disabled={isLoading}
          >
            {isLoading ? <Loader2 className="h-4 w-4 mr-1 animate-spin" /> : <RefreshCw className="h-4 w-4 mr-1" />}
            Atualizar
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded-md mb-4 flex items-start">
          <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium">Erro ao carregar arquivos:</p>
            <p className="mt-1">{error}</p>
            <p className="mt-2 text-sm">
              Verifique se as variáveis de ambiente BUNNY_API_KEY, BUNNY_STORAGE_ZONE e BUNNY_STORAGE_REGION estão
              configuradas corretamente.
            </p>
          </div>
        </div>
      )}

      {isLoading && files.length === 0 ? (
        <div className="text-center py-8">
          <div className="animate-spin h-8 w-8 border-2 border-[#4b7bb5] border-t-transparent rounded-full mx-auto mb-2"></div>
          <p className="text-gray-500">Carregando arquivos...</p>
        </div>
      ) : files.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p>Nenhum arquivo encontrado.</p>
          <p className="text-sm mt-2">Faça upload de arquivos usando o formulário acima.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-2 px-2">Arquivo</th>
                <th className="text-left py-2 px-2">Tamanho</th>
                <th className="text-left py-2 px-2">Data</th>
                <th className="text-right py-2 px-2">Ações</th>
              </tr>
            </thead>
            <tbody>
              {files.map((file) => (
                <tr key={file.Guid || file.ObjectName} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-2 px-2">
                    <div className="flex items-center">
                      {getFileIcon(file.ObjectName)}
                      <span className="ml-2">{file.ObjectName}</span>
                    </div>
                  </td>
                  <td className="py-2 px-2 text-gray-500">{formatFileSize(file.Length)}</td>
                  <td className="py-2 px-2 text-gray-500">{formatDate(file.LastChanged)}</td>
                  <td className="py-2 px-2 text-right">
                    <div className="flex justify-end space-x-2">
                      <a
                        href={`https://${file.StorageZoneName}.b-cdn.net/${file.Path}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:text-blue-700"
                        title="Abrir arquivo"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </a>
                      <button
                        className="text-red-500 hover:text-red-700 disabled:opacity-50"
                        title="Excluir arquivo"
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
      )}
    </div>
  )
}
