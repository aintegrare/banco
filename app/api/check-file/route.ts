import { type NextRequest, NextResponse } from "next/server"
import { getBunnyClient } from "@/lib/bunny"
import { logger } from "@/lib/logger"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const path = searchParams.get("path")

    if (!path) {
      return NextResponse.json({ error: "Parâmetro 'path' é obrigatório" }, { status: 400 })
    }

    logger.info(`API Check File: Verificando existência do arquivo: ${path}`)

    // Verificar se as variáveis de ambiente estão configuradas
    if (!process.env.BUNNY_API_KEY || !process.env.BUNNY_STORAGE_ZONE) {
      logger.error("API Check File: Configurações do Bunny.net incompletas")
      return NextResponse.json(
        {
          error: "Configurações do Bunny.net incompletas. Verifique as variáveis de ambiente.",
          details: "BUNNY_API_KEY e BUNNY_STORAGE_ZONE são necessários",
        },
        { status: 500 },
      )
    }

    const bunnyClient = getBunnyClient()
    const response = await bunnyClient.get(`/${path}`)

    const exists = response.status === 200

    logger.info(`API Check File: Arquivo ${path} ${exists ? "existe" : "não existe"}`)

    return NextResponse.json({
      exists,
      path,
      status: response.status,
    })
  } catch (error) {
    logger.error("API Check File: Erro ao verificar arquivo:", { data: error })
    return NextResponse.json(
      {
        error: "Erro ao verificar arquivo",
        message: error instanceof Error ? error.message : String(error),
        exists: false,
      },
      { status: 500 },
    )
  }
}
