import { type NextRequest, NextResponse } from "next/server"
import { uploadFileToBunny } from "@/lib/bunny"

export async function POST(request: NextRequest) {
  try {
    console.log("API Upload: Iniciando processamento de upload")

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

    const formData = await request.formData()
    const file = formData.get("file") as File | null

    if (!file) {
      console.error("API Upload: Nenhum arquivo enviado")
      return NextResponse.json({ error: "Nenhum arquivo enviado" }, { status: 400 })
    }

    console.log(`API Upload: Arquivo recebido - Nome: ${file.name}, Tamanho: ${file.size}, Tipo: ${file.type}`)

    // Verificar o tipo de arquivo
    const fileType = file.type
    const isAllowedType =
      fileType === "application/pdf" ||
      fileType.startsWith("text/") ||
      fileType === "application/msword" ||
      fileType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document"

    if (!isAllowedType) {
      console.error(`API Upload: Tipo de arquivo não permitido - ${fileType}`)
      return NextResponse.json(
        {
          error: "Tipo de arquivo não permitido. Apenas PDF, DOC, DOCX e arquivos de texto são aceitos.",
        },
        { status: 400 },
      )
    }

    // Gerar um nome de arquivo único
    const fileName = `${Date.now()}-${file.name.replace(/\s+/g, "-")}`
    const filePath = `documents/${fileName}`

    console.log(`API Upload: Preparando upload para ${filePath}`)

    // Converter o arquivo para buffer
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    console.log(`API Upload: Arquivo convertido para buffer, tamanho: ${buffer.length} bytes`)

    try {
      // Fazer upload para o Bunny.net
      console.log("API Upload: Iniciando upload para Bunny.net")
      const fileUrl = await uploadFileToBunny(filePath, buffer, file.type)
      console.log(`API Upload: Upload concluído com sucesso. URL: ${fileUrl}`)

      // Para simplificar o teste, vamos retornar sucesso sem processar o documento
      return NextResponse.json({
        success: true,
        fileUrl,
        fileName,
        fileType,
        filePath, // Adicionando o caminho do arquivo para depuração
        chunksProcessed: 0,
      })
    } catch (uploadError) {
      console.error("API Upload: Erro específico no upload para Bunny.net:", uploadError)
      return NextResponse.json(
        {
          error: "Erro ao fazer upload para o armazenamento",
          message: uploadError instanceof Error ? uploadError.message : String(uploadError),
        },
        { status: 500 },
      )
    }
  } catch (error) {
    console.error("API Upload: Erro geral no upload de arquivo:", error)
    return NextResponse.json(
      {
        error: "Erro ao processar o upload",
        message: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
