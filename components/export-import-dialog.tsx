"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { getExportImport, type ExportMetadata } from "@/lib/export-import"
import { Download, Upload, FileUp, Check, AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"

interface ExportImportDialogProps {
  trigger?: React.ReactNode
  defaultTab?: "export" | "import"
  onExportComplete?: () => void
  onImportComplete?: (metadata: ExportMetadata) => void
}

export function ExportImportDialog({
  trigger,
  defaultTab = "export",
  onExportComplete,
  onImportComplete,
}: ExportImportDialogProps) {
  const [open, setOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<"export" | "import">(defaultTab)
  const [selectedCollections, setSelectedCollections] = useState<string[]>([])
  const [importMode, setImportMode] = useState<"merge" | "overwrite">("merge")
  const [importFile, setImportFile] = useState<File | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [result, setResult] = useState<{
    success: boolean
    message: string
    details?: string
    metadata?: ExportMetadata
  } | null>(null)

  const exportImport = getExportImport()
  const collections = exportImport.getConfig().collections

  // Alternar seleção de coleção
  const toggleCollection = (name: string) => {
    setSelectedCollections((prev) => (prev.includes(name) ? prev.filter((c) => c !== name) : [...prev, name]))
  }

  // Selecionar todas as coleções
  const selectAllCollections = () => {
    setSelectedCollections(collections.map((c) => c.name))
  }

  // Limpar seleção de coleções
  const clearCollections = () => {
    setSelectedCollections([])
  }

  // Manipular exportação
  const handleExport = async () => {
    if (selectedCollections.length === 0) {
      setResult({
        success: false,
        message: "Nenhuma coleção selecionada",
        details: "Selecione pelo menos uma coleção para exportar.",
      })
      return
    }

    try {
      setIsProcessing(true)
      setProgress(10)

      // Simular progresso
      const progressInterval = setInterval(() => {
        setProgress((prev) => (prev < 90 ? prev + 10 : prev))
      }, 200)

      await exportImport.saveExportFile(selectedCollections)

      clearInterval(progressInterval)
      setProgress(100)

      setResult({
        success: true,
        message: "Exportação concluída com sucesso",
        details: `${selectedCollections.length} coleções foram exportadas.`,
      })

      if (onExportComplete) {
        onExportComplete()
      }
    } catch (error) {
      setResult({
        success: false,
        message: "Erro ao exportar dados",
        details: error instanceof Error ? error.message : "Erro desconhecido",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  // Manipular importação
  const handleImport = async () => {
    if (!importFile) {
      setResult({
        success: false,
        message: "Nenhum arquivo selecionado",
        details: "Selecione um arquivo de exportação para importar.",
      })
      return
    }

    try {
      setIsProcessing(true)
      setProgress(10)

      // Simular progresso
      const progressInterval = setInterval(() => {
        setProgress((prev) => (prev < 90 ? prev + 10 : prev))
      }, 200)

      const metadata = await exportImport.importData(importFile, {
        overwrite: importMode === "overwrite",
      })

      clearInterval(progressInterval)
      setProgress(100)

      setResult({
        success: true,
        message: "Importação concluída com sucesso",
        details: `${metadata.totalItems} itens foram importados de ${metadata.collections.length} coleções.`,
        metadata,
      })

      if (onImportComplete) {
        onImportComplete(metadata)
      }
    } catch (error) {
      setResult({
        success: false,
        message: "Erro ao importar dados",
        details: error instanceof Error ? error.message : "Erro desconhecido",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  // Manipular seleção de arquivo
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      setImportFile(files[0])
    }
  }

  // Resetar estado
  const resetState = () => {
    setSelectedCollections([])
    setImportFile(null)
    setImportMode("merge")
    setIsProcessing(false)
    setProgress(0)
    setResult(null)
  }

  // Fechar diálogo
  const handleClose = () => {
    setOpen(false)
    setTimeout(resetState, 300) // Resetar após animação de fechamento
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger || <Button>Exportar/Importar</Button>}</DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Exportar/Importar Dados</DialogTitle>
          <DialogDescription>
            Exporte seus dados para backup ou importe dados de um arquivo de exportação.
          </DialogDescription>
        </DialogHeader>

        {/* Abas */}
        <div className="flex border-b mb-4">
          <button
            className={`px-4 py-2 ${
              activeTab === "export" ? "border-b-2 border-primary font-medium" : "text-muted-foreground"
            }`}
            onClick={() => {
              setActiveTab("export")
              setResult(null)
            }}
          >
            <Download className="h-4 w-4 inline mr-2" />
            Exportar
          </button>
          <button
            className={`px-4 py-2 ${
              activeTab === "import" ? "border-b-2 border-primary font-medium" : "text-muted-foreground"
            }`}
            onClick={() => {
              setActiveTab("import")
              setResult(null)
            }}
          >
            <Upload className="h-4 w-4 inline mr-2" />
            Importar
          </button>
        </div>

        {/* Conteúdo da aba */}
        <div className="py-2">
          {activeTab === "export" ? (
            <div className="space-y-4">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-sm font-medium">Selecione as coleções para exportar:</h3>
                <div className="space-x-2">
                  <Button variant="outline" size="sm" onClick={selectAllCollections}>
                    Selecionar todos
                  </Button>
                  <Button variant="outline" size="sm" onClick={clearCollections}>
                    Limpar
                  </Button>
                </div>
              </div>

              <div className="space-y-2 max-h-[200px] overflow-y-auto border rounded-md p-2">
                {collections.map((collection) => (
                  <div key={collection.name} className="flex items-center space-x-2">
                    <Checkbox
                      id={`collection-${collection.name}`}
                      checked={selectedCollections.includes(collection.name)}
                      onCheckedChange={() => toggleCollection(collection.name)}
                    />
                    <Label htmlFor={`collection-${collection.name}`} className="text-sm cursor-pointer">
                      {collection.label}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="import-file">Selecione o arquivo de exportação:</Label>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    onClick={() => document.getElementById("import-file")?.click()}
                    className="w-full justify-start"
                  >
                    <FileUp className="h-4 w-4 mr-2" />
                    {importFile ? importFile.name : "Selecionar arquivo..."}
                  </Button>
                  <input type="file" id="import-file" accept=".zip" className="hidden" onChange={handleFileChange} />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Modo de importação:</Label>
                <RadioGroup
                  value={importMode}
                  onValueChange={(value) => setImportMode(value as "merge" | "overwrite")}
                  className="flex flex-col space-y-1"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="merge" id="merge" />
                    <Label htmlFor="merge" className="cursor-pointer">
                      Mesclar - Adicionar novos itens sem substituir existentes
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="overwrite" id="overwrite" />
                    <Label htmlFor="overwrite" className="cursor-pointer">
                      Substituir - Substituir todos os dados existentes
                    </Label>
                  </div>
                </RadioGroup>
              </div>
            </div>
          )}

          {/* Progresso */}
          {isProcessing && (
            <div className="mt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span>Processando...</span>
                <span>{progress}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          )}

          {/* Resultado */}
          {result && (
            <Alert className={`mt-4 ${result.success ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"}`}>
              <div className="flex items-center gap-2">
                {result.success ? (
                  <Check className="h-4 w-4 text-green-600" />
                ) : (
                  <AlertCircle className="h-4 w-4 text-red-600" />
                )}
                <AlertTitle className={result.success ? "text-green-700" : "text-red-700"}>{result.message}</AlertTitle>
              </div>
              <AlertDescription className="text-sm mt-1">{result.details}</AlertDescription>
            </Alert>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Fechar
          </Button>
          {activeTab === "export" ? (
            <Button onClick={handleExport} disabled={isProcessing || selectedCollections.length === 0}>
              <Download className="h-4 w-4 mr-2" />
              Exportar
            </Button>
          ) : (
            <Button onClick={handleImport} disabled={isProcessing || !importFile}>
              <Upload className="h-4 w-4 mr-2" />
              Importar
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
