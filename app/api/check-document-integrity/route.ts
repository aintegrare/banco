import { type NextRequest, NextResponse } from "next/server"
import { fixBunnyUrl } from "@/lib/bunny"

// Importamos apenas o que precisamos do pdfjs
// Evitamos importar o pacote completo que depende de APIs do navegador
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf"

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

        // Se for um PDF, tentamos extrair o texto
        if (contentType?.includes("application/pdf")) {
          try {
            const response = await fetch(fixedUrl)
            const arrayBuffer = await response.arrayBuffer()

            // Configurar o worker do PDF.js para ambiente Node.js
            const PDFJS = pdfjsLib
            if (!PDFJS.GlobalWorkerOptions.workerSrc) {
              // No ambiente Node.js, usamos o worker fake
              PDFJS.GlobalWorkerOptions.workerPort = new (PDFJS as any).PDFWorker({
                name: "pdf-worker",
              }).port
            }

            // Carregar o PDF
            const loadingTask = PDFJS.getDocument({
              data: arrayBuffer,
              // Removemos as opções que podem causar problemas no servidor
              disableFontFace: true,
              standardFontDataUrl: undefined,
              cMapUrl: undefined,
              cMapPacked: false,
            })

            const pdf = await loadingTask.promise
            const numPages = pdf.numPages

            // Extrair texto de todas as páginas (limitado às primeiras 5 para performance)
            const maxPagesToProcess = Math.min(numPages, 5)
            let extractedText = ""

            for (let i = 1; i <= maxPagesToProcess; i++) {
              const page = await pdf.getPage(i)
              const content = await page.getTextContent()
              const strings = content.items.map((item: any) => item.str)
              extractedText += strings.join(" ") + "\n"
            }

            textContent = extractedText
            textLength = extractedText.length

            // Verificar se o documento parece estar completo
            // Um documento vazio ou muito pequeno pode indicar problemas
            isComplete = textLength > 100 // Consideramos completo se tiver mais de 100 caracteres

            // Verificar se o texto parece ser um placeholder ou texto de demonstração
            const lowerText = textContent.toLowerCase()
            if (
              lowerText.includes("lorem ipsum") ||
              lowerText.includes("texto simulado") ||
              lowerText.includes("demonstração") ||
              lowerText.includes("placeholder")
            ) {
              isComplete = false
              errorMessage = "O documento parece conter texto de demonstração ou placeholder"
            }
          } catch (pdfError) {
            console.error("Erro ao processar PDF:", pdfError)
            errorMessage = `Erro ao processar o PDF: ${pdfError instanceof Error ? pdfError.message : String(pdfError)}`

            // Ainda retornamos informações básicas sobre o documento
            textContent = null
            textLength = 0
            isComplete = false
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
