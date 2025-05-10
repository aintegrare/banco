"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Loader2, AlertCircle, CheckCircle, FolderTree, RefreshCw, FileText } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"

export default function DocumentPathsPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [results, setResults] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  const updateDocumentUrls = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/admin/update-document-urls", {
        method: "POST",
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Erro ao atualizar URLs de documentos")
      }

      setResults(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro desconhecido")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-[#4b7bb5]">Gerenciamento de Caminhos de Documentos</h1>
          <p className="text-gray-500 mt-1">Ferramentas para gerenciar e corrigir caminhos de documentos no sistema</p>
        </div>
      </div>

      <Tabs defaultValue="update">
        <TabsList className="mb-4">
          <TabsTrigger value="update">Atualizar URLs</TabsTrigger>
          <TabsTrigger value="diagnose">Diagnóstico</TabsTrigger>
        </TabsList>

        <TabsContent value="update">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FolderTree className="mr-2 h-5 w-5 text-[#4b7bb5]" />
                Atualizar URLs de Documentos
              </CardTitle>
              <CardDescription>
                Esta ferramenta verifica e corrige as URLs dos documentos no banco de dados para garantir que elas
                apontem para os caminhos corretos, incluindo as pastas de clientes.
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

              {results && (
                <div className="mb-4">
                  <Alert variant={results.updated > 0 ? "default" : "warning"} className="mb-4">
                    {results.updated > 0 ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : (
                      <AlertCircle className="h-4 w-4" />
                    )}
                    <AlertTitle>
                      {results.updated > 0
                        ? `${results.updated} URLs atualizadas com sucesso`
                        : "Nenhuma URL precisou ser atualizada"}
                    </AlertTitle>
                    <AlertDescription>
                      Total de documentos: {results.total}
                      <br />
                      Atualizados: {results.updated}
                      <br />
                      Falhas: {results.failed}
                    </AlertDescription>
                  </Alert>

                  {results.details && results.details.length > 0 && (
                    <div className="mt-4">
                      <h3 className="text-sm font-medium mb-2">Detalhes:</h3>
                      <ScrollArea className="h-64 rounded-md border">
                        <div className="p-4">
                          {results.details.map((detail: any, index: number) => (
                            <div key={index} className="mb-4 pb-4 border-b border-gray-100 last:border-0">
                              <div className="flex items-center justify-between mb-2">
                                <div className="font-medium">{detail.title || `Documento #${detail.id}`}</div>
                                <Badge variant={detail.status === "success" ? "default" : "destructive"}>
                                  {detail.status === "success" ? "Atualizado" : "Erro"}
                                </Badge>
                              </div>

                              {detail.status === "success" ? (
                                <>
                                  <div className="text-sm text-gray-500 mb-1">
                                    <span className="font-medium">URL Original:</span>
                                  </div>
                                  <div className="text-xs bg-gray-50 p-2 rounded mb-2 break-all">{detail.oldUrl}</div>
                                  <div className="text-sm text-gray-500 mb-1">
                                    <span className="font-medium">Nova URL:</span>
                                  </div>
                                  <div className="text-xs bg-blue-50 p-2 rounded break-all">{detail.newUrl}</div>
                                </>
                              ) : (
                                <div className="text-sm text-red-500">{detail.error}</div>
                              )}
                            </div>
                          ))}
                        </div>
                      </ScrollArea>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button onClick={updateDocumentUrls} disabled={isLoading} className="bg-[#4b7bb5] hover:bg-[#3d649e]">
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Atualizando...
                  </>
                ) : (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Atualizar URLs de Documentos
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="diagnose">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="mr-2 h-5 w-5 text-[#4b7bb5]" />
                Diagnóstico de Caminhos
              </CardTitle>
              <CardDescription>Ferramentas para diagnosticar problemas com caminhos de documentos.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500">Funcionalidades de diagnóstico serão adicionadas em breve.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
