"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Loader2 } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export function PDFExtractorTester() {
  const [pdfUrl, setPdfUrl] = useState("")
  const [extractedText, setExtractedText] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const handleExtract = async () => {
    if (!pdfUrl) {
      setError("Por favor, insira uma URL de PDF válida")
      return
    }

    setIsLoading(true)
    setError(null)
    setSuccess(null)
    setExtractedText("")

    try {
      const response = await fetch("/api/test-pdf-extraction", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ pdfUrl }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Erro ao extrair texto do PDF")
      }

      setExtractedText(data.text)
      setSuccess("Texto extraído com sucesso!")
    } catch (err) {
      setError(`Erro: ${err instanceof Error ? err.message : String(err)}`)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Teste de Extração de PDF</CardTitle>
        <CardDescription>Insira a URL de um PDF para testar a extração de texto</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Input
            placeholder="https://exemplo.com/documento.pdf"
            value={pdfUrl}
            onChange={(e) => setPdfUrl(e.target.value)}
            className="flex-1"
          />
          <Button onClick={handleExtract} disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Extraindo...
              </>
            ) : (
              "Extrair Texto"
            )}
          </Button>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertTitle>Erro</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert variant="default" className="bg-green-50 border-green-200">
            <AlertTitle>Sucesso</AlertTitle>
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        )}

        <div>
          <p className="text-sm font-medium mb-2">Texto Extraído:</p>
          <Textarea
            value={extractedText}
            readOnly
            className="min-h-[300px] font-mono text-sm"
            placeholder="O texto extraído do PDF aparecerá aqui..."
          />
        </div>
      </CardContent>
      <CardFooter className="text-xs text-muted-foreground">
        <p>
          Esta ferramenta usa a biblioteca pdf-parse para extrair texto de documentos PDF. Alguns PDFs podem não ser
          processados corretamente se forem digitalizações ou estiverem protegidos.
        </p>
      </CardFooter>
    </Card>
  )
}
