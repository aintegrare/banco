import { NextResponse } from "next/server"
import { listBunnyFiles } from "@/lib/bunny"

export async function GET(request: Request) {
  try {
    const url = new URL(request.url)
    const directory = url.searchParams.get("directory") || ""

    // Listar arquivos no diretório especificado
    const files = await listBunnyFiles(directory)

    // Retornar apenas os dados necessários para a visualização pública
    const publicFiles = files.map((file) => ({
      name: file.ObjectName,
      isDirectory: file.IsDirectory,
      size: file.Length,
      modified: file.LastChanged,
      url: file.PublicUrl,
    }))

    return NextResponse.json({
      success: true,
      files: publicFiles,
    })
  } catch (error) {
    console.error("Erro ao listar arquivos públicos:", error)
    return NextResponse.json(
      {
        error: "Erro ao listar arquivos",
        message: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
