import type React from "react"

interface SearchResult {
  id: number
  title: string
  url: string
  snippet: string
  source: string
  sourceIcon: React.ReactNode
}

interface SearchResultsProps {
  results: SearchResult[]
}

export function SearchResults({ results }: SearchResultsProps) {
  if (results.length === 0) {
    return <p className="text-gray-500">Nenhum resultado encontrado.</p>
  }

  return (
    <div className="space-y-6">
      {results.map((result) => (
        <div key={result.id} className="border-b border-gray-100 pb-4 last:border-0 last:pb-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[#4b7bb5]">{result.sourceIcon}</span>
            <span className="text-xs text-gray-500 uppercase">{result.source}</span>
          </div>
          <h3 className="text-lg font-medium text-[#3d649e] mb-1">
            <a href={result.url} target="_blank" rel="noopener noreferrer" className="hover:underline">
              {result.title}
            </a>
          </h3>
          <p className="text-gray-600 text-sm">{result.snippet}</p>
          <a
            href={result.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-[#527eb7] hover:underline mt-1 inline-block"
          >
            {result.url}
          </a>
        </div>
      ))}
    </div>
  )
}
