"use client"

import { useEffect, useState } from "react"
import { FileText, Globe, Trash2, RefreshCw, Loader2 } from "lucide-react"

interface Document {
  id: number
  title: string
  url: string
  source_type: string
  created_at: string
}

export function DocumentList() {
  const [documents, setDocuments] = useState<Document[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<number | null>(null)

  const fetchDocuments = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/documents")
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Erro ao carregar documentos")
      }

      setDocuments(data.documents || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro desconhecido")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchDocuments()
  }, [])

  const handleDelete = async (id: number) => {
    if (!confirm("Tem certeza que deseja excluir este documento? Esta ação não pode ser desfeita.")) {
      return
    }

    setDeletingId(id)

    try {
      const response = await fetch(`/api/documents/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.message || data.error || "Erro ao excluir documento")
      }

      // Atualizar a lista após exclusão bem-sucedida
      setDocuments((prev) => prev.filter((doc) => doc.id !== id))
    } catch (err) {
      console.error("Erro ao excluir:", err)
      alert(err instanceof Error ? err.message : "Erro ao excluir documento")
    } finally {
      setDeletingId(null)
    }
  }

  const getSourceIcon = (sourceType: string) => {
    return sourceType === "pdf" ? (
      <FileText className="h-4 w-4 text-[#4b7bb5]" />
    ) : (
      <Globe className="h-4 w-4 text-[#4b7bb5]" />
    )
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-[#4072b0]">Documentos Processados</h2>
        <button
          onClick={fetchDocuments}
          className="flex items-center text-sm text-[#4b7bb5] hover:text-[#3d649e]"
          disabled={isLoading}
        >
          {isLoading ? <Loader2 className="h-4 w-4 mr-1 animate-spin" /> : <RefreshCw className="h-4 w-4 mr-1" />}
          Atualizar
        </button>
      </div>

      {isLoading && documents.length === 0 ? (
        <div className="text-center py-8">
          <div className="animate-spin h-8 w-8 border-2 border-[#4b7bb5] border-t-transparent rounded-full mx-auto mb-2"></div>
          <p className="text-gray-500">Carregando documentos...</p>
        </div>
      ) : error ? (
        <div className="bg-red-50 text-red-700 p-3 rounded-md">{error}</div>
      ) : documents.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p>Nenhum documento processado ainda.</p>
          <p className="text-sm mt-2">Adicione documentos usando o formulário acima.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-2 px-2">Tipo</th>
                <th className="text-left py-2 px-2">Título</th>
                <th className="text-left py-2 px-2">Data</th>
                <th className="text-right py-2 px-2">Ações</th>
              </tr>
            </thead>
            <tbody>
              {documents.map((doc) => (
                <tr key={doc.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-2 px-2">
                    <div className="flex items-center">
                      {getSourceIcon(doc.source_type)}
                      <span className="ml-2 text-xs uppercase text-gray-500">{doc.source_type}</span>
                    </div>
                  </td>
                  <td className="py-2 px-2">
                    <a
                      href={doc.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#4072b0] hover:underline"
                      title={doc.url}
                    >
                      {doc.title}
                    </a>
                  </td>
                  <td className="py-2 px-2 text-gray-500">{formatDate(doc.created_at)}</td>
                  <td className="py-2 px-2 text-right">
                    <button
                      className="text-red-500 hover:text-red-700 disabled:opacity-50"
                      title="Excluir documento"
                      onClick={() => handleDelete(doc.id)}
                      disabled={deletingId === doc.id}
                    >
                      {deletingId === doc.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
