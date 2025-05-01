import { type NextRequest, NextResponse } from "next/server"
import { deleteBunnyFile } from "@/lib/bunny"

export async function DELETE(request: NextRequest, { params }: { params: { path: string } }) {
  try {
    const path = params.path
    const decodedPath = decodeURIComponent(path)

    console.log(`API Delete File: Recebido caminho: ${path}`)
    console.log(`API Delete File: Caminho decodificado: ${decodedPath}`)

    // Garantir que o caminho esteja no formato correto
    // Se o caminho não começar com 'documents/', adicionar
    const normalizedPath = decodedPath.startsWith("documents/") ? decodedPath : `documents/${decodedPath}`

    console.log(`API Delete File: Caminho normalizado: ${normalizedPath}`)

    await deleteBunnyFile(normalizedPath)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Erro ao excluir arquivo:", error)
    return NextResponse.json(
      {
        error: "Erro ao excluir arquivo",
        message: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
