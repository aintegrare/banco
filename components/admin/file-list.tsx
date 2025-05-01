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
  FolderPlus,
  Search,
  Info,
} from "lucide-react"
import { getBunnyPublicUrl } from "@/lib/bunny"

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

export function FileList() {
  const [files, setFiles] = useState<BunnyFile[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [deletingFile, setDeletingFile] = useState<string | null>(null)
  const [isCreatingDirectory, setIsCreatingDirectory] = useState(false)
  const [directoryCreated, setDirectoryCreated] = useState(false)
  const [directoryInfo, setDirectoryInfo] = useState<any | null>(null)
  const [isCheckingDirectory, setIsCheckingDirectory] = useState(false)
  const [debugInfo, setDebugInfo] = useState<string | null>(null)

  const fetchFiles = async () => {
    setIsLoading(true)
    setError(null)
    setDebugInfo(null)

    try {
      console.log("Iniciando busca de arquivos...")
      const response = await fetch("/api/files?directory=documents")

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || errorData.error || `Erro ao listar arquivos: ${response.status}`)
      }

      const data = await response.json()
      console.log(`Arquivos recebidos: ${data.files?.length || 0}`)

      // Verificar e exibir informações de depuração
      if (data.files && data.files.length > 0) {
        const debugSample = data.files.slice(0, 3).map((file: BunnyFile) => ({
          Nome: file.ObjectName,
          Caminho: file.Path,
          URL: file.PublicUrl || getBunnyPublicUrl(file.Path),
        }))
        setDebugInfo(JSON.stringify(debugSample, null, 2))
      }

      // Garantir que todos os arquivos tenham URLs públicas corretas
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
      console.log(`FileList: Iniciando exclusão do arquivo: ${path}`)

      // Extrair apenas o nome do arquivo e pasta para a API
      // Remover qualquer prefixo de URL completa se existir
      let cleanPath = path

      // Se o caminho começa com http, extrair apenas a parte após o domínio
      if (path.startsWith("http")) {
        const url = new URL(path)
        cleanPath = url.pathname.replace(/^\//, "") // Remover a barra inicial
      }

      // Se o caminho já começa com 'documents/', usar como está
      // Caso contrário, extrair apenas o nome do arquivo
      if (!cleanPath.startsWith("documents/")) {
        const parts = cleanPath.split("/")
        cleanPath = parts[parts.length - 1]
      }

      console.log(`FileList: Caminho limpo para API: ${cleanPath}`)

      const response = await fetch(`/api/files/${encodeURIComponent(cleanPath)}`, {
        method: "DELETE",
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || data.error || `Erro ao excluir arquivo: ${response.status}`)
      }

      // Atualizar a lista após exclusão bem-sucedida
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
    setIsCreatingDirectory(true)
    setError(null)
    setDirectoryCreated(false)

    try {
      const response = await fetch("/api/create-directory", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ directory: "documents" }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || errorData.error || `Erro ao criar diretório: ${response.status}`)
      }

      setDirectoryCreated(true)
      await fetchFiles()
    } catch (err) {
      console.error("Erro ao criar diretório:", err)
      setError(err instanceof Error ? err.message : "Erro ao criar diretório")
    } finally {
      setIsCreatingDirectory(false)
    }
  }

  const handleCheckDirectory = async () => {
    setIsCheckingDirectory(true)
    setDirectoryInfo(null)
    setError(null)

    try {
      const response = await fetch("/api/check-directory")

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || errorData.error || `Erro ao verificar diretório: ${response.status}`)
      }

      const data = await response.json()
      setDirectoryInfo(data)

      // Se o diretório existe e tem arquivos, atualizar a lista
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
            onClick={handleCheckDirectory}
            className="flex items-center text-sm text-[#4b7bb5] hover:text-[#3d649e] px-2 py-1 border border-[#4b7bb5] rounded-md"
            disabled={isCheckingDirectory}
          >
            {isCheckingDirectory ? (
              <Loader2 className="h-4 w-4 mr-1 animate-spin" />
            ) : (
              <Search className="h-4 w-4 mr-1" />
            )}
            Verificar Diretório
          </button>
          <button
            onClick={handleCreateDirectory}
            className="flex items-center text-sm text-[#4b7bb5] hover:text-[#3d649e] px-2 py-1 border border-[#4b7bb5] rounded-md"
            disabled={isCreatingDirectory}
          >
            {isCreatingDirectory ? (
              <Loader2 className="h-4 w-4 mr-1 animate-spin" />
            ) : (
              <FolderPlus className="h-4 w-4 mr-1" />
            )}
            Criar Diretório
          </button>
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

      {debugInfo && (
        <div className="bg-gray-50 p-3 rounded-md mb-4 text-xs">
          <div className="flex items-start">
            <Info className="h-4 w-4 mr-2 text-[#4b7bb5] flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-gray-700">Informações de depuração (primeiros 3 arquivos):</p>
              <pre className="mt-1 bg-gray-100 p-2 rounded overflow-auto max-h-40">{debugInfo}</pre>
            </div>
          </div>
        </div>
      )}

      {directoryCreated && (
        <div className="bg-green-50 text-green-700 p-4 rounded-md mb-4 flex items-start">
          <div>
            <p className="font-medium">Diretório criado com sucesso!</p>
            <p className="mt-1">O diretório "documents" foi criado e está pronto para receber arquivos.</p>
          </div>
        </div>
      )}

      {directoryInfo && (
        <div className="bg-blue-50 text-blue-700 p-4 rounded-md mb-4">
          <h3 className="font-medium">Informações do Diretório:</h3>
          <p>Status: {directoryInfo.exists ? "Existe" : "Não existe"}</p>
          {directoryInfo.exists && <p>Quantidade de arquivos: {directoryInfo.fileCount}</p>}
          <details className="mt-2">
            <summary className="cursor-pointer">Detalhes técnicos</summary>
            <pre className="mt-2 p-2 bg-blue-100 rounded text-xs overflow-auto max-h-40">
              {JSON.stringify(directoryInfo, null, 2)}
            </pre>
          </details>
        </div>
      )}

      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded-md mb-4 flex items-start">
          <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium">Erro ao carregar arquivos:</p>
            <p className="mt-1">{error}</p>
            <p className="mt-2 text-sm">
              Verifique se as variáveis de ambiente BUNNY_API_KEY e BUNNY_STORAGE_ZONE estão configuradas corretamente.
            </p>
            <p className="mt-2 text-sm">
              <strong>Importante:</strong> Certifique-se de que você configurou uma Pull Zone no painel do Bunny.net
              conectada à sua Storage Zone para acessar os arquivos publicamente.
            </p>
            <div className="mt-2">
              <button
                onClick={handleCreateDirectory}
                className="text-sm text-red-700 underline"
                disabled={isCreatingDirectory}
              >
                Tentar criar o diretório "documents"
              </button>
            </div>
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
          <button
            onClick={handleCreateDirectory}
            className="mt-4 px-4 py-2 bg-[#4b7bb5] text-white rounded-md hover:bg-[#3d649e]"
            disabled={isCreatingDirectory}
          >
            {isCreatingDirectory ? "Criando diretório..." : "Criar diretório 'documents'"}
          </button>
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
                        href={file.PublicUrl || getBunnyPublicUrl(file.Path)}
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
