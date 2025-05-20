import Link from "next/link"
import { FileText, Globe } from "lucide-react"

interface SearchResult {
  id: string
  title: string
  content: string
  url?: string
  source?: string
  sourceIcon?: string
  metadata?: {
    source?: string
    author?: string
    date?: string
    [key: string]: any
  }
}

export function SearchResults({ results }: { results: SearchResult[] }) {
  if (results.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Nenhum resultado encontrado.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {results.map((result) => (
        <div key={result.id} className="border-b border-gray-100 pb-6 last:border-0 last:pb-0">
          <div className="flex items-start gap-3">
            <div className="mt-1 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-[#4b7bb5]/10 text-[#4b7bb5]">
              {result.sourceIcon === "FileText" ? <FileText className="h-4 w-4" /> : <Globe className="h-4 w-4" />}
            </div>
            <div>
              <h3 className="text-lg font-medium text-[#4b7bb5] flex items-center gap-2">
                {result.url ? (
                  <>
                    <Link href={result.url} className="hover:underline" target="_blank" rel="noopener noreferrer">
                      {result.title}
                    </Link>
                    <span className="text-xs bg-gray-100 px-2 py-0.5 rounded text-gray-600">
                      {result.source || "documento"}
                    </span>
                  </>
                ) : (
                  <>
                    {result.title}
                    {result.source && (
                      <span className="text-xs bg-gray-100 px-2 py-0.5 rounded text-gray-600">{result.source}</span>
                    )}
                  </>
                )}
              </h3>

              {result.metadata && Object.keys(result.metadata).length > 0 && (
                <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500">
                  {result.metadata.source && <span>Fonte: {result.metadata.source}</span>}
                  {result.metadata.author && <span>Autor: {result.metadata.author}</span>}
                  {result.metadata.date && <span>Data: {result.metadata.date}</span>}
                  {/* Renderizar outros metadados */}
                  {Object.entries(result.metadata)
                    .filter(([key]) => !["source", "author", "date"].includes(key))
                    .map(([key, value]) => (
                      <span key={key}>
                        {key.charAt(0).toUpperCase() + key.slice(1)}: {value}
                      </span>
                    ))}
                </div>
              )}

              <p className="mt-2 text-sm text-gray-700">{result.content}</p>

              {result.url && (
                <div className="mt-2">
                  <Link
                    href={result.url}
                    className="text-sm font-medium text-[#4b7bb5] hover:text-[#3d649e] flex items-center gap-1"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Ver documento completo
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="ml-1"
                    >
                      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                      <polyline points="15 3 21 3 21 9"></polyline>
                      <line x1="10" y1="14" x2="21" y2="3"></line>
                    </svg>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
