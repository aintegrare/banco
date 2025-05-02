"use client"

import { useState, useEffect } from "react"
import { FileText, ImageIcon, Film, Music, Archive, FileIcon } from "lucide-react"

interface StorageData {
  total: number
  used: number
  available: number
  fileTypes: {
    documents: number
    images: number
    videos: number
    audio: number
    archives: number
    others: number
  }
}

export function StorageStats() {
  const [storageData, setStorageData] = useState<StorageData>({
    total: 10 * 1024 * 1024 * 1024, // 10GB
    used: 3.7 * 1024 * 1024 * 1024, // 3.7GB
    available: 6.3 * 1024 * 1024 * 1024, // 6.3GB
    fileTypes: {
      documents: 1.2 * 1024 * 1024 * 1024, // 1.2GB
      images: 1.5 * 1024 * 1024 * 1024, // 1.5GB
      videos: 0.5 * 1024 * 1024 * 1024, // 0.5GB
      audio: 0.2 * 1024 * 1024 * 1024, // 0.2GB
      archives: 0.1 * 1024 * 1024 * 1024, // 0.1GB
      others: 0.2 * 1024 * 1024 * 1024, // 0.2GB
    },
  })
  const [isLoading, setIsLoading] = useState(false)

  // Em uma implementação real, você buscaria esses dados da API
  useEffect(() => {
    // fetchStorageStats()
  }, [])

  const fetchStorageStats = async () => {
    setIsLoading(true)
    try {
      // Chamada à API para buscar estatísticas de armazenamento
      const response = await fetch("/api/storage-stats")
      const data = await response.json()
      setStorageData(data)
    } catch (error) {
      console.error("Erro ao buscar estatísticas de armazenamento:", error)
    } finally {
      setIsLoading(false)
    }
  }

  // Função para formatar bytes em unidades legíveis
  const formatBytes = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"

    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))

    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  // Calcular porcentagem de uso
  const usagePercentage = (storageData.used / storageData.total) * 100

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h2 className="text-xl font-bold text-[#4072b0] mb-4">Armazenamento</h2>

      <div className="mb-6">
        <div className="flex justify-between mb-1">
          <span className="text-sm font-medium text-gray-700">
            {formatBytes(storageData.used)} de {formatBytes(storageData.total)} usado
          </span>
          <span className="text-sm font-medium text-gray-700">{usagePercentage.toFixed(1)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div
            className={`h-2.5 rounded-full ${
              usagePercentage > 90 ? "bg-red-500" : usagePercentage > 70 ? "bg-yellow-500" : "bg-[#4b7bb5]"
            }`}
            style={{ width: `${usagePercentage}%` }}
          ></div>
        </div>
        <p className="mt-1 text-xs text-gray-500">{formatBytes(storageData.available)} disponível</p>
      </div>

      <h3 className="text-sm font-medium text-gray-700 mb-3">Uso por tipo de arquivo</h3>
      <div className="space-y-3">
        <div className="flex items-center">
          <FileText className="h-5 w-5 text-blue-500 mr-3" />
          <div className="flex-1">
            <div className="flex justify-between mb-1">
              <span className="text-sm text-gray-600">Documentos</span>
              <span className="text-sm text-gray-600">{formatBytes(storageData.fileTypes.documents)}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-1.5">
              <div
                className="h-1.5 rounded-full bg-blue-500"
                style={{ width: `${(storageData.fileTypes.documents / storageData.used) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>

        <div className="flex items-center">
          <ImageIcon className="h-5 w-5 text-green-500 mr-3" />
          <div className="flex-1">
            <div className="flex justify-between mb-1">
              <span className="text-sm text-gray-600">Imagens</span>
              <span className="text-sm text-gray-600">{formatBytes(storageData.fileTypes.images)}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-1.5">
              <div
                className="h-1.5 rounded-full bg-green-500"
                style={{ width: `${(storageData.fileTypes.images / storageData.used) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>

        <div className="flex items-center">
          <Film className="h-5 w-5 text-purple-500 mr-3" />
          <div className="flex-1">
            <div className="flex justify-between mb-1">
              <span className="text-sm text-gray-600">Vídeos</span>
              <span className="text-sm text-gray-600">{formatBytes(storageData.fileTypes.videos)}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-1.5">
              <div
                className="h-1.5 rounded-full bg-purple-500"
                style={{ width: `${(storageData.fileTypes.videos / storageData.used) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>

        <div className="flex items-center">
          <Music className="h-5 w-5 text-red-500 mr-3" />
          <div className="flex-1">
            <div className="flex justify-between mb-1">
              <span className="text-sm text-gray-600">Áudio</span>
              <span className="text-sm text-gray-600">{formatBytes(storageData.fileTypes.audio)}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-1.5">
              <div
                className="h-1.5 rounded-full bg-red-500"
                style={{ width: `${(storageData.fileTypes.audio / storageData.used) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>

        <div className="flex items-center">
          <Archive className="h-5 w-5 text-amber-500 mr-3" />
          <div className="flex-1">
            <div className="flex justify-between mb-1">
              <span className="text-sm text-gray-600">Arquivos compactados</span>
              <span className="text-sm text-gray-600">{formatBytes(storageData.fileTypes.archives)}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-1.5">
              <div
                className="h-1.5 rounded-full bg-amber-500"
                style={{ width: `${(storageData.fileTypes.archives / storageData.used) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>

        <div className="flex items-center">
          <FileIcon className="h-5 w-5 text-gray-500 mr-3" />
          <div className="flex-1">
            <div className="flex justify-between mb-1">
              <span className="text-sm text-gray-600">Outros</span>
              <span className="text-sm text-gray-600">{formatBytes(storageData.fileTypes.others)}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-1.5">
              <div
                className="h-1.5 rounded-full bg-gray-500"
                style={{ width: `${(storageData.fileTypes.others / storageData.used) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
