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

    // Verificar tamanho do arquivo (100MB = 100 * 1024 * 1024 bytes)
    if (file.size > 100 * 1024 * 1024) {
      console.error(`API Upload: Arquivo muito grande - ${file.size} bytes`)
      return NextResponse.json(
        {
          error: "O arquivo excede o tamanho máximo de 100MB.",
        },
        { status: 400 },
      )
    }

    console.log(`API Upload: Arquivo recebido - Nome: ${file.name}, Tamanho: ${file.size}, Tipo: ${file.type}`)

    // Verificar o tipo de arquivo
    const fileType = file.type
    const fileExtension = file.name.split(".").pop()?.toLowerCase() || ""

    // Lista de extensões Adobe permitidas
    const allowedAdobeExtensions = ["psd", "psb", "ai", "indd", "idml"]

    // Verificar se é um tipo MIME conhecido ou uma extensão Adobe permitida
    const isAllowedType =
      fileType === "application/pdf" ||
      fileType.startsWith("text/") ||
      fileType === "application/msword" ||
      fileType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
      fileType.startsWith("image/") ||
      fileType === "application/vnd.adobe.photoshop" ||
      fileType === "image/vnd.adobe.photoshop" ||
      fileType === "application/illustrator" ||
      fileType === "application/x-indesign" ||
      allowedAdobeExtensions.includes(fileExtension)

    if (!isAllowedType) {
      console.error(`API Upload: Tipo de arquivo não permitido - ${fileType}, extensão: ${fileExtension}`)
      return NextResponse.json(
        {
          error:
            "Tipo de arquivo não permitido. Apenas PDF, DOC, DOCX, arquivos de texto, imagens e arquivos Adobe (PSD, AI, INDD) são aceitos.",
        },
        { status: 400 },
      )
    }

    // Gerar um nome de arquivo único
    const originalFileName = file.name
    const timestamp = Date.now()
    const fileName = `${timestamp}-${originalFileName.replace(/\s+/g, "-")}`

    // Determinar o diretório base com base no tipo de arquivo
    const fileExtensionForDir = originalFileName.split(".").pop()?.toLowerCase() || ""
    const adobeExtensions = ["psd", "psb", "ai", "indd", "idml"]

    let baseDir = "documents"
    if (fileType.startsWith("image/")) {
      baseDir = "images"
    } else if (adobeExtensions.includes(fileExtensionForDir)) {
      baseDir = "design" // Criar uma pasta específica para arquivos de design
    }

    // Construir o caminho completo para o arquivo
    let filePath = ""

    if (folder) {
      // Se uma pasta específica foi selecionada, usar essa pasta
      filePath = `${folder}/${fileName}`
    } else {
      // Caso contrário, usar o diretório base
      filePath = `${baseDir}/${fileName}`
    }

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
      const isImage = fileType.startsWith("image/")
      const fileExtensionForMetadata = originalFileName.split(".").pop()?.toLowerCase() || ""

      // Determinar o tipo de documento
      let documentType = "document"
      if (isImage) {
        documentType = "image"
      } else if (fileType.includes("pdf")) {
        documentType = "pdf"
      } else if (["psd", "psb"].includes(fileExtensionForMetadata)) {
        documentType = "photoshop"
      } else if (["ai"].includes(fileExtensionForMetadata)) {
        documentType = "illustrator"
      } else if (["indd", "idml"].includes(fileExtensionForMetadata)) {
        documentType = "indesign"
      }

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
