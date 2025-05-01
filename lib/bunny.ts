// Configuração do cliente Bunny.net Storage
const BUNNY_API_KEY = process.env.BUNNY_API_KEY || ""
const BUNNY_STORAGE_ZONE = process.env.BUNNY_STORAGE_ZONE || ""
const BUNNY_STORAGE_REGION = process.env.BUNNY_STORAGE_REGION || "de" // Frankfurt
const BUNNY_STORAGE_URL = `https://${BUNNY_STORAGE_REGION}.storage.bunnycdn.com/${BUNNY_STORAGE_ZONE}/`

// Função para fazer upload de um arquivo para o Bunny.net Storage
export async function uploadFileToBunny(
  filePath: string,
  fileContent: Buffer | string,
  contentType = "application/octet-stream",
): Promise<string> {
  try {
    if (!BUNNY_API_KEY || !BUNNY_STORAGE_ZONE) {
      throw new Error("Configurações do Bunny.net incompletas. Verifique as variáveis de ambiente.")
    }

    const url = `${BUNNY_STORAGE_URL}${filePath}`
    console.log(`Tentando fazer upload para: ${url}`)

    const response = await fetch(url, {
      method: "PUT",
      headers: {
        AccessKey: BUNNY_API_KEY,
        "Content-Type": contentType,
      },
      body: fileContent,
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`Erro ao fazer upload para Bunny.net: ${response.status} - ${errorText}`)
    }

    // Retorna a URL pública do arquivo
    return `https://${BUNNY_STORAGE_ZONE}.b-cdn.net/${filePath}`
  } catch (error) {
    console.error("Erro ao fazer upload para Bunny.net:", error)
    throw error
  }
}

// Função para listar arquivos em um diretório
export async function listBunnyFiles(directory = ""): Promise<any[]> {
  try {
    if (!BUNNY_API_KEY || !BUNNY_STORAGE_ZONE) {
      throw new Error("Configurações do Bunny.net incompletas. Verifique as variáveis de ambiente.")
    }

    // Garantir que o diretório termine com uma barra se não estiver vazio
    const formattedDirectory = directory ? (directory.endsWith("/") ? directory : `${directory}/`) : ""

    const url = `${BUNNY_STORAGE_URL}${formattedDirectory}`
    console.log(`Tentando listar arquivos de: ${url}`)

    const response = await fetch(url, {
      method: "GET",
      headers: {
        AccessKey: BUNNY_API_KEY,
      },
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`Erro ao listar arquivos do Bunny.net: ${response.status} - ${errorText}`)
    }

    const files = await response.json()
    return Array.isArray(files) ? files : []
  } catch (error) {
    console.error("Erro ao listar arquivos do Bunny.net:", error)
    throw error
  }
}

// Função para excluir um arquivo
export async function deleteBunnyFile(filePath: string): Promise<boolean> {
  try {
    if (!BUNNY_API_KEY || !BUNNY_STORAGE_ZONE) {
      throw new Error("Configurações do Bunny.net incompletas. Verifique as variáveis de ambiente.")
    }

    const url = `${BUNNY_STORAGE_URL}${filePath}`
    console.log(`Tentando excluir arquivo: ${url}`)

    const response = await fetch(url, {
      method: "DELETE",
      headers: {
        AccessKey: BUNNY_API_KEY,
      },
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`Erro ao excluir arquivo do Bunny.net: ${response.status} - ${errorText}`)
    }

    return true
  } catch (error) {
    console.error("Erro ao excluir arquivo do Bunny.net:", error)
    throw error
  }
}

// Função para baixar um arquivo
export async function downloadBunnyFile(filePath: string): Promise<Buffer> {
  try {
    if (!BUNNY_API_KEY || !BUNNY_STORAGE_ZONE) {
      throw new Error("Configurações do Bunny.net incompletas. Verifique as variáveis de ambiente.")
    }

    const url = `${BUNNY_STORAGE_URL}${filePath}`
    console.log(`Tentando baixar arquivo: ${url}`)

    const response = await fetch(url, {
      method: "GET",
      headers: {
        AccessKey: BUNNY_API_KEY,
      },
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`Erro ao baixar arquivo do Bunny.net: ${response.status} - ${errorText}`)
    }

    const arrayBuffer = await response.arrayBuffer()
    return Buffer.from(arrayBuffer)
  } catch (error) {
    console.error("Erro ao baixar arquivo do Bunny.net:", error)
    throw error
  }
}
