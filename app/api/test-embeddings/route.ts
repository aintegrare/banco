import { type NextRequest, NextResponse } from "next/server"
import {
  OpenAIEmbeddingProvider,
  AnthropicEmbeddingProvider,
  SupabaseEmbeddingProvider,
  generateSimpleEmbedding,
} from "@/lib/embeddings"

export async function POST(request: NextRequest) {
  try {
    const { provider, text } = await request.json()

    if (!text) {
      return NextResponse.json({ success: false, error: "Texto para embedding não fornecido" }, { status: 400 })
    }

    const startTime = Date.now()
    let embedding: number[] = []
    let success = false
    let error = ""

    try {
      switch (provider) {
        case "openai":
          embedding = await OpenAIEmbeddingProvider.generateEmbedding(text)
          break
        case "anthropic":
          embedding = await AnthropicEmbeddingProvider.generateEmbedding(text)
          break
        case "supabase":
          embedding = await SupabaseEmbeddingProvider.generateEmbedding(text)
          break
        case "local":
          embedding = generateSimpleEmbedding(text)
          break
        default:
          return NextResponse.json({ success: false, error: "Provedor de embedding não reconhecido" }, { status: 400 })
      }

      success = true
    } catch (err) {
      error = err instanceof Error ? err.message : "Erro desconhecido ao gerar embedding"
      console.error(`Erro ao gerar embedding com ${provider}:`, err)
    }

    const timeMs = Date.now() - startTime

    return NextResponse.json({
      success,
      provider,
      timeMs,
      dimensions: embedding.length,
      sample: embedding.slice(0, 5), // Amostra dos primeiros 5 valores
      error,
    })
  } catch (error) {
    console.error("Erro ao processar requisição de teste de embedding:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Erro desconhecido",
      },
      { status: 500 },
    )
  }
}
