import { type NextRequest, NextResponse } from "next/server"
import { processDocument } from "@/lib/api"

export async function POST(request: NextRequest) {
  try {
    const { url, type, chunkSize } = await request.json()

    if (!url) {
      return NextResponse.json({ error: "URL é obrigatória" }, { status: 400 })
    }

    if (!type || !["pdf", "website"].includes(type)) {
      return NextResponse.json({ error: "Tipo de documento inválido" }, { status: 400 })
    }

    // Validar URL
    try {
      new URL(url)
    } catch (e) {
      return NextResponse.json({ error: "URL inválida" }, { status: 400 })
    }

    console.log(`Iniciando processamento de ${type}: ${url}`)

    // Processar o documento usando nossa função atualizada
    const result = await processDocument(url, type as "pdf" | "website", chunkSize || 1000)

    console.log(`Processamento concluído com sucesso: ${JSON.stringify(result)}`)

    return NextResponse.json(result)
  } catch (error) {
    console.error("Erro ao processar documento:", error)

    return NextResponse.json(
      {
        error: "Erro ao processar documento",
        message: error instanceof Error ? error.message : String(error),
        success: false,
      },
      { status: 500 },
    )
  }
}
