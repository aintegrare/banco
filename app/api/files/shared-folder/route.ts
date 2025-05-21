import { type NextRequest, NextResponse } from "next/server"
import { listBunnyFiles } from "@/lib/bunny"
import { logger } from "@/lib/logger"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const folderPath = searchParams.get("path")
    const token = searchParams.get("token")

    if (!folderPath) {
      return NextResponse.json({ error: "Caminho da pasta não especificado" }, { status: 400 })
    }

    // Aqui você pode adicionar validação do token
    // Por exemplo, verificar se o token é válido para esta pasta
    // Isso requer uma tabela no banco de dados para armazenar tokens de compartilhamento

    // Listar arquivos na pasta
    const files = await listBunnyFiles(folderPath)

    // Filtrar informações sensíveis antes de retornar
    const safeFiles = files.map((file) => ({
      name: file.ObjectName,
      type: file.IsDirectory ? "folder" : "file",
      size: file.Length,
      modified: file.LastChanged,
      path: file.Path,
      url: file.PublicUrl,
      isDirectory: file.IsDirectory,
    }))

    return NextResponse.json({ files: safeFiles })
  } catch (error) {
    logger.error("Erro ao listar arquivos da pasta compartilhada:", { data: error })
    return NextResponse.json({ error: "Erro ao listar arquivos da pasta compartilhada" }, { status: 500 })
  }
}
