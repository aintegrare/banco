import { NextResponse } from "next/server"
import { uploadFileToBunny } from "@/lib/bunny"

export async function POST() {
  try {
    // Verificar se as variáveis de ambiente estão configuradas
    if (!process.env.BUNNY_API_KEY || !process.env.BUNNY_STORAGE_ZONE) {
      return NextResponse.json(
        {
          error: "Configurações do Bunny.net incompletas. Verifique as variáveis de ambiente.",
        },
        { status: 500 },
      )
    }

    // Criar um arquivo de teste
    const testContent = `Arquivo de teste criado em ${new Date().toISOString()}`
    const testFilePath = `documents/test-${Date.now()}.txt`

    console.log(`Criando arquivo de teste: ${testFilePath}`)

    // Fazer upload do arquivo de teste
    const fileUrl = await uploadFileToBunny(testFilePath, testContent, "text/plain")

    return NextResponse.json({
      success: true,
      message: "Diretório de teste criado com sucesso",
      fileUrl,
    })
  } catch (error) {
    console.error("Erro ao criar diretório de teste:", error)

    return NextResponse.json(
      {
        error: "Erro ao criar diretório de teste",
        message: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
