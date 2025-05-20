"use client"

import type React from "react"

import { useState, useRef } from "react"
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { toast } from "@/components/ui/use-toast"
import { Download, Upload, FileJson, FileSpreadsheet, Loader2 } from "lucide-react"
import { useExportImport, type ExportConfig, type ImportConfig } from "@/lib/export-import"

interface ExportImportDialogProps {
  collections: string[]
  defaultFileName?: string
  trigger?: React.ReactNode
  className?: string
}

export function ExportImportDialog({
  collections,
  defaultFileName = "export",
  trigger,
  className = "",
}: ExportImportDialogProps) {
  const [open, setOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("export")
  const [isProcessing, setIsProcessing] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Estado para configuração de exportação
  const [exportConfig, setExportConfig] = useState<ExportConfig>({
    collections: collections,
    format: "json",
    includeMetadata: true,
    fileName: `${defaultFileName}_${new Date().toISOString().split("T")[0]}`,
  })

  // Estado para configuração de importação
  const [importConfig, setImportConfig] = useState<ImportConfig>({
    validateData: true,
    overwriteExisting: false,
    collections: collections,
  })

  // Estado para seleção de coleções
  const [selectedCollections, setSelectedCollections] = useState<Record<string, boolean>>(
    collections.reduce((acc, collection) => ({ ...acc, [collection]: true }), {}),
  )

  // Hook de exportação/importação
  const { exportData, importData } = useExportImport()

  // Atualizar coleções selecionadas
  const updateSelectedCollections = (collection: string, selected: boolean) => {
    setSelectedCollections((prev) => ({ ...prev, [collection]: selected }))

    // Atualizar configurações
    const updatedCollections = Object.entries({ ...selectedCollections, [collection]: selected })
      .filter(([_, selected]) => selected)
      .map(([collection]) => collection)

    setExportConfig((prev) => ({ ...prev, collections: updatedCollections }))
    setImportConfig((prev) => ({ ...prev, collections: updatedCollections }))
  }

  // Selecionar/deselecionar todas as coleções
  const toggleAllCollections = (selected: boolean) => {
    const newSelectedCollections = collections.reduce((acc, collection) => ({ ...acc, [collection]: selected }), {})

    setSelectedCollections(newSelectedCollections)

    const updatedCollections = selected ? [...collections] : []
    setExportConfig((prev) => ({ ...prev, collections: updatedCollections }))
    setImportConfig((prev) => ({ ...prev, collections: updatedCollections }))
  }

  // Manipular exportação
  const handleExport = async () => {
    if (exportConfig.collections.length === 0) {
      toast({
        title: "Nenhuma coleção selecionada",
        description: "Selecione pelo menos uma coleção para exportar.",
        variant: "destructive",
      })
      return
    }

    setIsProcessing(true)

    try {
      // Adicionar extensão ao nome do arquivo se não tiver
      let fileName = exportConfig.fileName || defaultFileName
      if (!fileName.endsWith(`.${exportConfig.format}`)) {
        fileName += `.${exportConfig.format}`
      }

      const success = await exportData({
        ...exportConfig,
        fileName,
      })

      if (success) {
        setOpen(false)
      }
    } finally {
      setIsProcessing(false)
    }
  }

  // Manipular importação
  const handleImport = async () => {
    if (!fileInputRef.current?.files?.length) {
      toast({
        title: "Nenhum arquivo selecionado",
        description: "Selecione um arquivo para importar.",
        variant: "destructive",
      })
      return
    }

    setIsProcessing(true)

    try {
      const file = fileInputRef.current.files[0]
      const success = await importData(file, importConfig)

      if (success) {
        setOpen(false)
      }
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {trigger ? (
        <DialogTrigger asChild>{trigger}</DialogTrigger>
      ) : (
        <DialogTrigger asChild>
          <Button variant="outline" className={className}>
            <Download className="h-4 w-4 mr-2" />
            Exportar/Importar
          </Button>
        </DialogTrigger>
      )}

      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Exportar/Importar Dados</DialogTitle>
          <DialogDescription>Exporte seus dados para backup ou importe dados de um arquivo.</DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="export">Exportar</TabsTrigger>
            <TabsTrigger value="import">Importar</TabsTrigger>
          </TabsList>

          <TabsContent value="export" className="space-y-4 py-4">
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label className="text-sm font-medium">Coleções</Label>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-7 text-xs"
                      onClick={() => toggleAllCollections(true)}
                    >
                      Selecionar Todas
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-7 text-xs"
                      onClick={() => toggleAllCollections(false)}
                    >
                      Limpar
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 max-h-[150px] overflow-y-auto border rounded-md p-2">
                  {collections.map((collection) => (
                    <div key={collection} className="flex items-center space-x-2">
                      <Checkbox
                        id={`collection-${collection}`}
                        checked={selectedCollections[collection] || false}
                        onCheckedChange={(checked) => updateSelectedCollections(collection, checked === true)}
                      />
                      <label
                        htmlFor={`collection-${collection}`}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {collection}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="export-format">Formato</Label>
                <RadioGroup
                  id="export-format"
                  value={exportConfig.format}
                  onValueChange={(value) => setExportConfig((prev) => ({ ...prev, format: value as "json" | "csv" }))}
                  className="flex"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="json" id="format-json" />
                    <Label htmlFor="format-json" className="flex items-center">
                      <FileJson className="h-4 w-4 mr-1" />
                      JSON
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 ml-4">
                    <RadioGroupItem value="csv" id="format-csv" />
                    <Label htmlFor="format-csv" className="flex items-center">
                      <FileSpreadsheet className="h-4 w-4 mr-1" />
                      CSV
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-2">
                <Label htmlFor="export-filename">Nome do arquivo</Label>
                <Input
                  id="export-filename"
                  value={exportConfig.fileName}
                  onChange={(e) => setExportConfig((prev) => ({ ...prev, fileName: e.target.value }))}
                  placeholder="Nome do arquivo de exportação"
                />
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="include-metadata"
                  checked={exportConfig.includeMetadata}
                  onCheckedChange={(checked) =>
                    setExportConfig((prev) => ({ ...prev, includeMetadata: checked === true }))
                  }
                />
                <label
                  htmlFor="include-metadata"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Incluir metadados (timestamp, versão, etc.)
                </label>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleExport} disabled={isProcessing}>
                {isProcessing ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Exportando...
                  </>
                ) : (
                  <>
                    <Download className="h-4 w-4 mr-2" />
                    Exportar
                  </>
                )}
              </Button>
            </DialogFooter>
          </TabsContent>

          <TabsContent value="import" className="space-y-4 py-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="import-file">Arquivo</Label>
                <Input id="import-file" type="file" ref={fileInputRef} accept=".json,.csv" className="cursor-pointer" />
                <p className="text-xs text-gray-500">Selecione um arquivo JSON ou CSV para importar.</p>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label className="text-sm font-medium">Coleções para importar</Label>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-7 text-xs"
                      onClick={() => toggleAllCollections(true)}
                    >
                      Selecionar Todas
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-7 text-xs"
                      onClick={() => toggleAllCollections(false)}
                    >
                      Limpar
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 max-h-[150px] overflow-y-auto border rounded-md p-2">
                  {collections.map((collection) => (
                    <div key={collection} className="flex items-center space-x-2">
                      <Checkbox
                        id={`import-collection-${collection}`}
                        checked={selectedCollections[collection] || false}
                        onCheckedChange={(checked) => updateSelectedCollections(collection, checked === true)}
                      />
                      <label
                        htmlFor={`import-collection-${collection}`}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {collection}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="validate-data"
                    checked={importConfig.validateData}
                    onCheckedChange={(checked) =>
                      setImportConfig((prev) => ({ ...prev, validateData: checked === true }))
                    }
                  />
                  <label
                    htmlFor="validate-data"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Validar dados antes de importar
                  </label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="overwrite-existing"
                    checked={importConfig.overwriteExisting}
                    onCheckedChange={(checked) =>
                      setImportConfig((prev) => ({ ...prev, overwriteExisting: checked === true }))
                    }
                  />
                  <label
                    htmlFor="overwrite-existing"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Sobrescrever dados existentes
                  </label>
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleImport} disabled={isProcessing}>
                {isProcessing ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Importando...
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4 mr-2" />
                    Importar
                  </>
                )}
              </Button>
            </DialogFooter>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
