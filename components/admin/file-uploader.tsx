"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Upload, File, Loader2, X, CheckCircle, AlertTriangle } from "lucide-react"

export function FileUploader() {
  const [file, setFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [processingStatus, setProcessingStatus] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<any | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
      setError(null)
      setSuccess(null)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0])
      setError(null)
      setSuccess(null)
    }
  }

  const clearFile = () => {
    setFile(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleUpload = async () => {
    if (!file) return

    setIsUploading(true)
    setUploadProgress(0)
    setProcessingStatus(null)
    setError(null)
    setSuccess(null)

    try {
      // Simular progresso de upload
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          const newProgress = prev + 5
          return newProgress >= 90 ? 90 : newProgress
        })
      }, 300)

      const formData = new FormData()
      formData.append("file", file)

      setProcessingStatus("Enviando arquivo...")

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      clearInterval(progressInterval)
      setUploadProgress(100)
      setProcessingStatus("Processando documento...")

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || data.error || "Erro ao fazer upload")
      }

      setProcessingStatus("Indexando conteúdo...")
      await new Promise((resolve) => setTimeout(resolve, 1000))

      setProcessingStatus("Concluído!")
      setSuccess(data)
      clearFile()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro desconhecido")
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h2 className="text-xl font-bold text-[#4072b0] mb-4">Upload de Documentos</h2>

      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center ${
          file ? "border-green-400 bg-green-50" : "border-gray-300 hover:border-[#4b7bb5]"
        }`}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <input
          type="file"
          id="file-upload"
          className="hidden"
          onChange={handleFileChange}
          accept=".pdf,.doc,.docx,.txt"
          ref={fileInputRef}
        />

        {!file ? (
          <label htmlFor="file-upload" className="cursor-pointer">
            <div className="flex flex-col items-center">
              <Upload className="h-12 w-12 text-gray-400 mb-2" />
              <p className="text-gray-600 mb-1">Arraste e solte um arquivo aqui ou clique para selecionar</p>
              <p className="text-xs text-gray-500">PDF, DOC, DOCX, TXT (máx. 10MB)</p>
            </div>
          </label>
        ) : (
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <File className="h-8 w-8 text-[#4b7bb5] mr-3" />
              <div className="text-left">
                <p className="font-medium text-gray-800">{file.name}</p>
                <p className="text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
              </div>
            </div>
            <button onClick={clearFile} className="text-gray-500 hover:text-red-500" disabled={isUploading}>
              <X className="h-5 w-5" />
            </button>
          </div>
        )}
      </div>

      {file && (
        <button
          onClick={handleUpload}
          disabled={isUploading}
          className="mt-4 w-full flex items-center justify-center space-x-2 px-4 py-2 bg-[#4b7bb5] text-white rounded-md hover:bg-[#3d649e] focus:outline-none focus:ring-2 focus:ring-[#4b7bb5] focus:ring-offset-2 disabled:opacity-50"
        >
          {isUploading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Enviando... {uploadProgress}%</span>
            </>
          ) : (
            <>
              <Upload className="h-4 w-4" />
              <span>Enviar Arquivo</span>
            </>
          )}
        </button>
      )}

      {isUploading && (
        <div className="mt-4">
          <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
            <div className="bg-[#4b7bb5] h-2.5 rounded-full" style={{ width: `${uploadProgress}%` }}></div>
          </div>
          {processingStatus && (
            <div className="flex items-center text-sm text-gray-600">
              <Loader2 className="h-3 w-3 animate-spin mr-2" />
              <span>{processingStatus}</span>
            </div>
          )}
        </div>
      )}

      {error && (
        <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-md flex items-start">
          <AlertTriangle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium">Erro no upload:</p>
            <p className="mt-1">{error}</p>
          </div>
        </div>
      )}

      {success && (
        <div className="mt-4 p-3 bg-green-50 text-green-700 rounded-md flex items-start">
          <CheckCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium">Upload concluído com sucesso!</p>
            <p className="mt-1">
              Arquivo: {success.fileName}
              <br />
              {success.chunksProcessed} fragmentos processados e indexados.
            </p>
            {success.usedFallbackEmbeddings && (
              <p className="mt-1 text-amber-600 flex items-center">
                <AlertTriangle className="h-4 w-4 mr-1" />
                Usando embeddings locais (modo de fallback)
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
