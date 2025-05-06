import { type NextRequest, NextResponse } from "next/server"
import { moveBunnyFile } from "@/lib/bunny"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { sourcePaths, destinationFolder } = body

    if (!sourcePaths || !Array.isArray(sourcePaths) || sourcePaths.length === 0 || !destinationFolder) {
      return NextResponse.json(
        {
          error: "Os caminhos de origem e a pasta de destino são obrigatórios",
        },
        { status: 400 },
      )
    }

    console.log(`API Move Multiple Files: Movendo ${sourcePaths.length} arquivos para ${destinationFolder}`)

    const results = []
    const errors = []

    // Processar cada arquivo
    for (const sourcePath of sourcePaths) {
      try {
        // Extrair o nome do arquivo do caminho de origem
        const fileName = sourcePath.split("/").pop()

        // Construir o caminho de destino completo
        const destinationPath = `${destinationFolder}${destinationFolder.endsWith("/") ? "" : "/"}${fileName}`

        console.log(`API Move Multiple Files: Movendo ${sourcePath} para ${destinationPath}`)

        const newUrl = await moveBunnyFile(sourcePath, destinationPath)

        results.push({
          sourcePath,
          destinationPath,
          newUrl,
          success: true,
        })
      } catch (error) {
        console.error(`API Move Multiple Files: Erro ao mover ${sourcePath}:`, error)
        errors.push({
          sourcePath,
          error: error instanceof Error ? error.message : String(error),
        })
      }
    }

    return NextResponse.json({
      success: errors.length === 0,
      message: `${results.length} arquivo(s) movido(s) com sucesso. ${errors.length} erro(s).`,
      results,
      errors,
    })
  } catch (error) {
    console.error("API Move Multiple Files: Erro geral:", error)
    return NextResponse.json(
      {
        error: "Erro ao mover arquivos",
        message: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
