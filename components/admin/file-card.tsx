"use client"

import type React from "react"

import {
  Folder,
  FileText,
  ImageIcon,
  Film,
  Music,
  Archive,
  FileIcon,
  MoreVertical,
  Star,
  StarOff,
  Download,
  Trash2,
  Share2,
  Pencil,
  Eye,
  X,
  ExternalLink,
  Loader2,
  Check,
  MoveIcon,
  Clock,
  RefreshCw,
} from "lucide-react"
import { useState } from "react"
import { RenameWarningDialog } from "./rename-warning-dialog"
import { ShareLinkDialog } from "./share-link-dialog"
import { ToastNotification } from "./toast-notification"
import { DeleteConfirmationDialog } from "./delete-confirmation-dialog"
import { Button } from "@/components/ui/button"
import { DropdownMenuSeparator } from "@/components/ui/dropdown-menu"
import { DocumentPreview } from "./document-preview"

// Adicionar estas importações no início do arquivo
import { checkCacheStatus, purgeBunnyCache } from "@/lib/bunny"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

// Modificar a interface FileCardProps para incluir a contagem de tarefas
interface FileCardProps {
  file: {
    id: string
    name: string
    type: "folder" | "file"
    size?: number
    modified: string
    path: string
    url?: string
    fileType?: string
    isFavorite?: boolean
  }
  onFolderClick: () => void
  onDelete: () => void
  onRename: (oldPath: string, newName: string) => void
  onShare?: () => void
  onToggleFavorite?: () => void
  isSelected?: boolean
  onToggleSelect?: () => void
  taskCount?: number
  overdueCount?: number
  onOpenTasks?: () => void
  onMove?: () => void
}

export function FileCard({
  file,
  onFolderClick,
  onDelete,
  onRename,
  onShare,
  onToggleFavorite,
  isSelected,
  onToggleSelect,
  taskCount,
  overdueCount,
  onOpenTasks,
  onMove,
}: FileCardProps) {
  const [showMenu, setShowMenu] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [showRenameModal, setShowRenameModal] = useState(false)
  const [newFileName, setNewFileName] = useState(file.name)
  const [isRenaming, setIsRenaming] = useState(false)
  const [renameError, setRenameError] = useState<string | null>(null)
  const [showRenameWarning, setShowRenameWarning] = useState(false)
  const [showShareDialog, setShowShareDialog] = useState(false)
  const [toast, setToast] = useState<{ visible: boolean; message: string; type: "success" | "error" }>({
    visible: false,
    message: "",
    type: "success",
  })
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false)
  const [showDocumentPreview, setShowDocumentPreview] = useState(false)

  // Adicionar estes estados dentro da função FileCard
  const [isCached, setIsCached] = useState<boolean | null>(null)
  const [isCheckingCache, setIsCheckingCache] = useState(false)
  const [isPurgingCache, setIsPurgingCache] = useState(false)

  // Função para formatar bytes em unidades legíveis
  const formatBytes = (bytes = 0) => {
    if (bytes === 0) return "0 Bytes"

    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))

    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  // Determinar o ícone com base no tipo de arquivo
  const getFileIcon = () => {
    if (file.type === "folder") {
      return <Folder size={40} className="text-[#4b7bb5]" />
    }

    const fileType = file.fileType?.toLowerCase() || ""

    if (["jpg", "jpeg", "png", "gif", "webp"].includes(fileType)) {
      return <ImageIcon size={40} className="text-green-500" />
    } else if (["pdf"].includes(fileType)) {
      return <FileText size={40} className="text-red-500" />
    } else if (["mp4", "avi", "mov", "webm"].includes(fileType)) {
      return <Film size={40} className="text-purple-500" />
    } else if (["mp3", "wav", "ogg"].includes(fileType)) {
      return <Music size={40} className="text-blue-500" />
    } else if (["zip", "rar", "7z", "tar", "gz"].includes(fileType)) {
      return <Archive size={40} className="text-amber-500" />
    } else {
      return <FileIcon size={40} className="text-gray-500" />
    }
  }

  // Função para obter o tempo relativo (ex: "há 23 horas")
  const getRelativeTime = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()

    const diffSecs = Math.floor(diffMs / 1000)
    const diffMins = Math.floor(diffSecs / 60)
    const diffHours = Math.floor(diffMins / 60)
    const diffDays = Math.floor(diffHours / 24)

    if (diffDays > 0) {
      return `há ${diffDays} ${diffDays === 1 ? "dia" : "dias"}`
    } else if (diffHours > 0) {
      return `há ${diffHours} ${diffHours === 1 ? "hora" : "horas"}`
    } else if (diffMins > 0) {
      return `há ${diffMins} ${diffMins === 1 ? "minuto" : "minutos"}`
    } else {
      return "agora mesmo"
    }
  }

  const handleClick = () => {
    if (onToggleSelect) {
      onToggleSelect()
      return
    }

    if (file.type === "folder") {
      onFolderClick()
    } else {
      // Para imagens, mostrar preview
      if (isImage()) {
        setShowPreview(true)
      } else if (isPdf()) {
        setShowDocumentPreview(true)
      } else {
        // Para outros arquivos, abrir
        if (file.url) {
          window.open(file.url, "_blank")
        }
      }
    }
  }

  const toggleMenu = (e: React.MouseEvent) => {
    e.stopPropagation()
    setShowMenu(!showMenu)
  }

  const isImage = () => {
    const fileType = file.fileType?.toLowerCase() || ""
    return ["jpg", "jpeg", "png", "gif", "webp"].includes(fileType)
  }

  const isPdf = () => {
    const fileType = file.fileType?.toLowerCase() || ""
    return fileType === "pdf"
  }

  // Função para compartilhar arquivo ou pasta
  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation()
    setShowMenu(false)

    if (onShare) {
      onShare()
    } else {
      setShowShareDialog(true)
    }
  }

  // Função para copiar para a área de transferência
  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setToast({
        visible: true,
        message: "Link copiado para a área de transferência!",
        type: "success",
      })

      // Esconder o toast após 3 segundos
      setTimeout(() => {
        setToast((prev) => ({ ...prev, visible: false }))
      }, 3000)
    } catch (err) {
      console.error("Falha ao copiar texto: ", err)
      setToast({
        visible: true,
        message: "Erro ao copiar link",
        type: "error",
      })
    }
  }

  // Modificar a função handleRename para mostrar o aviso primeiro
  const handleRename = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!newFileName || newFileName.trim() === "") {
      setRenameError("O nome do arquivo não pode estar vazio")
      return
    }

    if (newFileName === file.name) {
      setShowRenameModal(false)
      return
    }

    // Verificar caracteres inválidos
    if (/[\\/:*?"<>|]/.test(newFileName)) {
      setRenameError("O nome do arquivo contém caracteres inválidos")
      return
    }

    // Se for uma pasta, mostrar o aviso primeiro
    if (file.type === "folder") {
      setShowRenameWarning(true)
      return
    }

    // Se não for pasta, continuar com a renomeação
    await executeRename()
  }

  // Função para executar a renomeação após a confirmação
  const executeRename = async () => {
    setIsRenaming(true)
    setRenameError(null)

    try {
      const response = await fetch("/api/files/rename", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          oldPath: file.path,
          newName: newFileName,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || data.error || "Erro ao renomear arquivo")
      }

      // Chamar a função onRename se existir
      if (onRename) {
        onRename(file.path, newFileName)
      }

      setShowRenameModal(false)
      setShowRenameWarning(false)
    } catch (error) {
      console.error("Erro ao renomear arquivo:", error)
      setRenameError(error instanceof Error ? error.message : "Erro ao renomear arquivo")
    } finally {
      setIsRenaming(false)
    }
  }

  // Função para confirmar exclusão
  const confirmDelete = () => {
    setShowDeleteConfirmation(false)
    onDelete()
  }

  // Função para alternar favorito
  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation()
    setShowMenu(false)

    if (onToggleFavorite) {
      onToggleFavorite()
    }
  }

  // Truncar o nome do arquivo se for muito longo
  const truncateFileName = (name: string, maxLength = 25) => {
    if (name.length <= maxLength) return name

    const extension = name.split(".").pop() || ""
    const nameWithoutExt = name.substring(0, name.length - extension.length - 1)

    if (nameWithoutExt.length <= maxLength - 3) return name

    return `${nameWithoutExt.substring(0, maxLength - 3)}...${extension ? "." + extension : ""}`
  }

  // Adicionar esta função dentro do componente FileCard
  const checkCache = async (e: React.MouseEvent) => {
    e.stopPropagation()
    if (!file.url) return

    setIsCheckingCache(true)
    try {
      const status = await checkCacheStatus(file.url)
      setIsCached(status.cached)

      // Mostrar toast com o status
      setToast({
        visible: true,
        message: status.cached
          ? `Arquivo em cache. Idade: ${status.age ? Math.floor(status.age / 60) + " minutos" : "desconhecida"}`
          : "Arquivo não está em cache",
        type: "success",
      })
    } catch (error) {
      console.error("Erro ao verificar cache:", error)
      setToast({
        visible: true,
        message: "Erro ao verificar status de cache",
        type: "error",
      })
    } finally {
      setIsCheckingCache(false)
    }
  }

  // Adicionar esta função dentro do componente FileCard
  const purgeCache = async (e: React.MouseEvent) => {
    e.stopPropagation()
    if (!file.url) return

    if (!confirm("Tem certeza que deseja purgar o cache deste arquivo?")) {
      return
    }

    setIsPurgingCache(true)
    try {
      // Extrair o caminho da URL
      let path = file.path

      if (file.url.startsWith("http")) {
        try {
          const url = new URL(file.url)
          path = url.pathname.replace(/^\//, "")
        } catch (e) {
          throw new Error("URL inválida")
        }
      }

      const success = await purgeBunnyCache(path)

      if (success) {
        setIsCached(false)
        setToast({
          visible: true,
          message: "Cache purgado com sucesso",
          type: "success",
        })
      } else {
        throw new Error("Falha ao purgar cache")
      }
    } catch (error) {
      console.error("Erro ao purgar cache:", error)
      setToast({
        visible: true,
        message: "Erro ao purgar cache",
        type: "error",
      })
    } finally {
      setIsPurgingCache(false)
    }
  }

  return (
    <>
      <div
        className={`bg-gray-100 rounded-lg border ${
          isSelected ? "border-[#4b7bb5] bg-blue-50" : "border-gray-200"
        } overflow-hidden hover:shadow-md transition-all cursor-pointer relative group`}
        onClick={handleClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Indicador de seleção */}
        {onToggleSelect && (
          <div className="absolute top-2 left-2 z-10">
            <div
              className={`w-5 h-5 rounded-full border ${
                isSelected ? "bg-[#4b7bb5] border-[#4b7bb5] text-white" : "bg-white border-gray-300"
              } flex items-center justify-center`}
            >
              {isSelected && <Check className="h-3 w-3" />}
            </div>
          </div>
        )}

        {/* Indicador de favorito */}
        {file.isFavorite && (
          <div className="absolute top-2 right-2 z-10">
            <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
          </div>
        )}

        <div className="flex flex-col">
          {/* Área de thumbnail */}
          <div className="w-full h-40 overflow-hidden bg-white flex items-center justify-center">
            {isImage() && file.url ? (
              <img
                src={file.url || "/placeholder.svg"}
                alt={file.name}
                className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105"
                onError={(e) => {
                  e.currentTarget.style.display = "none"
                  const iconContainer = e.currentTarget.parentElement
                  if (iconContainer) {
                    const icon = document.createElement("div")
                    icon.className = "flex items-center justify-center h-full"
                    icon.innerHTML =
                      '<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" class="text-green-500"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>'
                    iconContainer.appendChild(icon)
                  }
                }}
              />
            ) : isPdf() ? (
              <div className="flex flex-col items-center justify-center">
                <div className="w-10 h-10 bg-red-500 rounded-md flex items-center justify-center mb-2">
                  <FileText className="h-6 w-6 text-white" />
                </div>
              </div>
            ) : file.type === "folder" ? (
              <div className="flex flex-col items-center justify-center">
                <Folder className="h-16 w-16 text-[#4b7bb5]" />
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center">{getFileIcon()}</div>
            )}
          </div>

          {/* Área de informações */}
          <div className="p-3 bg-gray-200">
            {/* Ícone de tipo de arquivo */}
            <div className="flex items-center mb-1">
              {isPdf() && (
                <div className="w-6 h-6 bg-red-500 rounded-sm flex items-center justify-center mr-2">
                  <FileText className="h-4 w-4 text-white" />
                </div>
              )}
              <h3 className="text-sm font-medium text-gray-700 truncate">{truncateFileName(file.name)}</h3>
            </div>
            <div className="flex items-center text-xs text-gray-500">
              <span>{isPdf() ? "PDF" : file.fileType?.toUpperCase() || "Arquivo"}</span>
              <span className="mx-1">•</span>
              <span>{getRelativeTime(file.modified)}</span>
              {isCached !== null && (
                <>
                  <span className="mx-1">•</span>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span className={`flex items-center ${isCached ? "text-green-500" : "text-gray-400"}`}>
                          <Clock className="h-3 w-3 mr-0.5" />
                          {isCached ? "Em cache" : "Sem cache"}
                        </span>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>
                          {isCached
                            ? "Este arquivo está armazenado em cache no CDN"
                            : "Este arquivo não está em cache ou foi purgado"}
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Overlay de ações para hover */}
        {isHovered && !onToggleSelect && (
          <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg">
            {file.type === "file" && (
              <>
                {isImage() && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      setShowPreview(true)
                    }}
                    className="p-2 bg-white rounded-full text-gray-700 hover:text-[#4b7bb5] transition-colors"
                    title="Visualizar"
                  >
                    <Eye size={18} />
                  </button>
                )}
                {isPdf() && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      setShowDocumentPreview(true)
                    }}
                    className="p-2 bg-white rounded-full text-gray-700 hover:text-[#4b7bb5] transition-colors"
                    title="Visualizar PDF"
                  >
                    <Eye size={18} />
                  </button>
                )}
                <a
                  href={file.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="p-2 bg-white rounded-full text-gray-700 hover:text-blue-600 transition-colors"
                  title="Abrir"
                >
                  <ExternalLink size={18} />
                </a>
                {/* Botão de compartilhamento */}
                <button
                  onClick={handleShare}
                  className="p-2 bg-white rounded-full text-gray-700 hover:text-purple-600 transition-colors"
                  title="Compartilhar"
                >
                  <Share2 size={18} />
                </button>
                {/* Botão de favorito */}
                <button
                  onClick={handleToggleFavorite}
                  className="p-2 bg-white rounded-full text-gray-700 hover:text-amber-500 transition-colors"
                  title={file.isFavorite ? "Remover dos favoritos" : "Adicionar aos favoritos"}
                >
                  {file.isFavorite ? <StarOff size={18} /> : <Star size={18} />}
                </button>
              </>
            )}
          </div>
        )}

        {/* Menu button */}
        {!onToggleSelect && (
          <button
            className="absolute bottom-2 right-2 p-1.5 rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity bg-white shadow-sm"
            onClick={toggleMenu}
          >
            <MoreVertical size={16} />
          </button>
        )}

        {/* Dropdown menu */}
        {showMenu && (
          <div
            className="absolute bottom-10 right-2 bg-white rounded-md shadow-lg z-10 border border-gray-200 py-1 w-40 animate-fadeIn"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center"
              onClick={handleToggleFavorite}
            >
              {file.isFavorite ? (
                <>
                  <StarOff size={16} className="mr-2 text-amber-500" />
                  <span>Remover favorito</span>
                </>
              ) : (
                <>
                  <Star size={16} className="mr-2 text-amber-500" />
                  <span>Favoritar</span>
                </>
              )}
            </button>
            {file.type === "file" && (
              <>
                <button
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center"
                  onClick={(e) => {
                    e.stopPropagation()
                    setShowMenu(false)
                    if (isImage()) {
                      setShowPreview(true)
                    } else if (file.url) {
                      window.open(file.url, "_blank")
                    }
                  }}
                >
                  <Eye size={16} className="mr-2 text-blue-500" />
                  <span>Visualizar</span>
                </button>
                {file.type === "file" && isPdf() && (
                  <button
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center"
                    onClick={(e) => {
                      e.stopPropagation()
                      setShowMenu(false)
                      setShowDocumentPreview(true)
                    }}
                  >
                    <Eye className="h-4 w-4 mr-2 text-blue-500" />
                    <span>Visualizar PDF</span>
                  </button>
                )}
                <button
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center"
                  onClick={(e) => {
                    e.stopPropagation()
                    if (file.url) {
                      const a = document.createElement("a")
                      a.href = file.url
                      a.download = file.name
                      document.body.appendChild(a)
                      a.click()
                      document.body.removeChild(a)
                    }
                    setShowMenu(false)
                  }}
                >
                  <Download size={16} className="mr-2 text-green-500" />
                  <span>Download</span>
                </button>
              </>
            )}
            {/* Botão de compartilhamento no menu */}
            <button
              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center"
              onClick={handleShare}
            >
              <Share2 size={16} className="mr-2 text-purple-500" />
              <span>Compartilhar</span>
            </button>
            <button
              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center"
              onClick={(e) => {
                e.stopPropagation()
                setShowMenu(false)
                onMove && onMove()
              }}
            >
              <MoveIcon className="h-4 w-4 mr-2 text-purple-500" />
              <span>Mover</span>
            </button>
            <button
              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center"
              onClick={(e) => {
                e.stopPropagation()
                setShowMenu(false)
                setNewFileName(file.name)
                setRenameError(null)
                setShowRenameModal(true)
              }}
            >
              <Pencil size={16} className="mr-2 text-orange-500" />
              <span>Renomear</span>
            </button>
            <DropdownMenuSeparator />
            {/* Adicionar estes botões ao menu dropdown, antes do botão de exclusão */}
            <button
              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center"
              onClick={checkCache}
              disabled={isCheckingCache}
            >
              {isCheckingCache ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin text-blue-500" />
              ) : (
                <Clock className="h-4 w-4 mr-2 text-blue-500" />
              )}
              <span>Verificar Cache</span>
            </button>

            <button
              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center"
              onClick={purgeCache}
              disabled={isPurgingCache}
            >
              {isPurgingCache ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin text-orange-500" />
              ) : (
                <RefreshCw className="h-4 w-4 mr-2 text-orange-500" />
              )}
              <span>Purgar Cache</span>
            </button>
            {/* Modificar o botão de exclusão para mostrar o diálogo de confirmação */}
            <button
              className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center"
              onClick={(e) => {
                e.stopPropagation()
                setShowMenu(false)
                setShowDeleteConfirmation(true)
              }}
            >
              <Trash2 size={16} className="mr-2" />
              <span>Excluir</span>
            </button>
          </div>
        )}
      </div>

      {/* Modal de preview de imagem */}
      {showPreview && isImage() && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
            <div className="p-4 border-b flex justify-between items-center">
              <h3 className="font-medium flex items-center">
                <ImageIcon className="h-4 w-4 mr-2 text-green-500" />
                {file.name}
              </h3>
              <button
                onClick={() => setShowPreview(false)}
                className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="flex-1 overflow-auto p-6 flex items-center justify-center bg-gray-50">
              <img
                src={file.url || "/placeholder.svg"}
                alt={file.name}
                className="max-w-full max-h-[70vh] object-contain rounded-md shadow-md"
              />
            </div>
            <div className="p-4 border-t flex justify-between items-center bg-gray-50">
              <div className="text-sm text-gray-600">
                <span className="font-medium">{file.size ? formatBytes(file.size) : ""}</span> • {file.modified}
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={handleShare}
                  className="flex items-center px-3 py-1.5 bg-[#4b7bb5] text-white rounded-md hover:bg-[#3d649e] transition-colors"
                >
                  <Share2 className="h-4 w-4 mr-1.5" />
                  <span>Compartilhar</span>
                </Button>
                <a
                  href={file.url}
                  download
                  className="flex items-center px-3 py-1.5 bg-[#4b7bb5] text-white rounded-md hover:bg-[#3d649e] transition-colors"
                >
                  <Download className="h-4 w-4 mr-1.5" />
                  <span>Download</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de renomeação */}
      {showRenameModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fadeIn"
          onClick={(e) => e.stopPropagation()}
        >
          <div
            className="bg-white rounded-lg max-w-md w-full overflow-hidden shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 border-b">
              <h3 className="font-medium">Renomear {file.type === "folder" ? "pasta" : "arquivo"}</h3>
            </div>
            <form onSubmit={handleRename}>
              <div className="p-4">
                <label htmlFor="fileName" className="block text-sm font-medium text-gray-700 mb-1">
                  Novo nome:
                </label>
                <input
                  type="text"
                  id="fileName"
                  value={newFileName}
                  onChange={(e) => setNewFileName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#4b7bb5] focus:border-[#4b7bb5]"
                  autoFocus
                />
                {renameError && <p className="mt-2 text-sm text-red-600">{renameError}</p>}
              </div>
              <div className="p-4 bg-gray-50 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowRenameModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isRenaming}
                  className="px-4 py-2 bg-[#4b7bb5] border border-transparent rounded-md text-sm font-medium text-white hover:bg-[#3d649e] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#4b7bb5] disabled:opacity-50"
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

      {/* Diálogo de aviso de renomeação */}
      {showRenameWarning && (
        <RenameWarningDialog
          isOpen={showRenameWarning}
          onClose={() => setShowRenameWarning(false)}
          onConfirm={executeRename}
          itemName={file.name}
          isFolder={file.type === "folder"}
        />
      )}

      {/* Diálogo de compartilhamento */}
      {showShareDialog && (
        <ShareLinkDialog
          isOpen={showShareDialog}
          onClose={() => setShowShareDialog(false)}
          fileUrl={file.url || `${window.location.origin}/shared/${encodeURIComponent(file.path)}`}
          fileName={file.name}
        />
      )}

      {/* Diálogo de confirmação de exclusão */}
      {showDeleteConfirmation && (
        <DeleteConfirmationDialog
          isOpen={showDeleteConfirmation}
          onClose={() => setShowDeleteConfirmation(false)}
          onConfirm={confirmDelete}
          itemName={file.name}
          isFolder={file.type === "folder"}
        />
      )}

      {/* Toast de notificação */}
      {toast.visible && (
        <ToastNotification
          message={toast.message}
          type={toast.type}
          onClose={() => setToast((prev) => ({ ...prev, visible: false }))}
        />
      )}
      {/* Preview de documento */}
      {showDocumentPreview && (
        <DocumentPreview
          fileUrl={file.url || ""}
          fileName={file.name}
          fileType={file.fileType || ""}
          onClose={() => setShowDocumentPreview(false)}
        />
      )}
    </>
  )
}
