import { NextResponse } from "next/server"
import { uploadFileToBunny } from "@/lib/bunny"

export async function POST(request: Request) {
  try {
    console.log("API: Tentando criar diretório")

    // Verificar se as variáveis de ambiente estão configuradas
    if (!process.env.BUNNY_API_KEY || !process.env.BUNNY_STORAGE_ZONE) {
      console.error("API: Configurações do Bunny.net incompletas")
      return NextResponse.json(
        {
          error: "Configurações do Bunny.net incompletas. Verifique as variáveis de ambiente.",
        },
        { status: 500 },
      )
    }

    const { directory = "documents" } = await request.json().catch(() => ({}))

    // No Bunny.net, para criar um diretório, precisamos fazer upload de um arquivo nesse diretório
    // Vamos criar um arquivo .keep vazio
    const filePath = `${directory}/.keep`
    const fileContent = ""

    console.log(`API: Criando diretório através do arquivo: ${filePath}`)

    // Fazer upload do arquivo vazio para criar o diretório
    const fileUrl = await uploadFileToBunny(filePath, fileContent, "text/plain")

    return NextResponse.json({
      success: true,
      message: `Diretório ${directory} criado com sucesso`,
      fileUrl,
    })
  } catch (error) {
    console.error("API: Erro ao criar diretório:", error)

    return NextResponse.json(
      {
        error: "Erro ao criar diretório",
        message: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
