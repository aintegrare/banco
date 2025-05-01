import { type NextRequest, NextResponse } from "next/server"
import { generateEmbeddings, searchSimilarContent, getAIResponse } from "@/lib/api"
import { generateSimpleEmbedding } from "@/lib/embeddings"

export async function POST(request: NextRequest) {
  try {
    const { query } = await request.json()

    if (!query || typeof query !== "string") {
      return NextResponse.json({ error: "Query inválida" }, { status: 400 })
    }

    // Gerar embeddings para a consulta
    let queryEmbedding
    try {
      // Tentar usar a API do Claude para embeddings
      queryEmbedding = await generateEmbeddings(query)
    } catch (embeddingError) {
      console.error("Erro ao gerar embeddings com API, usando fallback:", embeddingError)
      // Se falhar, usar o fallback local
      queryEmbedding = generateSimpleEmbedding(query)
    }

    // Buscar conteúdo similar usando a função RPC do Supabase
    const similarContent = await searchSimilarContent(queryEmbedding, 5, 0.7)

    // Extrair o conteúdo para contexto
    const context = similarContent.map((item) => `Fonte: ${item.title} (${item.source_type})\n${item.content}`)

    // Obter resposta da IA
    const aiResponse = await getAIResponse(query, context)

    // Formatar resultados para exibição
    const results = similarContent.map((item) => ({
      id: item.id,
      title: item.title,
      url: item.url,
      snippet: item.content.substring(0, 150) + "...",
      source: item.source_type,
      sourceIcon: item.source_type === "pdf" ? "FileText" : "Globe",
    }))

    return NextResponse.json({
      results,
      aiResponse,
    })
  } catch (error) {
    console.error("Erro ao processar busca:", error)
    return NextResponse.json({ error: "Erro ao processar busca" }, { status: 500 })
  }
}
