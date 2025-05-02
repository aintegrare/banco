"use client"

import type React from "react"

import { useState } from "react"
import { FileText, Loader2, AlertCircle, CheckCircle, Info, AlertTriangle } from "lucide-react"

export function PDFExtractorTester() {
  const [url, setUrl] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const [logs, setLogs] = useState<string[]>([])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!url) return

    setIsLoading(true)
    setResult(null)
    setError(null)
    setLogs(["Iniciando extração de texto do PDF..."])

    try {
      addLog(`Enviando requisição para ${url}`)

      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 30000) // 30 segundos timeout

      const response = await fetch("/api/test-pdf-extraction", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url }),
        signal: controller.signal,
      }).catch((fetchError) => {
        if (fetchError.name === "AbortError") {
          throw new Error("A requisição excedeu o tempo limite de 30 segundos.")
        }
        throw fetchError
      })

      clearTimeout(timeoutId)

      addLog(`Resposta recebida com status: ${response.status}`)

      // Primeiro obter o texto da resposta
      const responseText = await response.text()
      addLog(`Texto da resposta recebido (${responseText.length} caracteres)`)

      // Verificar se a resposta está vazia
      if (!responseText || responseText.trim() === "") {
        throw new Error("Resposta vazia recebida do servidor")
      }

      // Verificar se a resposta contém "Internal server error"
      if (responseText.includes("Internal server error")) {
        throw new Error("Erro interno do servidor. Verifique os logs do servidor para mais detalhes.")
      }

      // Tentar converter o texto para JSON
      try {
        const data = JSON.parse(responseText)
        addLog("Dados JSON analisados com sucesso")

        if (!response.ok || data.error) {
          const errorMessage = data.message || data.error || `Erro: ${response.status}`
          addLog(`ERRO: ${errorMessage}`)
          throw new Error(errorMessage)
        }

        addLog(`Extração concluída! ${data.textLength} caracteres extraídos`)

        if (data.isSimulated) {
          addLog("AVISO: O texto extraído é simulado para fins de demonstração")
        }

        if (data.diagnostics) {
          addLog(`Diagnóstico: ${JSON.stringify(data.diagnostics)}`)
        }

        setResult(data)
      } catch (jsonError) {
        console.error("Erro ao analisar resposta como JSON:", jsonError)
        addLog("ERRO: Falha ao analisar resposta como JSON")

        // Mostrar o texto da resposta para diagnóstico
        const errorMessage = responseText.substring(0, 200) + (responseText.length > 200 ? "..." : "")
        addLog(`ERRO: Resposta não-JSON recebida: ${errorMessage}`)
        throw new Error(`Resposta inválida: ${errorMessage}`)
      }
    } catch (err) {
      console.error("Erro no teste de extração:", err)
      setError(err instanceof Error ? err.message : "Erro desconhecido")
      addLog(`ERRO FATAL: ${err instanceof Error ? err.message : "Erro desconhecido"}`)
    } finally {
      setIsLoading(false)
    }
  }

  const addLog = (message: string) => {
    setLogs((prev) => [...prev, message])
    console.log("PDF Tester Log:", message)
  }

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h2 className="text-xl font-bold text-[#4072b0] mb-4">Teste de Extração de PDF</h2>

      <div className="mb-4 p-3 bg-blue-50 text-blue-700 rounded-md flex items-start">
        <Info className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
        <div>
          <p className="font-medium">Modo de demonstração</p>
          <p className="mt-1 text-sm">
            Esta ferramenta está operando em modo de demonstração, gerando texto simulado baseado na URL do PDF. Para
            implementar a extração real de PDF em produção, será necessário configurar adequadamente as bibliotecas de
            processamento de PDF ou utilizar um serviço externo.
          </p>
        </div>
      </div>

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
            className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#4b7bb5] focus:ring-offset-2 disabled:opacity-50"
            required
          />
          <p className="mt-1 text-xs text-gray-500">
            No modo de demonstração, qualquer URL válida que termine com .pdf funcionará.
          </p>
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

      {logs.length > 0 && (
        <div className="mt-4 p-3 bg-gray-50 border border-gray-200 rounded-md">
          <div className="flex items-start mb-2">
            <Info className="h-4 w-4 mr-2 text-[#4b7bb5] flex-shrink-0 mt-0.5" />
            <h3 className="font-medium text-gray-700">Log de processamento:</h3>
          </div>
          <div className="bg-black text-green-400 p-2 rounded font-mono text-xs overflow-auto max-h-40">
            {logs.map((log, index) => (
              <div
                key={index}
                className={log.includes("ERRO") ? "text-red-400" : log.includes("AVISO") ? "text-yellow-400" : ""}
              >
                {`> ${log}`}
              </div>
            ))}
          </div>
        </div>
      )}

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

              {result.isSimulated && (
                <div className="mt-2 flex items-start bg-yellow-100 p-2 rounded-md text-yellow-700">
                  <AlertTriangle className="h-4 w-4 mr-2 flex-shrink-0 mt-0.5" />
                  <p>Aviso: O texto extraído é simulado para fins de demonstração.</p>
                </div>
              )}

              {result.diagnostics && (
                <div className="mt-2">
                  <p className="font-medium">Diagnóstico:</p>
                  <ul className="mt-1 list-disc list-inside text-sm">
                    <li>Contém caracteres alfanuméricos: {result.diagnostics.hasAlphaNumeric ? "Sim" : "Não"}</li>
                    <li>Contém palavras: {result.diagnostics.hasWords ? "Sim" : "Não"}</li>
                    <li>Tamanho médio das palavras: {result.diagnostics.averageWordLength.toFixed(2)}</li>
                    <li>Número de palavras: {result.diagnostics.wordCount}</li>
                    <li>Contém palavras comuns: {result.diagnostics.containsCommonWords ? "Sim" : "Não"}</li>
                  </ul>
                </div>
              )}
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
