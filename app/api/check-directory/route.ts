import { type NextRequest, NextResponse } from "next/server"
import { getBunnyClient, getBunnyPublicUrl } from "@/lib/bunny"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const directory = searchParams.get("directory") || "documents"

    console.log(`API Check Directory: Verificando diretório: ${directory}`)

    // Verificar se as variáveis de ambiente estão configuradas
    if (!process.env.BUNNY_API_KEY || !process.env.BUNNY_STORAGE_ZONE) {
      console.error("API Check Directory: Configurações do Bunny.net incompletas")
      return NextResponse.json(
        {
          error: "Configurações do Bunny.net incompletas. Verifique as variáveis de ambiente.",
        },
        { status: 500 },
      )
    }

    const bunnyClient = getBunnyClient()

    // Verificar se o diretório existe
    try {
      console.log(`API Check Directory: Verificando se o diretório ${directory} existe`)
      const response = await bunnyClient.get(`/${directory}/`)

      if (!response.ok) {
        console.log(`API Check Directory: Diretório ${directory} não existe`)
        return NextResponse.json({
          exists: false,
          message: `O diretório ${directory} não existe.`,
        })
      }

      const files = await response.json()
      console.log(`API Check Directory: Diretório ${directory} existe com ${files.length} arquivos`)

      // Adicionar URLs públicas aos arquivos
      const filesWithUrls = files.map((file: any) => ({
        ...file,
        PublicUrl: getBunnyPublicUrl(file.Path),
      }))

      return NextResponse.json({
        exists: true,
        fileCount: files.length,
        files: filesWithUrls,
      })
    } catch (error) {
      console.error(`API Check Directory: Erro ao verificar diretório ${directory}:`, error)
      return NextResponse.json({
        exists: false,
        error: `Erro ao verificar diretório ${directory}`,
        message: error instanceof Error ? error.message : String(error),
      })
    }
  } catch (error) {
    console.error("API Check Directory: Erro geral:", error)
    return NextResponse.json(
      {
        error: "Erro ao verificar diretório",
        message: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
