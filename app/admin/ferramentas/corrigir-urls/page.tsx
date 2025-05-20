"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Loader2, AlertCircle, CheckCircle } from "lucide-react"

export default function FixDocumentUrlsPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  const fixUrls = async () => {
    setIsLoading(true)
    setError(null)
    setResult(null)

    try {
      const response = await fetch("/api/admin/fix-document-urls", {
        method: "POST",
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Erro ao corrigir URLs")
      }

      const data = await response.json()
      setResult(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro desconhecido")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold text-[#4b7bb5] mb-6">Corrigir URLs de Documentos</h1>

      <Card>
        <CardHeader>
          <CardTitle>Correção de URLs</CardTitle>
          <CardDescription>
            Esta ferramenta corrige as URLs de todos os documentos no banco de dados, garantindo que elas incluam o
            caminho correto com a pasta do cliente.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Erro</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {result && (
            <Alert variant={result.updated > 0 ? "default" : "warning"} className="mb-4">
              {result.updated > 0 ? (
                <CheckCircle className="h-4 w-4 text-green-500" />
              ) : (
                <AlertCircle className="h-4 w-4" />
              )}
              <AlertTitle>
                {result.updated > 0
                  ? `${result.updated} URLs atualizadas com sucesso`
                  : "Nenhuma URL precisou ser atualizada"}
              </AlertTitle>
              <AlertDescription>
                Total de documentos: {result.total}
                <br />
                Atualizados: {result.updated}
                <br />
                Falhas: {result.failed}
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
        <CardFooter>
          <Button onClick={fixUrls} disabled={isLoading} className="bg-[#4b7bb5] hover:bg-[#3d649e]">
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Corrigindo URLs...
              </>
            ) : (
              "Corrigir URLs de Documentos"
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
