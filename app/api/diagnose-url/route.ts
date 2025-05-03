import { type NextRequest, NextResponse } from "next/server"
import { fixBunnyUrl } from "@/lib/bunny"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const url = searchParams.get("url")

    if (!url) {
      return NextResponse.json({ error: "URL não fornecida" }, { status: 400 })
    }

    // Verificar se a URL contém o prefixo incorreto
    const hasIncorrectPrefix = url.includes("zona-de-guardar")

    // Corrigir a URL
    const fixedUrl = fixBunnyUrl(url)

    // Verificar se a URL é acessível
    let isAccessible = false
    let statusCode = 0
    let errorMessage = null

    try {
      const response = await fetch(fixedUrl, { method: "HEAD" })
      statusCode = response.status
      isAccessible = response.ok
    } catch (error) {
      errorMessage = error instanceof Error ? error.message : String(error)
    }

    return NextResponse.json({
      originalUrl: url,
      fixedUrl,
      hasIncorrectPrefix,
      isAccessible,
      statusCode,
      errorMessage,
    })
  } catch (error) {
    console.error("Erro ao diagnosticar URL:", error)
    return NextResponse.json(
      {
        error: "Erro ao diagnosticar URL",
        message: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
