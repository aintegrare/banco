import { NextResponse } from "next/server"
import { listBunnyFiles } from "@/lib/bunny"

export async function GET() {
  try {
    console.log("API Folders: Buscando pastas disponíveis")

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

    // Listar arquivos na raiz para encontrar pastas
    const rootFiles = await listBunnyFiles("")

    // Filtrar apenas diretórios
    const folders = rootFiles.filter((file: any) => file.IsDirectory).map((folder: any) => folder.ObjectName)

    // Adicionar pastas padrão se não existirem
    const defaultFolders = ["documents", "images"]
    for (const defaultFolder of defaultFolders) {
      if (!folders.includes(defaultFolder)) {
        folders.push(defaultFolder)
      }
    }

    console.log(`API Folders: ${folders.length} pastas encontradas:`, folders)

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
