"use client"

import type React from "react"

import { useState, useRef } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { useToast } from "@/components/ui/use-toast"
import { Download, Upload, FileText, CheckCircle, AlertCircle } from "lucide-react"
import { exportData, importData, type ExportableEntity } from "@/lib/export-import"

interface ExportImportDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ExportImportDialog({ open, onOpenChange }: ExportImportDialogProps) {
  const [activeTab, setActiveTab] = useState("export")
  const [selectedEntities, setSelectedEntities] = useState<ExportableEntity[]>(["tasks", "projects", "clients"])
  const [exportFileName, setExportFileName] = useState(`integrare-export-${new Date().toISOString().split("T")[0]}`)
  const [exportDescription, setExportDescription] = useState("")
  const [exportedBy, setExportedBy] = useState("")

  const [importFile, setImportFile] = useState<File | null>(null)
  const [importProgress, setImportProgress] = useState(0)
  const [isProcessing, setIsProcessing] = useState(false)
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null)

  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  const handleEntityToggle = (entity: ExportableEntity) => {
    if (selectedEntities.includes(entity)) {
      setSelectedEntities(selectedEntities.filter((e) => e !== entity))
    } else {
      setSelectedEntities([...selectedEntities, entity])
    }
  }

  const handleExport = async () => {
    if (selectedEntities.length === 0) {
      toast({
        title: "Nenhuma entidade selecionada",
        description: "Selecione pelo menos uma entidade para exportar",
        variant: "destructive",
      })
      return
    }

    setIsProcessing(true)
    try {
      await exportData(selectedEntities, {
        fileName: exportFileName,
        description: exportDescription,
        exportedBy: exportedBy,
      })

      setResult({
        success: true,
        message: `Exportação concluída com sucesso. ${selectedEntities.length} entidades exportadas.`,
      })

      toast({
        title: "Exportação concluída",
        description: "Os dados foram exportados com sucesso.",
      })
    } catch (error) {
      console.error("Erro na exportação:", error)
      setResult({
        success: false,
        message: `Erro na exportação: ${error instanceof Error ? error.message : "Erro desconhecido"}`,
      })

      toast({
        title: "Erro na exportação",
        description: "Não foi possível exportar os dados. Tente novamente.",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setImportFile(e.target.files[0])
      setResult(null)
    }
  }

  const handleImport = async () => {
    if (!importFile) {
      toast({
        title: "Nenhum arquivo selecionado",
        description: "Selecione um arquivo para importar",
        variant: "destructive",
      })
      return
    }

    setIsProcessing(true)
    setImportProgress(0)

    try {
      const result = await importData(importFile, {
        entities: selectedEntities.length > 0 ? selectedEntities : undefined,
        onProgress: setImportProgress,
      })

      setResult(result)

      toast({
        title: result.success ? "Importação concluída" : "Erro na importação",
        description: result.message,
        variant: result.success ? "default" : "destructive",
      })
    } catch (error) {
      console.error("Erro na importação:", error)
      setResult({
        success: false,
        message: `Erro na importação: ${error instanceof Error ? error.message : "Erro desconhecido"}`,
      })

      toast({
        title: "Erro na importação",
        description: "Não foi possível importar os dados. Tente novamente.",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const resetForm = () => {
    setResult(null)
    setImportFile(null)
    setImportProgress(0)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Exportar / Importar Dados</DialogTitle>
          <DialogDescription>Exporte seus dados para backup ou importe dados previamente exportados.</DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="export" disabled={isProcessing}>
              <Download className="h-4 w-4 mr-2" />
              Exportar
            </TabsTrigger>
            <TabsTrigger value="import" disabled={isProcessing}>
              <Upload className="h-4 w-4 mr-2" />
              Importar
            </TabsTrigger>
          </TabsList>

          <TabsContent value="export" className="space-y-4 pt-4">
            <div>
              <h3 className="text-sm font-medium mb-2">Selecione os dados para exportar:</h3>
              <div className="grid grid-cols-2 gap-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="export-tasks"
                    checked={selectedEntities.includes("tasks")}
                    onCheckedChange={() => handleEntityToggle("tasks")}
                  />
                  <Label htmlFor="export-tasks">Tarefas</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="export-projects"
                    checked={selectedEntities.includes("projects")}
                    onCheckedChange={() => handleEntityToggle("projects")}
                  />
                  <Label htmlFor="export-projects">Projetos</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="export-clients"
                    checked={selectedEntities.includes("clients")}
                    onCheckedChange={() => handleEntityToggle("clients")}
                  />
                  <Label htmlFor="export-clients">Clientes</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="export-documents"
                    checked={selectedEntities.includes("documents")}
                    onCheckedChange={() => handleEntityToggle("documents")}
                  />
                  <Label htmlFor="export-documents">Documentos</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="export-posts"
                    checked={selectedEntities.includes("posts")}
                    onCheckedChange={() => handleEntityToggle("posts")}
                  />
                  <Label htmlFor="export-posts">Posts</Label>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="export-filename">Nome do arquivo</Label>
              <Input
                id="export-filename"
                value={exportFileName}
                onChange={(e) => setExportFileName(e.target.value)}
                placeholder="Nome do arquivo de exportação"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="export-description">Descrição (opcional)</Label>
              <Textarea
                id="export-description"
                value={exportDescription}
                onChange={(e) => setExportDescription(e.target.value)}
                placeholder="Descrição do conteúdo exportado"
                rows={2}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="exported-by">Exportado por (opcional)</Label>
              <Input
                id="exported-by"
                value={exportedBy}
                onChange={(e) => setExportedBy(e.target.value)}
                placeholder="Seu nome ou identificação"
              />
            </div>

            {result && (
              <div
                className={`p-3 rounded-md ${result.success ? "bg-green-50 text-green-800" : "bg-red-50 text-red-800"}`}
              >
                <div className="flex items-start">
                  {result.success ? (
                    <CheckCircle className="h-5 w-5 mr-2 flex-shrink-0" />
                  ) : (
                    <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
                  )}
                  <p className="text-sm">{result.message}</p>
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="import" className="space-y-4 pt-4">
            <div>
              <h3 className="text-sm font-medium mb-2">Selecione um arquivo para importar:</h3>
              <div className="flex items-center gap-2">
                <Input ref={fileInputRef} type="file" accept=".json" onChange={handleFileChange} className="flex-1" />
                {importFile && (
                  <Button variant="outline" size="sm" onClick={resetForm}>
                    Limpar
                  </Button>
                )}
              </div>

              {importFile && (
                <div className="flex items-center mt-2 text-sm text-gray-500">
                  <FileText className="h-4 w-4 mr-2" />
                  <span>
                    {importFile.name} ({Math.round(importFile.size / 1024)} KB)
                  </span>
                </div>
              )}
            </div>

            {isProcessing && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Progresso</span>
                  <span>{importProgress}%</span>
                </div>
                <Progress value={importProgress} className="h-2" />
              </div>
            )}

            {result && (
              <div
                className={`p-3 rounded-md ${result.success ? "bg-green-50 text-green-800" : "bg-red-50 text-red-800"}`}
              >
                <div className="flex items-start">
                  {result.success ? (
                    <CheckCircle className="h-5 w-5 mr-2 flex-shrink-0" />
                  ) : (
                    <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
                  )}
                  <p className="text-sm">{result.message}</p>
                </div>
              </div>
            )}

            <div>
              <h3 className="text-sm font-medium mb-2">Filtrar entidades (opcional):</h3>
              <p className="text-xs text-gray-500 mb-2">
                Se desejar importar apenas tipos específicos de dados, selecione-os abaixo. Caso contrário, todos os
                dados do arquivo serão importados.
              </p>
              <div className="grid grid-cols-2 gap-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="import-tasks"
                    checked={selectedEntities.includes("tasks")}
                    onCheckedChange={() => handleEntityToggle("tasks")}
                  />
                  <Label htmlFor="import-tasks">Tarefas</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="import-projects"
                    checked={selectedEntities.includes("projects")}
                    onCheckedChange={() => handleEntityToggle("projects")}
                  />
                  <Label htmlFor="import-projects">Projetos</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="import-clients"
                    checked={selectedEntities.includes("clients")}
                    onCheckedChange={() => handleEntityToggle("clients")}
                  />
                  <Label htmlFor="import-clients">Clientes</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="import-documents"
                    checked={selectedEntities.includes("documents")}
                    onCheckedChange={() => handleEntityToggle("documents")}
                  />
                  <Label htmlFor="import-documents">Documentos</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="import-posts"
                    checked={selectedEntities.includes("posts")}
                    onCheckedChange={() => handleEntityToggle("posts")}
                  />
                  <Label htmlFor="import-posts">Posts</Label>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isProcessing}>
            Cancelar
          </Button>
          {activeTab === "export" ? (
            <Button onClick={handleExport} disabled={isProcessing || selectedEntities.length === 0}>
              {isProcessing ? "Exportando..." : "Exportar Dados"}
            </Button>
          ) : (
            <Button onClick={handleImport} disabled={isProcessing || !importFile}>
              {isProcessing ? "Importando..." : "Importar Dados"}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
