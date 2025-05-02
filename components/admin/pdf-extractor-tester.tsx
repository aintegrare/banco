"use client"

import type React from "react"

import { useState } from "react"
import { FileText, Loader2, AlertCircle, CheckCircle, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function PDFExtractorTester() {
  const [url, setUrl] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const [logs, setLogs] = useState<string[]>([])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!url) return

    setIsLoading(true)
    setResult(null)
    setError(null)
    setLogs(["Iniciando extração de texto do PDF..."])

    try {
      addLog(`Enviando requisição para ${url}`)

      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 60000) // 60 segundos timeout

      const response = await fetch("/api/test-pdf-extraction", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url }),
        signal: controller.signal,
      }).catch((fetchError) => {
        if (fetchError.name === "AbortError") {
          throw new Error("A requisição excedeu o tempo limite de 60 segundos.")
        }
        throw fetchError
      })

      clearTimeout(timeoutId)

      addLog(`Resposta recebida com status: ${response.status}`)

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || `Erro: ${response.status}`)
      }

      const data = await response.json()
      addLog(`Extração concluída! ${data.textLength} caracteres extraídos`)

      if (data.diagnostics) {
        addLog(`Diagnóstico: ${data.wordCount} palavras encontradas`)
      }

      setResult(data)
    } catch (err) {
      console.error("Erro no teste de extração:", err)
      setError(err instanceof Error ? err.message : "Erro desconhecido")
      addLog(`ERRO: ${err instanceof Error ? err.message : "Erro desconhecido"}`)
    } finally {
      setIsLoading(false)
    }
  }

  const addLog = (message: string) => {
    setLogs((prev) => [...prev, message])
    console.log("PDF Tester Log:", message)
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-[#4072b0]">Teste de Extração de PDF</CardTitle>
        <CardDescription>
          Insira a URL de um PDF para testar a extração de texto usando a biblioteca pdf-parse
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-2">
            <Input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://exemplo.com/documento.pdf"
              className="flex-1"
              required
            />
            <Button type="submit" disabled={isLoading} className="bg-[#4b7bb5] hover:bg-[#3d649e]">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  <span>Extraindo...</span>
                </>
              ) : (
                <>
                  <FileText className="mr-2 h-4 w-4" />
                  <span>Extrair Texto</span>
                </>
              )}
            </Button>
          </div>
        </form>

        {logs.length > 0 && (
          <div className="p-3 bg-gray-50 border border-gray-200 rounded-md">
            <div className="flex items-center mb-2">
              <Info className="h-4 w-4 mr-2 text-[#4b7bb5]" />
              <h3 className="font-medium text-gray-700">Log de processamento:</h3>
            </div>
            <div className="bg-black text-green-400 p-2 rounded font-mono text-xs overflow-auto max-h-40">
              {logs.map((log, index) => (
                <div key={index} className={log.includes("ERRO") ? "text-red-400" : ""}>
                  {`> ${log}`}
                </div>
              ))}
            </div>
          </div>
        )}

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Erro</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {result && (
          <div className="space-y-4">
            <Alert className="bg-green-50 border-green-200">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertTitle className="text-green-700">Extração concluída com sucesso!</AlertTitle>
              <AlertDescription className="text-green-600">{result.textLength} caracteres extraídos</AlertDescription>
            </Alert>

            <Tabs defaultValue="sample">
              <TabsList>
                <TabsTrigger value="sample">Amostra</TabsTrigger>
                <TabsTrigger value="full">Texto Completo</TabsTrigger>
                <TabsTrigger value="diagnostics">Diagnóstico</TabsTrigger>
              </TabsList>
              <TabsContent value="sample" className="p-4 border rounded-md mt-2 max-h-60 overflow-auto">
                <pre className="text-sm whitespace-pre-wrap">{result.textSample}</pre>
              </TabsContent>
              <TabsContent value="full" className="p-4 border rounded-md mt-2 max-h-96 overflow-auto">
                <pre className="text-sm whitespace-pre-wrap">{result.fullText}</pre>
              </TabsContent>
              <TabsContent value="diagnostics" className="p-4 border rounded-md mt-2">
                {result.diagnostics && (
                  <div className="space-y-2">
                    <div className="grid grid-cols-2 gap-2">
                      <div className="bg-gray-50 p-2 rounded">
                        <span className="font-medium">Contém caracteres alfanuméricos:</span>{" "}
                        {result.diagnostics.hasAlphaNumeric ? "Sim" : "Não"}
                      </div>
                      <div className="bg-gray-50 p-2 rounded">
                        <span className="font-medium">Contém palavras:</span>{" "}
                        {result.diagnostics.hasWords ? "Sim" : "Não"}
                      </div>
                      <div className="bg-gray-50 p-2 rounded">
                        <span className="font-medium">Número de palavras:</span> {result.diagnostics.wordCount}
                      </div>
                      <div className="bg-gray-50 p-2 rounded">
                        <span className="font-medium">Tamanho médio das palavras:</span>{" "}
                        {result.diagnostics.averageWordLength.toFixed(2)}
                      </div>
                      <div className="bg-gray-50 p-2 rounded">
                        <span className="font-medium">Contém palavras comuns:</span>{" "}
                        {result.diagnostics.containsCommonWords ? "Sim" : "Não"}
                      </div>
                    </div>
                    <Alert>
                      <Info className="h-4 w-4" />
                      <AlertTitle>Interpretação</AlertTitle>
                      <AlertDescription>{interpretDiagnostics(result.diagnostics)}</AlertDescription>
                    </Alert>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex flex-col items-start text-xs text-muted-foreground">
        <p>Esta ferramenta usa a biblioteca pdf-parse para extrair texto de documentos PDF.</p>
        <p className="mt-1">
          Limitações: PDFs digitalizados (imagens) não terão o texto extraído corretamente sem OCR. PDFs protegidos por
          senha ou com restrições de segurança também podem falhar.
        </p>
      </CardFooter>
    </Card>
  )
}

// Função para interpretar os diagnósticos
function interpretDiagnostics(diagnostics: any) {
  if (!diagnostics.hasAlphaNumeric) {
    return "O texto extraído não contém caracteres alfanuméricos. Isso pode indicar um problema na extração ou um PDF que contém apenas imagens."
  }

  if (!diagnostics.hasWords) {
    return "O texto extraído não contém palavras reconhecíveis. Verifique se o PDF contém texto real e não apenas imagens ou gráficos."
  }

  if (diagnostics.wordCount < 10) {
    return "O texto extraído contém muito poucas palavras. O PDF pode estar vazio, protegido ou conter principalmente imagens."
  }

  if (!diagnostics.containsCommonWords) {
    return "O texto extraído não contém palavras comuns em português. Isso pode indicar que o texto está em outro idioma ou que a extração não foi bem-sucedida."
  }

  if (diagnostics.averageWordLength < 2 || diagnostics.averageWordLength > 15) {
    return "O tamanho médio das palavras é incomum. Isso pode indicar problemas na extração do texto ou um formato de documento não convencional."
  }

  return "O texto extraído parece válido e bem estruturado. A extração foi bem-sucedida."
}
