"use client"

import { useState } from "react"
import { AlertCircle, Loader2, FileText } from "lucide-react"
import { PDFTextExtractor } from "./pdf-text-extractor"

interface DocumentIntegrityResult {
  url: string
  exists: boolean
  contentType: string | null
  contentLength: number | null
  textContent: string | null
  textLength: number | null
  isComplete: boolean | null
  errorMessage?: string
  processingTime?: number
}

export function DocumentIntegrityChecker() {
  const [url, setUrl] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<DocumentIntegrityResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [pdfText, setPdfText] = useState<string | null>(null)

  const handleCheck = async () => {
    if (!url) {
      setError("Por favor, insira uma URL para verificar")
      return
    }

    setIsLoading(true)
    setError(null)
    setResult(null)
    setPdfText(null)

    try {
      const response = await fetch(`/api/check-document-integrity?url=${encodeURIComponent(url)}`)

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || errorData.error || `Erro ao verificar documento: ${response.status}`)
      }

      const data = await response.json()
      setResult(data)

      // Se for um PDF, o texto será extraído pelo componente cliente
      if (data.contentType?.includes("application/pdf")) {
        data.textContent = null
      }
    } catch (err) {
      console.error("Erro ao verificar integridade do documento:", err)
      setError(err instanceof Error ? err.message : "Erro desconhecido ao verificar documento")
    } finally {
      setIsLoading(false)
    }
  }

  const handlePdfTextExtracted = (text: string) => {
    setPdfText(text)
    if (result) {
      setResult({
        ...result,
        textContent: text,
        textLength: text.length,
        isComplete: text.length > 100,
      })
    }
  }

  const getStatusColor = (status: boolean | null) => {
    if (status === null) return "bg-gray-400"
    return status ? "bg-green-500" : "bg-red-500"
  }

  const displayTextContent = result?.textContent || pdfText

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h2 className="text-xl font-bold text-[#4072b0] mb-4">Verificação de Integridade de Documentos</h2>
      <p className="text-gray-600 mb-4">
        Esta ferramenta verifica se um documento está completo e acessível, analisando seu conteúdo e metadados.
      </p>

      <div className="mb-4">
        <label htmlFor="document-url" className="block text-sm font-medium text-gray-700 mb-1">
          URL do Documento
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            id="document-url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://integrare.b-cdn.net/documents/arquivo.pdf"
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#4072b0] focus:border-[#4072b0]"
          />
          <button
            onClick={handleCheck}
            disabled={isLoading}
            className="px-4 py-2 bg-[#4072b0] text-white rounded-md hover:bg-[#3d649e] focus:outline-none focus:ring-2 focus:ring-[#4072b0] focus:ring-offset-2 disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <Loader2 className="inline-block h-4 w-4 mr-2 animate-spin" />
                Verificando...
              </>
            ) : (
              "Verificar"
            )}
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded-md mb-4 flex items-start">
          <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium">Erro ao verificar documento:</p>
            <p className="mt-1">{error}</p>
          </div>
        </div>
      )}

      {result && (
        <div className="bg-gray-50 p-4 rounded-md">
          <h3 className="font-medium text-gray-700 mb-2">Resultado da verificação:</h3>

          <div className="grid grid-cols-1 gap-4 mb-4">
            <div>
              <p className="text-sm text-gray-500">URL do Documento:</p>
              <p className="font-mono text-sm break-all">{result.url}</p>
            </div>
          </div>

          <div className="space-y-3 mb-4">
            <div className="flex items-center">
              <div className={`h-4 w-4 rounded-full mr-2 ${result.exists ? "bg-green-500" : "bg-red-500"}`}></div>
              <p>
                {result.exists ? "O documento existe e está acessível" : "O documento não existe ou não está acessível"}
              </p>
            </div>

            {result.exists && (
              <>
                <div className="flex items-center">
                  <div className={`h-4 w-4 rounded-full mr-2 bg-blue-500`}></div>
                  <p>
                    Tipo de conteúdo: <span className="font-mono">{result.contentType}</span>
                  </p>
                </div>

                <div className="flex items-center">
                  <div className={`h-4 w-4 rounded-full mr-2 bg-blue-500`}></div>
                  <p>
                    Tamanho do arquivo:{" "}
                    <span className="font-mono">
                      {result.contentLength ? `${(result.contentLength / 1024).toFixed(2)} KB` : "Desconhecido"}
                    </span>
                  </p>
                </div>

                {result.contentType?.includes("application/pdf") && !pdfText && (
                  <PDFTextExtractor url={result.url} onTextExtracted={handlePdfTextExtracted} />
                )}

                {(displayTextContent !== null || pdfText !== null) && (
                  <div className="flex items-center">
                    <div className={`h-4 w-4 rounded-full mr-2 ${getStatusColor(displayTextContent !== null)}`}></div>
                    <p>
                      {displayTextContent !== null
                        ? `Texto extraído com sucesso (${displayTextContent.length} caracteres)`
                        : "Não foi possível extrair texto do documento"}
                    </p>
                  </div>
                )}

                <div className="flex items-center">
                  <div className={`h-4 w-4 rounded-full mr-2 ${getStatusColor(result.isComplete)}`}></div>
                  <p>
                    {result.isComplete === true
                      ? "O documento parece estar completo"
                      : result.isComplete === false
                        ? "O documento parece estar incompleto ou vazio"
                        : "Não foi possível determinar se o documento está completo"}
                  </p>
                </div>

                {result.processingTime && (
                  <div className="flex items-center">
                    <div className={`h-4 w-4 rounded-full mr-2 bg-gray-400`}></div>
                    <p>Tempo de processamento: {result.processingTime.toFixed(2)} ms</p>
                  </div>
                )}
              </>
            )}
          </div>

          {result.errorMessage && (
            <div className="mt-2 p-2 bg-red-50 rounded text-sm text-red-700">
              <p className="font-medium">Erro durante a verificação:</p>
              <p>{result.errorMessage}</p>
            </div>
          )}

          {displayTextContent && (
            <div className="mt-4">
              <h4 className="font-medium text-gray-700 mb-2 flex items-center">
                <FileText className="h-4 w-4 mr-2" />
                Amostra do conteúdo extraído:
              </h4>
              <div className="bg-white border border-gray-200 rounded-md p-3 max-h-60 overflow-y-auto">
                <pre className="text-xs whitespace-pre-wrap font-mono">{displayTextContent.substring(0, 1000)}...</pre>
              </div>
            </div>
          )}

          {result.exists && (
            <div className="mt-4 flex space-x-2">
              <a
                href={result.url}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1 text-sm bg-[#4072b0] text-white rounded-md hover:bg-[#3d649e]"
              >
                Abrir Documento
              </a>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(result.url)
                  alert("URL copiada para a área de transferência!")
                }}
                className="px-3 py-1 text-sm border border-[#4072b0] text-[#4072b0] rounded-md hover:bg-gray-50"
              >
                Copiar URL
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
