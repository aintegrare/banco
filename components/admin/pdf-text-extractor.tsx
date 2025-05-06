"use client"

import { useState, useEffect } from "react"
import { Loader2 } from "lucide-react"

interface PDFTextExtractorProps {
  url: string
  onTextExtracted: (text: string) => void
}

export function PDFTextExtractor({ url, onTextExtracted }: PDFTextExtractorProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function extractText() {
      try {
        setIsLoading(true)
        setError(null)

        // Importar PDF.js dinamicamente apenas no cliente
        const pdfjs = await import("pdfjs-dist")

        // Configurar o worker
        const pdfjsWorker = await import("pdfjs-dist/build/pdf.worker.entry")
        pdfjs.GlobalWorkerOptions.workerSrc = pdfjsWorker

        // Carregar o PDF
        const loadingTask = pdfjs.getDocument(url)
        const pdf = await loadingTask.promise
        const numPages = pdf.numPages

        // Extrair texto de todas as páginas
        let extractedText = ""
        const maxPagesToProcess = Math.min(numPages, 5)

        for (let i = 1; i <= maxPagesToProcess; i++) {
          const page = await pdf.getPage(i)
          const content = await page.getTextContent()
          const strings = content.items.map((item: any) => item.str)
          extractedText += strings.join(" ") + "\n"
        }

        onTextExtracted(extractedText)
      } catch (err) {
        console.error("Erro ao extrair texto do PDF:", err)
        setError(err instanceof Error ? err.message : "Erro desconhecido ao extrair texto do PDF")
        onTextExtracted("")
      } finally {
        setIsLoading(false)
      }
    }

    if (url) {
      extractText()
    }
  }, [url, onTextExtracted])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-4">
        <Loader2 className="h-6 w-6 animate-spin text-gray-500" />
        <span className="ml-2 text-sm text-gray-500">Extraindo texto do PDF...</span>
      </div>
    )
  }

  if (error) {
    return <div className="text-sm text-red-500">Erro ao extrair texto: {error}</div>
  }

  return null
}
