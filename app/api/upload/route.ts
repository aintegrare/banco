import { type NextRequest, NextResponse } from "next/server"
import { uploadFileToBunny } from "@/lib/bunny"
import { processDocument } from "@/lib/api"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File | null

    if (!file) {
      return NextResponse.json({ error: "Nenhum arquivo enviado" }, { status: 400 })
    }

    // Verificar o tipo de arquivo
    const fileType = file.type
    const isAllowedType =
      fileType === "application/pdf" ||
      fileType.startsWith("text/") ||
      fileType === "application/msword" ||
      fileType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document"

    if (!isAllowedType) {
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

    // Converter o arquivo para buffer
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // Fazer upload para o Bunny.net
    const fileUrl = await uploadFileToBunny(filePath, buffer, file.type)

    // Processar o documento para indexação
    const documentType = fileType === "application/pdf" ? "pdf" : "website"
    const processingResult = await processDocument(fileUrl, documentType)

    return NextResponse.json({
      success: true,
      fileUrl,
      fileName,
      fileType,
      documentId: processingResult.documentId,
      chunksProcessed: processingResult.chunksProcessed,
    })
  } catch (error) {
    console.error("Erro no upload de arquivo:", error)
    return NextResponse.json(
      {
        error: "Erro ao processar o upload",
        message: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
