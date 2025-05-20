import { type NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    // Aqui você pode adicionar verificação de autenticação se necessário

    const result = {
      total: 0,
      updated: 0,
      failed: 0,
      details: [] as any[],
    }

    // Buscar todos os documentos
    const { data: documents, error } = await supabase.from("documents").select("id, title, url")

    if (error) {
      throw error
    }

    if (!documents || documents.length === 0) {
      return NextResponse.json({
        success: true,
        ...result,
      })
    }

    result.total = documents.length

    // Processar cada documento
    for (const doc of documents) {
      try {
        if (!doc.url) continue

        // Verificar se a URL já contém "/clientes/"
        if (doc.url.includes("/documents/clientes/")) {
          continue
        }

        // Corrigir a URL
        let correctedUrl = doc.url

        // Se contém "/documents/" mas não "/documents/clientes/", inserir "/clientes/"
        if (doc.url.includes("/documents/") && !doc.url.includes("/documents/clientes/")) {
          const pathParts = doc.url.split("/documents/")
          if (pathParts.length > 1) {
            correctedUrl = `${pathParts[0]}/documents/clientes/${pathParts[1]}`
          }
        }

        // Se a URL foi alterada, atualizar no banco de dados
        if (correctedUrl !== doc.url) {
          const { error: updateError } = await supabase.from("documents").update({ url: correctedUrl }).eq("id", doc.id)

          if (updateError) {
            result.failed++
            result.details.push({
              id: doc.id,
              title: doc.title,
              oldUrl: doc.url,
              error: updateError.message,
              status: "error",
            })
          } else {
            result.updated++
            result.details.push({
              id: doc.id,
              title: doc.title,
              oldUrl: doc.url,
              newUrl: correctedUrl,
              status: "success",
            })
          }
        }
      } catch (docError) {
        result.failed++
        result.details.push({
          id: doc.id,
          title: doc.title,
          error: docError instanceof Error ? docError.message : String(docError),
          status: "error",
        })
      }
    }

    return NextResponse.json({
      success: true,
      ...result,
    })
  } catch (error) {
    console.error("Erro ao corrigir URLs de documentos:", error)

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
