"use client"

import type React from "react"

import { useState } from "react"
import { FileText, Globe, Upload, Loader2, AlertTriangle } from "lucide-react"

export function DocumentProcessor() {
  const [url, setUrl] = useState("")
  const [documentType, setDocumentType] = useState<"pdf" | "website">("website")
  const [chunkSize, setChunkSize] = useState(1000)
  const [isProcessing, setIsProcessing] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const [processingStatus, setProcessingStatus] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!url) return

    setIsProcessing(true)
    setResult(null)
    setError(null)
    setProcessingStatus("Iniciando processamento...")

    try {
      // Validar URL
      new URL(url) // Isso lançará um erro se a URL for inválida

      setProcessingStatus("Enviando solicitação...")

      const response = await fetch("/api/process-document", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          url,
          type: documentType,
          chunkSize,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || data.error || "Erro ao processar documento")
      }

      setResult(data)
      setProcessingStatus(null)
    } catch (err) {
      console.error("Erro no processamento:", err)
      setError(err instanceof Error ? err.message : "Erro desconhecido")
      setProcessingStatus(null)
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h2 className="text-xl font-bold text-[#4072b0] mb-4">Processar Novo Documento</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-1">
            URL do Documento
          </label>
          <input
            id="url"
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://exemplo.com"
            className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#4b7bb5]"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Documento</label>
          <div className="flex space-x-4">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="radio"
                checked={documentType === "pdf"}
                onChange={() => setDocumentType("pdf")}
                className="text-[#4b7bb5] focus:ring-[#4b7bb5]"
              />
              <FileText className="h-4 w-4 text-[#4b7bb5]" />
              <span>PDF/Ebook</span>
            </label>

            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="radio"
                checked={documentType === "website"}
                onChange={() => setDocumentType("website")}
                className="text-[#4b7bb5] focus:ring-[#4b7bb5]"
              />
              <Globe className="h-4 w-4 text-[#4b7bb5]" />
              <span>Website</span>
            </label>
          </div>
        </div>

        <div>
          <label htmlFor="chunkSize" className="block text-sm font-medium text-gray-700 mb-1">
            Tamanho do Chunk (caracteres)
          </label>
          <input
            id="chunkSize"
            type="number"
            value={chunkSize}
            onChange={(e) => setChunkSize(Number.parseInt(e.target.value))}
            min={100}
            max={5000}
            step={100}
            className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#4b7bb5]"
          />
          <p className="mt-1 text-xs text-gray-500">
            Tamanho dos fragmentos de texto para processamento. Valores menores são mais precisos, mas podem perder
            contexto.
          </p>
        </div>

        <button
          type="submit"
          disabled={isProcessing}
          className="flex items-center justify-center space-x-2 px-4 py-2 bg-[#4b7bb5] text-white rounded-md hover:bg-[#3d649e] focus:outline-none focus:ring-2 focus:ring-[#4b7bb5] focus:ring-offset-2 disabled:opacity-50"
        >
          {isProcessing ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Processando...</span>
            </>
          ) : (
            <>
              <Upload className="h-4 w-4" />
              <span>Processar Documento</span>
            </>
          )}
        </button>
      </form>

      {processingStatus && (
        <div className="mt-4 p-3 bg-blue-50 text-blue-700 rounded-md">
          <div className="flex items-center">
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
            <span>{processingStatus}</span>
          </div>
        </div>
      )}

      {error && (
        <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-md">
          <p className="font-medium">Erro no processamento:</p>
          <p className="mt-1">{error}</p>
        </div>
      )}

      {result && (
        <div className="mt-4 p-3 bg-green-50 text-green-700 rounded-md">
          <p>Documento processado com sucesso!</p>
          <p className="mt-1">{result.chunksProcessed} fragmentos indexados.</p>

          {result.usedFallbackEmbeddings && (
            <div className="flex items-center mt-2 text-amber-600">
              <AlertTriangle className="h-4 w-4 mr-2" />
              <span>Usando embeddings locais (modo de fallback)</span>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
