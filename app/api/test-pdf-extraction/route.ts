import { type NextRequest, NextResponse } from "next/server"
import { extractPDFText } from "@/lib/pdf-extractor"

export async function POST(request: NextRequest) {
  try {
    // Verificar se o corpo da requisição é válido
    let body
    try {
      body = await request.json()
    } catch (parseError) {
      console.error("Erro ao analisar o corpo da requisição:", parseError)
      return NextResponse.json(
        {
          error: "Corpo da requisição inválido",
          message: "O corpo da requisição não é um JSON válido",
        },
        { status: 400 },
      )
    }

    const { url } = body

    if (!url) {
      return NextResponse.json({ error: "URL é obrigatória" }, { status: 400 })
    }

    console.log(`Teste de extração de PDF: ${url}`)

    try {
      // Extrair texto do PDF usando nosso extrator compatível com serverless
      const text = await extractPDFText(url)

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
