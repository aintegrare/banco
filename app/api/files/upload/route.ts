import { type NextRequest, NextResponse } from "next/server"
import { uploadFileToBunny } from "@/lib/bunny"

export async function POST(request: NextRequest) {
  try {
    // Verificar se as variáveis de ambiente estão configuradas
    if (!process.env.BUNNY_API_KEY || !process.env.BUNNY_STORAGE_ZONE) {
      console.error("API Upload: Configurações do Bunny.net incompletas")
      return NextResponse.json(
        {
          error: "Configurações do Bunny.net incompletas. Verifique as variáveis de ambiente.",
        },
        { status: 500 },
      )
    }

    // Obter o formulário com o arquivo
    const formData = await request.formData()
    const file = formData.get("file") as File
    const directory = (formData.get("directory") as string) || ""

    if (!file) {
      return NextResponse.json({ error: "Nenhum arquivo enviado" }, { status: 400 })
    }

    console.log(`API Upload: Recebido arquivo ${file.name} para o diretório: ${directory}`)

    // Ler o arquivo como ArrayBuffer
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // Construir o caminho completo do arquivo
    const filePath = directory ? `${directory}/${file.name}` : file.name

    // Fazer upload para o Bunny.net
    const publicUrl = await uploadFileToBunny(filePath, buffer, file.type)

    return NextResponse.json({
      success: true,
      url: publicUrl,
      fileName: file.name,
      path: filePath,
    })
  } catch (error) {
    console.error("API Upload: Erro ao fazer upload de arquivo:", error)
    return NextResponse.json(
      {
        error: "Erro ao fazer upload de arquivo",
        message: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
