import { NextResponse } from "next/server"
import { diagnoseDocumentAccess } from "@/lib/document-selection"

export async function GET() {
  try {
    console.log("API Diagnose: Iniciando diagnóstico de acesso aos documentos")

    const diagnosticResult = await diagnoseDocumentAccess()

    return NextResponse.json({
      ...diagnosticResult,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("API Diagnose: Erro durante diagnóstico:", error)

    return NextResponse.json(
      {
        success: false,
        error: "Erro durante diagnóstico",
        message: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
