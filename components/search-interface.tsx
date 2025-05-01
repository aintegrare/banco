"use client"

import type React from "react"

import { useState } from "react"
import { Search, Loader2 } from "lucide-react"
import { SearchResults } from "./search-results"
import { AIResponse } from "./ai-response"

export function SearchInterface() {
  const [query, setQuery] = useState("")
  const [isSearching, setIsSearching] = useState(false)
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [aiResponse, setAIResponse] = useState("")
  const [activeTab, setActiveTab] = useState<"ai" | "links">("ai")
  const [error, setError] = useState<string | null>(null)

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!query.trim()) return

    setIsSearching(true)
    setSearchResults([])
    setAIResponse("")
    setError(null)

    try {
      const response = await fetch("/api/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query: query.trim() }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Erro na busca")
      }

      setSearchResults(data.results || [])
      setAIResponse(data.aiResponse || "")
    } catch (error) {
      console.error("Erro na busca:", error)
      setError(error instanceof Error ? error.message : "Ocorreu um erro durante a busca")
    } finally {
      setIsSearching(false)
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
            disabled={isSearching}
          >
            {isSearching ? <Loader2 className="h-5 w-5 animate-spin" /> : <Search className="h-5 w-5" />}
          </button>
        </div>
      </form>

      {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">{error}</div>}

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

          <div className="p-6">
            {activeTab === "ai" ? <AIResponse response={aiResponse} /> : <SearchResults results={searchResults} />}
          </div>
        </div>
      )}
    </div>
  )
}
