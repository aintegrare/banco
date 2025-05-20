import { supabase } from "./api"
import { listBunnyFiles } from "./bunny"

// Interface para mapear clientes às suas pastas
interface ClientFolderMapping {
  clientName: string
  folderPath: string
  lastUpdated: Date
}

// Cache de mapeamentos de pastas de clientes
let clientFolderMappings: ClientFolderMapping[] = []
let lastCacheUpdate: Date | null = null
const CACHE_TTL = 1000 * 60 * 30 // 30 minutos

/**
 * Atualiza o cache de mapeamentos de pastas de clientes
 */
export async function updateClientFolderMappings(): Promise<ClientFolderMapping[]> {
  try {
    console.log("DocumentPathManager: Atualizando mapeamentos de pastas de clientes...")

    // Listar todas as pastas dentro de documents/clientes
    const files = await listBunnyFiles("documents/clientes")

    // Filtrar apenas diretórios
    const clientFolders = files.filter((file) => file.IsDirectory)

    // Criar mapeamentos
    const mappings: ClientFolderMapping[] = clientFolders.map((folder) => {
      // Extrair o nome da pasta do cliente do caminho
      const folderName = folder.ObjectName.replace(/\/$/, "") // Remover barra final se existir

      return {
        clientName: folderName,
        folderPath: folder.Path,
        lastUpdated: new Date(),
      }
    })

    // Atualizar o cache
    clientFolderMappings = mappings
    lastCacheUpdate = new Date()

    console.log(`DocumentPathManager: ${mappings.length} pastas de clientes encontradas`)
    return mappings
  } catch (error) {
    console.error("DocumentPathManager: Erro ao atualizar mapeamentos de pastas:", error)
    // Se falhar, retornar o cache atual
    return clientFolderMappings
  }
}

/**
 * Obtém o mapeamento de pastas de clientes (do cache ou atualizado)
 */
export async function getClientFolderMappings(): Promise<ClientFolderMapping[]> {
  // Se o cache estiver vazio ou expirado, atualizar
  if (
    clientFolderMappings.length === 0 ||
    !lastCacheUpdate ||
    new Date().getTime() - lastCacheUpdate.getTime() > CACHE_TTL
  ) {
    return await updateClientFolderMappings()
  }

  return clientFolderMappings
}

/**
 * Encontra a pasta correta para um cliente com base no nome
 */
export async function findClientFolder(clientName: string): Promise<string | null> {
  const mappings = await getClientFolderMappings()

  // Primeiro, tentar encontrar uma correspondência exata
  const exactMatch = mappings.find((m) => m.clientName.toLowerCase() === clientName.toLowerCase())

  if (exactMatch) {
    return exactMatch.folderPath
  }

  // Se não encontrar correspondência exata, procurar por correspondência parcial
  const partialMatch = mappings.find(
    (m) =>
      clientName.toLowerCase().includes(m.clientName.toLowerCase()) ||
      m.clientName.toLowerCase().includes(clientName.toLowerCase()),
  )

  if (partialMatch) {
    return partialMatch.folderPath
  }

  return null
}

/**
 * Corrige o caminho do documento para usar a estrutura de pastas correta
 */
export async function correctDocumentPath(url: string): Promise<string> {
  if (!url) return url

  // Se a URL já estiver completa com http/https, extrair o caminho
  let path = url
  let baseUrl = ""

  if (url.startsWith("http")) {
    try {
      const urlObj = new URL(url)
      baseUrl = `${urlObj.protocol}//${urlObj.host}`
      path = urlObj.pathname.replace(/^\//, "")
    } catch (e) {
      console.error("URL inválida:", url)
      return url
    }
  }

  // Verificar se o caminho já está na estrutura correta
  // Padrão correto: documents/clientes/[NOME_CLIENTE]/[ARQUIVO]
  const pathParts = path.split("/")

  // Se não tiver pelo menos 3 partes (documents/clientes/arquivo), não é um caminho válido
  if (pathParts.length < 3) {
    return url
  }

  // Verificar se o caminho já contém a estrutura correta
  if (pathParts[0] === "documents" && pathParts[1] === "clientes") {
    // Se tiver apenas documents/clientes/[ARQUIVO] (sem pasta de cliente)
    if (pathParts.length === 3) {
      // Extrair o nome do arquivo
      const fileName = pathParts[2]

      // Tentar extrair o nome do cliente do nome do arquivo
      // Geralmente os arquivos têm um timestamp seguido do nome do cliente
      const fileNameParts = fileName.split("-")

      // Remover o timestamp (geralmente a primeira parte)
      if (fileNameParts.length > 1) {
        // Juntar as partes restantes para formar o possível nome do cliente
        const possibleClientName = fileNameParts.slice(1).join("-")

        // Tentar encontrar a pasta do cliente
        const clientFolder = await findClientFolder(possibleClientName)

        if (clientFolder) {
          console.log(`DocumentPathManager: Encontrada pasta para cliente "${possibleClientName}": ${clientFolder}`)
          // Construir o novo caminho
          const newPath = `${clientFolder}${fileName}`
          return baseUrl ? `${baseUrl}/${newPath}` : newPath
        }
      }
    }
  }

  // Se não conseguir corrigir, retornar a URL original
  return url
}

/**
 * Atualiza as URLs dos documentos no banco de dados para usar a estrutura correta
 */
export async function updateDocumentUrls(): Promise<{
  total: number
  updated: number
  failed: number
  details: any[]
}> {
  try {
    // Buscar todos os documentos
    const { data: documents, error } = await supabase.from("documents").select("id, title, url")

    if (error) {
      throw error
    }

    if (!documents || documents.length === 0) {
      return { total: 0, updated: 0, failed: 0, details: [] }
    }

    const results = {
      total: documents.length,
      updated: 0,
      failed: 0,
      details: [] as any[],
    }

    // Processar cada documento
    for (const doc of documents) {
      try {
        if (!doc.url) continue

        // Corrigir o caminho
        const correctedUrl = await correctDocumentPath(doc.url)

        // Se a URL foi alterada, atualizar no banco de dados
        if (correctedUrl !== doc.url) {
          const { error: updateError } = await supabase.from("documents").update({ url: correctedUrl }).eq("id", doc.id)

          if (updateError) {
            throw updateError
          }

          results.updated++
          results.details.push({
            id: doc.id,
            title: doc.title,
            oldUrl: doc.url,
            newUrl: correctedUrl,
            status: "success",
          })
        }
      } catch (docError) {
        results.failed++
        results.details.push({
          id: doc.id,
          title: doc.title,
          error: docError instanceof Error ? docError.message : String(docError),
          status: "error",
        })
      }
    }

    return results
  } catch (error) {
    console.error("DocumentPathManager: Erro ao atualizar URLs de documentos:", error)
    throw error
  }
}
