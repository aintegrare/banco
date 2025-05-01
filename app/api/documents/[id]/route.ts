import { type NextRequest, NextResponse } from "next/server"
import { deleteDocument } from "@/lib/api"

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = Number.parseInt(params.id, 10)

    if (isNaN(id)) {
      return NextResponse.json({ error: "ID inválido" }, { status: 400 })
    }

    await deleteDocument(id)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Erro ao excluir documento:", error)

    return NextResponse.json(
      {
        error: "Erro ao excluir documento",
        message: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
