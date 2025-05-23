"use client"

import { useState, useRef } from "react"
import { FileUploader } from "./file-uploader"
import FileList from "./file-list"

export default function FileExplorerClient() {
  const fileListRef = useRef<any>(null)
  const [showUploader, setShowUploader] = useState(false)

  const handleUploadSuccess = () => {
    // Recarregar a lista de arquivos
    if (fileListRef.current && fileListRef.current.fetchFiles) {
      fileListRef.current.fetchFiles()
    }
    setShowUploader(false)
  }

  return (
    <div>
      {/* Header simplificado com upload */}
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gerenciador de Arquivos</h1>
          <p className="text-gray-600 mt-1">Gerencie seus arquivos e pastas</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowUploader(!showUploader)}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              showUploader ? "bg-red-500 text-white hover:bg-red-600" : "bg-[#4b7bb5] text-white hover:bg-[#3d649e]"
            }`}
          >
            {showUploader ? "✕ Fechar Upload" : "📤 Upload de Arquivos"}
          </button>
        </div>
      </div>

      {/* Upload Section */}
      {showUploader && (
        <div className="mb-6">
          <FileUploader onUploadSuccess={handleUploadSuccess} />
        </div>
      )}

      <FileList ref={fileListRef} />
    </div>
  )
}
