import * as pdfjs from "pdfjs-dist"
import type { PDFDocumentProxy } from "pdfjs-dist"
import { getBunnyHeaders } from "./bunny"

// Configurar worker para o pdfjs
const pdfjsWorker = require("pdfjs-dist/build/pdf.worker.entry")
pdfjs.GlobalWorkerOptions.workerSrc = pdfjsWorker

// Função para extrair texto de um PDF
export async function extractPDFText(url: string): Promise<string> {
  try {
    console.log(`Extraindo texto do PDF: ${url}`)

    // Verificar se a URL é do Bunny CDN
    const isBunnyCDN = url.includes("b-cdn.net")

    // Preparar opções para carregamento do PDF
    const loadingOptions: any = {
      verbosity: 1, // Aumentar verbosidade para debug
    }

    // Adicionar headers de autenticação se for do Bunny CDN
    if (isBunnyCDN) {
      const headers = getBunnyHeaders()
      loadingOptions.httpHeaders = headers
    }

    // Carregar o documento PDF
    console.log("Carregando documento PDF...")
    const loadingTask = pdfjs.getDocument({
      url,
      ...loadingOptions,
    })

    // Adicionar timeout para evitar bloqueio indefinido
    const timeoutPromise = new Promise<PDFDocumentProxy>((_, reject) => {
      setTimeout(() => reject(new Error("Timeout ao carregar o PDF")), 30000)
    })

    // Carregar o documento com timeout
    const pdfDocument = await Promise.race([loadingTask.promise, timeoutPromise])

    console.log(`PDF carregado com ${pdfDocument.numPages} páginas`)

    // Extrair texto de todas as páginas
    let fullText = ""

    for (let i = 1; i <= pdfDocument.numPages; i++) {
      try {
        console.log(`Processando página ${i}/${pdfDocument.numPages}`)
        const page = await pdfDocument.getPage(i)
        const textContent = await page.getTextContent()

        // Extrair texto dos itens
        const pageText = textContent.items.map((item: any) => item.str).join(" ")

        fullText += pageText + "\n\n"
      } catch (pageError) {
        console.error(`Erro ao processar página ${i}:`, pageError)
        fullText += `[Erro na extração da página ${i}]\n\n`
      }
    }

    // Verificar se o texto extraído é válido
    if (!fullText || fullText.trim().length === 0) {
      console.warn("Texto extraído vazio, o PDF pode estar protegido ou ser uma imagem")
      throw new Error(
        "Não foi possível extrair texto do PDF. O arquivo pode estar protegido ou ser uma imagem digitalizada.",
      )
    }

    // Limpar o documento para liberar recursos
    pdfDocument.destroy()

    return fullText.trim()
  } catch (error) {
    console.error("Erro ao extrair texto do PDF:", error)

    // Verificar se é um erro de PDF protegido
    const errorMessage = error instanceof Error ? error.message : String(error)
    if (errorMessage.includes("password") || errorMessage.includes("protected") || errorMessage.includes("encrypted")) {
      throw new Error("O PDF está protegido por senha e não pode ser processado.")
    }

    // Verificar se é um erro de acesso
    if (
      errorMessage.includes("401") ||
      errorMessage.includes("403") ||
      errorMessage.includes("not authorized") ||
      errorMessage.includes("access denied")
    ) {
      throw new Error("Acesso negado ao PDF. Verifique as credenciais de autenticação.")
    }

    throw error
  }
}
