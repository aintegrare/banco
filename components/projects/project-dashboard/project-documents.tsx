"use client"

import { useState } from "react"
import { File, FileText, FileSpreadsheet, FileIcon as FilePresentation, Upload, Download, Trash2 } from "lucide-react"

interface Document {
  id: string
  name: string
  type: string
  size: string
  uploadedBy: string
  uploadedAt: string
}

interface ProjectDocumentsProps {
  documents: Document[]
}

export function ProjectDocuments({ documents }: ProjectDocumentsProps) {
  const [showUpload, setShowUpload] = useState(false)

  const getFileIcon = (type: string) => {
    switch (type) {
      case "pdf":
        return <FileText size={20} className="text-red-500" />
      case "excel":
        return <FileSpreadsheet size={20} className="text-green-500" />
      case "powerpoint":
        return <FilePresentation size={20} className="text-orange-500" />
      case "word":
        return <FileText size={20} className="text-blue-500" />
      default:
        return <File size={20} className="text-gray-500" />
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-medium text-gray-800">Documentos</h2>
        <button
          onClick={() => setShowUpload(!showUpload)}
          className="text-[#4b7bb5] hover:text-[#3d649e] text-sm flex items-center"
        >
          <Upload size={16} className="mr-1" />
          Upload
        </button>
      </div>

      {showUpload && (
        <div className="mb-4 p-4 border border-dashed border-gray-300 rounded-lg bg-gray-50 text-center">
          <Upload size={24} className="mx-auto text-gray-400 mb-2" />
          <p className="text-sm text-gray-600 mb-2">Arraste arquivos aqui ou clique para selecionar</p>
          <input type="file" className="hidden" id="file-upload" />
          <label
            htmlFor="file-upload"
            className="bg-[#4b7bb5] text-white px-4 py-2 rounded-md hover:bg-[#3d649e] cursor-pointer text-sm inline-block"
          >
            Selecionar arquivo
          </label>
        </div>
      )}

      <div className="space-y-2">
        {documents.length > 0 ? (
          documents.map((doc) => (
            <div key={doc.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg">
              <div className="flex items-center">
                {getFileIcon(doc.type)}
                <div className="ml-3">
                  <p className="font-medium text-gray-800">{doc.name}</p>
                  <p className="text-xs text-gray-500">
                    {doc.size} • Enviado por {doc.uploadedBy} em {formatDate(doc.uploadedAt)}
                  </p>
                </div>
              </div>
              <div className="flex space-x-2">
                <button className="text-gray-400 hover:text-gray-600">
                  <Download size={16} />
                </button>
                <button className="text-gray-400 hover:text-red-500">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-6 text-gray-500">
            <p>Nenhum documento encontrado</p>
            <p className="text-sm mt-1">Faça upload de documentos para este projeto</p>
          </div>
        )}
      </div>
    </div>
  )
}
