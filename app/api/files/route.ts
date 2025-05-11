import { type NextRequest, NextResponse } from "next/server"
import { FileService } from "@/lib/file-service"
import { logger } from "@/lib/logger"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const directory = searchParams.get("directory") || "documents"

    logger.info(`API Files: Buscando arquivos no diretório: ${directory}`)

    // Verificar se as variáveis de ambiente estão configuradas
    if (!process.env.BUNNY_API_KEY || !process.env.BUNNY_STORAGE_ZONE) {
      logger.error("API Files: Configurações do Bunny.net incompletas")
      return NextResponse.json(
        {
          error: "Configurações do Bunny.net incompletas. Verifique as variáveis de ambiente.",
          details: "BUNNY_API_KEY e BUNNY_STORAGE_ZONE são necessários",
        },
        { status: 500 },
      )
    }

    // Usar o serviço de arquivos para listar os arquivos
    const result = await FileService.listFiles(directory)

    if (!result.success) {
      logger.error(`API Files: ${result.error}`, { data: result.details })
      return NextResponse.json(
        {
          error: result.error,
          details: result.details,
          retryable: result.retryable,
        },
        { status: result.retryable ? 503 : 400 },
      )
    }

    return NextResponse.json(result.data)
  } catch (error) {
    logger.error("API Files: Erro ao listar arquivos:", { data: error })
    return NextResponse.json(
      {
        error: "Erro ao listar arquivos",
        message: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
      },
      { status: 500 },
    )
  }
}
