import { type NextRequest, NextResponse } from "next/server"
import { getBunnyClient } from "@/lib/bunny"

export async function POST(request: NextRequest) {
  try {
    // Obter o nome do diretório do corpo da requisição
    const body = await request.json()
    const directory = body.directory || "documents"

    console.log(`API Create Directory: Criando diretório: ${directory}`)

    // Verificar se as variáveis de ambiente estão configuradas
    if (!process.env.BUNNY_API_KEY || !process.env.BUNNY_STORAGE_ZONE) {
      console.error("API Create Directory: Configurações do Bunny.net incompletas")
      return NextResponse.json(
        {
          error: "Configurações do Bunny.net incompletas. Verifique as variáveis de ambiente.",
        },
        { status: 500 },
      )
    }

    const bunnyClient = getBunnyClient()

    // Verificar se o diretório já existe
    try {
      console.log(`API Create Directory: Verificando se o diretório ${directory} já existe`)
      const checkResponse = await bunnyClient.get(`/${directory}/`)

      if (checkResponse.ok) {
        console.log(`API Create Directory: Diretório ${directory} já existe`)
        return NextResponse.json({
          success: true,
          message: `O diretório ${directory} já existe.`,
          alreadyExists: true,
        })
      }
    } catch (error) {
      // Se o diretório não existir, continuamos para criá-lo
      console.log(`API Create Directory: Diretório ${directory} não existe, prosseguindo com a criação`)
    }

    // Criar o diretório
    try {
      console.log(`API Create Directory: Criando diretório ${directory}`)
      const response = await bunnyClient.put(`/${directory}/`, "")

      if (!response.ok) {
        console.error(
          `API Create Directory: Erro ao criar diretório ${directory}: ${response.status} ${response.statusText}`,
        )
        return NextResponse.json(
          {
            error: `Erro ao criar diretório ${directory}: ${response.status} ${response.statusText}`,
          },
          { status: response.status },
        )
      }

      console.log(`API Create Directory: Diretório ${directory} criado com sucesso`)
      return NextResponse.json({
        success: true,
        message: `Diretório ${directory} criado com sucesso.`,
      })
    } catch (error) {
      console.error(`API Create Directory: Erro ao criar diretório ${directory}:`, error)
      return NextResponse.json(
        {
          error: `Erro ao criar diretório ${directory}`,
          message: error instanceof Error ? error.message : String(error),
        },
        { status: 500 },
      )
    }
  } catch (error) {
    console.error("API Create Directory: Erro geral:", error)
    return NextResponse.json(
      {
        error: "Erro ao criar diretório",
        message: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
