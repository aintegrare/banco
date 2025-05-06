import { type NextRequest, NextResponse } from "next/server"
import { moveBunnyFile } from "@/lib/bunny"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { sourcePath, destinationPath } = body

    if (!sourcePath || !destinationPath) {
      return NextResponse.json({ error: "Os caminhos de origem e destino são obrigatórios" }, { status: 400 })
    }

    console.log(`API Move File: Movendo arquivo de ${sourcePath} para ${destinationPath}`)

    const newUrl = await moveBunnyFile(sourcePath, destinationPath)

    return NextResponse.json({
      success: true,
      message: "Arquivo movido com sucesso",
      newUrl,
    })
  } catch (error) {
    console.error("API Move File: Erro ao mover arquivo:", error)
    return NextResponse.json(
      {
        error: "Erro ao mover arquivo",
        message: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
