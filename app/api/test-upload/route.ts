import { NextResponse } from "next/server"
import { uploadFileToBunny } from "@/lib/bunny"

export async function POST() {
  try {
    console.log("API Test Upload: Iniciando teste de upload")

    // Verificar se as variáveis de ambiente estão configuradas
    if (!process.env.BUNNY_API_KEY || !process.env.BUNNY_STORAGE_ZONE) {
      console.error("API Test Upload: Configurações do Bunny.net incompletas")
      return NextResponse.json(
        {
          error: "Configurações do Bunny.net incompletas. Verifique as variáveis de ambiente.",
        },
        { status: 500 },
      )
    }

    // Criar um arquivo de teste simples
    const testContent = `Arquivo de teste criado em ${new Date().toISOString()}`
    const testFilePath = `documents/test-${Date.now()}.txt`

    console.log(`API Test Upload: Criando arquivo de teste: ${testFilePath}`)

    try {
      // Fazer upload do arquivo de teste
      const fileUrl = await uploadFileToBunny(testFilePath, testContent, "text/plain")
      console.log(`API Test Upload: Upload concluído com sucesso. URL: ${fileUrl}`)

      return NextResponse.json({
        success: true,
        message: "Teste de upload concluído com sucesso",
        fileUrl,
        note: "Importante: Para acessar este arquivo publicamente, você precisa configurar uma Pull Zone no painel do Bunny.net.",
      })
    } catch (uploadError) {
      console.error("API Test Upload: Erro específico no upload para Bunny.net:", uploadError)
      return NextResponse.json(
        {
          error: "Erro ao fazer upload para o armazenamento",
          message: uploadError instanceof Error ? uploadError.message : String(uploadError),
        },
        { status: 500 },
      )
    }
  } catch (error) {
    console.error("API Test Upload: Erro geral no teste de upload:", error)
    return NextResponse.json(
      {
        error: "Erro ao processar o teste de upload",
        message: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
