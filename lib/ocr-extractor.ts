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

    // No ambiente do navegador, informar que OCR não está disponível
    console.log("OCR Extractor: Ambiente de navegador detectado, OCR não disponível")
    return "A extração OCR só está disponível no servidor."
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
