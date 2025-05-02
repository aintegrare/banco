"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Upload, File, Loader2, X, CheckCircle, AlertTriangle, ImageIcon } from "lucide-react"

interface FileUploaderProps {
  onUploadSuccess?: () => void
}

export function FileUploader({ onUploadSuccess }: FileUploaderProps) {
  const [file, setFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [processingStatus, setProcessingStatus] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<any | null>(null)
  const [detailedError, setDetailedError] = useState<string | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0]
      setFile(selectedFile)
      setError(null)
      setDetailedError(null)
      setSuccess(null)

      // Criar preview para imagens
      if (selectedFile.type.startsWith("image/")) {
        const reader = new FileReader()
        reader.onload = (e) => {
          setPreviewUrl(e.target?.result as string)
        }
        reader.readAsDataURL(selectedFile)
      } else {
        setPreviewUrl(null)
      }
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
      const selectedFile = e.dataTransfer.files[0]
      setFile(selectedFile)
      setError(null)
      setDetailedError(null)
      setSuccess(null)

      // Criar preview para imagens
      if (selectedFile.type.startsWith("image/")) {
        const reader = new FileReader()
        reader.onload = (e) => {
          setPreviewUrl(e.target?.result as string)
        }
        reader.readAsDataURL(selectedFile)
      } else {
        setPreviewUrl(null)
      }
    }
  }

  const clearFile = () => {
    setFile(null)
    setPreviewUrl(null)
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
    setDetailedError(null)
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
      console.log("FileUploader: Iniciando upload do arquivo", file.name)

      try {
        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        })

        clearInterval(progressInterval)
        setUploadProgress(100)

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}))
          console.error("FileUploader: Erro na resposta da API", errorData)
          throw new Error(
            errorData.message || errorData.error || `Erro no servidor: ${response.status} ${response.statusText}`,
          )
        }

        const data = await response.json()
        console.log("FileUploader: Resposta da API recebida", data)

        setProcessingStatus("Indexando conteúdo...")
        await new Promise((resolve) => setTimeout(resolve, 1000))

        setProcessingStatus("Concluído!")
        setSuccess(data)

        // Notificar o componente pai sobre o upload bem-sucedido
        if (onUploadSuccess) {
          onUploadSuccess()
        }

        clearFile()
      } catch (fetchError) {
        console.error("FileUploader: Erro na chamada fetch", fetchError)
        clearInterval(progressInterval)
        throw fetchError
      }
    } catch (err) {
      console.error("FileUploader: Erro geral no upload", err)
      setError(err instanceof Error ? err.message : "Erro desconhecido")
      setDetailedError(
        "Detalhes técnicos: " +
          (err instanceof Error ? `${err.name}: ${err.message}${err.stack ? `\n${err.stack}` : ""}` : String(err)),
      )
    } finally {
      setIsUploading(false)
    }
  }

  // Função para criar um arquivo de teste simples
  const handleTestUpload = async () => {
    setIsUploading(true)
    setUploadProgress(0)
    setProcessingStatus(null)
    setError(null)
    setDetailedError(null)
    setSuccess(null)

    try {
      setProcessingStatus("Testando conexão com Bunny.net...")
      console.log("FileUploader: Iniciando teste de conexão")

      const response = await fetch("/api/test-upload", {
        method: "POST",
      })

      setUploadProgress(100)

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        console.error("FileUploader: Erro no teste de conexão", errorData)
        throw new Error(
          errorData.message || errorData.error || `Erro no servidor: ${response.status} ${response.statusText}`,
        )
      }

      const data = await response.json()
      console.log("FileUploader: Teste de conexão bem-sucedido", data)

      setProcessingStatus("Teste concluído!")
      setSuccess({
        fileName: "teste.txt",
        fileUrl: data.fileUrl,
        chunksProcessed: 0,
      })

      // Notificar o componente pai sobre o upload bem-sucedido
      if (onUploadSuccess) {
        onUploadSuccess()
      }
    } catch (err) {
      console.error("FileUploader: Erro no teste de conexão", err)
      setError(err instanceof Error ? err.message : "Erro desconhecido")
      setDetailedError(
        "Detalhes técnicos: " +
          (err instanceof Error ? `${err.name}: ${err.message}${err.stack ? `\n${err.stack}` : ""}` : String(err)),
      )
    } finally {
      setIsUploading(false)
    }
  }

  // Determinar o tipo de arquivo aceito
  const getAcceptedFileTypes = () => {
    return ".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.gif,.webp"
  }

  // Verificar se o arquivo é uma imagem
  const isImage = file && file.type.startsWith("image/")

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h2 className="text-xl font-bold text-[#4072b0] mb-4">Upload de Arquivos</h2>

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
          accept={getAcceptedFileTypes()}
          ref={fileInputRef}
        />

        {!file ? (
          <label htmlFor="file-upload" className="cursor-pointer">
            <div className="flex flex-col items-center">
              <Upload className="h-12 w-12 text-gray-400 mb-2" />
              <p className="text-gray-600 mb-1">Arraste e solte um arquivo aqui ou clique para selecionar</p>
              <p className="text-xs text-gray-500">PDF, DOC, DOCX, TXT, JPG, PNG, GIF, WEBP (máx. 10MB)</p>
            </div>
          </label>
        ) : (
          <div className="flex flex-col items-center">
            <div className="flex items-center justify-between w-full mb-4">
              <div className="flex items-center">
                {isImage ? (
                  <ImageIcon className="h-8 w-8 text-[#4b7bb5] mr-3" />
                ) : (
                  <File className="h-8 w-8 text-[#4b7bb5] mr-3" />
                )}
                <div className="text-left">
                  <p className="font-medium text-gray-800">{file.name}</p>
                  <p className="text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                </div>
              </div>
              <button onClick={clearFile} className="text-gray-500 hover:text-red-500" disabled={isUploading}>
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Preview de imagem */}
            {previewUrl && (
              <div className="mt-2 mb-4">
                <img
                  src={previewUrl || "/placeholder.svg"}
                  alt="Preview"
                  className="max-h-48 max-w-full rounded-lg object-contain"
                />
              </div>
            )}
          </div>
        )}
      </div>

      <div className="flex space-x-2 mt-4">
        {file && (
          <button
            onClick={handleUpload}
            disabled={isUploading}
            className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-[#4b7bb5] text-white rounded-md hover:bg-[#3d649e] focus:outline-none focus:ring-2 focus:ring-[#4b7bb5] focus:ring-offset-2 disabled:opacity-50"
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

        <button
          onClick={handleTestUpload}
          disabled={isUploading}
          className="px-4 py-2 border border-[#4b7bb5] text-[#4b7bb5] rounded-md hover:bg-[#f0f4f9] focus:outline-none focus:ring-2 focus:ring-[#4b7bb5] focus:ring-offset-2 disabled:opacity-50"
        >
          Testar Conexão
        </button>
      </div>

      {error && error.includes("URL") && (
        <div className="mt-2">
          <button
            onClick={async () => {
              try {
                const response = await fetch("/api/test-bunny-connection")
                const data = await response.json()
                setDetailedError(
                  `Teste de conexão: ${data.success ? "Sucesso" : "Falha"}\n${JSON.stringify(data, null, 2)}`,
                )
              } catch (err) {
                setDetailedError(`Erro ao testar conexão: ${err instanceof Error ? err.message : String(err)}`)
              }
            }}
            className="text-xs text-[#4b7bb5] underline"
          >
            Verificar URL da região
          </button>
        </div>
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
            {detailedError && (
              <details className="mt-2">
                <summary className="text-sm cursor-pointer">Detalhes técnicos</summary>
                <pre className="mt-1 text-xs bg-red-100 p-2 rounded overflow-auto max-h-40">{detailedError}</pre>
              </details>
            )}
            <p className="mt-2 text-sm">
              Verifique se as variáveis de ambiente BUNNY_API_KEY, BUNNY_STORAGE_ZONE e BUNNY_STORAGE_REGION estão
              configuradas corretamente.
            </p>
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
              {success.chunksProcessed > 0 && `${success.chunksProcessed} fragmentos processados e indexados.`}
            </p>
            {success.fileUrl && (
              <p className="mt-1">
                <a
                  href={success.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  Visualizar arquivo
                </a>
              </p>
            )}
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
