import { type NextRequest, NextResponse } from "next/server"
import { listBunnyFiles } from "@/lib/bunny"

export async function POST(request: NextRequest) {
  try {
    const { folderPath } = await request.json()

    if (!folderPath) {
      return NextResponse.json({ error: "Caminho da pasta é obrigatório" }, { status: 400 })
    }

    console.log(`Tentando recuperar pasta: ${folderPath}`)

    // Normalizar o caminho da pasta
    const normalizedPath = folderPath.replace(/\/+/g, "/").replace(/^\//, "")

    // Garantir que o caminho termine com uma barra
    const formattedPath = normalizedPath.endsWith("/") ? normalizedPath : `${normalizedPath}/`

    // Verificar se a pasta existe com diferentes variações de capitalização
    const parentPath = formattedPath.split("/").slice(0, -2).join("/")
    console.log(`Verificando pasta pai: ${parentPath}`)

    // Listar todos os arquivos e pastas no diretório pai
    const files = await listBunnyFiles(parentPath)

    // Procurar por pastas com nome similar (ignorando capitalização)
    const folderName = formattedPath.split("/").slice(-2)[0]
    console.log(`Procurando por pasta com nome similar a: ${folderName}`)

    const similarFolders = files.filter(
      (file) => file.IsDirectory && file.ObjectName.toLowerCase() === folderName.toLowerCase(),
    )

    if (similarFolders.length > 0) {
      console.log(`Encontradas ${similarFolders.length} pastas similares:`, similarFolders)

      // Retornar a primeira pasta encontrada
      return NextResponse.json({
        success: true,
        message: "Pasta encontrada com nome similar",
        folder: similarFolders[0],
        allSimilarFolders: similarFolders,
      })
    }

    // Se não encontrou pastas similares, tentar listar o conteúdo da pasta diretamente
    try {
      const directContent = await listBunnyFiles(formattedPath)
      if (directContent && directContent.length > 0) {
        console.log(`Pasta existe e contém ${directContent.length} itens`)
        return NextResponse.json({
          success: true,
          message: "Pasta encontrada diretamente",
          content: directContent,
        })
      }
    } catch (error) {
      console.log(`Erro ao tentar listar conteúdo diretamente: ${error}`)
    }

    // Se chegou aqui, não encontrou a pasta
    return NextResponse.json({
      success: false,
      message: "Pasta não encontrada",
      searchedPath: formattedPath,
      parentPath,
    })
  } catch (error) {
    console.error("Erro ao recuperar pasta:", error)
    return NextResponse.json(
      {
        error: "Erro ao recuperar pasta",
        message: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
