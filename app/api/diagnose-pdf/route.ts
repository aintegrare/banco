import { NextResponse } from "next/server"
import { extractPDFText } from "@/lib/pdf-extractor"
import { getBunnyHeaders } from "@/lib/bunny"

export async function POST(request: Request) {
  try {
    const { url } = await request.json()

    if (!url) {
      return NextResponse.json({ error: "URL não fornecida" }, { status: 400 })
    }

    console.log("Iniciando diagnóstico de acesso ao PDF:", url)

    // Verificar se a URL é do Bunny CDN
    const isBunnyCDN = url.includes("b-cdn.net")

    // Etapa 1: Verificar se o arquivo existe (HEAD request)
    console.log("Verificando existência do arquivo...")

    const headers = isBunnyCDN ? getBunnyHeaders() : {}

    try {
      const headResponse = await fetch(url, {
        method: "HEAD",
        headers,
      })

      if (!headResponse.ok) {
        return NextResponse.json({
          success: false,
          error: `Arquivo não encontrado ou inacessível: ${headResponse.status} ${headResponse.statusText}`,
          stage: "verificação_existencia",
          details: {
            status: headResponse.status,
            statusText: headResponse.statusText,
            headers: Object.fromEntries(headResponse.headers.entries()),
          },
        })
      }

      const contentType = headResponse.headers.get("content-type")
      const contentLength = headResponse.headers.get("content-length")

      console.log(`Arquivo encontrado: ${contentType}, ${contentLength} bytes`)

      if (!contentType?.includes("pdf")) {
        return NextResponse.json({
          success: false,
          error: `O arquivo não parece ser um PDF válido. Content-Type: ${contentType}`,
          stage: "verificação_tipo",
          details: {
            contentType,
            contentLength,
          },
        })
      }
    } catch (headError) {
      return NextResponse.json({
        success: false,
        error: `Erro ao verificar existência do arquivo: ${headError instanceof Error ? headError.message : String(headError)}`,
        stage: "verificação_existencia",
      })
    }

    // Etapa 2: Tentar baixar os primeiros bytes do arquivo para verificar se é um PDF válido
    console.log("Verificando estrutura do PDF...")

    try {
      const rangeHeaders = { ...headers, Range: "bytes=0-1023" }

      const rangeResponse = await fetch(url, {
        headers: rangeHeaders,
      })

      if (!rangeResponse.ok) {
        return NextResponse.json({
          success: false,
          error: `Não foi possível baixar os primeiros bytes do arquivo: ${rangeResponse.status} ${rangeResponse.statusText}`,
          stage: "verificação_bytes",
        })
      }

      const firstBytes = await rangeResponse.arrayBuffer()
      const firstBytesView = new Uint8Array(firstBytes)

      // Verificar assinatura de PDF (%PDF-)
      const isPDF =
        firstBytesView.length >= 5 &&
        firstBytesView[0] === 0x25 && // %
        firstBytesView[1] === 0x50 && // P
        firstBytesView[2] === 0x44 && // D
        firstBytesView[3] === 0x46 && // F
        firstBytesView[4] === 0x2d // -

      if (!isPDF) {
        return NextResponse.json({
          success: false,
          error: "O arquivo não possui a assinatura de um PDF válido",
          stage: "verificação_assinatura",
          details: {
            firstBytes: Array.from(firstBytesView.slice(0, 20))
              .map((b) => b.toString(16).padStart(2, "0"))
              .join(" "),
          },
        })
      }

      console.log("Assinatura de PDF válida encontrada")
    } catch (rangeError) {
      return NextResponse.json({
        success: false,
        error: `Erro ao verificar estrutura do PDF: ${rangeError instanceof Error ? rangeError.message : String(rangeError)}`,
        stage: "verificação_estrutura",
      })
    }

    // Etapa 3: Tentar extrair o texto do PDF
    console.log("Tentando extrair texto do PDF...")

    try {
      const startTime = Date.now()
      const text = await extractPDFText(url)
      const extractionTime = Date.now() - startTime

      if (!text || text.length < 10) {
        return NextResponse.json({
          success: false,
          error: "O texto extraído está vazio ou muito curto",
          stage: "extração_texto",
          details: {
            textLength: text?.length || 0,
            extractionTime,
            textSample: text?.substring(0, 100),
          },
        })
      }

      // Verificar se o texto parece ser simulado
      if (text.includes("Conteúdo simulado") || text.includes("Este é um texto extraído do arquivo")) {
        return NextResponse.json({
          success: false,
          error: "O texto extraído parece ser simulado, não real",
          stage: "verificação_conteúdo",
          details: {
            textLength: text.length,
            extractionTime,
            textSample: text.substring(0, 200),
          },
        })
      }

      // Sucesso na extração
      return NextResponse.json({
        success: true,
        message: "PDF acessado e texto extraído com sucesso",
        details: {
          textLength: text.length,
          extractionTime,
          textSample: text.substring(0, 500) + (text.length > 500 ? "..." : ""),
          wordCount: text.split(/\s+/).length,
        },
      })
    } catch (extractionError) {
      return NextResponse.json({
        success: false,
        error: `Erro ao extrair texto do PDF: ${extractionError instanceof Error ? extractionError.message : String(extractionError)}`,
        stage: "extração_texto",
      })
    }
  } catch (error) {
    console.error("Erro no diagnóstico de PDF:", error)
    return NextResponse.json(
      {
        success: false,
        error: `Erro interno: ${error instanceof Error ? error.message : String(error)}`,
      },
      { status: 500 },
    )
  }
}
