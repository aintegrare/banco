import { createWorker } from "tesseract.js"
import * as pdfjs from "pdfjs-dist"

// Configurar o worker do PDF.js
let pdfjsWorker: any
try {
  pdfjsWorker = await import("pdfjs-dist/build/pdf.worker.entry")
  if (typeof window !== "undefined" && !pdfjs.GlobalWorkerOptions.workerSrc) {
    pdfjs.GlobalWorkerOptions.workerSrc = pdfjsWorker
  }
} catch (error) {
  console.warn("OCR Extractor: Erro ao carregar PDF.js worker:", error)
}

// Função para extrair texto de PDFs usando OCR
export async function extractPDFTextWithOCR(pdfBuffer: Buffer): Promise<string> {
  try {
    console.log("OCR Extractor: Iniciando extração OCR do PDF")

    // Verificar se estamos em um ambiente serverless
    const isServerless = typeof window === "undefined"

    if (isServerless) {
      console.log("OCR Extractor: Detectado ambiente serverless, usando API externa")
      return await extractPDFTextWithOCRServerless(pdfBuffer)
    }

    // Carregar o PDF usando PDF.js
    try {
      const loadingTask = pdfjs.getDocument({ data: pdfBuffer })
      const pdf = await loadingTask.promise

      console.log(`OCR Extractor: PDF carregado, ${pdf.numPages} páginas encontradas`)

      // Criar worker do Tesseract
      const worker = await createWorker("por")
      console.log("OCR Extractor: Worker do Tesseract inicializado")

      let fullText = ""

      // Processar cada página do PDF
      for (let pageNum = 1; pageNum <= Math.min(pdf.numPages, 20); pageNum++) {
        console.log(`OCR Extractor: Processando página ${pageNum}/${pdf.numPages}`)

        // Obter a página
        const page = await pdf.getPage(pageNum)

        // Renderizar a página como uma imagem
        const viewport = page.getViewport({ scale: 2.0 }) // Escala maior para melhor qualidade
        const canvas = document.createElement("canvas")
        const context = canvas.getContext("2d")

        if (!context) {
          throw new Error("Não foi possível criar contexto de canvas")
        }

        canvas.height = viewport.height
        canvas.width = viewport.width

        await page.render({
          canvasContext: context,
          viewport: viewport,
        }).promise

        // Converter canvas para imagem
        const imageData = canvas.toDataURL("image/png")

        // Reconhecer texto na imagem usando Tesseract
        const { data } = await worker.recognize(imageData)

        // Adicionar texto reconhecido ao resultado
        fullText += data.text + "\n\n"

        console.log(`OCR Extractor: Página ${pageNum} processada, ${data.text.length} caracteres extraídos`)
      }

      // Terminar o worker do Tesseract
      await worker.terminate()
      console.log(`OCR Extractor: Extração OCR concluída, ${fullText.length} caracteres extraídos no total`)

      return fullText
    } catch (browserOcrError) {
      console.error("OCR Extractor: Erro na extração OCR no navegador:", browserOcrError)
      console.log("OCR Extractor: Tentando usar API externa como fallback")
      return await extractPDFTextWithOCRServerless(pdfBuffer)
    }
  } catch (error) {
    console.error("OCR Extractor: Erro na extração OCR:", error)
    throw new Error(`Falha na extração OCR do PDF: ${error instanceof Error ? error.message : String(error)}`)
  }
}

// Versão serverless da função OCR (usando API externa)
export async function extractPDFTextWithOCRServerless(pdfBuffer: Buffer): Promise<string> {
  try {
    console.log("OCR Extractor: Iniciando extração OCR serverless")

    // Verificar se a chave da API está configurada
    if (!process.env.OCR_API_KEY) {
      console.warn("OCR Extractor: OCR_API_KEY não está configurada")
      return "Não foi possível realizar OCR: chave de API não configurada. Configure a variável de ambiente OCR_API_KEY."
    }

    // Simulação de extração OCR para teste
    // Em produção, você substituiria isso por uma chamada real à API de OCR
    console.log("OCR Extractor: Simulando extração OCR (modo de teste)")
    return "Este é um texto extraído via OCR simulado para fins de teste. Em um ambiente de produção, você usaria uma API real de OCR."
  } catch (error) {
    console.error("OCR Extractor: Erro na extração OCR serverless:", error)
    // Retornar mensagem de erro em vez de texto vazio
    return `Erro no processamento OCR: ${error instanceof Error ? error.message : String(error)}`
  }
}

// Função para detectar se um PDF precisa de OCR
export async function isPDFScanned(pdfBuffer: Buffer): Promise<boolean> {
  try {
    console.log("OCR Extractor: Verificando se o PDF é digitalizado")

    // Verificar se estamos em um ambiente serverless
    if (typeof window === "undefined") {
      console.log("OCR Extractor: Ambiente serverless detectado, pulando verificação de PDF digitalizado")
      return false
    }

    // Verificação simplificada baseada no conteúdo do PDF
    // Procurar por padrões que indicam texto extraível
    const pdfText = pdfBuffer.toString("utf8", 0, Math.min(5000, pdfBuffer.length))

    // Verificar se há operadores de texto comuns em PDFs
    const hasTextOperators = /TJ|Tj|BT|ET/g.test(pdfText)

    // Verificar se há fontes definidas
    const hasFonts = /\/Font\s*<</.test(pdfText)

    // Verificar se há strings de texto entre parênteses
    const hasTextStrings = /$$[A-Za-z\s]{3,}$$/g.test(pdfText)

    // Se não encontrarmos indicadores de texto extraível, provavelmente é um PDF digitalizado
    const isLikelyScanned = !(hasTextOperators && hasFonts && hasTextStrings)

    console.log(
      `OCR Extractor: Resultado da verificação - hasTextOperators: ${hasTextOperators}, hasFonts: ${hasFonts}, hasTextStrings: ${hasTextStrings}`,
    )
    console.log(`OCR Extractor: PDF provavelmente ${isLikelyScanned ? "é" : "não é"} digitalizado`)

    return isLikelyScanned
  } catch (error) {
    console.error("OCR Extractor: Erro ao detectar se PDF é digitalizado:", error)
    // Em caso de erro, assumir que não precisa de OCR para evitar problemas
    return false
  }
}
