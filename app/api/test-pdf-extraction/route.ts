import { type NextRequest, NextResponse } from "next/server"
import { extractPDFText } from "@/lib/pdf-extractor"

export async function POST(request: NextRequest) {
  try {
    console.log("API: Iniciando teste de extração de PDF")

    // Verificar se o corpo da requisição é válido
    let body
    try {
      body = await request.json()
    } catch (parseError) {
      console.error("API: Erro ao analisar o corpo da requisição:", parseError)
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
      console.error("API: URL não fornecida")
      return NextResponse.json({ error: "URL é obrigatória" }, { status: 400 })
    }

    console.log(`API: Teste de extração de PDF: ${url}`)

    try {
      // Extrair texto do PDF usando nosso extrator
      const text = await extractPDFText(url)
      console.log(`API: Texto extraído com sucesso, ${text.length} caracteres`)

      // Verificar se o texto contém uma mensagem de erro
      if (text.startsWith("Erro") || text.startsWith("URL inválida")) {
        console.error(`API: Erro na extração: ${text}`)
        return NextResponse.json(
          {
            error: "Erro na extração",
            message: text,
            success: false,
          },
          { status: 400 },
        )
      }

      // Verificar se o texto parece ser simulado
      const isSimulated =
        text.includes("Este documento contém texto extraído do arquivo") ||
        text.includes("Este texto foi gerado como demonstração")

      // Criar diagnóstico do texto extraído
      const diagnostics = {
        hasAlphaNumeric: /[a-zA-Z0-9]/.test(text),
        hasWords: /[a-zA-Z]{3,}/.test(text),
        averageWordLength:
          text.split(/\s+/).reduce((sum, word) => sum + word.length, 0) / Math.max(1, text.split(/\s+/).length),
        wordCount: text.split(/\s+/).length,
        containsCommonWords: /\b(the|and|or|in|on|at|to|for|with|by)\b/i.test(text),
      }

      console.log("API: Retornando resposta com sucesso")
      return NextResponse.json({
        success: true,
        textLength: text.length,
        textSample: text.substring(0, 1000) + (text.length > 1000 ? "..." : ""),
        fullText: text,
        isSimulated: isSimulated,
        isScanned: false,
        usedOCR: false,
        diagnostics,
      })
    } catch (extractionError) {
      console.error("API: Erro específico na extração de texto:", extractionError)
      return NextResponse.json(
        {
          error: "Erro ao extrair texto do PDF",
          message: extractionError instanceof Error ? extractionError.message : String(extractionError),
          success: false,
        },
        { status: 500 },
      )
    }
  } catch (error) {
    console.error("API: Erro geral ao processar requisição:", error)
    return NextResponse.json(
      {
        error: "Erro ao processar requisição",
        message: error instanceof Error ? error.message : String(error),
        success: false,
      },
      { status: 500 },
    )
  }
}
