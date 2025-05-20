"use client"

import { saveAs } from "file-saver"
import JSZip from "jszip"

// Interface para metadados de exportação
export interface ExportMetadata {
  version: string
  timestamp: string
  appVersion: string
  collections: string[]
  totalItems: number
}

// Configuração para exportação/importação
export interface ExportImportConfig {
  collections: {
    name: string
    storageKey: string
    label: string
  }[]
  appVersion: string
}

// Configuração padrão
const defaultConfig: ExportImportConfig = {
  collections: [
    { name: "posts", storageKey: "smp_posts", label: "Posts" },
    { name: "projects", storageKey: "smp_projects", label: "Projetos" },
    { name: "tasks", storageKey: "tasks", label: "Tarefas" },
    { name: "clients", storageKey: "clients", label: "Clientes" },
  ],
  appVersion: process.env.NEXT_PUBLIC_APP_VERSION || "1.0.0",
}

// Classe para gerenciar exportação e importação
export class ExportImport {
  private config: ExportImportConfig

  constructor(config?: Partial<ExportImportConfig>) {
    this.config = {
      ...defaultConfig,
      ...config,
      collections: [...(config?.collections || defaultConfig.collections)],
    }
  }

  // Exportar dados para arquivo ZIP
  public async exportData(selectedCollections: string[] = this.config.collections.map((c) => c.name)): Promise<Blob> {
    try {
      const zip = new JSZip()
      let totalItems = 0

      // Filtrar coleções selecionadas
      const collectionsToExport = this.config.collections.filter((c) => selectedCollections.includes(c.name))

      // Adicionar cada coleção ao ZIP
      for (const collection of collectionsToExport) {
        const data = this.getCollectionData(collection.storageKey)
        if (data && data.length > 0) {
          zip.file(`${collection.name}.json`, JSON.stringify(data, null, 2))
          totalItems += data.length
        }
      }

      // Adicionar metadados
      const metadata: ExportMetadata = {
        version: "1.0",
        timestamp: new Date().toISOString(),
        appVersion: this.config.appVersion,
        collections: collectionsToExport.map((c) => c.name),
        totalItems,
      }

      zip.file("metadata.json", JSON.stringify(metadata, null, 2))

      // Gerar arquivo ZIP
      return await zip.generateAsync({ type: "blob" })
    } catch (error) {
      console.error("Erro ao exportar dados:", error)
      throw new Error("Falha ao exportar dados. Verifique o console para mais detalhes.")
    }
  }

  // Salvar arquivo de exportação
  public async saveExportFile(
    selectedCollections: string[] = this.config.collections.map((c) => c.name),
  ): Promise<void> {
    try {
      const blob = await this.exportData(selectedCollections)
      const timestamp = new Date().toISOString().replace(/[:.]/g, "-")
      saveAs(blob, `integrare-export-${timestamp}.zip`)
    } catch (error) {
      console.error("Erro ao salvar arquivo de exportação:", error)
      throw error
    }
  }

  // Importar dados de arquivo ZIP
  public async importData(file: File, options: { overwrite: boolean }): Promise<ExportMetadata> {
    try {
      const zip = await JSZip.loadAsync(file)

      // Verificar metadados
      const metadataFile = zip.file("metadata.json")
      if (!metadataFile) {
        throw new Error("Arquivo de exportação inválido: metadados ausentes")
      }

      const metadataContent = await metadataFile.async("string")
      const metadata: ExportMetadata = JSON.parse(metadataContent)

      // Verificar compatibilidade de versão
      if (metadata.appVersion && metadata.appVersion !== this.config.appVersion) {
        console.warn(
          `Aviso: Versão do arquivo (${metadata.appVersion}) é diferente da versão atual (${this.config.appVersion})`,
        )
      }

      // Importar cada coleção
      for (const collectionName of metadata.collections) {
        const collectionFile = zip.file(`${collectionName}.json`)
        if (collectionFile) {
          const collectionConfig = this.config.collections.find((c) => c.name === collectionName)

          if (collectionConfig) {
            const content = await collectionFile.async("string")
            const data = JSON.parse(content)

            if (data && Array.isArray(data)) {
              this.saveCollectionData(collectionConfig.storageKey, data, options.overwrite)
            }
          }
        }
      }

      return metadata
    } catch (error) {
      console.error("Erro ao importar dados:", error)
      throw new Error("Falha ao importar dados. Verifique o console para mais detalhes.")
    }
  }

  // Obter dados de uma coleção do localStorage
  private getCollectionData(storageKey: string): any[] {
    try {
      if (typeof window === "undefined") {
        return []
      }

      const data = localStorage.getItem(storageKey)
      return data ? JSON.parse(data) : []
    } catch (error) {
      console.error(`Erro ao obter dados da coleção ${storageKey}:`, error)
      return []
    }
  }

  // Salvar dados de uma coleção no localStorage
  private saveCollectionData(storageKey: string, data: any[], overwrite: boolean): void {
    try {
      if (typeof window === "undefined") {
        return
      }

      if (overwrite) {
        // Substituir dados existentes
        localStorage.setItem(storageKey, JSON.stringify(data))
      } else {
        // Mesclar com dados existentes
        const existingData = this.getCollectionData(storageKey)
        const mergedData = this.mergeData(existingData, data)
        localStorage.setItem(storageKey, JSON.stringify(mergedData))
      }
    } catch (error) {
      console.error(`Erro ao salvar dados da coleção ${storageKey}:`, error)
      throw error
    }
  }

  // Mesclar dados existentes com novos dados
  private mergeData(existingData: any[], newData: any[]): any[] {
    // Assumindo que cada item tem um ID único
    const merged = [...existingData]
    const existingIds = new Set(existingData.map((item) => item.id))

    for (const item of newData) {
      if (!item.id) {
        // Gerar ID se não existir
        item.id = this.generateId()
        merged.push(item)
      } else if (!existingIds.has(item.id)) {
        // Adicionar apenas se ID não existir
        merged.push(item)
      }
      // Ignorar itens com IDs duplicados
    }

    return merged
  }

  // Gerar ID único
  private generateId(): string {
    return `id-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
  }

  // Obter configuração
  public getConfig(): ExportImportConfig {
    return { ...this.config }
  }
}

// Instância global
let exportImportInstance: ExportImport | null = null

// Obter instância singleton
export function getExportImport(config?: Partial<ExportImportConfig>): ExportImport {
  if (!exportImportInstance && typeof window !== "undefined") {
    exportImportInstance = new ExportImport(config)
  }
  return exportImportInstance as ExportImport
}
