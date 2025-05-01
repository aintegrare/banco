import { downloadBunnyFile } from "./bunny"

// Função para extrair texto de um PDF usando uma abordagem compatível com ambiente serverless
export async function extractPDFText(pdfUrl: string): Promise<string> {
  try {
    console.log("PDF Extractor: Iniciando extração de", pdfUrl)

    // Obter o buffer do PDF
    let pdfBuffer: Buffer

    if (pdfUrl.includes("b-cdn.net") || pdfUrl.includes("storage.bunnycdn.com")) {
      // Extrair o caminho do arquivo da URL
      const urlParts = pdfUrl.split("/")
      const fileName = urlParts[urlParts.length - 1]
      const filePath = `documents/${fileName}`

      console.log(`PDF Extractor: Baixando PDF do Bunny.net: ${filePath}`)
      pdfBuffer = await downloadBunnyFile(filePath)
    } else {
      console.log(`PDF Extractor: Baixando PDF de URL externa: ${pdfUrl}`)
      const response = await fetch(pdfUrl)

      if (!response.ok) {
        throw new Error(`Erro ao baixar PDF: ${response.status}`)
      }

      const arrayBuffer = await response.arrayBuffer()
      pdfBuffer = Buffer.from(arrayBuffer)
    }

    console.log(`PDF Extractor: PDF baixado com sucesso, tamanho: ${pdfBuffer.length} bytes`)

    // Extrair texto do PDF usando nossa implementação personalizada
    const text = await extractTextFromPDFBuffer(pdfBuffer)

    console.log(`PDF Extractor: Extração concluída, ${text.length} caracteres extraídos`)
    if (text.length > 0) {
      console.log(`PDF Extractor: Amostra do texto: ${text.substring(0, 200)}...`)
    }

    // IMPORTANTE: Nunca retornar texto simulado
    return text
  } catch (error) {
    console.error("PDF Extractor: Erro na extração:", error)
    throw new Error(`Falha na extração do PDF: ${error instanceof Error ? error.message : String(error)}`)
  }
}

// Função para extrair texto de um buffer PDF usando uma abordagem compatível com serverless
async function extractTextFromPDFBuffer(pdfBuffer: Buffer): Promise<string> {
  try {
    // Verificar se o buffer é realmente um PDF (começa com %PDF)
    const isPDF = pdfBuffer.slice(0, 4).toString() === "%PDF"
    if (!isPDF) {
      throw new Error("O arquivo não parece ser um PDF válido")
    }

    // Implementação melhorada para extrair texto de PDFs
    let text = ""
    const pdfString = pdfBuffer.toString("utf8", 0, Math.min(pdfBuffer.length, 5000000)) // Limitar para evitar problemas de memória

    // Método 1: Buscar por strings entre parênteses (comum em PDFs)
    let inString = false
    let currentString = ""
    let escapeNext = false
    let depth = 0

    // Percorrer o buffer procurando por strings entre parênteses
    for (let i = 0; i < Math.min(pdfBuffer.length, 1000000); i++) {
      const byte = pdfBuffer[i]

      if (escapeNext) {
        if (inString) currentString += String.fromCharCode(byte)
        escapeNext = false
        continue
      }

      if (byte === 92) {
        // '\'
        escapeNext = true
        continue
      }

      if (byte === 40) {
        // '('
        if (!inString) {
          inString = true
          currentString = ""
        } else {
          depth++
          currentString += "("
        }
      } else if (byte === 41) {
        // ')'
        if (inString) {
          if (depth > 0) {
            depth--
            currentString += ")"
          } else {
            // Adicionar apenas strings que parecem ser texto real
            if (currentString.length > 2) {
              // Filtrar strings que parecem ser texto real
              if (/[a-zA-Z]{2,}/.test(currentString) || /[0-9]{2,}/.test(currentString)) {
                text += currentString + " "
              }
            }
            inString = false
          }
        }
      } else if (inString) {
        // Adicionar apenas caracteres ASCII imprimíveis
        if (byte >= 32 && byte <= 126) {
          currentString += String.fromCharCode(byte)
        } else if (byte === 10 || byte === 13) {
          // quebras de linha
          currentString += " "
        }
      }
    }

    // Método 2: Buscar por padrões de texto em PDFs (TJ, Tj operadores)
    const tjPattern = /\[(.*?)\]\s*TJ/g
    const tjMatches = pdfString.match(tjPattern)
    if (tjMatches) {
      for (const match of tjMatches) {
        // Extrair texto entre colchetes
        const content = match.substring(1, match.length - 3)
        // Limpar caracteres não imprimíveis
        const cleaned = content.replace(/[^\x20-\x7E]/g, " ")
        if (cleaned.length > 2) {
          text += cleaned + " "
        }
      }
    }

    // Método 3: Buscar por operadores Tj
    const tjSinglePattern = /$$(.*?)$$\s*Tj/g
    const tjSingleMatches = pdfString.match(tjSinglePattern)
    if (tjSingleMatches) {
      for (const match of tjSingleMatches) {
        // Extrair texto entre parênteses
        const content = match.substring(1, match.length - 3)
        // Limpar caracteres não imprimíveis
        const cleaned = content.replace(/[^\x20-\x7E]/g, " ")
        if (cleaned.length > 2) {
          text += cleaned + " "
        }
      }
    }

    // Método 4: Buscar por sequências de texto entre BT e ET (Begin Text/End Text)
    const btEtPattern = /BT\s*(.*?)\s*ET/gs
    const btEtMatches = pdfString.match(btEtPattern)
    if (btEtMatches) {
      for (const match of btEtMatches) {
        // Extrair texto entre BT e ET
        const content = match.substring(2, match.length - 2)
        // Buscar por strings entre parênteses dentro do bloco BT/ET
        const parenthesesPattern = /$$(.*?)$$/g
        const parenthesesMatches = content.match(parenthesesPattern)
        if (parenthesesMatches) {
          for (const pMatch of parenthesesMatches) {
            const pContent = pMatch.substring(1, pMatch.length - 1)
            if (pContent.length > 2 && /[a-zA-Z]{2,}/.test(pContent)) {
              text += pContent + " "
            }
          }
        }
      }
    }

    // Método 5: Extrair qualquer sequência de caracteres ASCII imprimíveis
    if (text.length < 100) {
      let simpleText = ""
      let currentWord = ""

      for (let i = 0; i < Math.min(pdfBuffer.length, 1000000); i++) {
        const byte = pdfBuffer[i]

        if ((byte >= 65 && byte <= 90) || (byte >= 97 && byte <= 122)) {
          // Letras
          currentWord += String.fromCharCode(byte)
        } else if (byte === 32 || byte === 9 || byte === 10 || byte === 13) {
          // Espaços e quebras de linha
          if (currentWord.length > 0) {
            simpleText += currentWord + " "
            currentWord = ""
          }
        } else {
          // Outros caracteres (pontuação, etc.)
          if (byte >= 32 && byte <= 126) {
            if (currentWord.length > 0) {
              simpleText += currentWord
              currentWord = ""
            }
            simpleText += String.fromCharCode(byte)
          }
        }
      }

      if (currentWord.length > 0) {
        simpleText += currentWord
      }

      // Se encontramos mais texto com esta abordagem, usá-lo
      if (simpleText.length > text.length) {
        text = simpleText
      }
    }

    // Limpar o texto extraído
    text = text.replace(/\s+/g, " ").replace(/\( /g, "(").replace(/ \)/g, ")").trim()

    // Se não encontramos texto suficiente, tentar uma abordagem mais agressiva
    if (text.length < 100) {
      console.warn("PDF Extractor: Extração de texto limitada, texto muito curto encontrado")

      // Extrair qualquer sequência de caracteres que pareça texto
      const textPattern = /[a-zA-Z]{3,}[a-zA-Z\s.,;:!?'"(){}[\]0-9-]*/g
      const textMatches = pdfString.match(textPattern)
      if (textMatches) {
        text = textMatches.join(" ")
      }
    }

    // IMPORTANTE: Se ainda não conseguimos extrair texto suficiente, retornar um erro
    // em vez de texto simulado
    if (text.length < 50) {
      throw new Error("Não foi possível extrair texto suficiente do PDF. O arquivo pode estar protegido ou corrompido.")
    }

    return text
  } catch (error) {
    console.error("PDF Extractor: Erro na extração de texto do buffer PDF:", error)
    throw new Error(`Falha na extração de texto do PDF: ${error instanceof Error ? error.message : String(error)}`)
  }
}
