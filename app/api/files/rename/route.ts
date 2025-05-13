import { type NextRequest, NextResponse } from "next/server"
import { renameBunnyFile } from "@/lib/bunny"

export async function POST(request: NextRequest) {
  try {
    const { oldPath, newName } = await request.json()

    if (!oldPath || !newName) {
      return NextResponse.json({ error: "Caminho antigo e novo nome são obrigatórios" }, { status: 400 })
    }

    console.log(`API Rename File: Renomeando arquivo de ${oldPath} para ${newName}`)

    // Verificar se o novo nome contém caracteres inválidos
    if (/[\\/:*?"<>|]/.test(newName)) {
      return NextResponse.json({ error: "O nome do arquivo contém caracteres inválidos" }, { status: 400 })
    }

    // Verificar se é uma pasta (termina com /)
    const isDirectory = oldPath.endsWith("/") || oldPath.endsWith("\\")
    console.log(`API Rename File: Tipo de item: ${isDirectory ? "Pasta" : "Arquivo"}`)

    // Usar a função de renomeação apropriada
    const newUrl = await renameBunnyFile(oldPath, newName)

    return NextResponse.json({
      success: true,
      newUrl,
      message: `${isDirectory ? "Pasta" : "Arquivo"} renomeado com sucesso`,
    })
  } catch (error) {
    console.error("Erro ao renomear arquivo:", error)
    return NextResponse.json(
      {
        error: "Erro ao renomear arquivo",
        message: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
