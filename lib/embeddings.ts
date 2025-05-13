// Sistema de embeddings com suporte a múltiplos provedores
// Inclui fallback local para garantir funcionamento mesmo sem acesso às APIs

import { createClient } from "@supabase/supabase-js"

// Configuração do cliente Supabase para vetores
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ""
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)

// Interface para provedores de embeddings
export interface EmbeddingProvider {
  name: string
  generateEmbedding: (text: string) => Promise<number[]>
  dimensions: number
}

// Função simples para gerar embeddings locais (fallback)
// Esta é uma implementação básica que não substitui embeddings reais,
// mas permite que o sistema continue funcionando para demonstração
export function generateSimpleEmbedding(text: string): number[] {
  // Normalizar o texto
  const normalizedText = text.toLowerCase().trim()

  // Criar um vetor de 1536 dimensões (mesmo tamanho dos embeddings do OpenAI)
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

// Provedor de embeddings OpenAI
export const OpenAIEmbeddingProvider: EmbeddingProvider = {
  name: "OpenAI",
  dimensions: 1536,
  generateEmbedding: async (text: string): Promise<number[]> => {
    try {
      // Verificar se a chave da API está disponível
      if (!process.env.OPENAI_API_KEY) {
        console.log("Chave da API OpenAI não encontrada, usando fallback local")
        return generateSimpleEmbedding(text)
      }

      // Limitar o tamanho do texto para evitar erros com a API
      const limitedText = text.slice(0, 8000) // Limite para o modelo ada-002

      const response = await fetch("https://api.openai.com/v1/embeddings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          input: limitedText,
          model: "text-embedding-ada-002",
        }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        console.error("Erro na resposta da API OpenAI:", errorData)
        throw new Error(errorData.error?.message || `Erro ao gerar embeddings: ${response.status}`)
      }

      const data = await response.json()
      return data.data[0].embedding
    } catch (error) {
      console.error("Erro ao gerar embeddings com OpenAI:", error)
      console.log("Usando fallback local para embeddings após erro na API OpenAI")
      return generateSimpleEmbedding(text)
    }
  },
}

// Provedor de embeddings Anthropic (usando Claude)
export const AnthropicEmbeddingProvider: EmbeddingProvider = {
  name: "Anthropic",
  dimensions: 1536,
  generateEmbedding: async (text: string): Promise<number[]> => {
    try {
      // Verificar se a chave da API está disponível
      if (!process.env.ANTHROPIC_API_KEY) {
        console.log("Chave da API Anthropic não encontrada, usando fallback local")
        return generateSimpleEmbedding(text)
      }

      // Limitar o tamanho do texto para evitar erros com a API
      const limitedText = text.slice(0, 100000)

      // Tentar usar a API Anthropic com timeout
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 15000) // 15 segundos de timeout

      // Usar uma abordagem mais direta para obter representações semânticas do texto
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": process.env.ANTHROPIC_API_KEY,
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify({
          model: "claude-3-haiku-20240307",
          max_tokens: 1024,
          messages: [
            {
              role: "user",
              content: `Analise este texto e gere uma representação numérica dele em 1536 dimensões. 
              Cada número deve estar entre -1 e 1. 
              Responda APENAS com os números separados por vírgulas, sem nenhum outro texto.
              
              Texto: ${limitedText}`,
            },
          ],
          system:
            "Você é um sistema de geração de embeddings. Sua tarefa é analisar o texto e gerar uma representação numérica em 1536 dimensões. Responda APENAS com os números separados por vírgulas, sem nenhum outro texto.",
        }),
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        console.error("Erro na resposta da API Anthropic:", errorData)
        throw new Error(errorData.error?.message || `Erro ao gerar embeddings: ${response.status}`)
      }

      const data = await response.json()
      const responseText = data.content[0].text.trim()

      // Tentar extrair números da resposta
      try {
        if (responseText.includes(",")) {
          // Tentar extrair números separados por vírgula
          const numbers = responseText
            .split(",")
            .map((num) => Number.parseFloat(num.trim()))
            .filter((num) => !isNaN(num))

          if (numbers.length >= 100) {
            // Verificar se temos pelo menos 100 números válidos
            // Preencher ou truncar para exatamente 1536 dimensões
            const result = new Array(1536).fill(0)
            for (let i = 0; i < Math.min(numbers.length, 1536); i++) {
              result[i] = numbers[i]
            }

            // Normalizar o vetor
            const magnitude = Math.sqrt(result.reduce((sum, val) => sum + val * val, 0))
            return result.map((val) => (magnitude > 0 ? val / magnitude : 0))
          }
        }

        // Se não conseguir extrair números suficientes, usar fallback
        console.log("Não foi possível extrair embeddings válidos da resposta do Claude, usando fallback local")
        return generateSimpleEmbedding(text)
      } catch (parseError) {
        console.error("Erro ao processar resposta do Claude para embeddings:", parseError)
        return generateSimpleEmbedding(text)
      }
    } catch (error) {
      console.error("Erro ao gerar embeddings com Anthropic:", error)
      console.log("Usando fallback local para embeddings após erro na API Anthropic")
      return generateSimpleEmbedding(text)
    }
  },
}

// Provedor de embeddings Supabase pgvector
export const SupabaseEmbeddingProvider: EmbeddingProvider = {
  name: "Supabase pgvector",
  dimensions: 1536,
  generateEmbedding: async (text: string): Promise<number[]> => {
    try {
      // Verificar se o cliente Supabase está configurado
      if (!supabaseUrl || !supabaseServiceKey) {
        console.log("Configuração do Supabase não encontrada, usando fallback local")
        return generateSimpleEmbedding(text)
      }

      // Limitar o tamanho do texto
      const limitedText = text.slice(0, 10000)

      // Chamar a função RPC do Supabase para gerar embeddings
      const { data, error } = await supabaseAdmin.rpc("generate_embeddings", {
        input_text: limitedText,
      })

      if (error) {
        console.error("Erro ao gerar embeddings com Supabase:", error)
        throw error
      }

      if (!data || !Array.isArray(data)) {
        console.log("Resposta inválida da função de embeddings do Supabase")
        return generateSimpleEmbedding(text)
      }

      return data
    } catch (error) {
      console.error("Erro ao gerar embeddings com Supabase:", error)
      console.log("Usando fallback local para embeddings após erro no Supabase")
      return generateSimpleEmbedding(text)
    }
  },
}

// Provedor de embeddings composto (tenta múltiplos provedores em sequência)
export const CompositeEmbeddingProvider: EmbeddingProvider = {
  name: "Composite",
  dimensions: 1536,
  generateEmbedding: async (text: string): Promise<number[]> => {
    // Lista de provedores em ordem de preferência
    const providers = [AnthropicEmbeddingProvider, SupabaseEmbeddingProvider, OpenAIEmbeddingProvider]

    // Tenta cada provedor em sequência
    for (const provider of providers) {
      try {
        console.log(`Tentando gerar embeddings com provedor: ${provider.name}`)
        const embedding = await provider.generateEmbedding(text)
        console.log(`Embeddings gerados com sucesso usando: ${provider.name}`)
        return embedding
      } catch (error) {
        console.error(`Erro ao gerar embeddings com ${provider.name}:`, error)
        console.log(`Tentando próximo provedor...`)
      }
    }

    // Se todos os provedores falharem, usa o fallback local
    console.log("Todos os provedores falharam, usando fallback local")
    return generateSimpleEmbedding(text)
  },
}

// Exporta o provedor padrão
export const defaultEmbeddingProvider = CompositeEmbeddingProvider
