"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { Upload, FileSpreadsheet, AlertCircle, CheckCircle2, X } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { importContacts } from "@/app/actions"

export function ImportContacts({ onSuccess }: { onSuccess?: () => void }) {
  const [file, setFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<{ total: number; added: number; skipped: number } | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      // Verificar se o arquivo é CSV ou XLSX
      const fileType = selectedFile.name.split(".").pop()?.toLowerCase()
      if (fileType !== "csv" && fileType !== "xlsx") {
        setError("Formato de arquivo não suportado. Por favor, envie um arquivo CSV ou XLSX.")
        setFile(null)
        return
      }

      setFile(selectedFile)
      setError(null)
      setSuccess(null)
    }
  }

  const handleUpload = async () => {
    if (!file) return

    setIsUploading(true)
    setProgress(0)
    setError(null)
    setSuccess(null)

    try {
      // Simular progresso de upload
      const progressInterval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval)
            return 90
          }
          return prev + 10
        })
      }, 300)

      // Criar FormData para enviar o arquivo
      const formData = new FormData()
      formData.append("file", file)

      // Enviar o arquivo para processamento
      const result = await importContacts(formData)

      clearInterval(progressInterval)
      setProgress(100)

      if (result.success) {
        setSuccess({
          total: result.total || 0,
          added: result.added || 0,
          skipped: result.skipped || 0,
        })

        toast({
          title: "Importação concluída",
          description: `${result.added} de ${result.total} contatos foram importados com sucesso. ${result.skipped || 0} contatos foram ignorados por já existirem.`,
        })

        if (onSuccess) {
          onSuccess()
        }
      } else {
        throw new Error(result.error || "Erro ao importar contatos")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ocorreu um erro ao importar os contatos.")
      toast({
        title: "Erro na importação",
        description: err instanceof Error ? err.message : "Ocorreu um erro ao importar os contatos.",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
    }
  }

  const resetForm = () => {
    setFile(null)
    setError(null)
    setSuccess(null)
    setProgress(0)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  return (
    <Card className="border-primary/20">
      <CardHeader className="bg-primary/5">
        <CardTitle className="text-primary-700">Importar Contatos</CardTitle>
        <CardDescription>Importe seus contatos a partir de arquivos CSV ou XLSX.</CardDescription>
      </CardHeader>
      <CardContent className="pt-4 space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Erro</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert variant="default" className="bg-green-50 border-green-200 text-green-800">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <AlertTitle>Importação concluída</AlertTitle>
            <AlertDescription>
              {success.added} de {success.total} contatos foram importados com sucesso.
              {success.skipped > 0 && (
                <p className="mt-1">{success.skipped} contatos foram ignorados por já existirem.</p>
              )}
            </AlertDescription>
          </Alert>
        )}

        <div className="space-y-2">
          <Label htmlFor="file" className="text-primary-700">
            Arquivo
          </Label>
          <div className="flex items-center gap-2">
            <Input
              id="file"
              type="file"
              ref={fileInputRef}
              accept=".csv,.xlsx"
              onChange={handleFileChange}
              className="border-primary/30 focus-visible:ring-primary/30"
              disabled={isUploading}
            />
            {file && (
              <Button
                variant="ghost"
                size="icon"
                onClick={resetForm}
                className="hover:bg-destructive/10"
                disabled={isUploading}
              >
                <X className="h-4 w-4 text-destructive" />
                <span className="sr-only">Limpar</span>
              </Button>
            )}
          </div>
          {file && (
            <div className="flex items-center text-sm text-muted-foreground">
              <FileSpreadsheet className="h-4 w-4 mr-2 text-primary" />
              {file.name} ({(file.size / 1024).toFixed(2)} KB)
            </div>
          )}
        </div>

        {isUploading && (
          <div className="space-y-2">
            <div className="text-sm text-muted-foreground">Processando arquivo...</div>
            <Progress value={progress} className="h-2" />
          </div>
        )}

        <div className="text-sm text-muted-foreground">
          <p className="font-medium text-primary-700 mb-1">Formato esperado:</p>
          <p>O arquivo deve conter as seguintes colunas:</p>
          <ul className="list-disc pl-5 mt-1 space-y-1">
            <li>
              <span className="font-medium">nome</span>: Nome completo do contato (obrigatório)
            </li>
            <li>
              <span className="font-medium">email</span>: Email do contato (obrigatório)
            </li>
            <li>
              <span className="font-medium">telefone</span>: Número de telefone (obrigatório)
            </li>
            <li>
              <span className="font-medium">cpf</span>: CPF do contato (opcional)
            </li>
            <li>
              <span className="font-medium">cidade</span>: Cidade do contato (opcional)
            </li>
            <li>
              <span className="font-medium">categoria</span>: ID da categoria (opcional, padrão: 5-Outros)
            </li>
            <li>
              <span className="font-medium">categoria_negocio</span>: ID da categoria de negócio (opcional)
            </li>
            <li>
              <span className="font-medium">temperatura</span>: ID da temperatura (opcional, 1-Frio, 2-Morno, 3-Quente)
            </li>
            <li>
              <span className="font-medium">valor_cliente</span>: ID do valor do cliente (opcional, 1-Baixo, 2-Médio,
              3-Alto)
            </li>
            <li>
              <span className="font-medium">preferencia_contato</span>: ID da preferência (opcional, 1-WhatsApp,
              2-Ligação, 3-Email)
            </li>
            <li>
              <span className="font-medium">fonte_captacao</span>: ID da fonte de captação (opcional)
            </li>
            <li>
              <span className="font-medium">ultimo_contato</span>: Data do último contato (opcional, formato YYYY-MM-DD)
            </li>
            <li>
              <span className="font-medium">data_descoberta</span>: Data da descoberta (opcional, formato YYYY-MM-DD)
            </li>
            <li>
              <span className="font-medium">observacoes</span>: Notas sobre o contato (opcional)
            </li>
          </ul>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end border-t border-primary/10 pt-4">
        <Button onClick={handleUpload} disabled={!file || isUploading} className="bg-primary hover:bg-primary-600">
          <Upload className="h-4 w-4 mr-2" />
          {isUploading ? "Importando..." : "Importar Contatos"}
        </Button>
      </CardFooter>
    </Card>
  )
}
