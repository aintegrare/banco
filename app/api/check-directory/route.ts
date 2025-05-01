import { NextResponse } from "next/server"
import { listBunnyFiles } from "@/lib/bunny"

export async function GET() {
  try {
    console.log("API Check Directory: Verificando diretório 'documents'")

    // Verificar se as variáveis de ambiente estão configuradas
    if (!process.env.BUNNY_API_KEY || !process.env.BUNNY_STORAGE_ZONE) {
      console.error("API Check Directory: Configurações do Bunny.net incompletas")
      return NextResponse.json(
        {
          error: "Configurações do Bunny.net incompletas. Verifique as variáveis de ambiente.",
        },
        { status: 500 },
      )
    }

    // Primeiro, verificar o diretório raiz
    console.log("API Check Directory: Verificando diretório raiz")
    const rootFiles = await listBunnyFiles("")

    // Verificar se o diretório 'documents' existe
    const documentsDir = rootFiles.find((f) => f.ObjectName === "documents" && f.IsDirectory)

    if (!documentsDir) {
      console.log("API Check Directory: Diretório 'documents' não encontrado no diretório raiz")
      return NextResponse.json({
        exists: false,
        message: "O diretório 'documents' não existe no diretório raiz",
        rootFiles,
      })
    }

    console.log("API Check Directory: Diretório 'documents' encontrado, verificando seu conteúdo")

    // Verificar o conteúdo do diretório 'documents'
    const documentsFiles = await listBunnyFiles("documents")

    return NextResponse.json({
      exists: true,
      message: "Diretório 'documents' existe",
      fileCount: documentsFiles.length,
      files: documentsFiles,
      rootFiles,
    })
  } catch (error) {
    console.error("API Check Directory: Erro ao verificar diretório:", error)

    return NextResponse.json(
      {
        error: "Erro ao verificar diretório",
        message: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
