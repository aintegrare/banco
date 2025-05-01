"use client"

import { useState } from "react"
import { Loader2, AlertCircle, CheckCircle, FileText, Database } from "lucide-react"

export function DocumentDiagnostic() {
  const [isLoading, setIsLoading] = useState(false)
  const [diagnosticResult, setDiagnosticResult] = useState<any | null>(null)
  const [error, setError] = useState<string | null>(null)

  const runDiagnostic = async () => {
    setIsLoading(true)
    setDiagnosticResult(null)
    setError(null)

    try {
      const response = await fetch("/api/diagnose")
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || data.error || "Erro no diagnóstico")
      }

      setDiagnosticResult(data)
    } catch (error) {
      console.error("DocumentDiagnostic: Erro no diagnóstico:", error)
      setError(error instanceof Error ? error.message : "Ocorreu um erro durante o diagnóstico")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h2 className="text-xl font-bold text-[#4072b0] mb-4">Diagnóstico de Documentos</h2>

      <div className="mb-4">
        <p className="text-gray-600 mb-2">
          Verifique o acesso aos documentos e fragmentos armazenados no banco de dados para garantir que o sistema de
          busca esteja funcionando corretamente.
        </p>
        <button
          onClick={runDiagnostic}
          disabled={isLoading}
          className="flex items-center space-x-2 px-4 py-2 bg-[#4b7bb5] text-white rounded-md hover:bg-[#3d649e] focus:outline-none focus:ring-2 focus:ring-[#4b7bb5] focus:ring-offset-2 disabled:opacity-50"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Executando diagnóstico...</span>
            </>
          ) : (
            <>
              <Database className="h-4 w-4" />
              <span>Executar Diagnóstico</span>
            </>
          )}
        </button>
      </div>

      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded-md mb-4 flex items-start">
          <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium">Erro no diagnóstico:</p>
            <p className="mt-1">{error}</p>
          </div>
        </div>
      )}

      {diagnosticResult && (
        <div
          className={`p-4 rounded-md mb-4 flex items-start ${
            diagnosticResult.success ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
          }`}
        >
          {diagnosticResult.success ? (
            <CheckCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
          ) : (
            <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
          )}
          <div>
            <p className="font-medium">
              {diagnosticResult.success ? "Diagnóstico concluído com sucesso!" : "Problemas detectados:"}
            </p>
            <div className="mt-2">
              <div className="flex items-center mb-1">
                <FileText className="h-4 w-4 mr-1" />
                <span>Documentos: {diagnosticResult.documentsCount}</span>
              </div>
              <div className="flex items-center">
                <Database className="h-4 w-4 mr-1" />
                <span>Fragmentos: {diagnosticResult.chunksCount}</span>
              </div>
            </div>
            {diagnosticResult.error && <p className="mt-2 text-red-600">{diagnosticResult.error}</p>}
            <details className="mt-3">
              <summary className="cursor-pointer text-sm">Detalhes técnicos</summary>
              <pre className="mt-2 p-2 bg-gray-100 rounded text-xs overflow-auto max-h-60">
                {JSON.stringify(diagnosticResult, null, 2)}
              </pre>
            </details>
          </div>
        </div>
      )}

      {diagnosticResult && diagnosticResult.success && diagnosticResult.documentsCount === 0 && (
        <div className="bg-yellow-50 text-yellow-700 p-4 rounded-md">
          <p className="font-medium">Nenhum documento encontrado!</p>
          <p className="mt-1">
            O sistema está funcionando corretamente, mas não há documentos indexados. Adicione documentos usando o
            formulário de processamento para que o sistema de busca possa funcionar.
          </p>
        </div>
      )}
    </div>
  )
}
