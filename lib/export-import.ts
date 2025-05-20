import { saveAs } from "file-saver"
import { offlineSync } from "./offline-sync"

// Tipos de entidades que podem ser exportadas/importadas
export type ExportableEntity = "tasks" | "projects" | "clients" | "documents" | "posts"

// Interface para o arquivo de exportação
export interface ExportFile {
  version: string
  timestamp: number
  entities: {
    [key in ExportableEntity]?: any[]
  }
  metadata: {
    exportedBy?: string
    description?: string
    appVersion: string
  }
}

// Função para exportar dados
export async function exportData(
  entities: ExportableEntity[],
  options?: {
    fileName?: string
    description?: string
    exportedBy?: string
  },
): Promise<Blob> {
  const exportData: ExportFile = {
    version: "1.0",
    timestamp: Date.now(),
    entities: {},
    metadata: {
      appVersion: process.env.NEXT_PUBLIC_APP_VERSION || "unknown",
      description: options?.description,
      exportedBy: options?.exportedBy,
    },
  }

  // Coletar dados para cada entidade
  for (const entity of entities) {
    try {
      // Tentar buscar do servidor primeiro
      const response = await fetch(`/api/export/${entity}`)

      if (response.ok) {
        const data = await response.json()
        exportData.entities[entity] = data
      } else {
        // Se falhar, tentar dados offline
        const offlineData = await offlineSync.getAllOfflineData(entity)
        if (offlineData && offlineData.length > 0) {
          exportData.entities[entity] = offlineData
        } else {
          console.warn(`Não foi possível exportar dados para ${entity}`)
        }
      }
    } catch (error) {
      console.error(`Erro ao exportar ${entity}:`, error)
    }
  }

  // Converter para JSON e criar blob
  const jsonString = JSON.stringify(exportData, null, 2)
  const blob = new Blob([jsonString], { type: "application/json" })

  // Salvar arquivo se fileName for fornecido
  if (options?.fileName) {
    const fileName = options.fileName.endsWith(".json") ? options.fileName : `${options.fileName}.json`
    saveAs(blob, fileName)
  }

  return blob
}

// Função para importar dados
export async function importData(
  file: File,
  options?: {
    entities?: ExportableEntity[]
    onProgress?: (progress: number) => void
  },
): Promise<{ success: boolean; message: string; importedEntities: ExportableEntity[] }> {
  try {
    // Ler o arquivo
    const fileContent = await file.text()
    const importData = JSON.parse(fileContent) as ExportFile

    // Validar o formato do arquivo
    if (!importData.version || !importData.entities || !importData.metadata) {
      return {
        success: false,
        message: "Formato de arquivo inválido",
        importedEntities: [],
      }
    }

    // Filtrar entidades se necessário
    const entitiesToImport = options?.entities || (Object.keys(importData.entities) as ExportableEntity[])
    const importedEntities: ExportableEntity[] = []

    // Processar cada entidade
    let processedEntities = 0
    const totalEntities = entitiesToImport.length

    for (const entity of entitiesToImport) {
      if (importData.entities[entity]) {
        try {
          // Tentar importar para o servidor
          const response = await fetch(`/api/import/${entity}`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(importData.entities[entity]),
          })

          if (response.ok) {
            importedEntities.push(entity)
          } else {
            // Se falhar, armazenar offline para sincronização posterior
            const items = importData.entities[entity] || []
            for (const item of items) {
              await offlineSync.storeOfflineData(entity, item.id, item)
              await offlineSync.queueItem(entity, item, "update")
            }
            importedEntities.push(entity)
          }
        } catch (error) {
          console.error(`Erro ao importar ${entity}:`, error)
        }
      }

      // Atualizar progresso
      processedEntities++
      if (options?.onProgress) {
        options.onProgress(Math.round((processedEntities / totalEntities) * 100))
      }
    }

    return {
      success: importedEntities.length > 0,
      message:
        importedEntities.length > 0
          ? `Importação concluída com sucesso para ${importedEntities.length} entidades`
          : "Nenhuma entidade foi importada",
      importedEntities,
    }
  } catch (error) {
    console.error("Erro ao importar dados:", error)
    return {
      success: false,
      message: `Erro ao importar dados: ${error instanceof Error ? error.message : "Erro desconhecido"}`,
      importedEntities: [],
    }
  }
}
