import { NextResponse } from "next/server"
import { getBunnyInfo, listBunnyFiles } from "@/lib/bunny"

export async function GET() {
  try {
    // Obter informações sobre a configuração do Bunny
    const bunnyInfo = await getBunnyInfo()

    // Se a conexão for bem-sucedida, tentar listar arquivos
    let files = []
    if (bunnyInfo.connectionTest.success) {
      files = await listBunnyFiles()
    }

    return NextResponse.json({
      ...bunnyInfo,
      files: files.slice(0, 10), // Limitar a 10 arquivos para não sobrecarregar a resposta
      totalFiles: files.length,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Erro ao diagnosticar configuração do Bunny:", error)
    return NextResponse.json(
      {
        error: "Erro ao diagnosticar configuração do Bunny",
        message: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
