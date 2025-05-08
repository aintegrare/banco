import { NextResponse } from "next/server"
import { createBunnyDirectory } from "@/lib/bunny"

export async function POST(request: Request) {
  try {
    const { path } = await request.json()

    if (!path) {
      return NextResponse.json({ error: "Caminho da pasta não fornecido" }, { status: 400 })
    }

    console.log(`API Create Folder: Criando pasta em: ${path}`)

    // Verificar se as variáveis de ambiente estão configuradas
    if (!process.env.BUNNY_API_KEY || !process.env.BUNNY_STORAGE_ZONE) {
      console.error("API Create Folder: Configurações do Bunny.net incompletas")
      return NextResponse.json(
        {
          error: "Configurações do Bunny.net incompletas. Verifique as variáveis de ambiente.",
        },
        { status: 500 },
      )
    }

    // Criar a pasta no Bunny.net
    const success = await createBunnyDirectory(path)

    if (success) {
      return NextResponse.json({
        success: true,
        message: "Pasta criada com sucesso",
        path,
      })
    } else {
      return NextResponse.json(
        {
          error: "Não foi possível criar a pasta",
        },
        { status: 500 },
      )
    }
  } catch (error) {
    console.error("API Create Folder: Erro ao criar pasta:", error)
    return NextResponse.json(
      {
        error: "Erro ao criar pasta",
        message: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
