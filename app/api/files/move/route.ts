import { type NextRequest, NextResponse } from "next/server"
import { FileService } from "@/lib/file-service"
import { logger } from "@/lib/logger"

export async function POST(request: NextRequest) {
  try {
    const { sourcePath, destinationPath } = await request.json()

    if (!sourcePath || !destinationPath) {
      logger.warn("API Files Move: Parâmetros inválidos", { data: { sourcePath, destinationPath } })
      return NextResponse.json(
        { error: "Parâmetros inválidos. 'sourcePath' e 'destinationPath' são obrigatórios." },
        { status: 400 },
      )
    }

    logger.info(`API Files Move: Movendo arquivo de ${sourcePath} para ${destinationPath}`)

    // Verificar se as variáveis de ambiente estão configuradas
    if (!process.env.BUNNY_API_KEY || !process.env.BUNNY_STORAGE_ZONE) {
      logger.error("API Files Move: Configurações do Bunny.net incompletas")
      return NextResponse.json(
        {
          error: "Configurações do Bunny.net incompletas. Verifique as variáveis de ambiente.",
          details: "BUNNY_API_KEY e BUNNY_STORAGE_ZONE são necessários",
        },
        { status: 500 },
      )
    }

    // Usar o serviço de arquivos para mover o arquivo
    const result = await FileService.moveFile(sourcePath, destinationPath)

    if (!result.success) {
      logger.error(`API Files Move: ${result.error}`, { data: result.details })
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
    logger.error("API Files Move: Erro ao mover arquivo:", { data: error })
    return NextResponse.json(
      {
        error: "Erro ao mover arquivo",
        message: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
      },
      { status: 500 },
    )
  }
}
