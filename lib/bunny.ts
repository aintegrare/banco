// Configuração do cliente Bunny.net Storage
const BUNNY_API_KEY = process.env.BUNNY_API_KEY || ""
const BUNNY_STORAGE_ZONE = process.env.BUNNY_STORAGE_ZONE || ""

// URLs corretas conforme configuração do Bunny.net
const BUNNY_STORAGE_URL = `https://storage.bunnycdn.com/${BUNNY_STORAGE_ZONE}`
const BUNNY_PULLZONE_URL = `https://integrare.b-cdn.net` // URL fixa da Pull Zone

// Adicionar logs para depuração
console.log(`Bunny Config: URL de Storage: ${BUNNY_STORAGE_URL}`)
console.log(`Bunny Config: URL da Pull Zone: ${BUNNY_PULLZONE_URL}`)

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

    const url = `${BUNNY_STORAGE_URL}/${filePath}`
    console.log(`Bunny Upload: Tentando fazer upload para: ${url}`)
    console.log(
      `Bunny Upload: Tamanho do conteúdo: ${typeof fileContent === "string" ? fileContent.length : fileContent.length} bytes`,
    )
    console.log(`Bunny Upload: Tipo de conteúdo: ${contentType}`)
    console.log(`Bunny Upload: Zona: ${BUNNY_STORAGE_ZONE}`)

    // Verificar se a URL é válida
    try {
      new URL(url)
    } catch (e) {
      throw new Error(`URL de upload inválida: ${url}`)
    }

    try {
      const response = await fetch(url, {
        method: "PUT",
        headers: {
          AccessKey: BUNNY_API_KEY,
          "Content-Type": contentType,
        },
        body: fileContent,
      })

      console.log(`Bunny Upload: Resposta recebida - Status: ${response.status}`)

      if (!response.ok) {
        let errorText = ""
        try {
          errorText = await response.text()
        } catch (e) {
          errorText = "Não foi possível ler o corpo da resposta"
        }
        throw new Error(`Erro ao fazer upload para Bunny.net: ${response.status} - ${errorText}`)
      }

      // Retorna a URL pública do arquivo através da Pull Zone
      const publicUrl = `${BUNNY_PULLZONE_URL}/${filePath}`
      console.log(`Bunny Upload: Upload concluído com sucesso. URL pública: ${publicUrl}`)
      return publicUrl
    } catch (fetchError) {
      console.error("Bunny Upload: Erro na chamada fetch:", fetchError)
      throw fetchError
    }
  } catch (error) {
    console.error("Bunny Upload: Erro geral:", error)
    throw error
  }
}

// Função para listar arquivos em um diretório - CORRIGIDA
export async function listBunnyFiles(directory = ""): Promise<any[]> {
  try {
    if (!BUNNY_API_KEY || !BUNNY_STORAGE_ZONE) {
      throw new Error("Configurações do Bunny.net incompletas. Verifique as variáveis de ambiente.")
    }

    // Garantir que o diretório termine com uma barra se não estiver vazio
    const formattedDirectory = directory ? (directory.endsWith("/") ? directory : `${directory}/`) : ""

    // Construir a URL correta para a API do Bunny.net
    const url = `${BUNNY_STORAGE_URL}/${formattedDirectory}`
    console.log(`Bunny List: Tentando listar arquivos de: ${url}`)
    console.log(`Bunny List: Zona: ${BUNNY_STORAGE_ZONE}`)
    console.log(`Bunny List: Diretório formatado: "${formattedDirectory}"`)

    // Verificar se a URL é válida
    try {
      new URL(url)
    } catch (e) {
      throw new Error(`URL de listagem inválida: ${url}`)
    }

    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          AccessKey: BUNNY_API_KEY,
          Accept: "application/json",
        },
      })

      console.log(`Bunny List: Resposta recebida - Status: ${response.status}`)

      if (!response.ok) {
        let errorText = ""
        try {
          errorText = await response.text()
        } catch (e) {
          errorText = "Não foi possível ler o corpo da resposta"
        }
        throw new Error(`Erro ao listar arquivos do Bunny.net: ${response.status} - ${errorText}`)
      }

      // Tentar obter o corpo da resposta como texto para depuração
      const responseText = await response.text()
      console.log(`Bunny List: Resposta bruta: ${responseText.substring(0, 200)}...`)

      // Tentar converter o texto em JSON
      let files = []
      try {
        files = JSON.parse(responseText)
        console.log(`Bunny List: Arquivos parseados: ${Array.isArray(files) ? files.length : "não é um array"} itens`)
      } catch (jsonError) {
        console.error("Bunny List: Erro ao fazer parse do JSON:", jsonError)
        console.log("Bunny List: Resposta completa:", responseText)
        throw new Error(`Erro ao processar resposta do Bunny.net: ${jsonError.message}`)
      }

      // Adicionar a URL pública para cada arquivo
      if (Array.isArray(files)) {
        return files.map((file) => ({
          ...file,
          PublicUrl: `${BUNNY_PULLZONE_URL}/${file.Path}`,
        }))
      }

      return Array.isArray(files) ? files : []
    } catch (fetchError) {
      console.error("Bunny List: Erro na chamada fetch:", fetchError)
      throw fetchError
    }
  } catch (error) {
    console.error("Bunny List: Erro geral:", error)
    throw error
  }
}

// Função para excluir um arquivo
export async function deleteBunnyFile(filePath: string): Promise<boolean> {
  try {
    if (!BUNNY_API_KEY || !BUNNY_STORAGE_ZONE) {
      throw new Error("Configurações do Bunny.net incompletas. Verifique as variáveis de ambiente.")
    }

    const url = `${BUNNY_STORAGE_URL}/${filePath}`
    console.log(`Bunny Delete: Tentando excluir arquivo: ${url}`)

    // Verificar se a URL é válida
    try {
      new URL(url)
    } catch (e) {
      throw new Error(`URL de exclusão inválida: ${url}`)
    }

    try {
      const response = await fetch(url, {
        method: "DELETE",
        headers: {
          AccessKey: BUNNY_API_KEY,
        },
      })

      console.log(`Bunny Delete: Resposta recebida - Status: ${response.status}`)

      if (!response.ok) {
        let errorText = ""
        try {
          errorText = await response.text()
        } catch (e) {
          errorText = "Não foi possível ler o corpo da resposta"
        }
        throw new Error(`Erro ao excluir arquivo do Bunny.net: ${response.status} - ${errorText}`)
      }

      console.log(`Bunny Delete: Arquivo excluído com sucesso: ${filePath}`)
      return true
    } catch (fetchError) {
      console.error("Bunny Delete: Erro na chamada fetch:", fetchError)
      throw fetchError
    }
  } catch (error) {
    console.error("Bunny Delete: Erro geral:", error)
    throw error
  }
}

// Função para baixar um arquivo
export async function downloadBunnyFile(filePath: string): Promise<Buffer> {
  try {
    if (!BUNNY_API_KEY || !BUNNY_STORAGE_ZONE) {
      throw new Error("Configurações do Bunny.net incompletas. Verifique as variáveis de ambiente.")
    }

    const url = `${BUNNY_STORAGE_URL}/${filePath}`
    console.log(`Bunny Download: Tentando baixar arquivo: ${url}`)

    // Verificar se a URL é válida
    try {
      new URL(url)
    } catch (e) {
      throw new Error(`URL de download inválida: ${url}`)
    }

    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          AccessKey: BUNNY_API_KEY,
        },
      })

      console.log(`Bunny Download: Resposta recebida - Status: ${response.status}`)

      if (!response.ok) {
        let errorText = ""
        try {
          errorText = await response.text()
        } catch (e) {
          errorText = "Não foi possível ler o corpo da resposta"
        }
        throw new Error(`Erro ao baixar arquivo do Bunny.net: ${response.status} - ${errorText}`)
      }

      const arrayBuffer = await response.arrayBuffer()
      console.log(`Bunny Download: Arquivo baixado com sucesso. Tamanho: ${arrayBuffer.byteLength} bytes`)
      return Buffer.from(arrayBuffer)
    } catch (fetchError) {
      console.error("Bunny Download: Erro na chamada fetch:", fetchError)
      throw fetchError
    }
  } catch (error) {
    console.error("Bunny Download: Erro geral:", error)
    throw error
  }
}

// Função para obter a URL pública de um arquivo
export function getBunnyPublicUrl(filePath: string): string {
  return `${BUNNY_PULLZONE_URL}/${filePath}`
}
