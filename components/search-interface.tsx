"use client"

import type React from "react"

import { useState } from "react"
import { Search, Loader2, AlertCircle, Info, FileText } from "lucide-react"
import { SearchResults } from "./search-results"
import { AIResponse } from "./ai-response"

export function SearchInterface() {
  const [query, setQuery] = useState("")
  const [isSearching, setIsSearching] = useState(false)
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [aiResponse, setAIResponse] = useState("")
  const [activeTab, setActiveTab] = useState<"ai" | "links">("ai")
  const [error, setError] = useState<string | null>(null)
  const [detailedError, setDetailedError] = useState<string | null>(null)
  const [usedDocuments, setUsedDocuments] = useState<any[]>([])
  const [documentCount, setDocumentCount] = useState<number>(0)
  const [isDiagnosing, setIsDiagnosing] = useState(false)
  const [diagnosticResult, setDiagnosticResult] = useState<any | null>(null)

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!query.trim()) return

    setIsSearching(true)
    setSearchResults([])
    setAIResponse("")
    setError(null)
    setDetailedError(null)
    setUsedDocuments([])
    setDocumentCount(0)

    try {
      console.log("SearchInterface: Iniciando busca para:", query.trim())

      const response = await fetch("/api/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query: query.trim() }),
      })

      const data = await response.json()

      if (!response.ok) {
        console.error("SearchInterface: Erro na resposta da API:", data)
        throw new Error(data.message || data.error || "Erro na busca")
      }

      console.log("SearchInterface: Resposta recebida:", {
        resultCount: data.results?.length || 0,
        hasAIResponse: !!data.aiResponse,
        documentCount: data.documentCount,
      })

      setSearchResults(data.results || [])
      setAIResponse(data.aiResponse || "")
      setUsedDocuments(data.usedDocuments || [])
      setDocumentCount(data.documentCount || 0)

      // Se não houver resultados mas tiver resposta da IA, mostrar a aba da IA
      if ((data.results?.length || 0) === 0 && data.aiResponse) {
        setActiveTab("ai")
      }

      // Se não houver resposta da IA mas tiver resultados, mostrar a aba de links
      if (!data.aiResponse && (data.results?.length || 0) > 0) {
        setActiveTab("links")
      }

      // Se houver um diagnóstico, armazená-lo
      if (data.diagnostic) {
        setDiagnosticResult(data.diagnostic)
      }
    } catch (error) {
      console.error("SearchInterface: Erro na busca:", error)
      setError(error instanceof Error ? error.message : "Ocorreu um erro durante a busca")
      setDetailedError(
        "Detalhes técnicos: " + (error instanceof Error ? `${error.name}: ${error.message}` : String(error)),
      )
    } finally {
      setIsSearching(false)
    }
  }

  const runDiagnostic = async () => {
    setIsDiagnosing(true)
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
      console.error("SearchInterface: Erro no diagnóstico:", error)
      setError(error instanceof Error ? error.message : "Ocorreu um erro durante o diagnóstico")
    } finally {
      setIsDiagnosing(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <form onSubmit={handleSearch} className="mb-8">
        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="O que você gostaria de saber?"
            className="w-full py-4 px-6 pr-12 rounded-full border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#4b7bb5] focus:border-transparent"
            disabled={isSearching}
          />
          <button
            type="submit"
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-[#4b7bb5] disabled:opacity-50"
            disabled={isSearching || !query.trim()}
          >
            {isSearching ? <Loader2 className="h-5 w-5 animate-spin" /> : <Search className="h-5 w-5" />}
          </button>
        </div>
      </form>

      <div className="flex justify-end mb-4">
        <button
          onClick={runDiagnostic}
          className="flex items-center text-sm text-[#4b7bb5] hover:text-[#3d649e] px-3 py-1 border border-[#4b7bb5] rounded-md"
          disabled={isDiagnosing}
        >
          {isDiagnosing ? <Loader2 className="h-4 w-4 mr-1 animate-spin" /> : <FileText className="h-4 w-4 mr-1" />}
          Verificar Documentos
        </button>
      </div>

      {diagnosticResult && (
        <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-lg mb-6">
          <div className="flex items-start">
            <Info className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium">Diagnóstico de Documentos:</p>
              <p>
                {diagnosticResult.success
                  ? `${diagnosticResult.documentsCount} documentos e ${diagnosticResult.chunksCount} fragmentos encontrados.`
                  : "Problema detectado no acesso aos documentos."}
              </p>
              {diagnosticResult.error && <p className="text-red-600 mt-1">{diagnosticResult.error}</p>}
              <details className="mt-2">
                <summary className="cursor-pointer text-sm">Detalhes técnicos</summary>
                <pre className="mt-1 text-xs bg-blue-100 p-2 rounded overflow-auto max-h-40">
                  {JSON.stringify(diagnosticResult, null, 2)}
                </pre>
              </details>
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 flex items-start">
          <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium">Erro na busca:</p>
            <p>{error}</p>
            {detailedError && (
              <details className="mt-2">
                <summary className="cursor-pointer text-sm">Detalhes técnicos</summary>
                <pre className="mt-1 text-xs bg-red-100 p-2 rounded overflow-auto max-h-40">{detailedError}</pre>
              </details>
            )}
          </div>
        </div>
      )}

      {isSearching && (
        <div className="text-center py-12">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-[#4b7bb5]" />
          <p className="text-gray-500">Buscando informações relevantes...</p>
        </div>
      )}

      {!isSearching && (searchResults.length > 0 || aiResponse) && (
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="border-b border-gray-200">
            <nav className="flex">
              <button
                onClick={() => setActiveTab("ai")}
                className={`px-6 py-3 text-sm font-medium ${
                  activeTab === "ai"
                    ? "border-b-2 border-[#4072b0] text-[#4072b0]"
                    : "text-gray-500 hover:text-[#6b91c1]"
                }`}
              >
                Resposta IA
              </button>
              <button
                onClick={() => setActiveTab("links")}
                className={`px-6 py-3 text-sm font-medium ${
                  activeTab === "links"
                    ? "border-b-2 border-[#4072b0] text-[#4072b0]"
                    : "text-gray-500 hover:text-[#6b91c1]"
                }`}
              >
                Fontes ({searchResults.length})
              </button>
            </nav>
          </div>

          {documentCount > 0 && (
            <div className="bg-gray-50 px-6 py-2 text-sm text-gray-600 border-b border-gray-200">
              <div className="flex items-center">
                <Info className="h-4 w-4 mr-1 text-[#4b7bb5]" />
                <span>
                  Resposta baseada em {documentCount} documento{documentCount !== 1 ? "s" : ""}:{" "}
                  {usedDocuments.map((doc, index) => (
                    <span key={doc.id}>
                      {index > 0 && ", "}
                      <span className="font-medium">{doc.title}</span>
                    </span>
                  ))}
                </span>
              </div>
            </div>
          )}

          <div className="p-6">
            {activeTab === "ai" ? <AIResponse response={aiResponse} /> : <SearchResults results={searchResults} />}
          </div>
        </div>
      )}
    </div>
  )
}
