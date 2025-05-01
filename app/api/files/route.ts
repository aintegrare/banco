import { type NextRequest, NextResponse } from "next/server"
import { listBunnyFiles } from "@/lib/bunny"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const directory = searchParams.get("directory") || "documents"

    console.log(`API: Listando arquivos do diretório: ${directory}`)

    // Verificar se as variáveis de ambiente estão configuradas
    if (!process.env.BUNNY_API_KEY || !process.env.BUNNY_STORAGE_ZONE) {
      return NextResponse.json(
        {
          error: "Configurações do Bunny.net incompletas. Verifique as variáveis de ambiente.",
          files: [],
        },
        { status: 500 },
      )
    }

    // Tentar listar os arquivos
    const files = await listBunnyFiles(directory)

    console.log(`API: Arquivos listados com sucesso: ${files.length} arquivos encontrados`)

    return NextResponse.json({ files })
  } catch (error) {
    console.error("API: Erro ao listar arquivos:", error)

    return NextResponse.json(
      {
        error: "Erro ao listar arquivos",
        message: error instanceof Error ? error.message : String(error),
        files: [],
      },
      { status: 500 },
    )
  }
}
