import { type NextRequest, NextResponse } from "next/server"
import { createBunnyDirectory } from "@/lib/bunny"

export async function POST(request: NextRequest) {
  try {
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

    // Obter o caminho do diretório a ser criado
    const { path } = await request.json()

    if (!path) {
      return NextResponse.json({ error: "Caminho do diretório não fornecido" }, { status: 400 })
    }

    console.log(`API Create Directory: Criando diretório: ${path}`)

    // Criar o diretório no Bunny.net
    await createBunnyDirectory(path)

    return NextResponse.json({
      success: true,
      message: "Diretório criado com sucesso",
    })
  } catch (error) {
    console.error("API Create Directory: Erro ao criar diretório:", error)
    return NextResponse.json(
      {
        error: "Erro ao criar diretório",
        message: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
