import { type NextRequest, NextResponse } from "next/server"
import { fixBunnyUrl } from "@/lib/bunny"

// Removemos a importação direta do pdfjs que estava causando o erro
// import * as pdfjs from "pdfjs-dist"

export async function GET(request: NextRequest) {
  try {
    const startTime = performance.now()
    const searchParams = request.nextUrl.searchParams
    const url = searchParams.get("url")

    if (!url) {
      return NextResponse.json({ error: "URL não fornecida" }, { status: 400 })
    }

    // Corrigir a URL se necessário
    const fixedUrl = fixBunnyUrl(url)

    // Verificar se o documento existe
    let exists = false
    let contentType = null
    let contentLength = null
    let textContent = null
    let textLength = null
    let isComplete = null
    let errorMessage = null

    try {
      // Primeiro, verificamos se o documento existe e obtemos seus metadados
      const headResponse = await fetch(fixedUrl, { method: "HEAD" })
      exists = headResponse.ok

      if (exists) {
        contentType = headResponse.headers.get("content-type")
        const contentLengthHeader = headResponse.headers.get("content-length")
        contentLength = contentLengthHeader ? Number.parseInt(contentLengthHeader, 10) : null

        // Se for um PDF, não tentamos extrair o texto no servidor
        // Em vez disso, apenas verificamos se o arquivo existe
        if (contentType?.includes("application/pdf")) {
          try {
            // Verificamos apenas se podemos acessar o conteúdo do PDF
            const response = await fetch(fixedUrl)

            if (!response.ok) {
              throw new Error(`Erro ao acessar o PDF: ${response.status}`)
            }

            // Não tentamos processar o PDF no servidor
            // Apenas indicamos que o arquivo existe e pode ser acessado
            textContent = "Conteúdo do PDF não extraído no servidor para evitar problemas de compatibilidade."
            textLength = textContent.length
            isComplete = true
          } catch (pdfError) {
            errorMessage = `Erro ao acessar o PDF: ${pdfError instanceof Error ? pdfError.message : String(pdfError)}`
          }
        } else {
          // Para outros tipos de arquivo, tentamos obter o conteúdo como texto
          try {
            const response = await fetch(fixedUrl)
            textContent = await response.text()
            textLength = textContent.length
            isComplete = textLength > 100 // Consideramos completo se tiver mais de 100 caracteres
          } catch (textError) {
            errorMessage = `Erro ao obter conteúdo do arquivo: ${
              textError instanceof Error ? textError.message : String(textError)
            }`
          }
        }
      }
    } catch (error) {
      errorMessage = error instanceof Error ? error.message : String(error)
    }

    const endTime = performance.now()
    const processingTime = endTime - startTime

    return NextResponse.json({
      url: fixedUrl,
      exists,
      contentType,
      contentLength,
      textContent,
      textLength,
      isComplete,
      errorMessage,
      processingTime,
    })
  } catch (error) {
    console.error("Erro ao verificar integridade do documento:", error)
    return NextResponse.json(
      {
        error: "Erro ao verificar integridade do documento",
        message: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
