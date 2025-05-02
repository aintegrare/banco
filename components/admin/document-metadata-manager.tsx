"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2, FileText, AlertCircle, CheckCircle, RefreshCw } from "lucide-react"
import { toast } from "@/components/ui/use-toast"

interface DocumentMetadata {
  id: number
  title: string
  originalFileName: string
  storedFileName: string
  fileUrl: string
  filePath: string
  fileType: string
  documentType: "pdf" | "website"
  timestamp: number
  processed: boolean
  processingError?: string
}

export function DocumentMetadataManager() {
  const [documents, setDocuments] = useState<DocumentMetadata[]>([])
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState<Record<number, boolean>>({})

  useEffect(() => {
    fetchDocuments()
  }, [])

  const fetchDocuments = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/document-metadata")

      if (!response.ok) {
        throw new Error(`Erro ao buscar documentos: ${response.status}`)
      }

      const data = await response.json()
      setDocuments(data)
    } catch (error) {
      console.error("Erro ao buscar documentos:", error)
      toast({
        title: "Erro",
        description: "Não foi possível carregar os documentos",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const processDocument = async (documentId: number) => {
    try {
      setProcessing((prev) => ({ ...prev, [documentId]: true }))

      const response = await fetch("/api/process-document", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ documentId }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || `Erro ao processar documento: ${response.status}`)
      }

      const result = await response.json()

      toast({
        title: "Sucesso",
        description: `Documento processado com ${result.chunksProcessed} chunks`,
      })

      // Atualizar a lista de documentos
      fetchDocuments()
    } catch (error) {
      console.error("Erro ao processar documento:", error)
      toast({
        title: "Erro",
        description: error instanceof Error ? error.message : "Erro ao processar documento",
        variant: "destructive",
      })
    } finally {
      setProcessing((prev) => ({ ...prev, [documentId]: false }))
    }
  }

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString()
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Carregando documentos...</span>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Documentos ({documents.length})</h2>
        <Button onClick={fetchDocuments} variant="outline" size="sm">
          <RefreshCw className="h-4 w-4 mr-2" />
          Atualizar
        </Button>
      </div>

      {documents.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center text-muted-foreground">
            Nenhum documento encontrado. Faça upload de documentos para começar.
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {documents.map((doc) => (
            <Card key={doc.id} className="overflow-hidden">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg truncate" title={doc.title}>
                    {doc.title}
                  </CardTitle>
                  <Badge variant={doc.processed ? "success" : "secondary"}>
                    {doc.processed ? "Processado" : "Pendente"}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="space-y-2 pb-2">
                <div className="text-sm text-muted-foreground">
                  <FileText className="h-4 w-4 inline mr-1" />
                  <span className="truncate" title={doc.originalFileName}>
                    {doc.originalFileName}
                  </span>
                </div>

                <div className="text-sm text-muted-foreground">
                  <span className="font-medium">Tipo:</span> {doc.documentType.toUpperCase()}
                </div>

                <div className="text-sm text-muted-foreground">
                  <span className="font-medium">Data:</span> {formatDate(doc.timestamp)}
                </div>

                {doc.processingError && (
                  <div className="text-sm text-red-500 flex items-start mt-2">
                    <AlertCircle className="h-4 w-4 mr-1 flex-shrink-0 mt-0.5" />
                    <span>{doc.processingError}</span>
                  </div>
                )}

                {doc.processed && !doc.processingError && (
                  <div className="text-sm text-green-500 flex items-center mt-2">
                    <CheckCircle className="h-4 w-4 mr-1" />
                    <span>Processado com sucesso</span>
                  </div>
                )}
              </CardContent>

              <CardFooter className="pt-2">
                <div className="flex justify-between w-full">
                  <Button variant="outline" size="sm" asChild>
                    <a href={doc.fileUrl} target="_blank" rel="noopener noreferrer">
                      Visualizar
                    </a>
                  </Button>

                  <Button
                    variant="default"
                    size="sm"
                    onClick={() => processDocument(doc.id)}
                    disabled={processing[doc.id]}
                  >
                    {processing[doc.id] ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Processando...
                      </>
                    ) : (
                      <>{doc.processed ? "Reprocessar" : "Processar"}</>
                    )}
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
