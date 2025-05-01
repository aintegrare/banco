"use client"

import type React from "react"

import { useState } from "react"
import { FileText, Loader2, AlertCircle, CheckCircle } from "lucide-react"

export function PDFExtractorTester() {
  const [url, setUrl] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!url) return

    setIsLoading(true)
    setResult(null)
    setError(null)

    try {
      const response = await fetch("/api/test-pdf-extraction", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || errorData.error || `Erro: ${response.status}`)
      }

      const data = await response.json()
      setResult(data)
    } catch (err) {
      console.error("Erro no teste de extração:", err)
      setError(err instanceof Error ? err.message : "Erro desconhecido")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h2 className="text-xl font-bold text-[#4072b0] mb-4">Teste de Extração de PDF</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="pdf-url" className="block text-sm font-medium text-gray-700 mb-1">
            URL do PDF
          </label>
          <input
            id="pdf-url"
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://exemplo.com/documento.pdf"
            className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#4b7bb5]"
            required
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="flex items-center justify-center space-x-2 px-4 py-2 bg-[#4b7bb5] text-white rounded-md hover:bg-[#3d649e] focus:outline-none focus:ring-2 focus:ring-[#4b7bb5] focus:ring-offset-2 disabled:opacity-50"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Extraindo texto...</span>
            </>
          ) : (
            <>
              <FileText className="h-4 w-4" />
              <span>Testar Extração</span>
            </>
          )}
        </button>
      </form>

      {error && (
        <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-md flex items-start">
          <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium">Erro na extração:</p>
            <p className="mt-1">{error}</p>
          </div>
        </div>
      )}

      {result && (
        <div className="mt-4 p-3 bg-green-50 text-green-700 rounded-md">
          <div className="flex items-start">
            <CheckCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium">Extração concluída com sucesso!</p>
              <p className="mt-1">Tamanho do texto: {result.textLength} caracteres</p>
            </div>
          </div>

          <div className="mt-4">
            <h3 className="font-medium mb-2">Amostra do texto extraído:</h3>
            <div className="bg-white border border-green-200 p-3 rounded-md max-h-60 overflow-auto">
              <pre className="text-sm whitespace-pre-wrap">{result.textSample}</pre>
            </div>
          </div>

          <details className="mt-4">
            <summary className="cursor-pointer font-medium">Ver texto completo</summary>
            <div className="mt-2 bg-white border border-green-200 p-3 rounded-md max-h-96 overflow-auto">
              <pre className="text-sm whitespace-pre-wrap">{result.fullText}</pre>
            </div>
          </details>
        </div>
      )}
    </div>
  )
}
