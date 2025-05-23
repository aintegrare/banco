import { type NextRequest, NextResponse } from "next/server"
import { listBunnyFiles } from "@/lib/bunny"

export async function GET(request: NextRequest) {
  try {
    // Obter o parâmetro directory da URL
    const searchParams = request.nextUrl.searchParams
    const directory = searchParams.get("directory") || ""

    console.log(`API Files: Buscando arquivos no diretório: ${directory}`)

    // Verificar se as variáveis de ambiente estão configuradas
    if (!process.env.BUNNY_API_KEY || !process.env.BUNNY_STORAGE_ZONE) {
      console.error("API Files: Configurações do Bunny.net incompletas")
      return NextResponse.json(
        {
          error: "Configurações do Bunny.net incompletas. Verifique as variáveis de ambiente.",
        },
        { status: 500 },
      )
    }

    // Listar arquivos no Bunny.net
    const files = await listBunnyFiles(directory)

    return NextResponse.json({ files })
  } catch (error) {
    console.error("API Files: Erro ao listar arquivos:", error)
    return NextResponse.json(
      {
        error: "Erro ao listar arquivos",
        message: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
