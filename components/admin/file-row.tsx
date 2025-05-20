"use client"

import { DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

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
  ExternalLink,
} from "lucide-react"
import { useState } from "react"
import { ShareLinkDialog } from "./share-link-dialog"
import { ToastNotification } from "./toast-notification"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
// Adicionar importação para o badge de tarefas
import { FolderTaskBadge } from "./folder-task-badge"

// Modificar a interface FileRowProps para incluir a contagem de tarefas
interface FileRowProps {
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
  onShare?: () => void
  onToggleFavorite?: () => void
  isSelected?: boolean
  onToggleSelect?: () => void
  showCheckbox?: boolean
  taskCount?: number
  overdueCount?: number
  onOpenTasks?: () => void
}

export function FileRow({
  file,
  onFolderClick,
  onDelete,
  onShare,
  onToggleFavorite,
  isSelected,
  onToggleSelect,
  showCheckbox,
  taskCount,
  overdueCount,
  onOpenTasks,
}: FileRowProps) {
  const [showMenu, setShowMenu] = useState(false)
  const [showShareDialog, setShowShareDialog] = useState(false)
  const [toast, setToast] = useState<{ visible: boolean; message: string; type: "success" | "error" }>({
    visible: false,
    message: "",
    type: "success",
  })

  // Função para formatar bytes em unidades legíveis
  const formatBytes = (bytes = 0) => {
    if (bytes === 0) return "0 Bytes"

    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))

    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  // Função para formatar data
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
  }

  // Determinar o ícone com base no tipo de arquivo
  const getFileIcon = () => {
    if (file.type === "folder") {
      return <Folder size={20} className="text-[#4b7bb5]" />
    }

    const fileType = file.fileType?.toLowerCase() || ""

    if (["jpg", "jpeg", "png", "gif", "webp"].includes(fileType)) {
      return <ImageIcon size={20} className="text-green-500" />
    } else if (["pdf"].includes(fileType)) {
      return <FileText size={20} className="text-red-500" />
    } else if (["mp4", "avi", "mov", "webm"].includes(fileType)) {
      return <Film size={20} className="text-purple-500" />
    } else if (["mp3", "wav", "ogg"].includes(fileType)) {
      return <Music size={20} className="text-blue-500" />
    } else if (["zip", "rar", "7z", "tar", "gz"].includes(fileType)) {
      return <Archive size={20} className="text-amber-500" />
    } else {
      return <FileIcon size={20} className="text-gray-500" />
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
      // Abrir arquivo
      if (file.url) {
        window.open(file.url, "_blank")
      }
    }
  }

  const toggleMenu = (e: React.MouseEvent) => {
    e.stopPropagation()
    setShowMenu(!showMenu)
  }

  // Função para compartilhar arquivo
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

  // Função para alternar favorito
  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation()
    setShowMenu(false)

    if (onToggleFavorite) {
      onToggleFavorite()
    }
  }

  return (
    <>
      <tr className={`hover:bg-gray-50 cursor-pointer ${isSelected ? "bg-blue-50" : ""}`} onClick={handleClick}>
        {showCheckbox && (
          <td className="px-3 py-4 whitespace-nowrap">
            <input
              type="checkbox"
              checked={isSelected}
              onChange={onToggleSelect}
              onClick={(e) => e.stopPropagation()}
              className="rounded border-gray-300 text-[#4b7bb5] focus:ring-[#4b7bb5]"
            />
          </td>
        )}
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="flex items-center">
            <div className="flex-shrink-0 relative">
              {getFileIcon()}
              {file.isFavorite && <Star className="absolute -top-1 -right-1 h-3 w-3 text-amber-500 fill-amber-500" />}
            </div>
            <div className="ml-4">
              <div className="text-sm font-medium text-gray-900">
                {file.name}
                {file.type === "folder" && taskCount && taskCount > 0 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      onOpenTasks?.()
                    }}
                    className="ml-1"
                  >
                    <FolderTaskBadge count={taskCount} overdueCount={overdueCount} />
                  </button>
                )}
              </div>
            </div>
          </div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="text-sm text-gray-500">{formatDate(file.modified)}</div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="text-sm text-gray-500">
            {file.type === "folder" ? "—" : file.size ? formatBytes(file.size) : "—"}
          </div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="text-sm text-gray-500">
            {file.type === "folder" ? "Pasta" : file.fileType?.toUpperCase() || "—"}
          </div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium relative">
          {/* Botões de ação rápida */}
          <div className="flex items-center justify-end space-x-1">
            {file.type === "file" && (
              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => {
                  e.stopPropagation()
                  window.open(file.url, "_blank")
                }}
                className="h-8 w-8"
                title="Abrir"
              >
                <ExternalLink size={16} className="text-blue-500" />
              </Button>
            )}
            {/* Botão de compartilhamento - AGORA DISPONÍVEL PARA TODOS OS TIPOS */}
            <Button variant="ghost" size="icon" onClick={handleShare} className="h-8 w-8" title="Compartilhar">
              <Share2 size={16} className="text-purple-500" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleToggleFavorite}
              className="h-8 w-8"
              title={file.isFavorite ? "Remover favorito" : "Favoritar"}
            >
              {file.isFavorite ? (
                <StarOff size={16} className="text-amber-500" />
              ) : (
                <Star size={16} className="text-amber-500" />
              )}
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8" title="Mais opções">
                  <MoreVertical size={16} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {file.type === "file" && (
                  <>
                    <DropdownMenuItem
                      onClick={(e) => {
                        e.stopPropagation()
                        window.open(file.url, "_blank")
                      }}
                    >
                      <Eye size={16} className="mr-2" />
                      <span>Visualizar</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <a href={file.url} download onClick={(e) => e.stopPropagation()}>
                        <Download size={16} className="mr-2" />
                        <span>Download</span>
                      </a>
                    </DropdownMenuItem>
                  </>
                )}
                <DropdownMenuItem onClick={handleShare}>
                  <Share2 size={16} className="mr-2" />
                  <span>Compartilhar</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleToggleFavorite}>
                  {file.isFavorite ? (
                    <>
                      <StarOff size={16} className="mr-2" />
                      <span>Remover favorito</span>
                    </>
                  ) : (
                    <>
                      <Star size={16} className="mr-2" />
                      <span>Favoritar</span>
                    </>
                  )}
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Pencil size={16} className="mr-2" />
                  <span>Renomear</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation()
                    onDelete()
                  }}
                  className="text-red-600"
                >
                  <Trash2 size={16} className="mr-2" />
                  <span>Excluir</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </td>
      </tr>

      {/* Diálogo de compartilhamento */}
      {showShareDialog && (
        <ShareLinkDialog
          isOpen={showShareDialog}
          onClose={() => setShowShareDialog(false)}
          fileUrl={file.url || `${window.location.origin}/shared/${encodeURIComponent(file.path)}`}
          fileName={file.name}
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
    </>
  )
}
