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

      // Verificar se o texto parece ser simulado
      const isSimulated =
        text.includes("Este é um texto extraído do arquivo") ||
        text.includes("Este é apenas um texto de exemplo para teste do sistema")

      return NextResponse.json({
        success: true,
        textLength: text.length,
        textSample: text.substring(0, 1000) + "...",
        fullText: text,
        isSimulated: isSimulated,
        diagnostics: {
          hasAlphaNumeric: /[a-zA-Z0-9]/.test(text),
          hasWords: /[a-zA-Z]{3,}/.test(text),
          averageWordLength: text.split(/\s+/).reduce((sum, word) => sum + word.length, 0) / text.split(/\s+/).length,
          wordCount: text.split(/\s+/).length,
          containsCommonWords: /\b(the|and|or|in|on|at|to|for|with|by)\b/i.test(text),
        },
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
