import { type NextRequest, NextResponse } from "next/server"
import { listBunnyFiles } from "@/lib/bunny"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const directory = searchParams.get("directory") || "documents"

    console.log(`API Files: Listando arquivos do diretório: ${directory}`)

    // Verificar se as variáveis de ambiente estão configuradas
    if (!process.env.BUNNY_API_KEY || !process.env.BUNNY_STORAGE_ZONE) {
      console.error("API Files: Configurações do Bunny.net incompletas")
      return NextResponse.json(
        {
          error: "Configurações do Bunny.net incompletas. Verifique as variáveis de ambiente.",
          files: [],
        },
        { status: 500 },
      )
    }

    // Tentar listar os arquivos
    try {
      console.log(`API Files: Chamando listBunnyFiles para o diretório: ${directory}`)
      const files = await listBunnyFiles(directory)
      console.log(`API Files: Arquivos listados com sucesso: ${files.length} arquivos encontrados`)

      // Adicionar mais informações para depuração
      if (files.length > 0) {
        console.log(
          "API Files: Primeiros 3 arquivos:",
          files.slice(0, 3).map((f) => ({
            Nome: f.ObjectName,
            Caminho: f.Path,
            URL: f.PublicUrl,
          })),
        )
      } else {
        console.log("API Files: Nenhum arquivo encontrado no diretório")
      }

      return NextResponse.json({ files })
    } catch (listError) {
      console.error("API Files: Erro específico ao listar arquivos:", listError)

      // Tentar listar o diretório raiz como fallback
      try {
        console.log("API Files: Tentando listar o diretório raiz como fallback")
        const rootFiles = await listBunnyFiles("")
        console.log(`API Files: Diretório raiz listado com sucesso: ${rootFiles.length} arquivos/pastas encontrados`)

        // Verificar se o diretório 'documents' existe
        const documentsDir = rootFiles.find((f) => f.ObjectName === "documents" && f.IsDirectory)

        if (!documentsDir) {
          console.log("API Files: Diretório 'documents' não encontrado no diretório raiz")
        } else {
          console.log("API Files: Diretório 'documents' encontrado no diretório raiz")
        }

        return NextResponse.json({
          warning: "Não foi possível listar o diretório solicitado. Mostrando diretório raiz.",
          files: rootFiles,
        })
      } catch (rootError) {
        console.error("API Files: Erro ao listar diretório raiz:", rootError)
        throw listError // Lançar o erro original
      }
    }
  } catch (error) {
    console.error("API Files: Erro ao listar arquivos:", error)

    return NextResponse.json(
      {
        error: "Erro ao listar arquivos",
        message: error instanceof Error ? error.message : String(error),
        files: [],
      },
      { status: 500 },
    )
  }
}
