import { type NextRequest, NextResponse } from "next/server"
import { createBunnyDirectory } from "@/lib/bunny"

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

    try {
      console.log(`API Create Directory: Iniciando processo de criação para: ${directory}`)
      // Usar a função para criar o diretório
      const success = await createBunnyDirectory(directory)

      console.log(`API Create Directory: Resultado da criação: ${success ? "Sucesso" : "Falha"}`)

      if (success) {
        console.log(`API Create Directory: Diretório ${directory} criado com sucesso`)
        return NextResponse.json({
          success: true,
          message: `Diretório ${directory} criado com sucesso.`,
          directory: directory,
        })
      } else {
        console.error(`API Create Directory: Falha ao criar diretório ${directory}`)
        return NextResponse.json(
          {
            error: `Falha ao criar diretório ${directory}`,
          },
          { status: 500 },
        )
      }
    } catch (error) {
      console.error(`API Create Directory: Erro ao criar diretório ${directory}:`, error)
      return NextResponse.json(
        {
          error: `Erro ao criar diretório ${directory}`,
          message: error instanceof Error ? error.message : String(error),
          stack: error instanceof Error ? error.stack : undefined,
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
        stack: error instanceof Error ? error.stack : undefined,
      },
      { status: 500 },
    )
  }
}
