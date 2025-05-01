import { type NextRequest, NextResponse } from "next/server"
import { extractTextFromPDF } from "@/lib/api"

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json()

    if (!url) {
      return NextResponse.json({ error: "URL é obrigatória" }, { status: 400 })
    }

    console.log(`Teste de extração de PDF: ${url}`)

    try {
      // Extrair texto do PDF
      const text = await extractTextFromPDF(url)

      return NextResponse.json({
        success: true,
        textLength: text.length,
        textSample: text.substring(0, 1000) + "...",
        fullText: text,
      })
    } catch (extractionError) {
      console.error("Erro específico na extração de texto:", extractionError)
      return NextResponse.json(
        {
          error: "Erro ao extrair texto do PDF",
          message: extractionError instanceof Error ? extractionError.message : String(extractionError),
        },
        { status: 500 },
      )
    }
  } catch (error) {
    console.error("Erro geral ao processar requisição:", error)
    return NextResponse.json(
      {
        error: "Erro ao processar requisição",
        message: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
