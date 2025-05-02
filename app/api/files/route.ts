import { type NextRequest, NextResponse } from "next/server"
import { getBunnyClient, getBunnyPublicUrl } from "@/lib/bunny"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const directory = searchParams.get("directory") || "documents"

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

    const bunnyClient = getBunnyClient()

    // Verificar se o diretório existe e criar se não existir
    try {
      console.log(`API Files: Verificando se o diretório ${directory} existe`)
      await bunnyClient.get(`/${directory}/`)
      console.log(`API Files: Diretório ${directory} existe`)
    } catch (error) {
      console.log(`API Files: Diretório ${directory} não existe, criando...`)
      try {
        await bunnyClient.put(`/${directory}/`, "")
        console.log(`API Files: Diretório ${directory} criado com sucesso`)
      } catch (createError) {
        console.error(`API Files: Erro ao criar diretório ${directory}:`, createError)
        // Continuar mesmo se não conseguir criar o diretório
      }
    }

    // Listar arquivos no diretório
    console.log(`API Files: Listando arquivos no diretório ${directory}`)
    const response = await bunnyClient.get(`/${directory}/`)

    if (!response.ok) {
      console.error(
        `API Files: Erro ao listar arquivos no diretório ${directory}: ${response.status} ${response.statusText}`,
      )
      return NextResponse.json(
        { error: `Erro ao listar arquivos: ${response.status} ${response.statusText}` },
        { status: response.status },
      )
    }

    const files = await response.json()
    console.log(`API Files: ${files.length} arquivos encontrados no diretório ${directory}`)

    // Adicionar URLs públicas aos arquivos
    const filesWithUrls = files.map((file: any) => ({
      ...file,
      PublicUrl: getBunnyPublicUrl(file.Path),
    }))

    return NextResponse.json({ files: filesWithUrls })
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
