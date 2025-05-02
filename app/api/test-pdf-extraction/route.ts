import { type NextRequest, NextResponse } from "next/server"
import { extractPDFText } from "@/lib/pdf-extractor"

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json()

    if (!url) {
      return NextResponse.json({ error: "URL do PDF não fornecida" }, { status: 400 })
    }

    console.log("Iniciando extração de PDF:", url)

    // Extrair texto do PDF
    const text = await extractPDFText(url)

    // Analisar o texto extraído para diagnóstico
    const diagnostics = analyzeExtractedText(text)

    // Preparar resposta
    const response = {
      success: true,
      textLength: text.length,
      textSample: text.substring(0, 500) + (text.length > 500 ? "..." : ""),
      fullText: text,
      diagnostics,
      isReal: true, // Indicar que esta é uma extração real, não simulada
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error("Erro na extração de PDF:", error)
    return NextResponse.json(
      {
        error: "Falha ao extrair texto do PDF",
        message: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}

// Função para analisar o texto extraído e fornecer diagnósticos
function analyzeExtractedText(text: string) {
  // Verificar se o texto contém caracteres alfanuméricos
  const hasAlphaNumeric = /[a-zA-Z0-9]/.test(text)

  // Dividir o texto em palavras
  const words = text.split(/\s+/).filter((word) => word.length > 0)
  const wordCount = words.length

  // Calcular o tamanho médio das palavras
  const totalCharacters = words.reduce((sum, word) => sum + word.length, 0)
  const averageWordLength = wordCount > 0 ? totalCharacters / wordCount : 0

  // Verificar se o texto contém palavras comuns
  const commonWords = ["o", "a", "de", "para", "em", "que", "com", "por", "um", "uma"]
  const containsCommonWords = commonWords.some((word) => text.toLowerCase().includes(` ${word} `))

  return {
    hasAlphaNumeric,
    hasWords: wordCount > 0,
    wordCount,
    averageWordLength,
    containsCommonWords,
  }
}
