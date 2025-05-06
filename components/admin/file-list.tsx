"use client"

import type React from "react"

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
  X,
  Download,
  CheckCircle,
  FolderOpen,
  Pencil,
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

  // Adicionar o estado para o modal de renomeação
  const [showRenameModal, setShowRenameModal] = useState(false)
  const [fileToRename, setFileToRename] = useState<BunnyFile | null>(null)
  const [newFileName, setNewFileName] = useState("")
  const [isRenaming, setIsRenaming] = useState(false)
  const [renameError, setRenameError] = useState<string | null>(null)

  const fetchFiles = async (directory = selectedDirectory) => {
    setIsLoading(true)
    setError(null)
    setDebugInfo(null)

    try {
      console.log(`Iniciando busca de arquivos no diretório: ${directory}...`)
      const response = await fetch(`/api/files?directory=${directory}`)

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
    fetchFiles(selectedDirectory)
  }, [selectedDirectory])

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

  const handleCreateDirectory = async (directory: string) => {
    setIsCreatingDirectory(true)
    setError(null)
    setDirectoryCreated(false)

    try {
      const response = await fetch("/api/create-directory", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ directory }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || errorData.error || `Erro ao criar diretório: ${response.status}`)
      }

      setDirectoryCreated(true)
      await fetchFiles(directory)
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
      const response = await fetch(`/api/check-directory?directory=${selectedDirectory}`)

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

  const isImage = (fileName: string) => {
    const extension = fileName.split(".").pop()?.toLowerCase()
    return ["jpg", "jpeg", "png", "gif", "webp"].includes(extension || "")
  }

  const handlePreviewFile = (file: BunnyFile) => {
    if (isImage(file.ObjectName)) {
      setPreviewFile(file)
    } else {
      // Verificar se a URL pública é válida
      const url = file.PublicUrl || getBunnyPublicUrl(file.Path)
      console.log(`Preview: Abrindo arquivo ${file.ObjectName} com URL: ${url}`)
      window.open(url, "_blank")
    }
  }

  const closePreview = () => {
    setPreviewFile(null)
  }

  const switchDirectory = (directory: string) => {
    setSelectedDirectory(directory)
    fetchFiles(directory)
  }

  // Filtrar arquivos com base na busca
  const filteredFiles = files.filter((file) => {
    return searchQuery ? file.ObjectName.toLowerCase().includes(searchQuery.toLowerCase()) : true
  })

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // A filtragem já acontece automaticamente via filteredFiles
  }

  // Adicionar a função para abrir o modal de renomeação
  const openRenameModal = (file: BunnyFile) => {
    setFileToRename(file)
    setNewFileName(file.ObjectName)
    setRenameError(null)
    setShowRenameModal(true)
  }

  // Adicionar a função para processar a renomeação
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

    // Verificar caracteres inválidos
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

      // Atualizar a lista de arquivos localmente
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

      // Atualizar a lista de arquivos do servidor após um breve atraso
      setTimeout(() => {
        fetchFiles(selectedDirectory)
      }, 1000)
    } catch (error) {
      console.error("Erro ao renomear arquivo:", error)
      setRenameError(error instanceof Error ? error.message : "Erro ao renomear arquivo")
    } finally {
      setIsRenaming(false)
    }
  }

  return (
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
                selectedDirectory === "images" ? "bg-[#4b7bb5] text-white shadow-sm" : "text-gray-600 hover:bg-gray-100"
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

      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={handleCheckDirectory}
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
          onClick={() => handleCreateDirectory(selectedDirectory)}
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
          Criar Diretório
        </button>

        <button
          onClick={() => fetchFiles(selectedDirectory)}
          className={`flex items-center text-sm px-3 py-1.5 rounded-md transition-all ${
            isLoading
              ? "bg-gray-100 text-gray-500"
              : "bg-white text-[#4b7bb5] border border-[#4b7bb5] hover:bg-[#f0f4f9]"
          }`}
          disabled={isLoading}
        >
          {isLoading ? <Loader2 className="h-4 w-4 mr-1.5 animate-spin" /> : <RefreshCw className="h-4 w-4 mr-1.5" />}
          Atualizar
        </button>
      </div>

      {debugInfo && (
        <div className="bg-gray-50 p-4 rounded-lg mb-6 text-xs border-l-4 border-[#4b7bb5]">
          <div className="flex items-start">
            <Info className="h-4 w-4 mr-2 text-[#4b7bb5] flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-gray-700 mb-2">Informações de depuração (primeiros 3 arquivos):</p>
              <pre className="bg-white p-3 rounded-md overflow-auto max-h-40 border border-gray-200">{debugInfo}</pre>
            </div>
          </div>
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
              <summary className="cursor-pointer text-blue-600 hover:text-blue-800 text-sm">Detalhes técnicos</summary>
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
                  onClick={() => handleCreateDirectory(selectedDirectory)}
                  className="text-red-600 hover:text-red-800 underline font-medium"
                  disabled={isCreatingDirectory}
                >
                  Tentar criar o diretório "{selectedDirectory}"
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
              onClick={() => handleCreateDirectory(selectedDirectory)}
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
                  <span>Criar diretório</span>
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
                    className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                  >
                    <td className="py-3 px-4">
                      <div className="flex items-center">
                        <div className="p-1.5 bg-gray-100 rounded-md mr-3">{getFileIcon(file.ObjectName)}</div>
                        <span
                          className="cursor-pointer hover:text-[#4b7bb5] font-medium transition-colors"
                          onClick={() => handlePreviewFile(file)}
                        >
                          {file.ObjectName}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-gray-500">{formatFileSize(file.Length)}</td>
                    <td className="py-3 px-4 text-gray-500">{formatDate(file.LastChanged)}</td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex justify-end space-x-2">
                        <a
                          href={file.PublicUrl || getBunnyPublicUrl(file.Path)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 text-blue-500 hover:text-blue-700 hover:bg-blue-50 rounded-md transition-colors"
                          title="Abrir arquivo"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </a>
                        <button
                          className="p-1.5 text-orange-500 hover:text-orange-700 hover:bg-orange-50 rounded-md transition-colors"
                          title="Renomear arquivo"
                          onClick={(e) => {
                            e.stopPropagation()
                            openRenameModal(file)
                          }}
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors disabled:opacity-50 disabled:hover:bg-transparent"
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
        </div>
      )}

      {/* Modal de renomeação */}
      {showRenameModal && fileToRename && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-white rounded-xl max-w-md w-full overflow-hidden shadow-2xl">
            <div className="p-4 border-b flex justify-between items-center">
              <h3 className="font-medium flex items-center">
                {getFileIcon(fileToRename.ObjectName)}
                <span className="ml-2">Renomear arquivo</span>
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

      {/* Modal de preview de imagem */}
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
    </div>
  )
}
