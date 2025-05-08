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
  Download,
  Trash2,
  Share2,
  Pencil,
  Eye,
  X,
  ExternalLink,
  Loader2,
} from "lucide-react"
import { useState } from "react"
import { RenameWarningDialog } from "./rename-warning-dialog"
import { ShareLinkDialog } from "./share-link-dialog"
import { ToastNotification } from "./toast-notification"
import { DeleteConfirmationDialog } from "./delete-confirmation-dialog"

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

interface FileCardProps {
  file: FileItem
  onFolderClick: () => void
  onDelete: () => void
  onRename?: (oldPath: string, newName: string) => void
}

export function FileCard({ file, onFolderClick, onDelete, onRename }: FileCardProps) {
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
  // Adicionar estado para o diálogo de confirmação de exclusão
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false)

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

  const handleClick = () => {
    if (file.type === "folder") {
      onFolderClick()
    } else {
      // Para imagens, mostrar preview
      if (isImage()) {
        setShowPreview(true)
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

  // Função para compartilhar arquivo ou pasta
  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation()
    setShowMenu(false)

    try {
      // Usar a API para gerar um link de compartilhamento
      const response = await fetch("/api/files/share", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ filePath: file.path }),
      })

      if (!response.ok) {
        throw new Error("Erro ao gerar link de compartilhamento")
      }

      const data = await response.json()

      // Se for um arquivo, já temos a URL direta
      if (file.type === "file" && file.url) {
        setShowShareDialog(true)
      } else {
        // Para pastas, usar a URL pública gerada pela API
        // Converter para URL de visualização pública
        const publicUrl = `${window.location.origin}/shared/${encodeURIComponent(file.path)}`
        copyToClipboard(publicUrl)
      }
    } catch (error) {
      console.error("Erro ao compartilhar:", error)
      setToast({
        visible: true,
        message: "Erro ao gerar link de compartilhamento",
        type: "error",
      })
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

  return (
    <>
      <div
        className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-all cursor-pointer relative group"
        onClick={handleClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="p-4 flex flex-col items-center">
          {/* Mostrar thumbnail para imagens */}
          {isImage() && file.url ? (
            <div className="w-full h-32 mb-2 overflow-hidden rounded-md bg-gray-50 flex items-center justify-center">
              <img
                src={file.url || "/placeholder.svg"}
                alt={file.name}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                onError={(e) => {
                  // Fallback para ícone se a imagem falhar
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
            </div>
          ) : (
            <div className="w-16 h-16 flex items-center justify-center bg-gray-50 rounded-full mb-3 group-hover:bg-[#f0f4f9] transition-colors">
              {getFileIcon()}
            </div>
          )}
          <h3 className="mt-2 text-sm font-medium text-gray-700 text-center truncate w-full group-hover:text-[#4b7bb5] transition-colors">
            {file.name}
          </h3>
          <p className="text-xs text-gray-500 mt-1">
            {file.type === "folder" ? "Pasta" : file.size ? formatBytes(file.size) : ""}
          </p>
          {file.project && (
            <span className="mt-2 px-2 py-0.5 bg-blue-100 text-blue-800 text-xs rounded-full">{file.project}</span>
          )}
        </div>

        {/* Overlay de ações para hover */}
        {isHovered && (
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
                  onClick={(e) => {
                    e.stopPropagation()
                    setShowShareDialog(true)
                  }}
                  className="p-2 bg-white rounded-full text-gray-700 hover:text-purple-600 transition-colors"
                  title="Compartilhar"
                >
                  <Share2 size={18} />
                </button>
              </>
            )}
            {/* Remover o botão de exclusão do overlay para evitar exclusões acidentais */}
          </div>
        )}

        {/* Menu button */}
        <button
          className="absolute top-2 right-2 p-1.5 rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity bg-white shadow-sm"
          onClick={toggleMenu}
        >
          <MoreVertical size={16} />
        </button>

        {/* Dropdown menu */}
        {showMenu && (
          <div
            className="absolute top-10 right-2 bg-white rounded-md shadow-lg z-10 border border-gray-200 py-1 w-40 animate-fadeIn"
            onClick={(e) => e.stopPropagation()}
          >
            <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center">
              <Star size={16} className="mr-2 text-amber-400" />
              <span>Favoritar</span>
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
                setNewFileName(file.name)
                setRenameError(null)
                setShowRenameModal(true)
              }}
            >
              <Pencil size={16} className="mr-2 text-orange-500" />
              <span>Renomear</span>
            </button>
            <div className="border-t border-gray-100 my-1"></div>
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
                <button
                  onClick={() => setShowShareDialog(true)}
                  className="flex items-center px-3 py-1.5 bg-[#4b7bb5] text-white rounded-md hover:bg-[#3d649e] transition-colors"
                >
                  <Share2 className="h-4 w-4 mr-1.5" />
                  <span>Compartilhar</span>
                </button>
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
    </>
  )
}
