import { NextResponse } from "next/server"
import { checkBunnyConfig } from "@/lib/bunny-config-checker"
import { logger } from "@/lib/logger"

export async function GET() {
  try {
    logger.info("API: Iniciando verificação da configuração do Bunny CDN")

    const result = await checkBunnyConfig()

    if (!result.success) {
      logger.warn("API: Verificação do Bunny CDN encontrou problemas", {
        issues: result.issues,
        recommendations: result.recommendations,
      })
    } else {
      logger.info("API: Verificação do Bunny CDN concluída com sucesso")
    }

    return NextResponse.json(result)
  } catch (error) {
    logger.error("API: Erro ao verificar configuração do Bunny CDN", { error })

    return NextResponse.json(
      {
        success: false,
        issues: ["Erro ao verificar configuração do Bunny CDN"],
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
      },
      { status: 500 },
    )
  }
}
