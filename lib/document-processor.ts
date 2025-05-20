import { supabase } from "./api"
import { getBunnyPublicUrl } from "./bunny"

/**
 * Função para garantir que o caminho do documento inclua a pasta do cliente
 * Esta função será chamada sempre que um documento for processado ou salvo
 */
export async function ensureClientFolderInPath(documentPath: string, clientName?: string): Promise<string> {
  if (!documentPath) return documentPath

  // Se já contém "/clientes/" no caminho, está correto
  if (documentPath.includes("/documents/clientes/")) {
    return documentPath
  }

  // Se contém apenas "/documents/" sem "/clientes/", adicionar "/clientes/"
  if (documentPath.includes("/documents/") && !documentPath.includes("/documents/clientes/")) {
    // Extrair a parte após "/documents/"
    const parts = documentPath.split("/documents/")
    if (parts.length > 1) {
      // Se temos um nome de cliente, adicionar ao caminho
      if (clientName) {
        return `/documents/clientes/${clientName}/${parts[1]}`
      }
      // Caso contrário, apenas adicionar "/clientes/"
      return `/documents/clientes/${parts[1]}`
    }
  }

  return documentPath
}

/**
 * Função para atualizar a URL de um documento no banco de dados
 */
export async function updateDocumentUrl(documentId: string, newUrl: string): Promise<boolean> {
  try {
    const { error } = await supabase.from("documents").update({ url: newUrl }).eq("id", documentId)

    if (error) {
      console.error(`Erro ao atualizar URL do documento ${documentId}:`, error)
      return false
    }

    return true
  } catch (error) {
    console.error(`Erro ao atualizar URL do documento ${documentId}:`, error)
    return false
  }
}

/**
 * Função para corrigir todas as URLs de documentos no banco de dados
 */
export async function fixAllDocumentUrls(): Promise<{
  total: number
  updated: number
  failed: number
  details: any[]
}> {
  const result = {
    total: 0,
    updated: 0,
    failed: 0,
    details: [] as any[],
  }

  try {
    // Buscar todos os documentos
    const { data: documents, error } = await supabase.from("documents").select("id, title, url, client_id")

    if (error) {
      throw error
    }

    if (!documents || documents.length === 0) {
      return result
    }

    result.total = documents.length

    // Buscar informações dos clientes para mapear client_id para client_name
    const { data: clients, error: clientsError } = await supabase.from("clients").select("id, name")

    if (clientsError) {
      console.error("Erro ao buscar clientes:", clientsError)
    }

    // Criar mapa de client_id para client_name
    const clientMap = new Map()
    if (clients) {
      clients.forEach((client) => {
        clientMap.set(client.id, client.name)
      })
    }

    // Processar cada documento
    for (const doc of documents) {
      try {
        if (!doc.url) continue

        // Obter o nome do cliente se disponível
        const clientName = doc.client_id ? clientMap.get(doc.client_id) : undefined

        // Corrigir o caminho
        const correctedUrl = await ensureClientFolderInPath(doc.url, clientName)

        // Se a URL foi alterada, atualizar no banco de dados
        if (correctedUrl !== doc.url) {
          const success = await updateDocumentUrl(doc.id, getBunnyPublicUrl(correctedUrl))

          if (success) {
            result.updated++
            result.details.push({
              id: doc.id,
              title: doc.title,
              oldUrl: doc.url,
              newUrl: getBunnyPublicUrl(correctedUrl),
              status: "success",
            })
          } else {
            result.failed++
            result.details.push({
              id: doc.id,
              title: doc.title,
              oldUrl: doc.url,
              error: "Falha ao atualizar no banco de dados",
              status: "error",
            })
          }
        }
      } catch (docError) {
        result.failed++
        result.details.push({
          id: doc.id,
          title: doc.title,
          error: docError instanceof Error ? docError.message : String(docError),
          status: "error",
        })
      }
    }

    return result
  } catch (error) {
    console.error("Erro ao corrigir URLs de documentos:", error)
    throw error
  }
}
