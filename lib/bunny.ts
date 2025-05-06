// Configuração do cliente Bunny.net Storage
const BUNNY_API_KEY = process.env.BUNNY_API_KEY || ""
const BUNNY_STORAGE_ZONE = process.env.BUNNY_STORAGE_ZONE || ""
const BUNNY_STORAGE_REGION = process.env.BUNNY_STORAGE_REGION || ""

// URLs corretas conforme configuração do Bunny.net
const BUNNY_STORAGE_URL = `https://storage.bunnycdn.com/${BUNNY_STORAGE_ZONE}`
// URL fixa da Pull Zone - sem incluir o nome da zona de armazenamento
const BUNNY_PULLZONE_URL = `https://integrare.b-cdn.net`

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

    // Normalizar o caminho do arquivo
    const normalizedPath = filePath.replace(/\/+/g, "/").replace(/^\//, "")

    const url = `${BUNNY_STORAGE_URL}/${normalizedPath}`
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
      // Não incluir o nome da zona de armazenamento na URL pública
      const publicUrl = `${BUNNY_PULLZONE_URL}/${normalizedPath}`
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

// Função para listar arquivos em um diretório - CORRIGIDA E MELHORADA
export async function listBunnyFiles(directory = ""): Promise<any[]> {
  try {
    if (!BUNNY_API_KEY || !BUNNY_STORAGE_ZONE) {
      throw new Error("Configurações do Bunny.net incompletas. Verifique as variáveis de ambiente.")
    }

    // Normalizar o diretório
    const normalizedDirectory = directory.replace(/\/+/g, "/").replace(/^\//, "")

    // Garantir que o diretório termine com uma barra se não estiver vazio
    const formattedDirectory = normalizedDirectory
      ? normalizedDirectory.endsWith("/")
        ? normalizedDirectory
        : `${normalizedDirectory}/`
      : ""

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
        return files.map((file) => {
          if (file.IsDirectory) {
            // Para diretórios, apenas adicionar o nome do diretório ao caminho
            const fullPath = `${formattedDirectory}${file.ObjectName}/`
            return {
              ...file,
              Path: fullPath,
              PublicUrl: `${BUNNY_PULLZONE_URL}/${fullPath}`,
            }
          } else {
            // Para arquivos, garantir que o nome do arquivo esteja incluído no caminho
            const fullPath = `${formattedDirectory}${file.ObjectName}`

            // Log para depuração
            console.log(`Bunny List: Arquivo: ${file.ObjectName}, Caminho completo: ${fullPath}`)

            return {
              ...file,
              Path: fullPath,
              PublicUrl: `${BUNNY_PULLZONE_URL}/${fullPath}`,
            }
          }
        })
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

    // Normalizar o caminho do arquivo (remover barras duplas, etc.)
    const normalizedPath = filePath.replace(/\/+/g, "/").replace(/^\//, "")

    console.log(`Bunny Delete: Tentando excluir arquivo: ${normalizedPath}`)

    const url = `${BUNNY_STORAGE_URL}/${normalizedPath}`
    console.log(`Bunny Delete: URL completa: ${url}`)

    // Verificar se a URL é válida
    try {
      new URL(url)
    } catch (e) {
      throw new Error(`URL de exclusão inválida: ${url}`)
    }

    // Verificar se o arquivo existe antes de tentar excluí-lo
    try {
      const checkResponse = await fetch(url, {
        method: "GET",
        headers: {
          AccessKey: BUNNY_API_KEY,
        },
      })

      if (checkResponse.status === 404) {
        console.log(`Bunny Delete: Arquivo não encontrado: ${normalizedPath}`)
        return true // Retornar true se o arquivo já não existe
      }
    } catch (checkError) {
      console.warn(`Bunny Delete: Erro ao verificar existência do arquivo: ${checkError}`)
      // Continuar com a exclusão mesmo se a verificação falhar
    }

    try {
      const response = await fetch(url, {
        method: "DELETE",
        headers: {
          AccessKey: BUNNY_API_KEY,
        },
      })

      console.log(`Bunny Delete: Resposta recebida - Status: ${response.status}`)

      // Considerar 404 como sucesso, já que o objetivo é que o arquivo não exista
      if (response.status === 404) {
        console.log(`Bunny Delete: Arquivo já não existe: ${normalizedPath}`)
        return true
      }

      if (!response.ok) {
        let errorText = ""
        try {
          errorText = await response.text()
        } catch (e) {
          errorText = "Não foi possível ler o corpo da resposta"
        }
        throw new Error(`Erro ao excluir arquivo do Bunny.net: ${response.status} - ${errorText}`)
      }

      console.log(`Bunny Delete: Arquivo excluído com sucesso: ${normalizedPath}`)
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

    // Normalizar o caminho do arquivo
    const normalizedPath = filePath.replace(/\/+/g, "/").replace(/^\//, "")

    const url = `${BUNNY_STORAGE_URL}/${normalizedPath}`
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

// Modificar a função renameBunnyFile para garantir que o caminho seja atualizado corretamente

// Substituir a função renameBunnyFile atual por esta versão melhorada:
export async function renameBunnyFile(oldPath: string, newName: string): Promise<string> {
  try {
    if (!BUNNY_API_KEY || !BUNNY_STORAGE_ZONE) {
      throw new Error("Configurações do Bunny.net incompletas. Verifique as variáveis de ambiente.")
    }

    // Normalizar o caminho do arquivo
    const normalizedPath = oldPath.replace(/\/+/g, "/").replace(/^\//, "")

    // Extrair o diretório do caminho antigo
    const lastSlashIndex = normalizedPath.lastIndexOf("/")
    const directory = lastSlashIndex >= 0 ? normalizedPath.substring(0, lastSlashIndex + 1) : ""

    // Construir o novo caminho completo
    const newPath = directory + newName

    console.log(`Bunny Rename: Renomeando de ${normalizedPath} para ${newPath}`)

    // Primeiro, baixar o arquivo original
    const fileContent = await downloadBunnyFile(normalizedPath)

    // Determinar o tipo de conteúdo com base na extensão do arquivo
    const extension = newName.split(".").pop()?.toLowerCase() || ""
    let contentType = "application/octet-stream"

    // Mapear extensões comuns para tipos MIME
    const mimeTypes: Record<string, string> = {
      pdf: "application/pdf",
      jpg: "image/jpeg",
      jpeg: "image/jpeg",
      png: "image/png",
      gif: "image/gif",
      webp: "image/webp",
      svg: "image/svg+xml",
      txt: "text/plain",
      html: "text/html",
      css: "text/css",
      js: "application/javascript",
      json: "application/json",
      xml: "application/xml",
      zip: "application/zip",
      doc: "application/msword",
      docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      xls: "application/vnd.ms-excel",
      xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      ppt: "application/vnd.ms-powerpoint",
      pptx: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    }

    if (extension && extension in mimeTypes) {
      contentType = mimeTypes[extension]
    }

    // Fazer upload do arquivo com o novo nome
    const newUrl = await uploadFileToBunny(newPath, fileContent, contentType)
    console.log(`Bunny Rename: Novo arquivo criado em: ${newPath}, URL: ${newUrl}`)

    // Excluir o arquivo original
    const deleteResult = await deleteBunnyFile(normalizedPath)
    console.log(`Bunny Rename: Arquivo original excluído: ${deleteResult}`)

    // Retornar a URL pública do novo arquivo
    return newUrl
  } catch (error) {
    console.error("Bunny Rename: Erro geral:", error)
    throw error
  }
}

// Função para obter a URL pública de um arquivo - CORRIGIDA
export function getBunnyPublicUrl(filePath: string): string {
  if (!filePath) {
    console.warn("Bunny URL: Caminho de arquivo vazio ou nulo")
    return `${BUNNY_PULLZONE_URL}/`
  }

  // Normalizar o caminho do arquivo
  const normalizedPath = filePath.replace(/\/+/g, "/").replace(/^\//, "")

  // Remover qualquer prefixo "zona-de-guardar/" se existir
  const cleanPath = normalizedPath.replace(/^zona-de-guardar\//, "")

  // Log para depuração
  console.log(`Bunny URL: Gerando URL pública para caminho: ${filePath} -> ${cleanPath}`)

  // Verificar se o caminho termina com uma barra (diretório) e não tem um nome de arquivo
  if (cleanPath.endsWith("/") || cleanPath === "") {
    console.warn(`Bunny URL: Caminho parece ser um diretório ou está vazio: ${cleanPath}`)
  }

  // Retornar a URL pública correta
  const publicUrl = `${BUNNY_PULLZONE_URL}/${cleanPath}`
  console.log(`Bunny URL: URL pública gerada: ${publicUrl}`)
  return publicUrl
}

// Função para criar um cliente Bunny.net
export function getBunnyClient() {
  if (!BUNNY_API_KEY || !BUNNY_STORAGE_ZONE) {
    throw new Error("Configurações do Bunny.net incompletas. Verifique as variáveis de ambiente.")
  }

  const bunnyClient = {
    get: async (path: string) => {
      const url = `${BUNNY_STORAGE_URL}${path}`
      console.log(`Bunny Client GET: ${url}`)
      try {
        const response = await fetch(url, {
          method: "GET",
          headers: {
            AccessKey: BUNNY_API_KEY,
            Accept: "application/json",
          },
        })
        return response
      } catch (e: any) {
        console.error(`Bunny Client GET error: ${e.message}`)
        throw e
      }
    },
    put: async (path: string, data: any) => {
      const url = `${BUNNY_STORAGE_URL}${path}`
      console.log(`Bunny Client PUT: ${url}`)
      try {
        const response = await fetch(url, {
          method: "PUT",
          headers: {
            AccessKey: BUNNY_API_KEY,
            "Content-Type": "application/json",
          },
          body: data,
        })
        return response
      } catch (e: any) {
        console.error(`Bunny Client PUT error: ${e.message}`)
        throw e
      }
    },
    delete: async (path: string) => {
      const url = `${BUNNY_STORAGE_URL}${path}`
      console.log(`Bunny Client DELETE: ${url}`)
      try {
        const response = await fetch(url, {
          method: "DELETE",
          headers: {
            AccessKey: BUNNY_API_KEY,
          },
        })
        return response
      } catch (e: any) {
        console.error(`Bunny Client DELETE error: ${e.message}`)
        throw e
      }
    },
  }

  return bunnyClient
}

// Função para obter os headers de autenticação para o Bunny CDN
export function getBunnyHeaders(): Record<string, string> {
  const apiKey = process.env.BUNNY_API_KEY

  if (!apiKey) {
    console.warn("BUNNY_API_KEY não encontrada nas variáveis de ambiente")
    return {}
  }

  return {
    AccessKey: apiKey,
    // Adicionar outros headers necessários para autenticação
    Accept: "application/json, application/pdf, */*",
    "User-Agent": "Integrare-PDF-Processor/1.0",
  }
}

// Função para verificar se as credenciais do Bunny estão configuradas
export function checkBunnyCredentials(): { configured: boolean; missing: string[] } {
  const missing: string[] = []

  if (!process.env.BUNNY_API_KEY) missing.push("BUNNY_API_KEY")
  if (!process.env.BUNNY_STORAGE_ZONE) missing.push("BUNNY_STORAGE_ZONE")

  return {
    configured: missing.length === 0,
    missing,
  }
}

// Função para corrigir URLs com prefixo incorreto
export function fixBunnyUrl(url: string): string {
  if (!url) return url

  // Verificar se a URL contém o prefixo incorreto "zona-de-guardar"
  if (url.includes("zona-de-guardar")) {
    // Remover o prefixo "zona-de-guardar/" da URL
    return url.replace(/\/zona-de-guardar\//, "/")
  }

  return url
}

// Nova função para extrair o nome do arquivo de um caminho
export function getFileNameFromPath(path: string): string {
  if (!path) return ""

  // Remover qualquer parâmetro de consulta
  const pathWithoutQuery = path.split("?")[0]

  // Obter o último segmento do caminho após a última barra
  const segments = pathWithoutQuery.split("/")
  return segments[segments.length - 1]
}

// Nova função para verificar se uma URL é válida e completa
export function isValidFileUrl(url: string): boolean {
  if (!url) return false

  try {
    const parsedUrl = new URL(url)
    // Verificar se a URL tem um caminho além do domínio
    if (parsedUrl.pathname === "/" || parsedUrl.pathname === "") {
      return false
    }

    // Verificar se o caminho termina com uma extensão de arquivo
    const fileName = getFileNameFromPath(parsedUrl.pathname)
    return fileName !== "" && fileName.includes(".")
  } catch (e) {
    return false
  }
}
