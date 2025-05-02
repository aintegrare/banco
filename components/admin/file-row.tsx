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

interface FileRowProps {
  file: FileItem
  onFolderClick: () => void
  onDelete: () => void
}

export function FileRow({ file, onFolderClick, onDelete }: FileRowProps) {
  const [showMenu, setShowMenu] = useState(false)

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
    <tr className="hover:bg-gray-50 cursor-pointer" onClick={handleClick}>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <div className="flex-shrink-0">{getFileIcon()}</div>
          <div className="ml-4">
            <div className="text-sm font-medium text-gray-900">{file.name}</div>
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
        {file.project ? (
          <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
            {file.project}
          </span>
        ) : (
          <span className="text-sm text-gray-500">—</span>
        )}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium relative">
        <button className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100" onClick={toggleMenu}>
          <MoreVertical size={16} />
        </button>

        {/* Dropdown menu */}
        {showMenu && (
          <div
            className="absolute top-10 right-4 bg-white rounded-md shadow-lg z-10 border border-gray-200 py-1 w-40"
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
      </td>
    </tr>
  )
}
