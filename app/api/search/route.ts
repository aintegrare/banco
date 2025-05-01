import { type NextRequest, NextResponse } from "next/server"
import { generateEmbeddings, getAIResponse } from "@/lib/api"
import { generateSimpleEmbedding } from "@/lib/embeddings"
import { selectRelevantDocuments, getDocumentContent, diagnoseDocumentAccess } from "@/lib/document-selection"

export async function POST(request: NextRequest) {
  try {
    const { query } = await request.json()

    if (!query || typeof query !== "string") {
      return NextResponse.json({ error: "Query inválida" }, { status: 400 })
    }

    console.log("API Search: Processando consulta:", query)

    // Diagnóstico de acesso aos documentos
    const diagnosticResult = await diagnoseDocumentAccess()
    console.log("API Search: Resultado do diagnóstico:", diagnosticResult)

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
    console.log("API Search: Selecionando documentos relevantes")
    const relevantDocuments = await selectRelevantDocuments(query, 2, 5)
    console.log(`API Search: ${relevantDocuments.length} documentos selecionados`)

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
    for (const doc of relevantDocuments) {
      try {
        const content = await getDocumentContent(doc.id)
        if (content.length > 0) {
          documentContents.push({
            id: doc.id,
            title: doc.title,
            url: doc.url,
            source_type: doc.source_type,
            content: content.join("\n\n"),
            relevance_score: doc.relevance_score,
          })
        }
      } catch (error) {
        console.error(`API Search: Erro ao buscar conteúdo do documento ${doc.id}:`, error)
      }
    }

    console.log(`API Search: Conteúdo obtido para ${documentContents.length} documentos`)

    if (documentContents.length === 0) {
      console.log("API Search: Nenhum conteúdo encontrado nos documentos selecionados")
      return NextResponse.json({
        results: [],
        aiResponse:
          "Encontrei documentos que podem ser relevantes, mas não consegui acessar seu conteúdo. Por favor, verifique a integridade dos documentos no sistema.",
      })
    }

    // 3. Preparar o contexto para a IA
    const context = documentContents.map((doc) => `Fonte: ${doc.title} (${doc.source_type})\n${doc.content}`)

    // 4. Gerar embeddings para a consulta (para compatibilidade com o código existente)
    let queryEmbedding
    try {
      console.log("API Search: Gerando embeddings para a consulta")
      queryEmbedding = await generateEmbeddings(query)
    } catch (embeddingError) {
      console.error("API Search: Erro ao gerar embeddings, usando fallback:", embeddingError)
      queryEmbedding = generateSimpleEmbedding(query)
    }

    // 5. Obter resposta da IA
    console.log("API Search: Gerando resposta da IA com base nos documentos selecionados")
    let aiResponse = ""
    try {
      aiResponse = await getAIResponse(query, context)
      console.log("API Search: Resposta da IA gerada com sucesso")
    } catch (aiError) {
      console.error("API Search: Erro ao gerar resposta da IA:", aiError)
      aiResponse =
        "Desculpe, não foi possível gerar uma resposta para sua consulta. Por favor, tente novamente mais tarde."
    }

    // 6. Formatar resultados para exibição
    const results = documentContents.map((doc) => ({
      id: doc.id,
      title: doc.title,
      url: doc.url,
      snippet: doc.content.substring(0, 150) + "...",
      source: doc.source_type,
      sourceIcon: doc.source_type === "pdf" ? "FileText" : "Globe",
      relevance_score: doc.relevance_score,
    }))

    // Ordenar resultados por relevância
    results.sort((a, b) => (b.relevance_score || 0) - (a.relevance_score || 0))

    return NextResponse.json({
      results,
      aiResponse,
      documentCount: relevantDocuments.length,
      usedDocuments: relevantDocuments.map((d) => ({ id: d.id, title: d.title })),
    })
  } catch (error) {
    console.error("API Search: Erro ao processar busca:", error)
    return NextResponse.json(
      {
        error: "Erro ao processar busca",
        message: error instanceof Error ? error.message : String(error),
        aiResponse: "Ocorreu um erro ao processar sua consulta. Por favor, tente novamente mais tarde.",
      },
      { status: 500 },
    )
  }
}
