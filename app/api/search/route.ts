import { type NextRequest, NextResponse } from "next/server"
import { getAIResponse } from "@/lib/api"
import { generateSimpleEmbedding } from "@/lib/embeddings"
import { selectRelevantDocuments, getDocumentContent, diagnoseDocumentAccess } from "@/lib/document-selection"
import { fixBunnyUrl } from "@/lib/bunny"
import { correctDocumentPath } from "@/lib/document-path-manager"

export async function POST(request: NextRequest) {
  try {
    // Verificar se o corpo da requisição é válido
    let body
    try {
      body = await request.json()
    } catch (parseError) {
      console.error("API Search: Erro ao analisar o corpo da requisição:", parseError)
      return NextResponse.json(
        {
          error: "Corpo da requisição inválido",
          message: "O corpo da requisição não é um JSON válido",
        },
        { status: 400 },
      )
    }

    const { query } = body

    if (!query || typeof query !== "string") {
      return NextResponse.json({ error: "Query inválida" }, { status: 400 })
    }

    console.log("API Search: Processando consulta:", query)

    // Diagnóstico de acesso aos documentos
    let diagnosticResult
    try {
      diagnosticResult = await diagnoseDocumentAccess()
      console.log("API Search: Resultado do diagnóstico:", diagnosticResult)
    } catch (diagError) {
      console.error("API Search: Erro no diagnóstico:", diagError)
      // Continuar mesmo com erro no diagnóstico
      diagnosticResult = {
        success: false,
        documentsCount: 0,
        chunksCount: 0,
        error: diagError instanceof Error ? diagError.message : String(diagError),
      }
    }

    if (!diagnosticResult.success || diagnosticResult.documentsCount === 0) {
      console.error("API Search: Problema detectado no acesso aos documentos")
      return NextResponse.json({
        error: "Problema no acesso aos documentos",
        diagnostic: diagnosticResult,
        aiResponse:
          "Não foi possível acessar os documentos para responder à sua consulta. Por favor, verifique se existem documentos indexados no sistema.",
        results: [],
      })
    }

    // 1. Selecionar documentos relevantes (entre 2 e 5)
    let relevantDocuments = []
    try {
      console.log("API Search: Selecionando documentos relevantes")
      relevantDocuments = await selectRelevantDocuments(query, 2, 5)
      console.log(`API Search: ${relevantDocuments.length} documentos selecionados`)
    } catch (selectError) {
      console.error("API Search: Erro ao selecionar documentos:", selectError)
      return NextResponse.json(
        {
          error: "Erro ao selecionar documentos relevantes",
          message: selectError instanceof Error ? selectError.message : String(selectError),
          aiResponse: "Ocorreu um erro ao buscar documentos relevantes. Por favor, tente novamente mais tarde.",
          results: [],
        },
        { status: 500 },
      )
    }

    if (relevantDocuments.length === 0) {
      console.log("API Search: Nenhum documento relevante encontrado")
      return NextResponse.json({
        results: [],
        aiResponse:
          "Não encontrei documentos relevantes para responder à sua consulta. Por favor, tente reformular a pergunta ou adicione mais documentos ao sistema.",
      })
    }

    // 2. Buscar o conteúdo completo de cada documento selecionado
    console.log("API Search: Buscando conteúdo dos documentos selecionados")
    const documentContents = []
    let hasSimulatedContent = false

    for (const doc of relevantDocuments) {
      try {
        const content = await getDocumentContent(doc.id)
        if (content.length > 0) {
          // Verificar se o conteúdo parece ser simulado
          const joinedContent = content.join("\n\n")
          const isSimulated =
            joinedContent.includes("Este é um texto extraído do arquivo") ||
            joinedContent.includes("Este é apenas um texto de exemplo para teste do sistema")

          if (isSimulated) {
            console.warn(`API Search: Documento ${doc.id} contém conteúdo simulado`)
            hasSimulatedContent = true
          }

          // Corrigir a URL do documento para usar a URL pública com o caminho correto
          let publicUrl = doc.url
          if (doc.url) {
            // Primeiro corrigir qualquer problema com a URL
            publicUrl = fixBunnyUrl(doc.url)

            // Depois corrigir o caminho do documento usando o novo sistema
            publicUrl = await correctDocumentPath(publicUrl)

            console.log(`API Search: URL original: ${doc.url}, URL corrigida: ${publicUrl}`)
          }

          documentContents.push({
            id: doc.id,
            title: doc.title,
            url: publicUrl, // Usar a URL pública corrigida
            source_type: doc.source_type,
            content: joinedContent,
            relevance_score: doc.relevance_score,
            isSimulated: isSimulated,
          })
        }
      } catch (error) {
        console.error(`API Search: Erro ao buscar conteúdo do documento ${doc.id}:`, error)
        // Continuar com os próximos documentos
      }
    }

    console.log(`API Search: Conteúdo obtido para ${documentContents.length} documentos`)

    if (hasSimulatedContent) {
      console.warn("API Search: Alguns documentos contêm conteúdo simulado")
    }

    if (documentContents.length === 0) {
      console.log("API Search: Nenhum conteúdo encontrado nos documentos selecionados")
      return NextResponse.json({
        results: [],
        aiResponse:
          "Encontrei documentos que podem ser relevantes, mas não consegui acessar seu conteúdo. Por favor, verifique a integridade dos documentos no sistema.",
      })
    }

    // Filtrar documentos com conteúdo simulado se houver documentos reais disponíveis
    const realDocuments = documentContents.filter((doc) => !doc.isSimulated)

    // Usar apenas documentos reais se houver algum disponível
    const documentsToUse = realDocuments.length > 0 ? realDocuments : documentContents

    // 3. Preparar o contexto para a IA
    const context = documentsToUse.map(
      (doc) => `Fonte: ${doc.title} (${doc.source_type})\nURL: ${doc.url}\n${doc.content}`,
    )

    // 4. Gerar embeddings para a consulta (para compatibilidade com o código existente)
    let queryEmbedding
    try {
      console.log("API Search: Gerando embeddings para a consulta")
      // Usar diretamente o fallback local para evitar problemas com a API
      queryEmbedding = generateSimpleEmbedding(query)
      console.log("API Search: Embeddings gerados com sucesso usando método local")
    } catch (embeddingError) {
      console.error("API Search: Erro ao gerar embeddings:", embeddingError)
      return NextResponse.json(
        {
          error: "Erro ao gerar embeddings para a consulta",
          message: embeddingError instanceof Error ? embeddingError.message : String(embeddingError),
          aiResponse: "Ocorreu um erro ao processar sua consulta. Por favor, tente novamente mais tarde.",
        },
        { status: 500 },
      )
    }

    // 5. Obter resposta da IA
    console.log("API Search: Gerando resposta da IA com base nos documentos selecionados")
    let aiResponse = ""
    try {
      aiResponse = await getAIResponse(query, context)
      console.log("API Search: Resposta da IA gerada com sucesso")

      // Verificar se a resposta contém indicações de conteúdo simulado
      if (
        aiResponse.includes("não encontrei informações relevantes") &&
        aiResponse.includes("texto era um exemplo simulado")
      ) {
        console.warn("API Search: A resposta da IA indica que está usando conteúdo simulado")

        // Se todos os documentos são simulados, informar ao usuário
        if (realDocuments.length === 0) {
          aiResponse =
            "Não foi possível encontrar informações reais sobre sua consulta. Os documentos disponíveis contêm apenas texto simulado. Por favor, adicione documentos com conteúdo real ao sistema."
        }
      }
    } catch (aiError) {
      console.error("API Search: Erro ao gerar resposta da IA:", aiError)
      aiResponse =
        "Desculpe, não foi possível gerar uma resposta para sua consulta. Por favor, tente novamente mais tarde."
    }

    // 6. Formatar resultados para exibição
    const results = documentsToUse.map((doc) => ({
      id: doc.id,
      title: doc.title,
      url: doc.url, // URL pública já corrigida
      snippet: doc.content.substring(0, 150) + "...",
      source: doc.source_type,
      sourceIcon: doc.source_type === "pdf" ? "FileText" : "Globe",
      relevance_score: doc.relevance_score,
      isSimulated: doc.isSimulated,
    }))

    // Ordenar resultados por relevância
    results.sort((a, b) => (b.relevance_score || 0) - (a.relevance_score || 0))

    return NextResponse.json({
      results,
      aiResponse,
      documentCount: documentsToUse.length,
      usedDocuments: documentsToUse.map((d) => ({ id: d.id, title: d.title, url: d.url })), // Incluir URLs públicas
      hasSimulatedContent: hasSimulatedContent,
      realDocumentsCount: realDocuments.length,
    })
  } catch (error) {
    console.error("API Search: Erro ao processar busca:", error)

    // Garantir que a resposta seja sempre um JSON válido
    return NextResponse.json(
      {
        error: "Erro ao processar busca",
        message: error instanceof Error ? error.message : String(error),
        aiResponse: "Ocorreu um erro ao processar sua consulta. Por favor, tente novamente mais tarde.",
        results: [],
      },
      { status: 500 },
    )
  }
}
