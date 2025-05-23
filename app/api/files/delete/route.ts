import { type NextRequest, NextResponse } from "next/server"
import { deleteBunnyFile } from "@/lib/bunny"

export async function POST(request: NextRequest) {
  try {
    // Verificar se as variáveis de ambiente estão configuradas
    if (!process.env.BUNNY_API_KEY || !process.env.BUNNY_STORAGE_ZONE) {
      console.error("API Delete: Configurações do Bunny.net incompletas")
      return NextResponse.json(
        {
          error: "Configurações do Bunny.net incompletas. Verifique as variáveis de ambiente.",
        },
        { status: 500 },
      )
    }

    // Obter o caminho do arquivo a ser excluído
    const { path } = await request.json()

    if (!path) {
      return NextResponse.json({ error: "Caminho do arquivo não fornecido" }, { status: 400 })
    }

    console.log(`API Delete: Excluindo arquivo: ${path}`)

    // Excluir o arquivo do Bunny.net
    await deleteBunnyFile(path)

    return NextResponse.json({
      success: true,
      message: "Arquivo excluído com sucesso",
    })
  } catch (error) {
    console.error("API Delete: Erro ao excluir arquivo:", error)
    return NextResponse.json(
      {
        error: "Erro ao excluir arquivo",
        message: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
