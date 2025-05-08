import { NextResponse } from "next/server"
import { getBunnyPublicUrl } from "@/lib/bunny"

export async function POST(request: Request) {
  try {
    const { filePath } = await request.json()

    if (!filePath) {
      return NextResponse.json({ error: "Caminho do arquivo não fornecido" }, { status: 400 })
    }

    // Gerar URL pública para o arquivo
    const publicUrl = getBunnyPublicUrl(filePath)

    return NextResponse.json({
      success: true,
      shareUrl: publicUrl,
    })
  } catch (error) {
    console.error("Erro ao gerar link de compartilhamento:", error)
    return NextResponse.json(
      {
        error: "Erro ao gerar link de compartilhamento",
        message: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
