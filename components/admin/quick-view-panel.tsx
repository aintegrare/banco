"use client"

import { useState, useEffect } from "react"
import {
  X,
  Download,
  Share2,
  Star,
  StarOff,
  Pencil,
  Trash2,
  Calendar,
  FileText,
  ImageIcon,
  Film,
  Music,
  Archive,
  File,
  ExternalLink,
  Folder,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ShareLinkDialog } from "./share-link-dialog"

interface FileDetails {
  id: string
  name: string
  type: "folder" | "file"
  size?: number
  modified: string
  created?: string
  path: string
  url?: string
  fileType?: string
  isFavorite?: boolean
  metadata?: Record<string, any>
}

interface QuickViewPanelProps {
  file: FileDetails | null
  onClose: () => void
  onDelete: (file: FileDetails) => void
  onRename: (file: FileDetails) => void
  onToggleFavorite: (file: FileDetails) => void
  onShare: (file: FileDetails) => void
}

export function QuickViewPanel({ file, onClose, onDelete, onRename, onToggleFavorite, onShare }: QuickViewPanelProps) {
  const [activeTab, setActiveTab] = useState<string>("preview")
  const [showShareDialog, setShowShareDialog] = useState(false)

  // Resetar a aba ativa quando o arquivo muda
  useEffect(() => {
    setActiveTab("preview")
  }, [file?.id])

  if (!file) return null

  // Formatar bytes em unidades legíveis
  const formatBytes = (bytes = 0) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  // Formatar data
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

  // Verificar se é uma imagem
  const isImage = () => {
    const imageTypes = ["jpg", "jpeg", "png", "gif", "webp", "svg"]
    return file.type === "file" && imageTypes.includes(file.fileType?.toLowerCase() || "")
  }

  // Verificar se é um PDF
  const isPdf = () => {
    return file.type === "file" && file.fileType?.toLowerCase() === "pdf"
  }

  // Verificar se é um vídeo
  const isVideo = () => {
    const videoTypes = ["mp4", "webm", "ogg", "mov", "avi"]
    return file.type === "file" && videoTypes.includes(file.fileType?.toLowerCase() || "")
  }

  // Verificar se é um áudio
  const isAudio = () => {
    const audioTypes = ["mp3", "wav", "ogg", "m4a"]
    return file.type === "file" && audioTypes.includes(file.fileType?.toLowerCase() || "")
  }

  // Obter o ícone do arquivo
  const getFileIcon = () => {
    if (file.type === "folder") return <Folder className="h-6 w-6 text-[#4b7bb5]" />

    const fileType = file.fileType?.toLowerCase() || ""

    if (isImage()) return <ImageIcon className="h-6 w-6 text-blue-500" />
    if (isPdf()) return <FileText className="h-6 w-6 text-red-500" />
    if (isVideo()) return <Film className="h-6 w-6 text-purple-500" />
    if (isAudio()) return <Music className="h-6 w-6 text-green-500" />

    const archiveTypes = ["zip", "rar", "7z", "tar", "gz"]
    if (archiveTypes.includes(fileType)) return <Archive className="h-6 w-6 text-amber-500" />

    return <File className="h-6 w-6 text-gray-500" />
  }

  // Renderizar a prévia do arquivo
  const renderPreview = () => {
    if (file.type === "folder") {
      return (
        <div className="flex flex-col items-center justify-center h-full">
          <Folder className="h-24 w-24 text-[#4b7bb5] mb-4" />
          <p className="text-gray-500">Pasta</p>
        </div>
      )
    }

    if (isImage() && file.url) {
      return (
        <div className="flex items-center justify-center h-full">
          <img
            src={file.url || "/placeholder.svg"}
            alt={file.name}
            className="max-w-full max-h-full object-contain"
            onError={(e) => {
              e.currentTarget.src = "/enerate a placeholder image indicating that an image is not available.png"
            }}
          />
        </div>
      )
    }

    if (isPdf() && file.url) {
      return (
        <div className="flex flex-col items-center justify-center h-full">
          <div className="bg-red-500 rounded-lg p-6 mb-4">
            <FileText className="h-16 w-16 text-white" />
          </div>
          <p className="text-gray-500 mb-4">Documento PDF</p>
          <Button onClick={() => window.open(file.url, "_blank")} className="flex items-center">
            <ExternalLink className="h-4 w-4 mr-2" />
            Abrir PDF
          </Button>
        </div>
      )
    }

    if (isVideo() && file.url) {
      return (
        <div className="flex flex-col items-center justify-center h-full">
          <video controls className="max-w-full max-h-[300px]" src={file.url}>
            Seu navegador não suporta a reprodução de vídeos.
          </video>
        </div>
      )
    }

    if (isAudio() && file.url) {
      return (
        <div className="flex flex-col items-center justify-center h-full">
          <div className="bg-green-500 rounded-full p-6 mb-4">
            <Music className="h-16 w-16 text-white" />
          </div>
          <audio controls className="w-full max-w-md mt-4" src={file.url}>
            Seu navegador não suporta a reprodução de áudio.
          </audio>
        </div>
      )
    }

    // Fallback para outros tipos de arquivo
    return (
      <div className="flex flex-col items-center justify-center h-full">
        {getFileIcon()}
        <p className="text-gray-500 mt-4">{file.fileType ? file.fileType.toUpperCase() : "Arquivo"}</p>
        {file.url && (
          <Button onClick={() => window.open(file.url, "_blank")} className="mt-4 flex items-center">
            <ExternalLink className="h-4 w-4 mr-2" />
            Abrir arquivo
          </Button>
        )}
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-end">
      <div className="bg-white w-full max-w-md h-full flex flex-col shadow-xl animate-slideInRight">
        {/* Cabeçalho */}
        <div className="p-4 border-b flex items-center justify-between">
          <div className="flex items-center">
            {getFileIcon()}
            <h3 className="ml-2 font-medium truncate">{file.name}</h3>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Abas */}
        <Tabs defaultValue="preview" className="flex-1 flex flex-col" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="px-4 pt-2 border-b">
            <TabsTrigger value="preview">Prévia</TabsTrigger>
            <TabsTrigger value="details">Detalhes</TabsTrigger>
            {file.metadata && <TabsTrigger value="metadata">Metadados</TabsTrigger>}
          </TabsList>

          {/* Conteúdo da aba de prévia */}
          <TabsContent value="preview" className="flex-1 p-4 overflow-auto">
            <div className="h-full flex items-center justify-center bg-gray-50 rounded-lg border">
              {renderPreview()}
            </div>
          </TabsContent>

          {/* Conteúdo da aba de detalhes */}
          <TabsContent value="details" className="flex-1 p-4 overflow-auto">
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-1">Nome</h4>
                <p className="text-sm">{file.name}</p>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-1">Tipo</h4>
                <p className="text-sm">
                  {file.type === "folder"
                    ? "Pasta"
                    : file.fileType
                      ? `${file.fileType.toUpperCase()} (${file.type})`
                      : file.type}
                </p>
              </div>

              {file.size !== undefined && (
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-1">Tamanho</h4>
                  <p className="text-sm">{formatBytes(file.size)}</p>
                </div>
              )}

              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-1">Caminho</h4>
                <p className="text-sm break-all">{file.path}</p>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-1">Modificado em</h4>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1 text-gray-400" />
                  <p className="text-sm">{formatDate(file.modified)}</p>
                </div>
              </div>

              {file.created && (
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-1">Criado em</h4>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1 text-gray-400" />
                    <p className="text-sm">{formatDate(file.created)}</p>
                  </div>
                </div>
              )}

              {file.url && (
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-1">URL</h4>
                  <div className="flex items-center">
                    <p className="text-sm break-all text-blue-500 hover:underline">
                      <a href={file.url} target="_blank" rel="noopener noreferrer">
                        {file.url}
                      </a>
                    </p>
                  </div>
                </div>
              )}
            </div>
          </TabsContent>

          {/* Conteúdo da aba de metadados */}
          {file.metadata && (
            <TabsContent value="metadata" className="flex-1 p-4 overflow-auto">
              <div className="space-y-4">
                {Object.entries(file.metadata).map(([key, value]) => (
                  <div key={key}>
                    <h4 className="text-sm font-medium text-gray-500 mb-1 capitalize">{key.replace(/_/g, " ")}</h4>
                    <p className="text-sm break-all">
                      {typeof value === "object" ? JSON.stringify(value, null, 2) : String(value)}
                    </p>
                  </div>
                ))}
              </div>
            </TabsContent>
          )}
        </Tabs>

        {/* Barra de ações */}
        <div className="p-4 border-t bg-gray-50">
          <div className="flex justify-between">
            <div className="flex space-x-2">
              {file.url && file.type === "file" && (
                <Button variant="outline" size="icon" asChild title="Download">
                  <a href={file.url} download={file.name}>
                    <Download className="h-4 w-4" />
                  </a>
                </Button>
              )}

              <Button variant="outline" size="icon" onClick={() => onShare(file)} title="Compartilhar">
                <Share2 className="h-4 w-4" />
              </Button>

              <Button
                variant="outline"
                size="icon"
                onClick={() => onToggleFavorite(file)}
                title={file.isFavorite ? "Remover dos favoritos" : "Adicionar aos favoritos"}
              >
                {file.isFavorite ? <StarOff className="h-4 w-4" /> : <Star className="h-4 w-4" />}
              </Button>
            </div>

            <div className="flex space-x-2">
              <Button variant="outline" size="icon" onClick={() => onRename(file)} title="Renomear">
                <Pencil className="h-4 w-4" />
              </Button>

              <Button
                variant="outline"
                size="icon"
                onClick={() => onDelete(file)}
                className="text-red-500 hover:text-red-700 hover:bg-red-50"
                title="Excluir"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Diálogo de compartilhamento */}
      {showShareDialog && (
        <ShareLinkDialog
          isOpen={showShareDialog}
          onClose={() => setShowShareDialog(false)}
          fileUrl={file.url || `${window.location.origin}/shared/${encodeURIComponent(file.path)}`}
          fileName={file.name}
        />
      )}
    </div>
  )
}
