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

  return (
    <div
      className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow cursor-pointer relative group"
      onClick={handleClick}
    >
      <div className="p-4 flex flex-col items-center">
        {getFileIcon()}
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
              <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center">
                <Eye size={16} className="mr-2" />
                <span>Visualizar</span>
              </button>
              <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center">
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
  )
}
