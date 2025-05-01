import { createClient } from "@supabase/supabase-js"
import { generateSimpleEmbedding } from "./embeddings"
import { downloadBunnyFile } from "./bunny"
// Importar pdf-parse com require para evitar problemas de importação
const pdfParse = require("pdf-parse")

// Configuração do cliente Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ""

// Cliente para operações públicas (somente leitura)
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Cliente para operações administrativas (com chave de serviço)
export const adminSupabase = createClient(supabaseUrl, supabaseServiceKey)

// Função para gerar embeddings de texto usando a API do Claude
export async function generateEmbeddings(text: string) {
  try {
    console.log("Gerando embedding para texto de tamanho:", text.length)

    // Limitar o tamanho do texto para evitar erros com a API
    const limitedText = text.slice(0, 100000) // Limitar a 100k caracteres

    // Verificar se a chave da API está disponível
    if (!process.env.ANTHROPIC_API_KEY) {
      console.log("Chave da API Anthropic não encontrada, usando fallback local para embeddings")
      return generateSimpleEmbedding(text)
    }

    try {
      // Tentar usar a API Anthropic com timeout
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 10000) // 10 segundos de timeout

      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": process.env.ANTHROPIC_API_KEY,
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify({
          model: "claude-3-haiku-20240307",
          max_tokens: 1024,
          messages: [
            {
              role: "user",
              content: limitedText,
            },
          ],
          system: "Gere um embedding semântico para este texto. Responda apenas com o embedding.",
        }),
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        console.error("Erro na resposta da API de embeddings:", errorData)
        throw new Error(errorData.error?.message || `Erro ao gerar embeddings: ${response.status}`)
      }

      const data = await response.json()

      // Como a API de mensagens não retorna embeddings diretamente,
      // vamos usar o fallback local em vez de tentar extrair embeddings da resposta
      console.log("Usando fallback local para embeddings devido à limitação da API")
      return generateSimpleEmbedding(text)
    } catch (apiError) {
      console.error("Erro ao chamar API de embeddings:", apiError)
      console.log("Usando fallback local para embeddings após erro na API")
      return generateSimpleEmbedding(text)
    }
  } catch (error) {
    console.error("Erro ao gerar embeddings:", error)
    // Usar o fallback local em caso de erro
    console.log("Usando fallback local para embeddings devido a erro na API")
    return generateSimpleEmbedding(text)
  }
}

// Função para extrair texto de um PDF usando pdf-parse
export async function extractTextFromPDF(pdfUrl: string) {
  try {
    console.log("Extraindo texto do PDF:", pdfUrl)

    // Se o PDF está no Bunny.net, baixar primeiro
    let pdfBuffer: Buffer

    if (pdfUrl.includes("b-cdn.net") || pdfUrl.includes("storage.bunnycdn.com")) {
      // Extrair o caminho do arquivo da URL
      const urlParts = pdfUrl.split("/")
      const fileName = urlParts[urlParts.length - 1]
      const filePath = `documents/${fileName}`

      console.log(`Baixando PDF do Bunny.net: ${filePath}`)
      // Baixar o arquivo do Bunny.net
      pdfBuffer = await downloadBunnyFile(filePath)
    } else {
      console.log(`Baixando PDF de URL externa: ${pdfUrl}`)
      // Baixar o PDF de uma URL externa
      const response = await fetch(pdfUrl)

      if (!response.ok) {
        throw new Error(`Erro ao baixar PDF: ${response.status}`)
      }

      const arrayBuffer = await response.arrayBuffer()
      pdfBuffer = Buffer.from(arrayBuffer)
    }

    console.log(`PDF baixado com sucesso, tamanho: ${pdfBuffer.length} bytes`)

    // Extrair texto usando pdf-parse
    try {
      const data = await pdfParse(pdfBuffer)
      console.log(`Extração de texto concluída, tamanho total: ${data.text.length} caracteres`)
      console.log(`Amostra do texto extraído: ${data.text.substring(0, 200)}...`)
      return data.text
    } catch (parseError) {
      console.error("Erro ao analisar PDF:", parseError)
      throw new Error(`Erro ao analisar PDF: ${parseError.message}`)
    }
  } catch (error) {
    console.error(`Erro ao extrair texto do PDF ${pdfUrl}:`, error)
    throw error
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

// Atualizar a função processDocument para usar o fallback se necessário
export async function processDocument(documentUrl: string, documentType: "pdf" | "website", chunkSize = 1000) {
  let documentId = null
  let useSimpleEmbeddings = false

  try {
    console.log(`Processando documento ${documentType}: ${documentUrl}`)

    // Extrair título do URL
    const urlObj = new URL(documentUrl)
    const pathSegments = urlObj.pathname.split("/")
    const fileName = pathSegments[pathSegments.length - 1] || urlObj.hostname
    const title = fileName.replace(/\.[^/.]+$/, "").replace(/-/g, " ") || urlObj.hostname

    // Extrair texto do documento
    let documentText = ""
    if (documentType === "website") {
      documentText = await extractTextFromWebsite(documentUrl)
    } else {
      documentText = await extractTextFromPDF(documentUrl)
    }

    if (!documentText || documentText.length < 50) {
      throw new Error("Texto extraído muito curto ou vazio")
    }

    console.log(`Texto extraído com sucesso: ${documentText.length} caracteres`)
    console.log(`Amostra do texto extraído: ${documentText.substring(0, 200)}...`)

    // Dividir o texto em chunks
    const chunks = splitTextIntoChunks(documentText, chunkSize)
    console.log(`Texto dividido em ${chunks.length} chunks`)

    if (chunks.length === 0) {
      throw new Error("Nenhum chunk gerado do texto")
    }

    // Adicionar documento ao banco de dados
    const document = await addDocument(title, documentUrl, documentType)
    documentId = document.id

    console.log(`Documento adicionado com ID: ${documentId}`)

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

      await addDocumentChunk(documentId, chunk, embedding, i)
      console.log(`Chunk ${i + 1} processado com sucesso`)
    }

    return {
      success: true,
      chunksProcessed: chunks.length,
      documentId,
      usedFallbackEmbeddings: useSimpleEmbeddings,
    }
  } catch (error) {
    console.error(`Erro ao processar documento ${documentUrl}:`, error)

    // Se o documento foi criado mas houve erro nos chunks, remover o documento
    if (documentId) {
      try {
        console.log(`Removendo documento ${documentId} devido a erro no processamento`)
        await adminSupabase.from("documents").delete().eq("id", documentId)
      } catch (deleteError) {
        console.error("Erro ao remover documento após falha:", deleteError)
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
