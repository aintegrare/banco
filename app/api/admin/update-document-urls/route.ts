import { type NextRequest, NextResponse } from "next/server"
import { updateDocumentUrls } from "@/lib/document-path-manager"

export async function POST(request: NextRequest) {
  try {
    // Verificar autenticação (você pode adicionar sua lógica de autenticação aqui)

    // Atualizar URLs dos documentos
    const results = await updateDocumentUrls()

    return NextResponse.json({
      success: true,
      ...results,
    })
  } catch (error) {
    console.error("Erro ao atualizar URLs de documentos:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
