import { type NextRequest, NextResponse } from "next/server"
import { uploadFileToBunny } from "@/lib/bunny"
import { addDocumentMetadata } from "@/lib/api"

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

    const folder = (formData.get("folder") as string) || ""

    if (!file) {
      console.error("API Upload: Nenhum arquivo enviado")
      return NextResponse.json({ error: "Nenhum arquivo enviado" }, { status: 400 })
    }

    // Verificar tamanho do arquivo (30MB = 30 * 1024 * 1024 bytes)
    if (file.size > 30 * 1024 * 1024) {
      console.error(`API Upload: Arquivo muito grande - ${file.size} bytes`)
      return NextResponse.json(
        {
          error: "O arquivo excede o tamanho máximo de 30MB.",
        },
        { status: 400 },
      )
    }

    console.log(`API Upload: Arquivo recebido - Nome: ${file.name}, Tamanho: ${file.size}, Tipo: ${file.type}`)

    // Verificar o tipo de arquivo
    const fileType = file.type
    const isAllowedType =
      fileType === "application/pdf" ||
      fileType.startsWith("text/") ||
      fileType === "application/msword" ||
      fileType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
      fileType.startsWith("image/") // Permitir imagens

    if (!isAllowedType) {
      console.error(`API Upload: Tipo de arquivo não permitido - ${fileType}`)
      return NextResponse.json(
        {
          error: "Tipo de arquivo não permitido. Apenas PDF, DOC, DOCX, arquivos de texto e imagens são aceitos.",
        },
        { status: 400 },
      )
    }

    // Gerar um nome de arquivo único
    const originalFileName = file.name
    const timestamp = Date.now()
    const fileName = `${timestamp}-${originalFileName.replace(/\s+/g, "-")}`

    // Determinar a pasta com base no tipo de arquivo
    const isImage = fileType.startsWith("image/")
    const baseFolder = isImage ? "images" : "documents"
    // Combinar a pasta base com a pasta selecionada pelo usuário
    // const folderPath = folder ? `${baseFolder}/${folder}` : baseFolder
    // const filePath = `${folderPath}/${fileName}`

    // Determinar o diretório base com base no tipo de arquivo
    const baseDir = fileType.startsWith("image/") ? "images" : "documents"

    // Combinar o diretório base com a pasta selecionada
    const targetDir = folder ? `${baseDir}/${folder}` : baseDir

    // Construir o caminho completo para o arquivo
    const filePath = `${targetDir}/${fileName}`

    console.log(`API Upload: Nome original: ${originalFileName}`)
    console.log(`API Upload: Nome com timestamp: ${fileName}`)
    console.log(`API Upload: Caminho completo: ${filePath}`)

    // Converter o arquivo para buffer
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    console.log(`API Upload: Arquivo convertido para buffer, tamanho: ${buffer.length} bytes`)

    try {
      // Fazer upload para o Bunny.net
      console.log("API Upload: Iniciando upload para Bunny.net")
      const fileUrl = await uploadFileToBunny(filePath, buffer, file.type)
      console.log(`API Upload: Upload concluído com sucesso. URL: ${fileUrl}`)

      // Armazenar metadados do documento
      const documentType = isImage ? "image" : fileType.includes("pdf") ? "pdf" : "document"
      const metadata = await addDocumentMetadata({
        title: originalFileName.replace(/\.[^/.]+$/, ""),
        originalFileName,
        storedFileName: fileName,
        fileUrl,
        filePath,
        fileType,
        documentType,
        timestamp,
      })

      console.log(`API Upload: Metadados armazenados com ID: ${metadata.id}`)

      // Para simplificar o teste, vamos retornar sucesso sem processar o documento
      return NextResponse.json({
        success: true,
        fileUrl,
        fileName,
        originalFileName,
        fileType,
        filePath,
        documentId: metadata.id,
        chunksProcessed: 0,
        isImage,
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
