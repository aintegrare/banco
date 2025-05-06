import { type NextRequest, NextResponse } from "next/server"
import { getBunnyClient } from "@/lib/bunny"

export async function GET(request: NextRequest) {
  try {
    const folderPath = request.nextUrl.searchParams.get("path") || ""

    if (!folderPath) {
      return NextResponse.json(
        {
          error: "Caminho da pasta não especificado",
        },
        { status: 400 },
      )
    }

    console.log(`API Check Folder: Verificando pasta: ${folderPath}`)

    // Verificar se as variáveis de ambiente estão configuradas
    if (!process.env.BUNNY_API_KEY || !process.env.BUNNY_STORAGE_ZONE) {
      console.error("API Check Folder: Configurações do Bunny.net incompletas")
      return NextResponse.json(
        {
          error: "Configurações do Bunny.net incompletas. Verifique as variáveis de ambiente.",
        },
        { status: 500 },
      )
    }

    // Normalizar o caminho
    const normalizedPath = folderPath.replace(/\/+/g, "/").replace(/^\//, "")
    const formattedPath = normalizedPath.endsWith("/") ? normalizedPath : `${normalizedPath}/`

    const client = getBunnyClient()

    try {
      const response = await client.get(`/${formattedPath}`)

      console.log(`API Check Folder: Status da verificação: ${response.status}`)

      if (response.ok) {
        // Tentar obter a lista de arquivos na pasta
        let files = []
        try {
          const text = await response.text()
          files = JSON.parse(text)
        } catch (e) {
          console.error("API Check Folder: Erro ao parsear a resposta:", e)
        }

        return NextResponse.json({
          exists: true,
          path: formattedPath,
          message: `A pasta ${formattedPath} existe`,
          files: Array.isArray(files) ? files : [],
          fileCount: Array.isArray(files) ? files.length : 0,
        })
      } else {
        return NextResponse.json({
          exists: false,
          path: formattedPath,
          message: `A pasta ${formattedPath} não existe`,
          status: response.status,
          statusText: response.statusText,
        })
      }
    } catch (error) {
      console.error(`API Check Folder: Erro ao verificar pasta ${formattedPath}:`, error)
      return NextResponse.json(
        {
          exists: false,
          path: formattedPath,
          error: `Erro ao verificar pasta: ${error instanceof Error ? error.message : String(error)}`,
        },
        { status: 500 },
      )
    }
  } catch (error) {
    console.error("API Check Folder: Erro geral:", error)
    return NextResponse.json(
      {
        error: "Erro ao verificar pasta",
        message: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
