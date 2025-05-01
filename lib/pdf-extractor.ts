import { downloadBunnyFile } from "./bunny"

// Função para extrair texto de um PDF usando uma abordagem mais direta
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

    // Carregar a biblioteca pdf-parse em runtime
    const pdfParse = await import("pdf-parse").then((module) => module.default || module)

    // Extrair o texto do PDF
    const data = await pdfParse(pdfBuffer, {
      // Opções para melhorar a extração
      pagerender: (pageData: any) => {
        // Extrair texto da página
        return pageData.getTextContent().then((textContent: any) => {
          let lastY,
            text = ""
          for (const item of textContent.items) {
            if (lastY == item.transform[5] || !lastY) {
              text += item.str
            } else {
              text += "\n" + item.str
            }
            lastY = item.transform[5]
          }
          return text
        })
      },
    })

    // Verificar se o texto foi extraído com sucesso
    if (!data || !data.text || data.text.length < 10) {
      throw new Error("Texto extraído muito curto ou vazio")
    }

    console.log(`PDF Extractor: Extração concluída, ${data.text.length} caracteres extraídos`)
    console.log(`PDF Extractor: Amostra do texto: ${data.text.substring(0, 200)}...`)

    return data.text
  } catch (error) {
    console.error("PDF Extractor: Erro na extração:", error)
    throw new Error(`Falha na extração do PDF: ${error instanceof Error ? error.message : String(error)}`)
  }
}
