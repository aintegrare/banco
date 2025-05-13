import { NextResponse } from "next/server"
import { listBunnyFiles } from "@/lib/bunny"

export async function GET(request: Request) {
  try {
    console.log("API Folders: Buscando pastas disponíveis")

    // Obter o parâmetro path da URL
    const url = new URL(request.url)
    const path = url.searchParams.get("path") || ""

    console.log(`API Folders: Buscando pastas no caminho: "${path}"`)

    // Verificar se as variáveis de ambiente estão configuradas
    if (!process.env.BUNNY_API_KEY || !process.env.BUNNY_STORAGE_ZONE) {
      console.error("API Folders: Configurações do Bunny.net incompletas")
      return NextResponse.json(
        {
          error: "Configurações do Bunny.net incompletas. Verifique as variáveis de ambiente.",
        },
        { status: 500 },
      )
    }

    // Listar arquivos no caminho especificado para encontrar pastas
    const files = await listBunnyFiles(path)

    // Filtrar apenas diretórios
    const folders = files
      .filter((file: any) => file.IsDirectory)
      .map((folder: any) => ({
        name: folder.ObjectName,
        path: folder.Path,
        fullPath: folder.Path,
      }))

    // Se estamos na raiz, adicionar pastas padrão se não existirem
    if (!path) {
      const defaultFolders = ["documents", "images"]
      for (const defaultFolder of defaultFolders) {
        if (!folders.some((f) => f.name === defaultFolder)) {
          folders.push({
            name: defaultFolder,
            path: defaultFolder,
            fullPath: `${defaultFolder}/`,
          })
        }
      }
    }

    console.log(
      `API Folders: ${folders.length} pastas encontradas:`,
      folders.map((f) => f.path),
    )

    return NextResponse.json({ folders })
  } catch (error) {
    console.error("API Folders: Erro ao listar pastas:", error)
    return NextResponse.json(
      {
        error: "Erro ao listar pastas",
        message: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
