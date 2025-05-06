"use client"

import type React from "react"
import { useState } from "react"
import { Loader2, Search, AlertCircle, CheckCircle, FolderOpen } from "lucide-react"

interface FolderRecoveryProps {
  onFolderFound: (folderPath: string) => void
}

export function FolderRecovery({ onFolderFound }: FolderRecoveryProps) {
  const [folderPath, setFolderPath] = useState("")
  const [isSearching, setIsSearching] = useState(false)
  const [searchResult, setSearchResult] = useState<any | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!folderPath) {
      setError("Por favor, informe o caminho da pasta")
      return
    }

    setIsSearching(true)
    setError(null)
    setSearchResult(null)

    try {
      const response = await fetch("/api/recover-folder", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ folderPath }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || data.error || "Erro ao buscar pasta")
      }

      setSearchResult(data)

      if (data.success && (data.folder || data.content)) {
        // Se encontrou a pasta, notificar o componente pai
        const foundPath = data.folder ? data.folder.Path : folderPath
        onFolderFound(foundPath)
      }
    } catch (error) {
      console.error("Erro ao recuperar pasta:", error)
      setError(error instanceof Error ? error.message : "Erro ao buscar pasta")
    } finally {
      setIsSearching(false)
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100 mb-6">
      <h2 className="text-xl font-bold text-[#4072b0] flex items-center mb-4">
        <FolderOpen className="mr-2 h-6 w-6 text-[#4b7bb5]" />
        Recuperar Pasta Perdida
      </h2>

      <form onSubmit={handleSearch} className="mb-4">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="flex-grow">
            <label htmlFor="folderPath" className="block text-sm font-medium text-gray-700 mb-1">
              Caminho da pasta (ex: documents/clientes)
            </label>
            <input
              type="text"
              id="folderPath"
              value={folderPath}
              onChange={(e) => setFolderPath(e.target.value)}
              placeholder="Informe o caminho da pasta"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#4b7bb5] focus:border-[#4b7bb5]"
            />
          </div>
          <div className="flex items-end">
            <button
              type="submit"
              disabled={isSearching}
              className="px-4 py-2 bg-[#4b7bb5] border border-transparent rounded-md text-sm font-medium text-white hover:bg-[#3d649e] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#4b7bb5] disabled:opacity-50 h-10"
            >
              {isSearching ? (
                <>
                  <Loader2 className="h-4 w-4 mr-1.5 inline animate-spin" />
                  Buscando...
                </>
              ) : (
                <>
                  <Search className="h-4 w-4 mr-1.5 inline" />
                  Buscar Pasta
                </>
              )}
            </button>
          </div>
        </div>
      </form>

      {error && (
        <div className="bg-red-50 p-4 rounded-lg mb-4 border-l-4 border-red-500 flex items-start">
          <AlertCircle className="h-5 w-5 mr-2 text-red-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-red-700">Erro ao buscar pasta:</p>
            <p className="text-red-600">{error}</p>
          </div>
        </div>
      )}

      {searchResult && (
        <div
          className={`p-4 rounded-lg mb-4 border-l-4 flex items-start ${
            searchResult.success ? "bg-green-50 border-green-500" : "bg-yellow-50 border-yellow-500"
          }`}
        >
          {searchResult.success ? (
            <CheckCircle className="h-5 w-5 mr-2 text-green-500 flex-shrink-0 mt-0.5" />
          ) : (
            <AlertCircle className="h-5 w-5 mr-2 text-yellow-500 flex-shrink-0 mt-0.5" />
          )}
          <div>
            <p className={`font-medium ${searchResult.success ? "text-green-700" : "text-yellow-700"}`}>
              {searchResult.message}
            </p>

            {searchResult.folder && (
              <div className="mt-2">
                <p className="text-sm font-medium">Pasta encontrada:</p>
                <div className="bg-white p-2 rounded border border-gray-200 mt-1">
                  <p>
                    <span className="font-medium">Nome:</span> {searchResult.folder.ObjectName}
                  </p>
                  <p>
                    <span className="font-medium">Caminho:</span> {searchResult.folder.Path}
                  </p>
                  <button
                    onClick={() => onFolderFound(searchResult.folder.Path)}
                    className="mt-2 px-3 py-1 bg-[#4b7bb5] text-white text-sm rounded hover:bg-[#3d649e]"
                  >
                    Navegar para esta pasta
                  </button>
                </div>
              </div>
            )}

            {searchResult.allSimilarFolders && searchResult.allSimilarFolders.length > 1 && (
              <div className="mt-2">
                <p className="text-sm font-medium">Outras pastas similares encontradas:</p>
                <div className="bg-white p-2 rounded border border-gray-200 mt-1 max-h-40 overflow-y-auto">
                  {searchResult.allSimilarFolders.slice(1).map((folder: any, index: number) => (
                    <div key={index} className="mb-2 pb-2 border-b border-gray-100 last:border-0">
                      <p>
                        <span className="font-medium">Nome:</span> {folder.ObjectName}
                      </p>
                      <p>
                        <span className="font-medium">Caminho:</span> {folder.Path}
                      </p>
                      <button
                        onClick={() => onFolderFound(folder.Path)}
                        className="mt-1 px-2 py-0.5 bg-[#4b7bb5] text-white text-xs rounded hover:bg-[#3d649e]"
                      >
                        Navegar
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {searchResult.content && (
              <div className="mt-2">
                <p className="text-sm font-medium">Conteúdo da pasta ({searchResult.content.length} itens):</p>
                <div className="bg-white p-2 rounded border border-gray-200 mt-1 max-h-40 overflow-y-auto">
                  <ul className="list-disc pl-5">
                    {searchResult.content.slice(0, 10).map((item: any, index: number) => (
                      <li key={index}>
                        {item.ObjectName}
                        {item.IsDirectory ? "/" : ""}
                      </li>
                    ))}
                    {searchResult.content.length > 10 && (
                      <li className="text-gray-500">...e mais {searchResult.content.length - 10} itens</li>
                    )}
                  </ul>
                </div>
              </div>
            )}

            {!searchResult.success && (
              <div className="mt-2">
                <p className="text-sm">
                  Caminho pesquisado:{" "}
                  <span className="font-mono text-xs bg-gray-100 px-1 py-0.5 rounded">{searchResult.searchedPath}</span>
                </p>
                <p className="text-sm mt-1">
                  Diretório pai:{" "}
                  <span className="font-mono text-xs bg-gray-100 px-1 py-0.5 rounded">{searchResult.parentPath}</span>
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
        <p className="font-medium mb-1">Dicas para recuperar pastas:</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Tente o caminho exato da pasta (ex: "documents/clientes")</li>
          <li>Experimente variações de capitalização (ex: "Documents/Clientes")</li>
          <li>Verifique se a pasta está em outro diretório raiz (ex: "images/clientes")</li>
          <li>Se souber o nome de um arquivo dentro da pasta, tente buscar por ele</li>
        </ul>
      </div>
    </div>
  )
}
