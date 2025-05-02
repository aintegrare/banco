import { type NextRequest, NextResponse } from "next/server"
import { listDocumentMetadata, getDocumentMetadata } from "@/lib/api"

export async function GET(request: NextRequest) {
  try {
    console.log("API Document Metadata: Obtendo metadados de documentos")

    const url = new URL(request.url)
    const id = url.searchParams.get("id")

    if (id) {
      // Obter metadados de um documento específico
      const documentId = Number.parseInt(id, 10)
      if (isNaN(documentId)) {
        return NextResponse.json({ error: "ID do documento inválido" }, { status: 400 })
      }

      console.log(`API Document Metadata: Obtendo metadados do documento ${documentId}`)
      const metadata = await getDocumentMetadata(documentId)

      if (!metadata) {
        return NextResponse.json({ error: "Documento não encontrado" }, { status: 404 })
      }

      return NextResponse.json(metadata)
    } else {
      // Listar metadados de todos os documentos
      console.log("API Document Metadata: Listando todos os metadados")
      const metadataList = await listDocumentMetadata()
      return NextResponse.json(metadataList)
    }
  } catch (error) {
    console.error("API Document Metadata: Erro ao obter metadados:", error)
    return NextResponse.json(
      {
        error: "Erro ao obter metadados",
        message: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
