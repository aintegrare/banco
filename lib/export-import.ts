"use client"

import { toast } from "@/components/ui/use-toast"

// Interface para configuração de exportação
export interface ExportConfig {
  collections: string[]
  format: "json" | "csv"
  includeMetadata: boolean
  fileName?: string
}

// Interface para configuração de importação
export interface ImportConfig {
  validateData: boolean
  overwriteExisting: boolean
  collections?: string[] // Se definido, importa apenas estas coleções
}

// Interface para metadados de exportação
export interface ExportMetadata {
  version: string
  timestamp: number
  collections: string[]
  counts: Record<string, number>
  appVersion?: string
}

// Interface para dados exportados
export interface ExportData {
  metadata: ExportMetadata
  data: Record<string, any[]>
}

// Funções para exportação e importação de dados
export const DataExportImport = {
  // Exportar dados
  exportData: async (config: ExportConfig): Promise<Blob | null> => {
    try {
      const collections = config.collections || []
      if (collections.length === 0) {
        toast({
          title: "Erro na exportação",
          description: "Nenhuma coleção selecionada para exportação.",
          variant: "destructive",
        })
        return null
      }

      // Coletar dados de cada coleção
      const data: Record<string, any[]> = {}
      const counts: Record<string, number> = {}

      for (const collection of collections) {
        try {
          // Buscar dados da coleção
          // Aqui você implementaria a lógica real para buscar dados
          // Por exemplo, usando fetch para chamar suas APIs

          const response = await fetch(`/api/${collection}`)
          if (!response.ok) {
            throw new Error(`Falha ao buscar dados da coleção ${collection}`)
          }

          const collectionData = await response.json()
          data[collection] = Array.isArray(collectionData) ? collectionData : []
          counts[collection] = data[collection].length
        } catch (error) {
          console.error(`Erro ao exportar coleção ${collection}:`, error)
          toast({
            title: "Aviso",
            description: `Não foi possível exportar a coleção ${collection}.`,
            variant: "destructive",
          })

          // Continuar com outras coleções
          data[collection] = []
          counts[collection] = 0
        }
      }

      // Criar metadados
      const metadata: ExportMetadata = {
        version: "1.0",
        timestamp: Date.now(),
        collections: Object.keys(data),
        counts,
        appVersion: process.env.NEXT_PUBLIC_APP_VERSION || "1.0.0",
      }

      // Criar objeto de exportação
      const exportObject: ExportData = {
        metadata: config.includeMetadata ? metadata : null,
        data,
      }

      // Converter para o formato desejado
      let blob: Blob

      if (config.format === "csv") {
        // Converter para CSV
        // Nota: Esta é uma implementação simplificada para CSV
        // Para dados complexos, você pode precisar de uma biblioteca mais robusta

        let csvContent = ""

        // Para cada coleção
        for (const collection of Object.keys(data)) {
          csvContent += `# Collection: ${collection}\n`

          const items = data[collection]
          if (items.length === 0) {
            csvContent += "No data\n\n"
            continue
          }

          // Cabeçalhos
          const headers = Object.keys(items[0])
          csvContent += headers.join(",") + "\n"

          // Dados
          for (const item of items) {
            const row = headers.map((header) => {
              const value = item[header]
              if (value === null || value === undefined) return ""
              if (typeof value === "object") return JSON.stringify(value).replace(/"/g, '""')
              return `"${String(value).replace(/"/g, '""')}"`
            })
            csvContent += row.join(",") + "\n"
          }

          csvContent += "\n"
        }

        blob = new Blob([csvContent], { type: "text/csv" })
      } else {
        // JSON é o formato padrão
        const jsonContent = JSON.stringify(exportObject, null, 2)
        blob = new Blob([jsonContent], { type: "application/json" })
      }

      return blob
    } catch (error) {
      console.error("Erro durante exportação:", error)
      toast({
        title: "Erro na exportação",
        description: "Ocorreu um erro ao exportar os dados. Tente novamente.",
        variant: "destructive",
      })
      return null
    }
  },

  // Importar dados
  importData: async (file: File, config: ImportConfig): Promise<boolean> => {
    try {
      // Verificar tipo de arquivo
      const isJson = file.type === "application/json" || file.name.endsWith(".json")
      const isCsv = file.type === "text/csv" || file.name.endsWith(".csv")

      if (!isJson && !isCsv) {
        toast({
          title: "Formato não suportado",
          description: "Por favor, selecione um arquivo JSON ou CSV.",
          variant: "destructive",
        })
        return false
      }

      // Ler conteúdo do arquivo
      const fileContent = await file.text()

      // Processar dados com base no formato
      let importData: ExportData

      if (isJson) {
        try {
          importData = JSON.parse(fileContent)

          // Validar estrutura básica
          if (!importData.data || typeof importData.data !== "object") {
            throw new Error("Estrutura de dados inválida")
          }
        } catch (error) {
          toast({
            title: "Arquivo JSON inválido",
            description: "O arquivo não contém um JSON válido ou está em formato incorreto.",
            variant: "destructive",
          })
          return false
        }
      } else {
        // Processar CSV
        // Esta é uma implementação simplificada
        // Para CSV complexos, considere usar uma biblioteca como PapaParse

        const lines = fileContent.split("\n")
        const data: Record<string, any[]> = {}

        let currentCollection = ""
        let headers: string[] = []

        for (let i = 0; i < lines.length; i++) {
          const line = lines[i].trim()

          if (line.startsWith("# Collection:")) {
            currentCollection = line.replace("# Collection:", "").trim()
            data[currentCollection] = []
            headers = []
          } else if (line && currentCollection && !headers.length) {
            // Esta linha contém os cabeçalhos
            headers = line.split(",").map((h) => h.trim())
          } else if (line && currentCollection && headers.length) {
            // Esta linha contém dados
            const values = line.split(",")

            if (values.length === headers.length) {
              const item: Record<string, any> = {}

              for (let j = 0; j < headers.length; j++) {
                let value = values[j].trim()

                // Tentar converter para tipos apropriados
                if (value === "") {
                  item[headers[j]] = null
                } else if (value === "true") {
                  item[headers[j]] = true
                } else if (value === "false") {
                  item[headers[j]] = false
                } else if (!isNaN(Number(value))) {
                  item[headers[j]] = Number(value)
                } else {
                  // Remover aspas se estiver entre aspas
                  if (value.startsWith('"') && value.endsWith('"')) {
                    value = value.substring(1, value.length - 1).replace(/""/g, '"')
                  }
                  item[headers[j]] = value
                }
              }

              data[currentCollection].push(item)
            }
          }
        }

        importData = {
          metadata: {
            version: "1.0",
            timestamp: Date.now(),
            collections: Object.keys(data),
            counts: Object.fromEntries(Object.entries(data).map(([key, value]) => [key, value.length])),
          },
          data,
        }
      }

      // Filtrar coleções se necessário
      if (config.collections && config.collections.length > 0) {
        const filteredData: Record<string, any[]> = {}

        for (const collection of config.collections) {
          if (importData.data[collection]) {
            filteredData[collection] = importData.data[collection]
          }
        }

        importData.data = filteredData
        importData.metadata.collections = Object.keys(filteredData)
        importData.metadata.counts = Object.fromEntries(
          Object.entries(filteredData).map(([key, value]) => [key, value.length]),
        )
      }

      // Validar dados se configurado
      if (config.validateData) {
        // Aqui você implementaria a validação específica para seus dados
        // Por exemplo, verificar se campos obrigatórios estão presentes

        for (const collection of Object.keys(importData.data)) {
          for (const item of importData.data[collection]) {
            // Exemplo de validação: verificar se tem ID
            if (!item.id) {
              toast({
                title: "Dados inválidos",
                description: `Item na coleção ${collection} não possui ID.`,
                variant: "destructive",
              })
              return false
            }

            // Adicione mais validações conforme necessário
          }
        }
      }

      // Importar dados para cada coleção
      let totalImported = 0
      let totalErrors = 0

      for (const collection of Object.keys(importData.data)) {
        const items = importData.data[collection]

        if (items.length === 0) continue

        try {
          // Aqui você implementaria a lógica real para importar dados
          // Por exemplo, usando fetch para chamar suas APIs

          // Se for para sobrescrever dados existentes
          if (config.overwriteExisting) {
            // Opção 1: Limpar coleção e inserir tudo
            // await fetch(`/api/${collection}/clear`, { method: 'POST' })

            // Opção 2: Atualizar item por item
            for (const item of items) {
              const response = await fetch(`/api/${collection}/${item.id}`, {
                method: "PUT",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify(item),
              })

              if (response.ok) {
                totalImported++
              } else {
                totalErrors++
              }
            }
          } else {
            // Inserir apenas novos itens
            // Primeiro, buscar IDs existentes
            const existingResponse = await fetch(`/api/${collection}/ids`)
            const existingIds = await existingResponse.json()

            // Filtrar apenas novos itens
            const newItems = items.filter((item) => !existingIds.includes(item.id))

            // Inserir novos itens
            for (const item of newItems) {
              const response = await fetch(`/api/${collection}`, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify(item),
              })

              if (response.ok) {
                totalImported++
              } else {
                totalErrors++
              }
            }
          }
        } catch (error) {
          console.error(`Erro ao importar coleção ${collection}:`, error)
          toast({
            title: "Erro na importação",
            description: `Falha ao importar dados para ${collection}.`,
            variant: "destructive",
          })
          totalErrors += items.length
        }
      }

      // Notificar resultado
      if (totalImported > 0) {
        toast({
          title: "Importação concluída",
          description: `${totalImported} item(s) importado(s) com sucesso.${totalErrors > 0 ? ` ${totalErrors} erro(s).` : ""}`,
        })
        return true
      } else if (totalErrors > 0) {
        toast({
          title: "Falha na importação",
          description: `Nenhum item foi importado. ${totalErrors} erro(s).`,
          variant: "destructive",
        })
        return false
      } else {
        toast({
          title: "Nenhum dado importado",
          description: "Não havia dados para importar ou todos os itens já existem.",
        })
        return true
      }
    } catch (error) {
      console.error("Erro durante importação:", error)
      toast({
        title: "Erro na importação",
        description: "Ocorreu um erro ao importar os dados. Tente novamente.",
        variant: "destructive",
      })
      return false
    }
  },

  // Baixar arquivo
  downloadFile: (blob: Blob, fileName: string): void => {
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = fileName
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  },
}

// Hook para usar exportação/importação em componentes
export function useExportImport() {
  const exportData = async (config: ExportConfig): Promise<boolean> => {
    const blob = await DataExportImport.exportData(config)

    if (blob) {
      const fileName = config.fileName || `export_${Date.now()}.${config.format}`
      DataExportImport.downloadFile(blob, fileName)
      return true
    }

    return false
  }

  const importData = async (file: File, config: ImportConfig): Promise<boolean> => {
    return await DataExportImport.importData(file, config)
  }

  return {
    exportData,
    importData,
  }
}
