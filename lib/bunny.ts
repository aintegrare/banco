// Configuração do cliente Bunny.net Storage
const BUNNY_API_KEY = process.env.BUNNY_API_KEY || ""
const BUNNY_STORAGE_ZONE = process.env.BUNNY_STORAGE_ZONE || ""
const BUNNY_STORAGE_REGION = process.env.BUNNY_STORAGE_REGION || ""
const BUNNY_PULLZONE_URL = process.env.BUNNY_PULLZONE_URL || `https://integrare.b-cdn.net`

// Adicionar estas constantes no início do arquivo, após as constantes existentes
const DEFAULT_CACHE_TIME = 60 * 60 * 24 * 7 // 7 dias em segundos
const DEFAULT_CACHE_CONTROL = `public, max-age=${DEFAULT_CACHE_TIME}`

// Adicionar este objeto de configuração de cache por tipo de arquivo
const CACHE_CONFIG = {
  // Imagens - cache longo
  image: {
    maxAge: 60 * 60 * 24 * 30, // 30 dias
    cacheControl: "public, max-age=2592000, stale-while-revalidate=86400",
  },
  // Documentos - cache médio
  document: {
    maxAge: 60 * 60 * 24 * 7, // 7 dias
    cacheControl: "public, max-age=604800, stale-while-revalidate=86400",
  },
  // Arquivos de design - cache curto
  design: {
    maxAge: 60 * 60 * 24, // 1 dia
    cacheControl: "public, max-age=86400, must-revalidate",
  },
  // Padrão para outros tipos
  default: {
    maxAge: 60 * 60 * 24 * 3, // 3 dias
    cacheControl: "public, max-age=259200, stale-while-revalidate=86400",
  },
}

// URLs corretas conforme configuração do Bunny.net
const BUNNY_STORAGE_URL = `https://storage.bunnycdn.com/${BUNNY_STORAGE_ZONE}`

// Adicionar logs para depuração
console.log(`Bunny Config: URL de Storage: ${BUNNY_STORAGE_URL}`)
console.log(`Bunny Config: URL da Pull Zone: ${BUNNY_PULLZONE_URL}`)

// Modificar a função uploadFileToBunny para criar pastas automaticamente se não existirem
// Adicionar esta lógica antes do upload do arquivo

// Verificar se a pasta existe e criar se necessário
export async function ensureFolderExists(folderPath: string): Promise<boolean> {
  try {
    // Dividir o caminho em partes
    const parts = folderPath.split("/").filter(Boolean)
    let currentPath = ""

    // Criar cada nível de pasta se não existir
    for (const part of parts) {
      currentPath = currentPath ? `${currentPath}/${part}` : part

      // Verificar se a pasta existe
      const checkResponse = await fetch(
        `${process.env.BUNNY_STORAGE_REGION}/${process.env.BUNNY_STORAGE_ZONE}/${currentPath}/`,
        {
          method: "GET",
          headers: {
            AccessKey: process.env.BUNNY_API_KEY || "",
          },
        },
      )

      // Se a pasta não existir (404), criar
      if (checkResponse.status === 404) {
        const createResponse = await fetch(
          `${process.env.BUNNY_STORAGE_REGION}/${process.env.BUNNY_STORAGE_ZONE}/${currentPath}/`,
          {
            method: "PUT",
            headers: {
              AccessKey: process.env.BUNNY_API_KEY || "",
            },
          },
        )

        if (!createResponse.ok) {
          console.error(`Erro ao criar pasta ${currentPath}:`, await createResponse.text())
          return false
        }
      } else if (!checkResponse.ok) {
        console.error(`Erro ao verificar pasta ${currentPath}:`, await checkResponse.text())
        return false
      }
    }

    return true
  } catch (error) {
    console.error("Erro ao garantir existência da pasta:", error)
    return false
  }
}

// Função para determinar o tipo de conteúdo com base na extensão do arquivo
function getContentTypeFromExtension(fileName: string): string {
  const extension = fileName.split(".").pop()?.toLowerCase() || ""

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
    psd: "application/vnd.adobe.photoshop",
    ai: "application/illustrator",
    indd: "application/x-indesign",
    idml: "application/x-indesign",
  }

  return extension && extension in mimeTypes ? mimeTypes[extension] : "application/octet-stream"
}

// Função para determinar a categoria de cache com base no tipo de arquivo
function getCacheCategory(filePath: string): string {
  const extension = filePath.split(".").pop()?.toLowerCase() || ""

  // Imagens
  if (["jpg", "jpeg", "png", "gif", "webp", "svg"].includes(extension)) {
    return "image"
  }

  // Documentos
  if (["pdf", "doc", "docx", "txt", "xls", "xlsx", "ppt", "pptx"].includes(extension)) {
    return "document"
  }

  // Arquivos de design
  if (["psd", "psb", "ai", "indd", "idml"].includes(extension)) {
    return "design"
  }

  return "default"
}

// Função para obter os cabeçalhos de cache apropriados para um arquivo
function getCacheHeaders(filePath: string): Record<string, string> {
  const category = getCacheCategory(filePath)
  const config = CACHE_CONFIG[category as keyof typeof CACHE_CONFIG] || CACHE_CONFIG.default

  return {
    "Cache-Control": config.cacheControl,
  }
}

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
    const normalizedPath = filePath.replace(/\/+/g, "/").replace(/\/^\//, "")

    // Modificar a função uploadFileToBunny para usar ensureFolderExists
    // Antes da linha com o fetch para upload, adicionar:

    // Garantir que a pasta existe
    const folderOnly = filePath.substring(0, filePath.lastIndexOf("/"))
    if (folderOnly) {
      await ensureFolderExists(folderOnly)
    }

    // Determinar o tipo de conteúdo se não foi especificado
    if (contentType === "application/octet-stream") {
      contentType = getContentTypeFromExtension(normalizedPath)
    }

    // Obter cabeçalhos de cache apropriados
    const cacheHeaders = getCacheHeaders(normalizedPath)

    const url = `${BUNNY_STORAGE_URL}/${normalizedPath}`
    console.log(`Bunny Upload: Tentando fazer upload para: ${url}`)
    console.log(
      `Bunny Upload: Tamanho do conteúdo: ${typeof fileContent === "string" ? fileContent.length : fileContent.length} bytes`,
    )
    console.log(`Bunny Upload: Tipo de conteúdo: ${contentType}`)
    console.log(`Bunny Upload: Zona: ${BUNNY_STORAGE_ZONE}`)
    console.log(`Bunny Upload: Cache-Control: ${cacheHeaders["Cache-Control"]}`)

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
          ...cacheHeaders,
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

      // Verificar se o arquivo foi realmente enviado
      await verifyFileExists(normalizedPath)

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

// Adicionar esta nova função para verificar se um arquivo existe após o upload
async function verifyFileExists(filePath: string, retries = 3, delay = 1000): Promise<boolean> {
  console.log(`Bunny Verify: Verificando existência do arquivo: ${filePath}`)

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const url = `${BUNNY_STORAGE_URL}/${filePath}`
      const response = await fetch(url, {
        method: "HEAD",
        headers: {
          AccessKey: BUNNY_API_KEY,
        },
      })

      if (response.ok) {
        console.log(`Bunny Verify: Arquivo verificado com sucesso após ${attempt} tentativa(s)`)
        return true
      }

      console.log(`Bunny Verify: Arquivo não encontrado na tentativa ${attempt}/${retries}`)

      if (attempt < retries) {
        console.log(`Bunny Verify: Aguardando ${delay}ms antes da próxima tentativa`)
        await new Promise((resolve) => setTimeout(resolve, delay))
        // Aumentar o tempo de espera para a próxima tentativa
        delay *= 2
      }
    } catch (error) {
      console.error(`Bunny Verify: Erro ao verificar arquivo na tentativa ${attempt}/${retries}:`, error)

      if (attempt < retries) {
        await new Promise((resolve) => setTimeout(resolve, delay))
        delay *= 2
      }
    }
  }

  console.warn(`Bunny Verify: Não foi possível verificar o arquivo após ${retries} tentativas`)
  return false
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

// Modificar a função deleteBunnyFile para incluir verificação após a exclusão
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

      // Verificar se o arquivo foi realmente excluído
      const fileStillExists = await verifyFileDeleted(normalizedPath)
      if (fileStillExists) {
        console.warn(`Bunny Delete: Arquivo ainda existe após tentativa de exclusão: ${normalizedPath}`)
        return false
      }

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

// Adicionar esta nova função para verificar se um arquivo foi excluído
async function verifyFileDeleted(filePath: string, retries = 3, delay = 1000): Promise<boolean> {
  console.log(`Bunny Verify Delete: Verificando exclusão do arquivo: ${filePath}`)

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const url = `${BUNNY_STORAGE_URL}/${filePath}`
      const response = await fetch(url, {
        method: "HEAD",
        headers: {
          AccessKey: BUNNY_API_KEY,
        },
      })

      if (response.status === 404) {
        console.log(`Bunny Verify Delete: Arquivo excluído com sucesso após ${attempt} tentativa(s)`)
        return false // Arquivo não existe, exclusão bem-sucedida
      }

      console.log(`Bunny Verify Delete: Arquivo ainda existe na tentativa ${attempt}/${retries}`)

      if (attempt < retries) {
        console.log(`Bunny Verify Delete: Aguardando ${delay}ms antes da próxima tentativa`)
        await new Promise((resolve) => setTimeout(resolve, delay))
        // Aumentar o tempo de espera para a próxima tentativa
        delay *= 2
      }
    } catch (error) {
      console.error(`Bunny Verify Delete: Erro ao verificar exclusão na tentativa ${attempt}/${retries}:`, error)

      if (attempt < retries) {
        await new Promise((resolve) => setTimeout(resolve, delay))
        delay *= 2
      }
    }
  }

  console.warn(`Bunny Verify Delete: Arquivo ainda pode existir após ${retries} tentativas de verificação`)
  return true // Assumir que o arquivo ainda existe após todas as tentativas
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

// NOVA IMPLEMENTAÇÃO SEGURA para renomear pastas
export async function renameBunnyFolder(oldPath: string, newName: string): Promise<string> {
  try {
    if (!BUNNY_API_KEY || !BUNNY_STORAGE_ZONE) {
      throw new Error("Configurações do Bunny.net incompletas. Verifique as variáveis de ambiente.")
    }

    // Normalizar o caminho da pasta
    const normalizedPath = oldPath.replace(/\/+/g, "/").replace(/^\//, "")

    // Garantir que o caminho termine com uma barra
    const formattedPath = normalizedPath.endsWith("/") ? normalizedPath : `${normalizedPath}/`

    // Extrair o diretório pai
    const pathParts = formattedPath.split("/").filter((part) => part.length > 0)
    const oldFolderName = pathParts.pop() || ""
    const parentPath = pathParts.length > 0 ? pathParts.join("/") + "/" : ""

    // Construir o novo caminho
    const newPath = `${parentPath}${newName}/`

    console.log(`Bunny Rename Folder: Renomeando pasta de "${formattedPath}" para "${newPath}"`)
    console.log(`Bunny Rename Folder: Diretório pai: "${parentPath}"`)

    // 1. Verificar se a pasta de origem existe e listar seu conteúdo
    console.log(`Bunny Rename Folder: Verificando pasta de origem: ${formattedPath}`)
    let sourceFiles
    try {
      sourceFiles = await listBunnyFiles(formattedPath)
      console.log(`Bunny Rename Folder: Pasta de origem contém ${sourceFiles.length} itens`)
    } catch (error) {
      console.error(`Bunny Rename Folder: Erro ao listar pasta de origem:`, error)
      throw new Error(`Não foi possível acessar a pasta de origem: ${error.message}`)
    }

    // 2. Criar a pasta de destino
    console.log(`Bunny Rename Folder: Criando pasta de destino: ${newPath}`)
    try {
      await createBunnyDirectory(newPath)
      console.log(`Bunny Rename Folder: Pasta de destino criada com sucesso`)
    } catch (error) {
      console.error(`Bunny Rename Folder: Erro ao criar pasta de destino:`, error)
      throw new Error(`Não foi possível criar a pasta de destino: ${error.message}`)
    }

    // 3. Copiar todos os arquivos e subpastas para a nova pasta
    console.log(`Bunny Rename Folder: Copiando ${sourceFiles.length} itens para a nova pasta`)

    const copyPromises = sourceFiles.map(async (file) => {
      const relativePath = file.Path.substring(formattedPath.length)
      const newItemPath = `${newPath}${relativePath}`

      if (file.IsDirectory) {
        // Para pastas, criar a pasta no novo local
        console.log(`Bunny Rename Folder: Criando subpasta ${newItemPath}`)
        return createBunnyDirectory(newItemPath)
      } else {
        // Para arquivos, baixar e fazer upload no novo local
        console.log(`Bunny Rename Folder: Copiando arquivo ${file.Path} para ${newItemPath}`)
        try {
          const fileContent = await downloadBunnyFile(file.Path)
          return uploadFileToBunny(newItemPath, fileContent)
        } catch (error) {
          console.error(`Bunny Rename Folder: Erro ao copiar arquivo ${file.Path}:`, error)
          throw error
        }
      }
    })

    // Aguardar todas as operações de cópia
    await Promise.all(copyPromises)
    console.log(`Bunny Rename Folder: Todos os itens copiados com sucesso`)

    // 4. Verificar se a pasta de destino contém todos os arquivos
    console.log(`Bunny Rename Folder: Verificando pasta de destino após cópia`)
    let destinationFiles
    try {
      destinationFiles = await listBunnyFiles(newPath)
      console.log(`Bunny Rename Folder: Pasta de destino contém ${destinationFiles.length} itens`)

      // Verificar se todos os arquivos foram copiados
      if (destinationFiles.length < sourceFiles.length) {
        console.warn(`Bunny Rename Folder: AVISO - A pasta de destino tem menos itens que a origem!`)
        console.warn(`Bunny Rename Folder: Origem: ${sourceFiles.length}, Destino: ${destinationFiles.length}`)
      }
    } catch (error) {
      console.error(`Bunny Rename Folder: Erro ao verificar pasta de destino:`, error)
      throw new Error(`Não foi possível verificar a pasta de destino após a cópia: ${error.message}`)
    }

    // 5. Excluir a pasta de origem SOMENTE se a cópia foi bem-sucedida
    if (destinationFiles && destinationFiles.length > 0) {
      console.log(`Bunny Rename Folder: Excluindo pasta de origem: ${formattedPath}`)

      // Excluir arquivos da pasta de origem
      for (const file of sourceFiles) {
        if (!file.IsDirectory) {
          try {
            await deleteBunnyFile(file.Path)
            console.log(`Bunny Rename Folder: Arquivo excluído: ${file.Path}`)
          } catch (error) {
            console.error(`Bunny Rename Folder: Erro ao excluir arquivo ${file.Path}:`, error)
            // Continuar mesmo se houver erro na exclusão
          }
        }
      }

      // Tentar excluir a pasta vazia
      try {
        await deleteBunnyFile(formattedPath)
        console.log(`Bunny Rename Folder: Pasta de origem excluída com sucesso`)
      } catch (error) {
        console.error(`Bunny Rename Folder: Erro ao excluir pasta de origem:`, error)
        // Não lançar erro aqui, pois a operação principal (cópia) já foi concluída
      }
    } else {
      console.warn(
        `Bunny Rename Folder: AVISO - Pasta de destino vazia ou não verificada. A pasta de origem NÃO será excluída.`,
      )
    }

    // Retornar a URL pública da nova pasta
    const publicUrl = `${BUNNY_PULLZONE_URL}/${newPath}`
    console.log(`Bunny Rename Folder: Renomeação concluída. Nova URL: ${publicUrl}`)
    return publicUrl
  } catch (error) {
    console.error("Bunny Rename Folder: Erro geral:", error)
    throw error
  }
}

// Modificar a função renameBunnyFile para garantir que o caminho seja atualizado corretamente
export async function renameBunnyFile(oldPath: string, newName: string): Promise<string> {
  try {
    if (!BUNNY_API_KEY || !BUNNY_STORAGE_ZONE) {
      throw new Error("Configurações do Bunny.net incompletas. Verifique as variáveis de ambiente.")
    }

    // Normalizar o caminho do arquivo
    const normalizedPath = oldPath.replace(/\/+/g, "/").replace(/^\//, "")

    // Verificar se é uma pasta ou um arquivo
    const isDirectory = normalizedPath.endsWith("/") || normalizedPath.endsWith("\\")

    // Se for uma pasta, usar a função específica para pastas
    if (isDirectory) {
      console.log(`Bunny Rename: Detectada pasta, usando função específica para pastas`)
      return renameBunnyFolder(normalizedPath, newName)
    }

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

    // Verificar se o novo arquivo foi criado com sucesso antes de excluir o original
    try {
      const checkResponse = await fetch(`${BUNNY_STORAGE_URL}/${newPath}`, {
        method: "HEAD",
        headers: {
          AccessKey: BUNNY_API_KEY,
        },
      })

      if (!checkResponse.ok) {
        throw new Error(`Novo arquivo não foi criado corretamente: ${checkResponse.status}`)
      }

      console.log(`Bunny Rename: Verificação do novo arquivo bem-sucedida`)
    } catch (checkError) {
      console.error(`Bunny Rename: Erro ao verificar novo arquivo:`, checkError)
      throw new Error(`Não foi possível verificar se o novo arquivo foi criado: ${checkError.message}`)
    }

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
// Modificar a função getBunnyPublicUrl para garantir que os caminhos estejam corretos
export function getBunnyPublicUrl(filePath: string): string {
  if (!filePath) {
    console.warn("Bunny URL: Caminho de arquivo vazio ou nulo")
    return `${BUNNY_PULLZONE_URL}/`
  }

  // Normalizar o caminho do arquivo
  const normalizedPath = filePath.replace(/\/+/g, "/").replace(/^\//, "")

  // Retornar a URL pública correta
  return `${BUNNY_PULLZONE_URL}/${normalizedPath}`
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

// Função para garantir que as URLs de documentos incluam o caminho correto para clientes
export function ensureCorrectDocumentPath(url: string): string {
  if (!url) return url

  // Se a URL já estiver completa com http/https, extrair o caminho
  let path = url
  if (url.startsWith("http")) {
    try {
      const urlObj = new URL(url)
      path = urlObj.pathname.replace(/^\//, "")
    } catch (e) {
      console.error("URL inválida:", url)
      return url
    }
  }

  // Verificar se o caminho já contém "documents/clientes"
  if (!path.includes("documents/clientes") && path.includes("documents")) {
    // Se contém "documents" mas não "documents/clientes", inserir "clientes" após "documents"
    const pathParts = path.split("documents/")
    if (pathParts.length > 1) {
      const newPath = `documents/clientes/${pathParts[1]}`
      console.log(`Corrigindo caminho de documento: ${path} -> ${newPath}`)

      // Se a URL original era completa, reconstruir
      if (url.startsWith("http")) {
        try {
          const urlObj = new URL(url)
          urlObj.pathname = `/${newPath}`
          return urlObj.toString()
        } catch (e) {
          console.error("Erro ao reconstruir URL:", e)
          return `${BUNNY_PULLZONE_URL}/${newPath}`
        }
      }

      return `${BUNNY_PULLZONE_URL}/${newPath}`
    }
  }

  // Se já estiver correto ou não for um caminho de documento, retornar a URL original
  return url.startsWith("http") ? url : `${BUNNY_PULLZONE_URL}/${path}`
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

// Adicionar uma nova função para criar diretórios de forma mais robusta
// Adicionar esta função após a função isValidFileUrl

export async function createBunnyDirectory(directoryPath: string): Promise<boolean> {
  try {
    if (!BUNNY_API_KEY || !BUNNY_STORAGE_ZONE) {
      throw new Error("Configurações do Bunny.net incompletas. Verifique as variáveis de ambiente.")
    }

    // Normalizar o caminho do diretório
    const normalizedPath = directoryPath.replace(/\/+/g, "/").replace(/^\//, "")

    // Garantir que o caminho termine com uma barra
    const formattedPath = normalizedPath.endsWith("/") ? normalizedPath : `${normalizedPath}/`

    console.log(`Bunny Create Directory: Tentando criar diretório: ${formattedPath}`)

    // No Bunny.net, para criar um diretório vazio, precisamos fazer uma requisição PUT com corpo vazio
    const url = `${BUNNY_STORAGE_URL}/${formattedPath}`
    const response = await fetch(url, {
      method: "PUT",
      headers: {
        AccessKey: BUNNY_API_KEY,
        "Content-Type": "application/octet-stream",
      },
      body: "",
    })

    if (!response.ok) {
      throw new Error(`Erro ao criar diretório no Bunny.net: ${response.status}`)
    }

    console.log(`Bunny Create Directory: Diretório criado com sucesso: ${formattedPath}`)
    return true
  } catch (error) {
    console.error("Erro ao criar diretório:", error)
    throw error
  }
}

// Função para mover arquivos entre diretórios
export async function moveBunnyFile(sourcePath: string, destinationPath: string): Promise<string> {
  try {
    if (!BUNNY_API_KEY || !BUNNY_STORAGE_ZONE) {
      throw new Error("Configurações do Bunny.net incompletas. Verifique as variáveis de ambiente.")
    }

    // Normalizar os caminhos
    const normalizedSourcePath = sourcePath.replace(/\/+/g, "/").replace(/^\//, "")
    const normalizedDestPath = destinationPath.replace(/\/+/g, "/").replace(/^\//, "")

    console.log(`Bunny Move: Movendo de ${normalizedSourcePath} para ${normalizedDestPath}`)

    // Primeiro, baixar o arquivo original
    const fileContent = await downloadBunnyFile(normalizedSourcePath)

    // Determinar o tipo de conteúdo com base na extensão do arquivo
    const fileName = normalizedSourcePath.split("/").pop() || ""
    const extension = fileName.split(".").pop()?.toLowerCase() || ""
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

    // Fazer upload do arquivo no novo caminho
    const newUrl = await uploadFileToBunny(normalizedDestPath, fileContent, contentType)
    console.log(`Bunny Move: Novo arquivo criado em: ${normalizedDestPath}, URL: ${newUrl}`)

    // Excluir o arquivo original
    const deleteResult = await deleteBunnyFile(normalizedSourcePath)
    console.log(`Bunny Move: Arquivo original excluído: ${deleteResult}`)

    // Retornar a URL pública do novo arquivo
    return newUrl
  } catch (error) {
    console.error("Bunny Move: Erro geral:", error)
    throw error
  }
}

// Função para purgar o cache de um arquivo na Pull Zone
export async function purgeBunnyCache(filePath: string): Promise<boolean> {
  try {
    if (!process.env.BUNNY_API_KEY) {
      throw new Error("BUNNY_API_KEY não configurada")
    }

    // Normalizar o caminho do arquivo
    const normalizedPath = filePath.replace(/\/+/g, "/").replace(/^\//, "")

    console.log(`Bunny Purge: Purgando cache para: ${normalizedPath}`)

    // Obter o ID da Pull Zone (você precisará configurar isso)
    const pullZoneId = process.env.BUNNY_PULLZONE_ID
    if (!pullZoneId) {
      throw new Error("BUNNY_PULLZONE_ID não configurada")
    }

    // URL da API de purge do Bunny CDN
    const purgeUrl = `https://api.bunny.net/pullzone/${pullZoneId}/purgeCache`

    const response = await fetch(purgeUrl, {
      method: "POST",
      headers: {
        AccessKey: process.env.BUNNY_API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        urls: [`/${normalizedPath}`],
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`Erro ao purgar cache: ${response.status} - ${errorText}`)
    }

    console.log(`Bunny Purge: Cache purgado com sucesso para: ${normalizedPath}`)
    return true
  } catch (error) {
    console.error("Bunny Purge: Erro ao purgar cache:", error)
    return false
  }
}

// Função para verificar o status do cache de um arquivo
export async function checkCacheStatus(url: string): Promise<{
  cached: boolean
  age?: number
  expires?: number
  cacheControl?: string
}> {
  try {
    console.log(`Bunny Cache Check: Verificando status de cache para: ${url}`)

    const response = await fetch(url, {
      method: "HEAD",
    })

    const headers = Object.fromEntries(response.headers.entries())

    const result = {
      cached: headers["x-cache"] === "HIT",
      age: headers["age"] ? Number.parseInt(headers["age"]) : undefined,
      expires: headers["expires"] ? new Date(headers["expires"]).getTime() : undefined,
      cacheControl: headers["cache-control"],
    }

    console.log(`Bunny Cache Check: Resultado para ${url}:`, result)
    return result
  } catch (error) {
    console.error(`Bunny Cache Check: Erro ao verificar cache para ${url}:`, error)
    return { cached: false }
  }
}

// Função para obter a configuração de cache recomendada para um tipo de arquivo
export function getRecommendedCacheConfig(fileType: string): {
  maxAge: number
  cacheControl: string
} {
  // Converter para minúsculo para comparação
  const type = fileType.toLowerCase()

  // Verificar se é uma imagem
  if (type.startsWith("image/")) {
    return CACHE_CONFIG.image
  }

  // Verificar se é um documento
  if (type.includes("pdf") || type.includes("word") || type.includes("excel") || type.includes("text")) {
    return CACHE_CONFIG.document
  }

  // Verificar se é um arquivo de design
  if (type.includes("photoshop") || type.includes("illustrator") || type.includes("indesign")) {
    return CACHE_CONFIG.design
  }

  // Padrão para outros tipos
  return CACHE_CONFIG.default
}
