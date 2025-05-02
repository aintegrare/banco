"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2, AlertCircle, CheckCircle, FileText, Info } from "lucide-react"

export function PDFDiagnostics() {
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
    setLogs(["Iniciando diagnóstico do PDF..."])

    try {
      addLog(`Enviando requisição para diagnosticar: ${url}`)

      const response = await fetch("/api/diagnose-pdf", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url }),
      })

      addLog(`Resposta recebida com status: ${response.status}`)

      const data = await response.json()

      if (!data.success) {
        addLog(`ERRO: ${data.error}`)
        addLog(`Estágio da falha: ${data.stage || "desconhecido"}`)

        if (data.details) {
          Object.entries(data.details).forEach(([key, value]) => {
            addLog(`${key}: ${value}`)
          })
        }

        setError(data.error)
      } else {
        addLog(`Diagnóstico concluído com sucesso!`)
        addLog(`Texto extraído: ${data.details.textLength} caracteres, ${data.details.wordCount} palavras`)
        addLog(`Tempo de extração: ${data.details.extractionTime}ms`)
        setResult(data)
      }
    } catch (err) {
      console.error("Erro no diagnóstico:", err)
      setError(err instanceof Error ? err.message : "Erro desconhecido")
      addLog(`ERRO: ${err instanceof Error ? err.message : "Erro desconhecido"}`)
    } finally {
      setIsLoading(false)
    }
  }

  const addLog = (message: string) => {
    setLogs((prev) => [...prev, message])
    console.log("PDF Diagnostics Log:", message)
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-[#4072b0]">Diagnóstico de Acesso a PDF</CardTitle>
        <CardDescription>
          Ferramenta para diagnosticar problemas de acesso e extração de texto de arquivos PDF
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
                  <span>Diagnosticando...</span>
                </>
              ) : (
                <>
                  <FileText className="mr-2 h-4 w-4" />
                  <span>Diagnosticar PDF</span>
                </>
              )}
            </Button>
          </div>
        </form>

        {logs.length > 0 && (
          <div className="p-3 bg-gray-50 border border-gray-200 rounded-md">
            <div className="flex items-center mb-2">
              <Info className="h-4 w-4 mr-2 text-[#4b7bb5]" />
              <h3 className="font-medium text-gray-700">Log de diagnóstico:</h3>
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
            <AlertTitle>Problema Detectado</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {result && (
          <div className="space-y-4">
            <Alert className="bg-green-50 border-green-200">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertTitle className="text-green-700">PDF Acessível</AlertTitle>
              <AlertDescription className="text-green-600">
                O PDF foi acessado e o texto foi extraído com sucesso.
              </AlertDescription>
            </Alert>

            <Tabs defaultValue="sample">
              <TabsList>
                <TabsTrigger value="sample">Amostra de Texto</TabsTrigger>
                <TabsTrigger value="details">Detalhes</TabsTrigger>
              </TabsList>
              <TabsContent value="sample" className="p-4 border rounded-md mt-2 max-h-60 overflow-auto">
                <pre className="text-sm whitespace-pre-wrap">{result.details.textSample}</pre>
              </TabsContent>
              <TabsContent value="details" className="p-4 border rounded-md mt-2">
                <div className="space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-gray-50 p-2 rounded">
                      <span className="font-medium">Tamanho do texto:</span> {result.details.textLength} caracteres
                    </div>
                    <div className="bg-gray-50 p-2 rounded">
                      <span className="font-medium">Número de palavras:</span> {result.details.wordCount}
                    </div>
                    <div className="bg-gray-50 p-2 rounded">
                      <span className="font-medium">Tempo de extração:</span> {result.details.extractionTime}ms
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex flex-col items-start text-xs text-muted-foreground">
        <p>Esta ferramenta verifica o acesso e a capacidade de extração de texto de arquivos PDF.</p>
        <p className="mt-1">
          Ela realiza verificações em várias etapas: existência do arquivo, estrutura do PDF e extração de texto.
        </p>
      </CardFooter>
    </Card>
  )
}
