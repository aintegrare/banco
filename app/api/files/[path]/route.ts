import { type NextRequest, NextResponse } from "next/server"
import { deleteBunnyFile } from "@/lib/bunny"

export async function DELETE(request: NextRequest, { params }: { params: { path: string } }) {
  try {
    const path = params.path
    const decodedPath = decodeURIComponent(path)

    await deleteBunnyFile(decodedPath)

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
