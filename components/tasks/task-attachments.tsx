"use client"

import { useState } from "react"
import { Upload, File, FileText, ImageIcon, Film, Music, Archive, Download, Trash2, Plus } from "lucide-react"

// Dados de exemplo para anexos
const SAMPLE_ATTACHMENTS = [
  {
    id: "attachment-1",
    taskId: "task-1",
    name: "referencias_instagram.pdf",
    size: 2.5 * 1024 * 1024, // 2.5MB
    type: "pdf",
    url: "#",
    uploadedBy: "Ana Silva",
    uploadedAt: "2023-10-17T14:30:00Z",
  },
  {
    id: "attachment-2",
    taskId: "task-1",
    name: "mockup_post_1.jpg",
    size: 1.8 * 1024 * 1024, // 1.8MB
    type: "jpg",
    url: "#",
    uploadedBy: "Ana Silva",
    uploadedAt: "2023-10-18T09:15:00Z",
  },
  {
    id: "attachment-3",
    taskId: "task-2",
    name: "correcoes_textos.docx",
    size: 0.5 * 1024 * 1024, // 0.5MB
    type: "docx",
    url: "#",
    uploadedBy: "Carlos Mendes",
    uploadedAt: "2023-10-16T11:20:00Z",
  },
]

interface TaskAttachmentsProps {
  taskId: string
  projectId: string
}

export function TaskAttachments({ taskId, projectId }: TaskAttachmentsProps) {
  const [attachments, setAttachments] = useState(
    SAMPLE_ATTACHMENTS.filter((attachment) => attachment.taskId === taskId),
  )
  const [isUploading, setIsUploading] = useState(false)

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
  }

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const getFileIcon = (fileType: string) => {
    switch (fileType) {
      case "pdf":
        return <FileText size={24} className="text-red-500" />
      case "jpg":
      case "jpeg":
      case "png":
      case "gif":
        return <ImageIcon size={24} className="text-green-500" />
      case "mp4":
      case "avi":
      case "mov":
        return <Film size={24} className="text-purple-500" />
      case "mp3":
      case "wav":
        return <Music size={24} className="text-blue-500" />
      case "zip":
      case "rar":
        return <Archive size={24} className="text-yellow-500" />
      case "doc":
      case "docx":
        return <FileText size={24} className="text-blue-500" />
      default:
        return <File size={24} className="text-gray-500" />
    }
  }

  const handleUpload = () => {
    // Aqui você implementaria a lógica de upload real
    // Por enquanto, vamos simular
    setIsUploading(true)

    setTimeout(() => {
      const newAttachment = {
        id: `attachment-${Date.now()}`,
        taskId,
        name: "novo_arquivo.pdf",
        size: 1.2 * 1024 * 1024, // 1.2MB
        type: "pdf",
        url: "#",
        uploadedBy: "Você",
        uploadedAt: new Date().toISOString(),
      }

      setAttachments([...attachments, newAttachment])
      setIsUploading(false)
    }, 1500)
  }

  const handleDelete = (id: string) => {
    if (confirm("Tem certeza que deseja excluir este anexo?")) {
      setAttachments(attachments.filter((attachment) => attachment.id !== id))
      // Aqui você faria uma chamada à API para excluir o anexo
      console.log("Anexo excluído:", id)
    }
  }

  return (
    <div>
      <div className="mb-4">
        <button
          onClick={handleUpload}
          disabled={isUploading}
          className="flex items-center space-x-2 px-4 py-2 bg-[#4b7bb5] text-white rounded-md hover:bg-[#3d649e] transition-colors disabled:opacity-50"
        >
          {isUploading ? (
            <>
              <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
              <span>Enviando...</span>
            </>
          ) : (
            <>
              <Plus size={16} />
              <span>Adicionar Anexo</span>
            </>
          )}
        </button>
        <p className="text-xs text-gray-500 mt-1">
          Os anexos são vinculados ao projeto {projectId} e podem ser acessados por todos os membros do projeto.
        </p>
      </div>

      {attachments.length === 0 ? (
        <div className="text-center py-6 text-gray-500 border-2 border-dashed border-gray-300 rounded-lg">
          <Upload size={32} className="mx-auto text-gray-400 mb-2" />
          <p>Nenhum anexo ainda. Adicione arquivos à tarefa.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {attachments.map((attachment) => (
            <div
              key={attachment.id}
              className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50"
            >
              <div className="mr-3">{getFileIcon(attachment.type)}</div>
              <div className="flex-grow min-w-0">
                <div className="flex justify-between items-center mb-1">
                  <p className="text-sm font-medium text-gray-800 truncate">{attachment.name}</p>
                  <span className="text-xs text-gray-500">{formatBytes(attachment.size)}</span>
                </div>
                <div className="flex items-center text-xs text-gray-500">
                  <span>
                    Enviado por {attachment.uploadedBy} em {formatDate(attachment.uploadedAt)}
                  </span>
                </div>
              </div>
              <div className="flex items-center ml-4 space-x-2">
                <button className="text-gray-500 hover:text-[#4b7bb5]">
                  <Download size={18} />
                </button>
                <button onClick={() => handleDelete(attachment.id)} className="text-gray-500 hover:text-red-500">
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
