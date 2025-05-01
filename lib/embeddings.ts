// Função simples para gerar embeddings locais (fallback)
// Esta é uma implementação básica que não substitui embeddings reais,
// mas permite que o sistema continue funcionando para demonstração
export function generateSimpleEmbedding(text: string): number[] {
  // Normalizar o texto
  const normalizedText = text.toLowerCase().trim()

  // Criar um vetor de 1536 dimensões (mesmo tamanho dos embeddings do Claude)
  const embedding = new Array(1536).fill(0)

  // Função de hash simples para converter caracteres em valores numéricos
  const simpleHash = (str: string): number => {
    let hash = 0
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i)
      hash = (hash << 5) - hash + char
      hash = hash & hash // Converter para inteiro de 32 bits
    }
    return hash
  }

  // Dividir o texto em tokens (palavras)
  const tokens = normalizedText.split(/\s+/)

  // Preencher o vetor de embedding com base nas palavras do texto
  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i]
    const hash = simpleHash(token)
    const position = Math.abs(hash) % 1536

    // Adicionar um valor baseado na posição da palavra no texto
    embedding[position] += 1 / (i + 1)
  }

  // Normalizar o vetor para ter comprimento unitário
  const magnitude = Math.sqrt(embedding.reduce((sum, val) => sum + val * val, 0))
  return embedding.map((val) => (magnitude > 0 ? val / magnitude : 0))
}
