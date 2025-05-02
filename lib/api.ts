import { createClient } from "@supabase/supabase-js"
import { defaultEmbeddingProvider, generateSimpleEmbedding } from "./embeddings"
import { extractPDFText } from "./pdf-extractor"

// Configuração do cliente Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ""

// Cliente para operações públicas (somente leitura)
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Cliente para operações administrativas (com chave de serviço)
export const adminSupabase = createClient(supabaseUrl, supabaseServiceKey)

// Interface para metadados de documentos
export interface DocumentMetadata {
  id?: number
  title: string
  originalFileName: string
  storedFileName: string
  fileUrl: string
  filePath: string
  fileType: string
  documentType: "pdf" | "website"
  timestamp: number
  processed?: boolean
  processingError?: string
}

// Função para adicionar metadados de documento
export async function addDocumentMetadata(metadata: Omit<DocumentMetadata, "id">): Promise<DocumentMetadata> {
  try {
    console.log("API: Adicionando metadados do documento:", metadata.title)

    const { data, error } = await adminSupabase
      .from("document_metadata")
      .insert({
        title: metadata.title,
        original_file_name: metadata.originalFileName,
        stored_file_name: metadata.storedFileName,
        file_url: metadata.fileUrl,
        file_path: metadata.filePath,
        file_type: metadata.fileType,
        document_type: metadata.documentType,
        timestamp: metadata.timestamp,
        processed: false,
      })
      .select()
      .single()

    if (error) {
      console.error("API: Erro ao adicionar metadados do documento:", error)
      throw error
    }

    console.log("API: Metadados do documento adicionados com sucesso:", data)

    return {
      id: data.id,
      title: data.title,
      originalFileName: data.original_file_name,
      storedFileName: data.stored_file_name,
      fileUrl: data.file_url,
      filePath: data.file_path,
      fileType: data.file_type,
      documentType: data.document_type as "pdf" | "website",
      timestamp: data.timestamp,
      processed: data.processed,
      processingError: data.processing_error,
    }
  } catch (error) {
    console.error("API: Erro ao adicionar metadados do documento:", error)
    throw error
  }
}

// Função para atualizar o status de processamento de um documento
export async function updateDocumentProcessingStatus(
  documentId: number,
  processed: boolean,
  error?: string,
): Promise<void> {
  try {
    console.log(
      `API: Atualizando status de processamento do documento ${documentId} para ${processed ? "processado" : "não processado"}`,
    )

    const { error: updateError } = await adminSupabase
      .from("document_metadata")
      .update({
        processed,
        processing_error: error,
        processed_at: processed ? new Date().toISOString() : null,
      })
      .eq("id", documentId)

    if (updateError) {
      console.error("API: Erro ao atualizar status de processamento do documento:", updateError)
      throw updateError
    }

    console.log(`API: Status de processamento do documento ${documentId} atualizado com sucesso`)
  } catch (error) {
    console.error("API: Erro ao atualizar status de processamento do documento:", error)
    throw error
  }
}

// Função para obter metadados de um documento
export async function getDocumentMetadata(documentId: number): Promise<DocumentMetadata | null> {
  try {
    console.log(`API: Obtendo metadados do documento ${documentId}`)

    const { data, error } = await supabase.from("document_metadata").select("*").eq("id", documentId).single()

    if (error) {
      if (error.code === "PGRST116") {
        console.log(`API: Documento ${documentId} não encontrado`)
        return null
      }
      console.error("API: Erro ao obter metadados do documento:", error)
      throw error
    }

    if (!data) {
      return null
    }

    console.log(`API: Metadados do documento ${documentId} obtidos com sucesso:`, data)

    return {
      id: data.id,
      title: data.title,
      originalFileName: data.original_file_name,
      storedFileName: data.stored_file_name,
      fileUrl: data.file_url,
      filePath: data.file_path,
      fileType: data.file_type,
      documentType: data.document_type as "pdf" | "website",
      timestamp: data.timestamp,
      processed: data.processed,
      processingError: data.processing_error,
    }
  } catch (error) {
    console.error("API: Erro ao obter metadados do documento:", error)
    throw error
  }
}

// Função para listar todos os documentos
export async function listDocumentMetadata(): Promise<DocumentMetadata[]> {
  try {
    console.log("API: Listando metadados de todos os documentos")

    const { data, error } = await supabase
      .from("document_metadata")
      .select("*")
      .order("timestamp", { ascending: false })

    if (error) {
      console.error("API: Erro ao listar metadados dos documentos:", error)
      throw error
    }

    console.log(`API: ${data.length} metadados de documentos obtidos com sucesso`)

    return data.map((item) => ({
      id: item.id,
      title: item.title,
      originalFileName: item.original_file_name,
      storedFileName: item.stored_file_name,
      fileUrl: item.file_url,
      filePath: item.file_path,
      fileType: item.file_type,
      documentType: item.document_type as "pdf" | "website",
      timestamp: item.timestamp,
      processed: item.processed,
      processingError: item.processing_error,
    }))
  } catch (error) {
    console.error("API: Erro ao listar metadados dos documentos:", error)
    throw error
  }
}

// Função para gerar embeddings de texto usando provedores configurados
export async function generateEmbeddings(text: string) {
  try {
    console.log("Gerando embedding para texto de tamanho:", text.length)

    // Limitar o tamanho do texto para evitar erros com a API
    const limitedText = text.slice(0, 100000) // Limitar a 100k caracteres

    try {
      // Usar o provedor de embeddings padrão (composite)
      return await defaultEmbeddingProvider.generateEmbedding(limitedText)
    } catch (apiError) {
      console.error("Erro ao chamar API de embeddings:", apiError)
      console.log("Usando fallback local para embeddings após erro na API")
      return generateSimpleEmbedding(limitedText)
    }
  } catch (error) {
    console.error("Erro ao gerar embeddings:", error)
    // Usar o fallback local em caso de erro
    console.log("Usando fallback local para embeddings devido a erro")
    return generateSimpleEmbedding(text)
  }
}

// Função para extrair texto de uma URL (website)
export async function extractTextFromWebsite(url: string) {
  try {
    console.log("Extraindo texto do website:", url)

    // Em um ambiente real, você usaria uma biblioteca como cheerio
    // Aqui vamos fazer uma extração simples para demonstração
    const response = await fetch(url)

    if (!response.ok) {
      throw new Error(`Erro ao acessar o website: ${response.status}`)
    }

    const html = await response.text()

    // Extração básica de texto
    const text = html
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, " ")
      .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, " ")
      .replace(/<[^>]*>/g, " ")
      .replace(/\s+/g, " ")
      .trim()

    return text
  } catch (error) {
    console.error(`Erro ao extrair texto do website ${url}:`, error)
    throw error
  }
}

// Função para dividir texto em chunks
export function splitTextIntoChunks(text: string, chunkSize: number) {
  const chunks = []
  let currentChunk = ""

  // Dividir por parágrafos para manter contexto
  const paragraphs = text.split(/\n\s*\n/)

  for (const paragraph of paragraphs) {
    // Se o parágrafo for maior que o tamanho do chunk, divida-o
    if (paragraph.length > chunkSize) {
      // Dividir o parágrafo em sentenças
      const sentences = paragraph.match(/[^.!?]+[.!?]+/g) || [paragraph]

      for (const sentence of sentences) {
        if (currentChunk.length + sentence.length <= chunkSize) {
          currentChunk += sentence + " "
        } else {
          if (currentChunk) {
            chunks.push(currentChunk.trim())
          }

          // Se a sentença for maior que o tamanho do chunk, divida-a
          if (sentence.length > chunkSize) {
            const words = sentence.split(/\s+/)
            let tempChunk = ""

            for (const word of words) {
              if (tempChunk.length + word.length + 1 <= chunkSize) {
                tempChunk += word + " "
              } else {
                chunks.push(tempChunk.trim())
                tempChunk = word + " "
              }
            }

            if (tempChunk) {
              currentChunk = tempChunk
            } else {
              currentChunk = ""
            }
          } else {
            currentChunk = sentence + " "
          }
        }
      }
    } else {
      // Se adicionar o parágrafo exceder o tamanho do chunk, comece um novo
      if (currentChunk.length + paragraph.length + 2 > chunkSize) {
        chunks.push(currentChunk.trim())
        currentChunk = paragraph + "\n\n"
      } else {
        currentChunk += paragraph + "\n\n"
      }
    }
  }

  // Adicionar o último chunk se não estiver vazio
  if (currentChunk.trim()) {
    chunks.push(currentChunk.trim())
  }

  return chunks
}

// Atualizar a função processDocument para usar o novo extrator de PDF e metadados
export async function processDocument(documentId: number, chunkSize = 1000) {
  try {
    console.log(`Processando documento com ID: ${documentId}`)

    // Obter metadados do documento
    const metadata = await getDocumentMetadata(documentId)

    if (!metadata) {
      throw new Error(`Documento com ID ${documentId} não encontrado`)
    }

    console.log(`Metadados do documento obtidos:`, {
      title: metadata.title,
      url: metadata.fileUrl,
      type: metadata.documentType,
    })

    // Extrair texto do documento
    let documentText = ""
    if (metadata.documentType === "website") {
      documentText = await extractTextFromWebsite(metadata.fileUrl)
    } else {
      // Usar nosso extrator de PDF compatível com serverless
      console.log(`Extraindo texto do PDF: ${metadata.fileUrl}`)
      documentText = await extractPDFText(metadata.fileUrl)
      console.log(`Extração de texto do PDF concluída, tamanho: ${documentText.length} caracteres`)
    }

    if (!documentText || documentText.length < 50) {
      const error = "Texto extraído muito curto ou vazio"
      console.error(error)
      await updateDocumentProcessingStatus(documentId, false, error)
      throw new Error(error)
    }

    console.log(`Texto extraído com sucesso: ${documentText.length} caracteres`)
    console.log(`Amostra do texto extraído: ${documentText.substring(0, 200)}...`)

    // Verificar se o texto parece ser simulado
    if (
      documentText.includes("Este é um texto extraído do arquivo") ||
      documentText.includes("Este é apenas um texto de exemplo para teste do sistema")
    ) {
      const error = "O texto extraído parece ser simulado, não real"
      console.error(error)
      await updateDocumentProcessingStatus(documentId, false, error)
      throw new Error(error)
    }

    // Dividir o texto em chunks
    const chunks = splitTextIntoChunks(documentText, chunkSize)
    console.log(`Texto dividido em ${chunks.length} chunks`)

    if (chunks.length === 0) {
      const error = "Nenhum chunk gerado do texto"
      console.error(error)
      await updateDocumentProcessingStatus(documentId, false, error)
      throw new Error(error)
    }

    // Adicionar documento ao banco de dados
    const document = await addDocument(metadata.title, metadata.fileUrl, metadata.documentType)
    const dbDocumentId = document.id

    console.log(`Documento adicionado ao banco de dados com ID: ${dbDocumentId}`)

    let useSimpleEmbeddings = false

    // Para cada chunk, gerar embedding e armazenar
    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i]
      console.log(`Processando chunk ${i + 1}/${chunks.length} (tamanho: ${chunk.length})`)

      let embedding
      try {
        // Tentar usar a API do Claude para embeddings
        embedding = await generateEmbeddings(chunk)
      } catch (embeddingError) {
        console.error("Erro ao gerar embeddings com API, usando fallback:", embeddingError)
        // Se falhar, usar o fallback local
        embedding = generateSimpleEmbedding(chunk)
        useSimpleEmbeddings = true
      }

      await addDocumentChunk(dbDocumentId, chunk, embedding, i)
      console.log(`Chunk ${i + 1} processado com sucesso`)
    }

    // Atualizar status de processamento
    await updateDocumentProcessingStatus(documentId, true)

    return {
      success: true,
      chunksProcessed: chunks.length,
      documentId: dbDocumentId,
      metadataId: documentId,
      usedFallbackEmbeddings: useSimpleEmbeddings,
    }
  } catch (error) {
    console.error(`Erro ao processar documento:`, error)

    // Atualizar status de processamento com erro
    if (documentId) {
      try {
        await updateDocumentProcessingStatus(documentId, false, error instanceof Error ? error.message : String(error))
      } catch (updateError) {
        console.error("Erro ao atualizar status de processamento:", updateError)
      }
    }

    throw error
  }
}

// Função para adicionar um novo documento
export async function addDocument(title: string, url: string, sourceType: string) {
  try {
    const { data, error } = await adminSupabase
      .from("documents")
      .insert({
        title,
        url,
        source_type: sourceType,
      })
      .select()
      .single()

    if (error) {
      console.error("Erro ao adicionar documento:", error)
      throw error
    }

    return data
  } catch (error) {
    console.error("Erro ao adicionar documento:", error)
    throw error
  }
}

// Função para adicionar um chunk de documento com embedding
export async function addDocumentChunk(documentId: number, content: string, embedding: number[], chunkIndex: number) {
  try {
    const { error } = await adminSupabase.from("document_chunks").insert({
      document_id: documentId,
      content,
      embedding,
      chunk_index: chunkIndex,
    })

    if (error) {
      console.error("Erro ao adicionar chunk de documento:", error)
      throw error
    }

    return true
  } catch (error) {
    console.error("Erro ao adicionar chunk de documento:", error)
    throw error
  }
}

// Função para buscar conteúdo similar usando embeddings
export async function searchSimilarContent(queryEmbedding: number[], limit = 5, threshold = 0.7) {
  try {
    const { data, error } = await supabase.rpc("match_documents", {
      query_embedding: queryEmbedding,
      match_threshold: threshold,
      match_count: limit,
    })

    if (error) {
      console.error("Erro ao buscar conteúdo similar:", error)
      throw error
    }

    return data || []
  } catch (error) {
    console.error("Erro ao buscar conteúdo similar:", error)
    throw error
  }
}

// Função para obter resposta da IA usando Claude
export async function getAIResponse(query: string, context: string[]) {
  try {
    const contextText = context.join("\n\n")

    // Verificar se a chave da API está disponível
    if (!process.env.ANTHROPIC_API_KEY) {
      console.error("Chave da API Anthropic não encontrada")
      return "Não foi possível gerar uma resposta porque a chave da API não está configurada. Por favor, configure a variável de ambiente ANTHROPIC_API_KEY."
    }

    try {
      // Tentar usar a API Anthropic com timeout
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 30000) // 30 segundos de timeout

      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": process.env.ANTHROPIC_API_KEY,
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify({
          model: "claude-3-sonnet-20240229",
          max_tokens: 1000,
          messages: [
            {
              role: "user",
              content: `Com base nas seguintes informações, responda à pergunta: "${query}"\n\nInformações:\n${contextText}\n\nForneça uma resposta detalhada e bem estruturada, usando listas numeradas quando apropriado. Cite as fontes específicas quando relevante.`,
            },
          ],
        }),
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        console.error("Erro na resposta da API Claude:", errorData)
        throw new Error(errorData.error?.message || `Erro ao obter resposta da IA: ${response.status}`)
      }

      const data = await response.json()
      return data.content[0].text
    } catch (apiError) {
      console.error("Erro ao chamar API Claude:", apiError)
      if (apiError.name === "AbortError") {
        return "A solicitação excedeu o tempo limite. Por favor, tente novamente mais tarde."
      }
      throw apiError
    }
  } catch (error) {
    console.error("Erro ao obter resposta da IA:", error)
    return "Ocorreu um erro ao processar sua consulta. Por favor, tente novamente mais tarde."
  }
}

// Função para excluir um documento e seus chunks
export async function deleteDocument(documentId: number) {
  try {
    // Excluir o documento (os chunks serão excluídos automaticamente pela restrição ON DELETE CASCADE)
    const { error } = await adminSupabase.from("documents").delete().eq("id", documentId)

    if (error) {
      console.error("Erro ao excluir documento:", error)
      throw error
    }

    return true
  } catch (error) {
    console.error("Erro ao excluir documento:", error)
    throw error
  }
}
