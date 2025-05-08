"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Upload, File, Loader2, X, CheckCircle, AlertTriangle, ImageIcon, Trash2 } from "lucide-react"
// Adicionar importação do componente Select
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface FileUploaderProps {
  onUploadSuccess?: () => void
}

export function FileUploader({ onUploadSuccess }: FileUploaderProps) {
  const [files, setFiles] = useState<File[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState<{ [key: string]: number }>({})
  const [processingStatus, setProcessingStatus] = useState<string | null>(null)
  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  const [success, setSuccess] = useState<any[]>([])
  const [detailedError, setDetailedError] = useState<string | null>(null)
  const [previewUrls, setPreviewUrls] = useState<{ [key: string]: string }>({})
  const fileInputRef = useRef<HTMLInputElement>(null)
  // Adicionar estado para armazenar as pastas e a pasta selecionada
  const [folders, setFolders] = useState<string[]>([])
  const [selectedFolder, setSelectedFolder] = useState<string>("") // Pasta raiz por padrão

  // Adicionar função para buscar as pastas disponíveis
  const fetchFolders = async () => {
    try {
      const response = await fetch("/api/files/folders")
      if (response.ok) {
        const data = await response.json()
        setFolders(["", ...data.folders]) // Adiciona a pasta raiz como opção
      } else {
        console.error("Erro ao buscar pastas:", await response.text())
        // Definir pelo menos as pastas padrão
        setFolders(["", "documents", "images"])
      }
    } catch (error) {
      console.error("Erro ao buscar pastas:", error)
      // Definir pelo menos as pastas padrão em caso de erro
      setFolders(["", "documents", "images"])
    }
  }

  // Adicionar useEffect para carregar as pastas quando o componente montar
  useEffect(() => {
    fetchFolders()
  }, [])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFiles = Array.from(e.target.files)

      // Verificar tamanho dos arquivos (30MB = 30 * 1024 * 1024 bytes)
      const validFiles = selectedFiles.filter((file) => {
        if (file.size > 30 * 1024 * 1024) {
          setErrors((prev) => ({
            ...prev,
            [file.name]: "O arquivo excede o tamanho máximo de 30MB.",
          }))
          return false
        }
        return true
      })

      setFiles((prev) => [...prev, ...validFiles])
      setErrors({})
      setSuccess([])

      // Criar previews para imagens
      const newPreviewUrls: { [key: string]: string } = {}
      validFiles.forEach((file) => {
        if (file.type.startsWith("image/")) {
          const reader = new FileReader()
          reader.onload = (e) => {
            setPreviewUrls((prev) => ({
              ...prev,
              [file.name]: e.target?.result as string,
            }))
          }
          reader.readAsDataURL(file)
        }
      })
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFiles = Array.from(e.dataTransfer.files)

      // Verificar tamanho dos arquivos (30MB = 30 * 1024 * 1024 bytes)
      const validFiles = droppedFiles.filter((file) => {
        if (file.size > 30 * 1024 * 1024) {
          setErrors((prev) => ({
            ...prev,
            [file.name]: "O arquivo excede o tamanho máximo de 30MB.",
          }))
          return false
        }
        return true
      })

      setFiles((prev) => [...prev, ...validFiles])
      setErrors({})
      setSuccess([])

      // Criar previews para imagens
      validFiles.forEach((file) => {
        if (file.type.startsWith("image/")) {
          const reader = new FileReader()
          reader.onload = (e) => {
            setPreviewUrls((prev) => ({
              ...prev,
              [file.name]: e.target?.result as string,
            }))
          }
          reader.readAsDataURL(file)
        }
      })
    }
  }

  const removeFile = (index: number) => {
    setFiles((prev) => {
      const newFiles = [...prev]
      newFiles.splice(index, 1)
      return newFiles
    })
  }

  const clearFiles = () => {
    setFiles([])
    setPreviewUrls({})
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleUpload = async () => {
    if (files.length === 0) return

    setIsUploading(true)
    setUploadProgress({})
    setProcessingStatus("Preparando upload...")
    setErrors({})
    setDetailedError(null)
    setSuccess([])

    try {
      const results = []

      // Upload de cada arquivo individualmente
      for (let i = 0; i < files.length; i++) {
        const file = files[i]

        // Inicializar progresso para este arquivo
        setUploadProgress((prev) => ({
          ...prev,
          [file.name]: 0,
        }))

        setProcessingStatus(`Enviando arquivo ${i + 1} de ${files.length}: ${file.name}`)
        console.log(`FileUploader: Iniciando upload do arquivo ${i + 1}/${files.length}`, file.name)

        // Simular progresso de upload para este arquivo
        const progressInterval = setInterval(() => {
          setUploadProgress((prev) => {
            const newProgress = { ...prev }
            if (newProgress[file.name] < 90) {
              newProgress[file.name] = newProgress[file.name] + 5
            }
            return newProgress
          })
        }, 300)

        try {
          const formData = new FormData()
          formData.append("file", file)
          formData.append("folder", selectedFolder) // Adicionar a pasta selecionada

          const response = await fetch("/api/upload", {
            method: "POST",
            body: formData,
          })

          clearInterval(progressInterval)
          setUploadProgress((prev) => ({
            ...prev,
            [file.name]: 100,
          }))

          if (!response.ok) {
            const errorData = await response.json().catch(() => ({}))
            console.error(`FileUploader: Erro na resposta da API para ${file.name}`, errorData)
            setErrors((prev) => ({
              ...prev,
              [file.name]:
                errorData.message || errorData.error || `Erro no servidor: ${response.status} ${response.statusText}`,
            }))
            continue // Continuar com o próximo arquivo
          }

          const data = await response.json()
          console.log(`FileUploader: Resposta da API recebida para ${file.name}`, data)

          results.push(data)
          setSuccess((prev) => [...prev, data])
        } catch (fetchError) {
          console.error(`FileUploader: Erro na chamada fetch para ${file.name}`, fetchError)
          clearInterval(progressInterval)
          setErrors((prev) => ({
            ...prev,
            [file.name]: fetchError instanceof Error ? fetchError.message : "Erro desconhecido",
          }))
        }
      }

      setProcessingStatus("Upload concluído!")

      // Notificar o componente pai sobre o upload bem-sucedido
      if (onUploadSuccess && results.length > 0) {
        onUploadSuccess()
      }

      // Limpar arquivos apenas se todos foram enviados com sucesso
      if (Object.keys(errors).length === 0) {
        clearFiles()
      }
    } catch (err) {
      console.error("FileUploader: Erro geral no upload", err)
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
    setUploadProgress({})
    setProcessingStatus(null)
    setErrors({})
    setDetailedError(null)
    setSuccess([])

    try {
      setProcessingStatus("Testando conexão com Bunny.net...")
      console.log("FileUploader: Iniciando teste de conexão")

      const response = await fetch("/api/test-upload", {
        method: "POST",
      })

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
      setSuccess([
        {
          fileName: "teste.txt",
          fileUrl: data.fileUrl,
          chunksProcessed: 0,
        },
      ])

      // Notificar o componente pai sobre o upload bem-sucedido
      if (onUploadSuccess) {
        onUploadSuccess()
      }
    } catch (err) {
      console.error("FileUploader: Erro no teste de conexão", err)
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

  // Calcular o total de arquivos com erro
  const errorCount = Object.keys(errors).length

  // Calcular o total de arquivos com sucesso
  const successCount = success.length

  return (
    <div className="bg-white rounded-lg p-4">
      <h2 className="text-lg font-semibold text-[#4072b0] mb-3">Upload de Arquivos</h2>

      <div className="mb-4">
        <label htmlFor="folder-select" className="block text-sm font-medium text-gray-700 mb-1">
          Pasta de destino
        </label>
        <Select value={selectedFolder} onValueChange={setSelectedFolder}>
          <SelectTrigger id="folder-select" className="w-full">
            <SelectValue placeholder="Pasta raiz" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="root">Pasta raiz</SelectItem>
            {folders
              .filter((f) => f !== "")
              .map((folder) => (
                <SelectItem key={folder} value={folder}>
                  {folder}
                </SelectItem>
              ))}
          </SelectContent>
        </Select>
      </div>

      <div
        className={`border-2 border-dashed rounded-lg p-5 text-center ${
          files.length > 0 ? "border-green-400 bg-green-50" : "border-gray-300 hover:border-[#4b7bb5]"
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
          multiple
        />

        {files.length === 0 ? (
          <label htmlFor="file-upload" className="cursor-pointer">
            <div className="flex flex-col items-center">
              <Upload className="h-8 w-8 text-gray-400 mb-2" />
              <p className="text-gray-600 mb-1">Arraste e solte arquivos aqui ou clique para selecionar</p>
              <p className="text-xs text-gray-500">PDF, DOC, DOCX, TXT, JPG, PNG, GIF, WEBP (máx. 30MB por arquivo)</p>
            </div>
          </label>
        ) : (
          <div className="flex flex-col items-center w-full">
            <div className="w-full mb-4">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-medium text-gray-800">{files.length} arquivo(s) selecionado(s)</h3>
                <button
                  onClick={clearFiles}
                  className="text-gray-500 hover:text-red-500 flex items-center text-sm"
                  disabled={isUploading}
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Limpar todos
                </button>
              </div>

              <div className="max-h-60 overflow-y-auto border border-gray-200 rounded-md bg-white">
                {files.map((file, index) => {
                  const isImage = file.type.startsWith("image/")
                  const hasError = errors[file.name]
                  const uploadComplete = uploadProgress[file.name] === 100

                  return (
                    <div
                      key={`${file.name}-${index}`}
                      className={`flex items-center justify-between p-3 border-b last:border-b-0 ${
                        hasError ? "bg-red-50" : uploadComplete ? "bg-green-50" : ""
                      }`}
                    >
                      <div className="flex items-center flex-1 min-w-0">
                        {isImage ? (
                          <ImageIcon className="h-6 w-6 text-[#4b7bb5] mr-3 flex-shrink-0" />
                        ) : (
                          <File className="h-6 w-6 text-[#4b7bb5] mr-3 flex-shrink-0" />
                        )}
                        <div className="text-left min-w-0">
                          <p className="font-medium text-gray-800 truncate">{file.name}</p>
                          <p className="text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                        </div>
                      </div>

                      {isUploading && uploadProgress[file.name] !== undefined ? (
                        <div className="w-20 mr-2">
                          <div className="w-full bg-gray-200 rounded-full h-1.5">
                            <div
                              className="bg-[#4b7bb5] h-1.5 rounded-full"
                              style={{ width: `${uploadProgress[file.name]}%` }}
                            ></div>
                          </div>
                          <span className="text-xs text-gray-500">{uploadProgress[file.name]}%</span>
                        </div>
                      ) : hasError ? (
                        <span className="text-xs text-red-500 mr-2 max-w-[150px] truncate" title={errors[file.name]}>
                          {errors[file.name]}
                        </span>
                      ) : null}

                      <button
                        onClick={() => removeFile(index)}
                        className="text-gray-500 hover:text-red-500 ml-2"
                        disabled={isUploading}
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </div>
                  )
                })}
              </div>
            </div>

            <div className="flex justify-center mt-2">
              <label
                htmlFor="file-upload"
                className="cursor-pointer text-[#4b7bb5] text-sm hover:underline flex items-center"
              >
                <Upload className="h-4 w-4 mr-1" />
                Adicionar mais arquivos
              </label>
            </div>
          </div>
        )}
      </div>

      <div className="flex space-x-2 mt-3">
        {files.length > 0 && (
          <button
            onClick={handleUpload}
            disabled={isUploading}
            className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-[#4b7bb5] text-white rounded-md hover:bg-[#3d649e] focus:outline-none focus:ring-2 focus:ring-[#4b7bb5] focus:ring-offset-2 disabled:opacity-50"
          >
            {isUploading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Enviando... {processingStatus}</span>
              </>
            ) : (
              <>
                <Upload className="h-4 w-4" />
                <span>
                  Enviar {files.length} Arquivo{files.length !== 1 ? "s" : ""}
                </span>
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

      {Object.keys(errors).length > 0 && errors.URL && (
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

      {isUploading && processingStatus && (
        <div className="mt-4">
          <div className="flex items-center text-sm text-gray-600">
            <Loader2 className="h-3 w-3 animate-spin mr-2" />
            <span>{processingStatus}</span>
          </div>
        </div>
      )}

      {detailedError && (
        <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-md flex items-start">
          <AlertTriangle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium">Erro no upload:</p>
            <details className="mt-2">
              <summary className="text-sm cursor-pointer">Detalhes técnicos</summary>
              <pre className="mt-1 text-xs bg-red-100 p-2 rounded overflow-auto max-h-40">{detailedError}</pre>
            </details>
            <p className="mt-2 text-sm">
              Verifique se as variáveis de ambiente BUNNY_API_KEY, BUNNY_STORAGE_ZONE e BUNNY_STORAGE_REGION estão
              configuradas corretamente.
            </p>
          </div>
        </div>
      )}

      {errorCount > 0 && (
        <div className="mt-3 p-2 bg-red-50 text-red-700 rounded-md flex items-start">
          <AlertTriangle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium">
              Erro em {errorCount} arquivo{errorCount !== 1 ? "s" : ""}:
            </p>
            <p className="mt-1">Alguns arquivos não puderam ser enviados. Verifique os detalhes acima.</p>
          </div>
        </div>
      )}

      {successCount > 0 && (
        <div className="mt-4 p-3 bg-green-50 text-green-700 rounded-md flex items-start">
          <CheckCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium">
              Upload concluído com sucesso para {successCount} arquivo{successCount !== 1 ? "s" : ""}!
            </p>
            {success.length > 0 && (
              <div className="mt-2">
                {success.length <= 3 ? (
                  // Mostrar detalhes se houver poucos arquivos
                  success.map((item, index) => (
                    <p key={index} className="text-sm">
                      {item.fileName}
                      {item.fileUrl && (
                        <a
                          href={item.fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="ml-2 text-blue-600 hover:underline"
                        >
                          Visualizar
                        </a>
                      )}
                    </p>
                  ))
                ) : (
                  // Mostrar resumo se houver muitos arquivos
                  <p className="text-sm">{success.length} arquivos foram enviados com sucesso.</p>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
