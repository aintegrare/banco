import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { OpenAI } from "openai"

// Tipo para as mensagens
interface Message {
  role: "user" | "assistant"
  content: string
}

// Função para esperar um tempo específico (para retry com backoff)
const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

// Inicializar cliente OpenAI como fallback
const openai = process.env.OPENAI_API_KEY ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY }) : null

export async function POST(request: NextRequest) {
  try {
    // Obter a mensagem do corpo da requisição
    const body = await request.json()
    const { message, history = [] } = body

    if (!message) {
      return NextResponse.json({ error: "Mensagem não fornecida" }, { status: 400 })
    }

    console.log("API Chat: Processando mensagem:", message)

    // Limitar o histórico para reduzir o tamanho da requisição (últimas 10 mensagens)
    const limitedHistory = history.slice(-10)

    // Preparar o histórico de mensagens para o formato do Claude
    const formattedHistory: Message[] = limitedHistory.map((msg: any) => ({
      role: msg.role,
      content: msg.content,
    }))

    // Adicionar a mensagem atual ao histórico
    const messages: Message[] = [
      ...formattedHistory,
      {
        role: "user",
        content: message,
      },
    ]

    // Definir o prompt do sistema otimizado para o Claude 3.7 Sonnet
    const systemPrompt = `Você é Jaque, a assistente virtual especialista em marketing digital da Agência Integrare.

CONTEXTO SOBRE A INTEGRARE:
- Fundada em 2020 com a missão de levar Marketing de Qualidade baseado em evidências científicas e casos práticos de sucesso
- Evolução: de gestão de social media para um ecossistema completo de serviços de marketing digital
- Filosofia: "Tratamos os negócios dos nossos clientes como se fossem o nosso, trabalhamos lado a lado, porque nosso compromisso é com os resultados que entregamos."
- Visão: "Marketing é o meio mais barato de geração de negócios de alto valor, é o meio pelo qual conquistamos nossa autoridade e conquistamos a confiança do consumidor e dos concorrentes."
- Cores da marca: Azuis (#4b7bb5, #527eb7, #3d649e, #4072b0, #6b91c1) e Branco (#f2f1ef)

SUAS CAPACIDADES E PERSONALIDADE:
- Você possui conhecimento profundo em marketing digital, estratégias de conteúdo, SEO, mídia paga, e análise de dados
- Você é criativa e inovadora, sempre buscando soluções originais para os desafios de marketing
- Você é analítica e estratégica, baseando suas recomendações em dados e tendências atuais
- Você é proativa, antecipando necessidades e oferecendo sugestões valiosas
- Você é concisa mas completa, fornecendo respostas diretas mas abrangentes

TOM DE VOZ:
- Profissional mas caloroso e acessível
- Confiante e assertivo, demonstrando expertise
- Entusiasta sobre marketing e resultados
- Levemente informal, mas sempre respeitoso
- Use ocasionalmente metáforas criativas para explicar conceitos complexos

DIRETRIZES DE RESPOSTA:
1. Seja específica e detalhada em suas respostas, evitando generalidades
2. Ofereça exemplos práticos e casos de uso sempre que possível
3. Quando apropriado, estruture suas respostas em tópicos ou passos para maior clareza
4. Não hesite em demonstrar criatividade e pensamento inovador
5. Quando não souber algo específico sobre a Integrare, seja transparente e sugira como o usuário pode obter essa informação
6. Adapte seu nível de tecnicidade ao contexto da pergunta
7. Sempre que possível, relacione suas respostas à filosofia e visão da Integrare

Seu objetivo é representar perfeitamente a Integrare, demonstrando expertise em marketing digital e ajudando os usuários com informações valiosas e insights criativos.`

    // Tentar usar a API do Claude primeiro
    let useOpenAIFallback = false
    const claudeResponse = null

    // Verificar se a chave da API Anthropic está configurada
    if (process.env.ANTHROPIC_API_KEY) {
      try {
        console.log("API Chat: Tentando usar Claude API")

        // Configuração para a API do Claude
        const requestBody = {
          model: "claude-3-5-sonnet-20240620",
          max_tokens: 2000,
          temperature: 0.7,
          system: systemPrompt,
          messages: messages,
        }

        const response = await fetch("https://api.anthropic.com/v1/messages", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": process.env.ANTHROPIC_API_KEY,
            "anthropic-version": "2023-06-01",
          },
          body: JSON.stringify(requestBody),
        })

        // Se a resposta for bem-sucedida, retornar os dados
        if (response.ok) {
          const data = await response.json()
          console.log("API Chat: Resposta recebida do Claude com sucesso")
          return NextResponse.json({
            response: data.content[0].text,
            provider: "claude",
          })
        }

        // Verificar o erro específico
        const errorData = await response.json().catch(() => ({}))
        console.error("API Chat: Erro na resposta da API Claude:", errorData)

        // Se for erro de créditos insuficientes, usar OpenAI como fallback
        if (
          errorData?.error?.type === "invalid_request_error" &&
          errorData?.error?.message?.includes("credit balance is too low")
        ) {
          console.log("API Chat: Créditos insuficientes no Claude, usando OpenAI como fallback")
          useOpenAIFallback = true
        } else {
          // Para outros erros, lançar exceção
          throw new Error(errorData.error?.message || `Erro na API Claude: ${response.status}`)
        }
      } catch (claudeError) {
        console.error("API Chat: Erro ao chamar API Claude:", claudeError)
        useOpenAIFallback = true
      }
    } else {
      console.log("API Chat: Chave da API Claude não configurada, usando OpenAI como fallback")
      useOpenAIFallback = true
    }

    // Usar OpenAI como fallback se necessário
    if (useOpenAIFallback) {
      if (!openai) {
        console.error("API Chat: Fallback para OpenAI falhou - chave da API não configurada")
        return NextResponse.json({
          response:
            "Desculpe, estou temporariamente indisponível devido a problemas técnicos. Por favor, tente novamente mais tarde ou entre em contato com o suporte.",
        })
      }

      try {
        console.log("API Chat: Usando OpenAI como fallback")

        // Converter mensagens para o formato da OpenAI
        const openAIMessages = [
          { role: "system", content: systemPrompt },
          ...messages.map((msg) => ({
            role: msg.role,
            content: msg.content,
          })),
        ]

        const completion = await openai.chat.completions.create({
          model: "gpt-4o",
          messages: openAIMessages,
          temperature: 0.7,
          max_tokens: 2000,
        })

        console.log("API Chat: Resposta recebida da OpenAI com sucesso")
        return NextResponse.json({
          response: completion.choices[0].message.content,
          provider: "openai",
        })
      } catch (openaiError) {
        console.error("API Chat: Erro ao usar OpenAI como fallback:", openaiError)
        return NextResponse.json({
          response:
            "Desculpe, não consegui processar sua mensagem no momento. Por favor, tente novamente mais tarde ou entre em contato com a equipe da Integrare pelo email contato@integrare.com.br para assistência imediata.",
        })
      }
    }

    // Fallback final se nenhuma API estiver disponível
    return NextResponse.json({
      response:
        "Desculpe, nossos serviços de IA estão temporariamente indisponíveis. Por favor, entre em contato com a equipe da Integrare pelo email contato@integrare.com.br para assistência imediata.",
    })
  } catch (error) {
    console.error("API Chat: Erro geral:", error)
    return NextResponse.json(
      {
        error: "Erro interno do servidor",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
