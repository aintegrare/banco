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
} from "lucide-react"
import { useState } from "react"

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
}

export function FileCard({ file, onFolderClick, onDelete }: FileCardProps) {
  const [showMenu, setShowMenu] = useState(false)
  const [showPreview, setShowPreview] = useState(false)

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

  return (
    <>
      <div
        className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow cursor-pointer relative group"
        onClick={handleClick}
      >
        <div className="p-4 flex flex-col items-center">
          {/* Mostrar thumbnail para imagens */}
          {isImage() && file.url ? (
            <div className="w-full h-32 mb-2 overflow-hidden rounded-md">
              <img
                src={file.url || "/placeholder.svg"}
                alt={file.name}
                className="w-full h-full object-cover"
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
            getFileIcon()
          )}
          <h3 className="mt-2 text-sm font-medium text-gray-700 text-center truncate w-full">{file.name}</h3>
          <p className="text-xs text-gray-500 mt-1">
            {file.type === "folder" ? "Pasta" : file.size ? formatBytes(file.size) : ""}
          </p>
          {file.project && (
            <span className="mt-1 px-2 py-0.5 bg-blue-100 text-blue-800 text-xs rounded-full">{file.project}</span>
          )}
        </div>

        {/* Menu button */}
        <button
          className="absolute top-2 right-2 p-1 rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={toggleMenu}
        >
          <MoreVertical size={16} />
        </button>

        {/* Dropdown menu */}
        {showMenu && (
          <div
            className="absolute top-8 right-2 bg-white rounded-md shadow-lg z-10 border border-gray-200 py-1 w-40"
            onClick={(e) => e.stopPropagation()}
          >
            <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center">
              <Star size={16} className="mr-2" />
              <span>Favoritar</span>
            </button>
            {file.type === "file" && (
              <>
                <button
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
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
                  <Eye size={16} className="mr-2" />
                  <span>Visualizar</span>
                </button>
                <button
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
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
                  <Download size={16} className="mr-2" />
                  <span>Download</span>
                </button>
              </>
            )}
            <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center">
              <Share2 size={16} className="mr-2" />
              <span>Compartilhar</span>
            </button>
            <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center">
              <Pencil size={16} className="mr-2" />
              <span>Renomear</span>
            </button>
            <button
              className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 flex items-center"
              onClick={(e) => {
                e.stopPropagation()
                setShowMenu(false)
                onDelete()
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            <div className="p-4 border-b flex justify-between items-center">
              <h3 className="font-medium">{file.name}</h3>
              <button onClick={() => setShowPreview(false)} className="text-gray-500 hover:text-gray-700">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="flex-1 overflow-auto p-4 flex items-center justify-center">
              <img
                src={file.url || "/placeholder.svg"}
                alt={file.name}
                className="max-w-full max-h-[70vh] object-contain"
              />
            </div>
            <div className="p-4 border-t flex justify-between">
              <div className="text-sm text-gray-500">
                {file.size ? formatBytes(file.size) : ""} • {file.modified}
              </div>
              <a href={file.url} download className="text-[#4b7bb5] hover:text-[#3d649e] flex items-center">
                <Download className="h-4 w-4 mr-1" />
                <span>Download</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
