import { type NextRequest, NextResponse } from "next/server"
import { FileService } from "@/lib/file-service"
import { logger } from "@/lib/logger"

export async function POST(request: NextRequest) {
  try {
    const { oldPath, newName } = await request.json()

    if (!oldPath || !newName) {
      logger.warn("API Files Rename: Parâmetros inválidos", { data: { oldPath, newName } })
      return NextResponse.json(
        { error: "Parâmetros inválidos. 'oldPath' e 'newName' são obrigatórios." },
        { status: 400 },
      )
    }

    logger.info(`API Files Rename: Renomeando arquivo de ${oldPath} para ${newName}`)

    // Verificar se as variáveis de ambiente estão configuradas
    if (!process.env.BUNNY_API_KEY || !process.env.BUNNY_STORAGE_ZONE) {
      logger.error("API Files Rename: Configurações do Bunny.net incompletas")
      return NextResponse.json(
        {
          error: "Configurações do Bunny.net incompletas. Verifique as variáveis de ambiente.",
          details: "BUNNY_API_KEY e BUNNY_STORAGE_ZONE são necessários",
        },
        { status: 500 },
      )
    }

    // Usar o serviço de arquivos para renomear o arquivo
    const result = await FileService.renameFile(oldPath, newName)

    if (!result.success) {
      logger.error(`API Files Rename: ${result.error}`, { data: result.details })
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
    logger.error("API Files Rename: Erro ao renomear arquivo:", { data: error })
    return NextResponse.json(
      {
        error: "Erro ao renomear arquivo",
        message: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
      },
      { status: 500 },
    )
  }
}
