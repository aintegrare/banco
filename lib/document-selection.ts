import { supabase } from "./api"
import { generateSimpleEmbedding } from "./embeddings"

// Interface para documentos
interface Document {
  id: number
  title: string
  url: string
  source_type: string
  created_at: string
  relevance_score?: number
}

// Função para selecionar documentos relevantes para uma consulta
export async function selectRelevantDocuments(query: string, minDocs = 2, maxDocs = 5): Promise<Document[]> {
  try {
    console.log(`DocumentSelection: Selecionando documentos relevantes para: "${query}"`)
    console.log(`DocumentSelection: Parâmetros - minDocs: ${minDocs}, maxDocs: ${maxDocs}`)

    // 1. Primeiro, buscar todos os documentos disponíveis
    const { data: allDocuments, error: docsError } = await supabase
      .from("documents")
      .select("*")
      .order("created_at", { ascending: false })

    if (docsError) {
      console.error("DocumentSelection: Erro ao buscar documentos:", docsError)
      throw docsError
    }

    if (!allDocuments || allDocuments.length === 0) {
      console.log("DocumentSelection: Nenhum documento encontrado na base de dados")
      return []
    }

    console.log(`DocumentSelection: ${allDocuments.length} documentos encontrados no total`)

    // Se temos poucos documentos, retornar todos
    if (allDocuments.length <= minDocs) {
      console.log(`DocumentSelection: Retornando todos os ${allDocuments.length} documentos (abaixo do mínimo)`)
      return allDocuments
    }

    // 2. Gerar embedding para a consulta
    const queryEmbedding = generateSimpleEmbedding(query)

    // 3. Buscar chunks mais similares à consulta
    const { data: similarChunks, error: chunksError } = await supabase.rpc("match_documents", {
      query_embedding: queryEmbedding,
      match_threshold: 0.5,
      match_count: 10,
    })

    if (chunksError) {
      console.error("DocumentSelection: Erro ao buscar chunks similares:", chunksError)
      // Fallback: retornar documentos mais recentes
      console.log(`DocumentSelection: Usando fallback - retornando ${maxDocs} documentos mais recentes`)
      return allDocuments.slice(0, maxDocs)
    }

    if (!similarChunks || similarChunks.length === 0) {
      console.log("DocumentSelection: Nenhum chunk similar encontrado")
      // Fallback: retornar documentos mais recentes
      console.log(`DocumentSelection: Usando fallback - retornando ${maxDocs} documentos mais recentes`)
      return allDocuments.slice(0, maxDocs)
    }

    console.log(`DocumentSelection: ${similarChunks.length} chunks similares encontrados`)

    // 4. Extrair IDs únicos de documentos dos chunks
    const documentIds = [...new Set(similarChunks.map((chunk) => chunk.document_id))]
    console.log(`DocumentSelection: ${documentIds.length} documentos únicos identificados nos chunks`)

    // 5. Filtrar documentos pelos IDs encontrados
    const relevantDocuments = allDocuments.filter((doc) => documentIds.includes(doc.id))

    // 6. Adicionar pontuação de relevância com base na frequência nos chunks
    const documentFrequency: Record<number, number> = {}
    similarChunks.forEach((chunk) => {
      documentFrequency[chunk.document_id] = (documentFrequency[chunk.document_id] || 0) + 1
    })

    const scoredDocuments = relevantDocuments.map((doc) => ({
      ...doc,
      relevance_score: documentFrequency[doc.id] || 0,
    }))

    // 7. Ordenar por relevância e limitar ao número máximo
    const sortedDocuments = scoredDocuments
      .sort((a, b) => (b.relevance_score || 0) - (a.relevance_score || 0))
      .slice(0, maxDocs)

    console.log(`DocumentSelection: Retornando ${sortedDocuments.length} documentos mais relevantes`)
    console.log(
      "DocumentSelection: Documentos selecionados:",
      sortedDocuments.map((d) => ({ id: d.id, title: d.title, score: d.relevance_score })),
    )

    return sortedDocuments
  } catch (error) {
    console.error("DocumentSelection: Erro ao selecionar documentos:", error)
    throw error
  }
}

// Função para buscar o conteúdo completo de um documento
export async function getDocumentContent(documentId: number): Promise<string[]> {
  try {
    console.log(`DocumentSelection: Buscando conteúdo do documento ID ${documentId}`)

    // Buscar todos os chunks do documento, ordenados pelo índice
    const { data: chunks, error } = await supabase
      .from("document_chunks")
      .select("content, chunk_index")
      .eq("document_id", documentId)
      .order("chunk_index", { ascending: true })

    if (error) {
      console.error(`DocumentSelection: Erro ao buscar chunks do documento ${documentId}:`, error)
      throw error
    }

    if (!chunks || chunks.length === 0) {
      console.log(`DocumentSelection: Nenhum chunk encontrado para o documento ${documentId}`)

      // Buscar informações do documento para diagnóstico
      const { data: docInfo, error: docError } = await supabase
        .from("documents")
        .select("*")
        .eq("id", documentId)
        .single()

      if (docError) {
        console.error(`DocumentSelection: Erro ao buscar informações do documento ${documentId}:`, docError)
      } else if (docInfo) {
        console.log(`DocumentSelection: Informações do documento ${documentId}:`, {
          title: docInfo.title,
          url: docInfo.url,
          source_type: docInfo.source_type,
          created_at: docInfo.created_at,
        })
      }

      return []
    }

    console.log(`DocumentSelection: ${chunks.length} chunks encontrados para o documento ${documentId}`)

    // Verificar o conteúdo do primeiro chunk para diagnóstico
    if (chunks.length > 0) {
      const firstChunk = chunks[0]
      console.log(
        `DocumentSelection: Amostra do primeiro chunk (primeiros 100 caracteres): ${firstChunk.content.substring(
          0,
          100,
        )}...`,
      )
    }

    return chunks.map((chunk) => chunk.content)
  } catch (error) {
    console.error(`DocumentSelection: Erro ao buscar conteúdo do documento ${documentId}:`, error)
    throw error
  }
}

// Função para diagnosticar problemas de acesso aos documentos
export async function diagnoseDocumentAccess(): Promise<{
  success: boolean
  documentsCount: number
  chunksCount: number
  randomDocument?: any
  randomChunk?: any
  error?: string
}> {
  try {
    console.log("DocumentSelection: Iniciando diagnóstico de acesso aos documentos")

    // Verificar tabela de documentos
    const { data: documents, error: docsError } = await supabase.from("documents").select("*").limit(10)

    if (docsError) {
      console.error("DocumentSelection: Erro ao acessar tabela de documentos:", docsError)
      return {
        success: false,
        documentsCount: 0,
        chunksCount: 0,
        error: `Erro ao acessar tabela de documentos: ${docsError.message}`,
      }
    }

    const documentsCount = documents?.length || 0
    console.log(`DocumentSelection: ${documentsCount} documentos encontrados`)

    // Verificar tabela de chunks
    const { data: chunks, error: chunksError } = await supabase.from("document_chunks").select("*").limit(10)

    if (chunksError) {
      console.error("DocumentSelection: Erro ao acessar tabela de chunks:", chunksError)
      return {
        success: false,
        documentsCount,
        chunksCount: 0,
        error: `Erro ao acessar tabela de chunks: ${chunksError.message}`,
      }
    }

    const chunksCount = chunks?.length || 0
    console.log(`DocumentSelection: ${chunksCount} chunks encontrados`)

    // Selecionar um documento aleatório para teste
    const randomDocument = documents && documents.length > 0 ? documents[0] : null
    const randomChunk = chunks && chunks.length > 0 ? chunks[0] : null

    return {
      success: true,
      documentsCount,
      chunksCount,
      randomDocument,
      randomChunk,
    }
  } catch (error) {
    console.error("DocumentSelection: Erro no diagnóstico:", error)
    return {
      success: false,
      documentsCount: 0,
      chunksCount: 0,
      error: error instanceof Error ? error.message : String(error),
    }
  }
}
