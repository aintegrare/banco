"use client"

import { useState } from "react"
import { AlertCircle, Loader2 } from "lucide-react"

export function UrlDiagnostics() {
  const [url, setUrl] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  const handleDiagnose = async () => {
    if (!url) {
      setError("Por favor, insira uma URL para diagnosticar")
      return
    }

    setIsLoading(true)
    setError(null)
    setResult(null)

    try {
      const response = await fetch(`/api/diagnose-url?url=${encodeURIComponent(url)}`)

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || errorData.error || `Erro ao diagnosticar URL: ${response.status}`)
      }

      const data = await response.json()
      setResult(data)
    } catch (err) {
      console.error("Erro ao diagnosticar URL:", err)
      setError(err instanceof Error ? err.message : "Erro desconhecido ao diagnosticar URL")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h2 className="text-xl font-bold text-[#4072b0] mb-4">Diagnóstico de URL</h2>

      <div className="mb-4">
        <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-1">
          URL para diagnosticar
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            id="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://integrare.b-cdn.net/documents/arquivo.pdf"
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#4072b0] focus:border-[#4072b0]"
          />
          <button
            onClick={handleDiagnose}
            disabled={isLoading}
            className="px-4 py-2 bg-[#4072b0] text-white rounded-md hover:bg-[#3d649e] focus:outline-none focus:ring-2 focus:ring-[#4072b0] focus:ring-offset-2 disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <Loader2 className="inline-block h-4 w-4 mr-2 animate-spin" />
                Verificando...
              </>
            ) : (
              "Diagnosticar"
            )}
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded-md mb-4 flex items-start">
          <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium">Erro ao diagnosticar URL:</p>
            <p className="mt-1">{error}</p>
          </div>
        </div>
      )}

      {result && (
        <div className="bg-gray-50 p-4 rounded-md">
          <h3 className="font-medium text-gray-700 mb-2">Resultado do diagnóstico:</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <p className="text-sm text-gray-500">URL Original:</p>
              <p className="font-mono text-sm break-all">{result.originalUrl}</p>
            </div>

            <div>
              <p className="text-sm text-gray-500">URL Corrigida:</p>
              <p className="font-mono text-sm break-all">{result.fixedUrl}</p>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center">
              <div
                className={`h-4 w-4 rounded-full mr-2 ${result.hasIncorrectPrefix ? "bg-red-500" : "bg-green-500"}`}
              ></div>
              <p>
                {result.hasIncorrectPrefix
                  ? "A URL contém o prefixo incorreto 'zona-de-guardar'"
                  : "A URL não contém prefixos incorretos"}
              </p>
            </div>

            <div className="flex items-center">
              <div className={`h-4 w-4 rounded-full mr-2 ${result.isAccessible ? "bg-green-500" : "bg-red-500"}`}></div>
              <p>
                {result.isAccessible
                  ? "A URL é acessível (status " + result.statusCode + ")"
                  : "A URL não é acessível (status " + result.statusCode + ")"}
              </p>
            </div>

            {result.errorMessage && (
              <div className="mt-2 p-2 bg-red-50 rounded text-sm text-red-700">
                <p className="font-medium">Erro ao acessar a URL:</p>
                <p>{result.errorMessage}</p>
              </div>
            )}
          </div>

          {result.hasIncorrectPrefix && (
            <div className="mt-4 p-3 bg-blue-50 text-blue-700 rounded-md">
              <p className="font-medium">Recomendação:</p>
              <p>A URL contém o prefixo incorreto "zona-de-guardar". Use a URL corrigida mostrada acima.</p>
            </div>
          )}

          <div className="mt-4 flex space-x-2">
            <a
              href={result.fixedUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1 text-sm bg-[#4072b0] text-white rounded-md hover:bg-[#3d649e]"
            >
              Abrir URL Corrigida
            </a>
            <button
              onClick={() => {
                navigator.clipboard.writeText(result.fixedUrl)
                alert("URL corrigida copiada para a área de transferência!")
              }}
              className="px-3 py-1 text-sm border border-[#4072b0] text-[#4072b0] rounded-md hover:bg-gray-50"
            >
              Copiar URL Corrigida
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
