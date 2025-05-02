// Função principal para extrair texto de PDFs
export async function extractPDFText(pdfUrl: string): Promise<string> {
  try {
    console.log("PDF Extractor: Iniciando extração de", pdfUrl)

    // Verificar se a URL é válida
    try {
      new URL(pdfUrl)
    } catch (urlError) {
      console.error("PDF Extractor: URL inválida:", pdfUrl)
      return "URL inválida. Verifique se o endereço está correto."
    }

    // Buscar o arquivo PDF
    const pdfResponse = await fetch(pdfUrl)
    if (!pdfResponse.ok) {
      throw new Error(`Falha ao buscar o PDF: ${pdfResponse.status} ${pdfResponse.statusText}`)
    }

    // Converter para ArrayBuffer
    const pdfBuffer = await pdfResponse.arrayBuffer()

    // Importar pdf-parse dinamicamente para evitar problemas com SSR
    const pdfParse = (await import("pdf-parse")).default

    // Extrair o texto do PDF
    const data = await pdfParse(Buffer.from(pdfBuffer))

    // Verificar se o texto foi extraído com sucesso
    if (!data.text || data.text.trim().length === 0) {
      console.warn("PDF Extractor: Nenhum texto extraído do PDF")
      return "Não foi possível extrair texto deste PDF. O arquivo pode estar protegido, ser uma imagem digitalizada ou estar corrompido."
    }

    console.log(`PDF Extractor: Extração concluída, ${data.text.length} caracteres extraídos`)

    // Limpar e normalizar o texto extraído
    const cleanedText = cleanPdfText(data.text)
    return cleanedText
  } catch (error) {
    console.error("PDF Extractor: Erro na extração:", error)
    return `Erro na extração do PDF: ${error instanceof Error ? error.message : String(error)}`
  }
}

// Função para limpar e normalizar o texto extraído do PDF
function cleanPdfText(text: string): string {
  return (
    text
      // Remover múltiplos espaços em branco
      .replace(/\s+/g, " ")
      // Remover quebras de página e outros caracteres especiais
      .replace(/\f/g, "\n")
      // Normalizar quebras de linha
      .replace(/\r\n/g, "\n")
      .replace(/\n{3,}/g, "\n\n")
      // Remover espaços em branco no início e fim
      .trim()
  )
}

// Mantemos a função de simulação para fallback em caso de erro
function generateSimulatedText(pdfUrl: string): string {
  // Extrair o nome do arquivo da URL
  const urlParts = pdfUrl.split("/")
  const fileName = urlParts[urlParts.length - 1].replace(".pdf", "").replace(/[_-]/g, " ")

  // Gerar texto simulado mais realista
  return `
Este documento contém texto extraído do arquivo "${fileName}".

RESUMO
Este documento apresenta uma análise detalhada sobre o tema principal abordado. 
Foram considerados diversos aspectos e perspectivas para fornecer uma visão abrangente.

INTRODUÇÃO
O objetivo deste documento é apresentar informações relevantes sobre o assunto em questão.
A metodologia utilizada baseou-se em pesquisas e análises de dados recentes.

DESENVOLVIMENTO
Os resultados obtidos demonstram tendências significativas no setor.
Observou-se que os principais fatores que influenciam este cenário são:
1. Inovação tecnológica
2. Mudanças no comportamento do consumidor
3. Regulamentações governamentais
4. Competição no mercado global

CONCLUSÃO
Com base nas análises realizadas, conclui-se que há oportunidades substanciais para 
desenvolvimento futuro, desde que sejam consideradas as limitações identificadas.

REFERÊNCIAS
- Smith, J. (2023). Análise de Tendências de Mercado.
- Johnson, A. et al. (2022). Perspectivas Tecnológicas.
- Garcia, M. (2023). Comportamento do Consumidor na Era Digital.

Este texto foi gerado como demonstração do sistema de extração de PDF.
Para implementar a extração real, será necessário configurar adequadamente as bibliotecas 
de processamento de PDF no ambiente de produção.
  `.trim()
}
