import { type NextRequest, NextResponse } from "next/server"
import { processDocument } from "@/lib/api"

export async function POST(request: NextRequest) {
  try {
    console.log("API Process Document: Iniciando processamento de documento")

    const body = await request.json()
    const { documentId } = body

    if (!documentId) {
      console.error("API Process Document: ID do documento não fornecido")
      return NextResponse.json({ error: "ID do documento é obrigatório" }, { status: 400 })
    }

    console.log(`API Process Document: Processando documento com ID: ${documentId}`)

    try {
      const result = await processDocument(documentId)
      console.log(`API Process Document: Documento processado com sucesso:`, result)

      return NextResponse.json({
        success: true,
        ...result,
      })
    } catch (processingError) {
      console.error("API Process Document: Erro ao processar documento:", processingError)
      return NextResponse.json(
        {
          error: "Erro ao processar documento",
          message: processingError instanceof Error ? processingError.message : String(processingError),
        },
        { status: 500 },
      )
    }
  } catch (error) {
    console.error("API Process Document: Erro geral:", error)
    return NextResponse.json(
      {
        error: "Erro ao processar a requisição",
        message: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
