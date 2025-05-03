import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// Tipo para as mensagens
interface Message {
  role: "user" | "assistant"
  content: string
}

export async function POST(request: NextRequest) {
  try {
    // Verificar se a chave da API está configurada
    if (!process.env.ANTHROPIC_API_KEY) {
      console.error("API Chat: Chave da API Anthropic não configurada")
      return NextResponse.json({ error: "Configuração incompleta do servidor" }, { status: 500 })
    }

    // Obter a mensagem do corpo da requisição
    const body = await request.json()
    const { message, history = [] } = body

    if (!message) {
      return NextResponse.json({ error: "Mensagem não fornecida" }, { status: 400 })
    }

    console.log("API Chat: Processando mensagem:", message)

    // Preparar o histórico de mensagens para o formato do Claude
    const formattedHistory: Message[] = history.map((msg: any) => ({
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

    // Chamar a API do Claude com configurações otimizadas
    try {
      console.log("API Chat: Enviando requisição para Claude 3.7 Sonnet")

      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": process.env.ANTHROPIC_API_KEY,
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify({
          model: "claude-3-7-sonnet-20250219", // Atualizado para o modelo mais recente
          max_tokens: 4000, // Aumentado para permitir respostas mais detalhadas
          temperature: 0.8, // Temperatura alta para criatividade, mas não máxima
          top_p: 0.95, // Controle de diversidade de tokens
          top_k: 50, // Limita a seleção aos 50 tokens mais prováveis
          system: systemPrompt,
          messages: messages,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        console.error("API Chat: Erro na resposta da API Claude:", errorData)
        throw new Error(errorData.error?.message || `Erro na API Claude: ${response.status}`)
      }

      const data = await response.json()
      console.log("API Chat: Resposta recebida do Claude")

      return NextResponse.json({
        response: data.content[0].text,
      })
    } catch (apiError) {
      console.error("API Chat: Erro ao chamar API Claude:", apiError)
      return NextResponse.json(
        {
          error: "Erro ao processar sua mensagem",
          details: apiError instanceof Error ? apiError.message : String(apiError),
        },
        { status: 500 },
      )
    }
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
