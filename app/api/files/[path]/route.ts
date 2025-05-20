import { type NextRequest, NextResponse } from "next/server"
import { FileService } from "@/lib/file-service"
import { logger } from "@/lib/logger"

export async function DELETE(request: NextRequest, { params }: { params: { path: string } }) {
  try {
    const path = decodeURIComponent(params.path)
    logger.info(`API Files Delete: Excluindo arquivo: ${path}`)

    // Verificar se as variáveis de ambiente estão configuradas
    if (!process.env.BUNNY_API_KEY || !process.env.BUNNY_STORAGE_ZONE) {
      logger.error("API Files Delete: Configurações do Bunny.net incompletas")
      return NextResponse.json(
        {
          error: "Configurações do Bunny.net incompletas. Verifique as variáveis de ambiente.",
          details: "BUNNY_API_KEY e BUNNY_STORAGE_ZONE são necessários",
        },
        { status: 500 },
      )
    }

    // Usar o serviço de arquivos para excluir o arquivo
    const result = await FileService.deleteFile(path)

    if (!result.success) {
      logger.error(`API Files Delete: ${result.error}`, { data: result.details })
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
    logger.error("API Files Delete: Erro ao excluir arquivo:", { data: error })
    return NextResponse.json(
      {
        error: "Erro ao excluir arquivo",
        message: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
      },
      { status: 500 },
    )
  }
}
