"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Send, Bot, Info, HelpCircle, Code, Calendar, Loader2, AlertTriangle } from "lucide-react"
import { AnimatePresence, motion } from "framer-motion"

interface Message {
  id: string
  text: string
  role: "user" | "assistant" | "system"
  timestamp: Date
  isError?: boolean
}

// Respostas pré-definidas para simulação local
const localResponses: Record<string, string> = {
  default:
    "Olá! Sou a Jaque, assistente virtual da Integrare. Como posso ajudar com seu planejamento de mídia social hoje?",
  marketing:
    "O marketing digital envolve várias estratégias como SEO, mídia social, email marketing e marketing de conteúdo. Qual área específica você gostaria de explorar?",
  instagram:
    "O Instagram é uma plataforma visual excelente para engajamento. Recomendo focar em Stories, Reels e posts com imagens de alta qualidade. A consistência visual é fundamental para sua marca.",
  facebook:
    "O Facebook é ideal para construir comunidade e alcançar públicos diversos. Conteúdo de vídeo e posts que incentivam interação tendem a ter melhor desempenho no algoritmo.",
  linkedin:
    "Para o LinkedIn, conteúdo profissional e educativo funciona melhor. Artigos de liderança de pensamento, cases de sucesso e atualizações do setor são formatos recomendados.",
  twitter:
    "No Twitter, mensagens concisas e oportunas são essenciais. Participar de conversas relevantes e usar hashtags estratégicas pode aumentar significativamente seu alcance.",
  tiktok:
    "O TikTok valoriza autenticidade e criatividade. Conteúdo curto, envolvente e que acompanha tendências tem maior chance de viralizar nesta plataforma.",
  planejamento:
    "Um bom planejamento de mídia social inclui: definição de objetivos claros, conhecimento do público-alvo, calendário de conteúdo, estratégia para cada plataforma e métricas para acompanhamento de resultados.",
  hashtags:
    "Hashtags devem ser relevantes, específicas e em número moderado. Misture hashtags populares com nichos específicos para melhor alcance. Pesquise as tendências do seu setor regularmente.",
  métricas:
    "As principais métricas a monitorar incluem: alcance, engajamento (curtidas, comentários, compartilhamentos), taxa de cliques, conversões, crescimento de seguidores e ROI das campanhas pagas.",
  frequência:
    "A frequência ideal de postagem varia por plataforma: Instagram (1-2/dia), Facebook (1/dia), LinkedIn (1-2/semana), Twitter (3-5/dia), TikTok (1-3/dia). Teste diferentes frequências para seu público específico.",
  horário:
    "Os melhores horários para postar dependem do seu público, mas geralmente: Instagram (meio-dia e 18h), Facebook (13h-16h), LinkedIn (manhã e início da tarde em dias úteis), Twitter (12h-15h), TikTok (19h-21h).",
  conteúdo:
    "Diversifique seu conteúdo entre educativo, inspirador, entretenimento e promocional. A regra 80/20 sugere 80% de conteúdo de valor e 20% promocional.",
  ferramentas:
    "Algumas ferramentas úteis para gestão de mídia social: Hootsuite, Buffer, Later, Canva, Planoly, Sprout Social e Google Analytics para métricas.",
  crise:
    "Para gestão de crise em redes sociais: monitore menções à sua marca, responda rapidamente, seja transparente, não delete críticas válidas e tenha um plano de contingência preparado.",
  tendências:
    "Tendências atuais incluem: conteúdo de vídeo curto, realidade aumentada, marketing de influência, conteúdo gerado pelo usuário e maior foco em autenticidade e responsabilidade social.",
  orgânico:
    "Para melhorar alcance orgânico: crie conteúdo de alta qualidade, incentive engajamento com perguntas e calls-to-action, use hashtags estrategicamente e mantenha consistência nas postagens.",
  pago: "Anúncios pagos devem ter objetivos claros, segmentação precisa, criativos atraentes e testes A/B regulares. Comece com orçamentos pequenos e escale conforme os resultados.",
  engajamento:
    "Para aumentar engajamento: faça perguntas, crie enquetes, responda comentários prontamente, compartilhe conteúdo dos seguidores e crie conteúdo que ressoe emocionalmente com seu público.",
  análise:
    "Analise seus resultados mensalmente, identificando: conteúdos com melhor desempenho, horários mais eficazes, crescimento de seguidores e conversões geradas. Use esses insights para ajustar sua estratégia.",
}

export default function ChatInterface({
  messages: initialMessages = [],
  setMessages: setParentMessages,
  selectedModule,
  isMobile = false,
}: {
  messages: Message[]
  setMessages: (messages: Message[]) => void
  selectedModule: string
  isMobile?: boolean
}) {
  const [inputValue, setInputValue] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [localMessages, setLocalMessages] = useState<Message[]>(initialMessages)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Atualizar as informações do módulo
  const moduleInfo = {
    assistant: {
      name: "Jaque - Assistente",
      icon: <Bot size={20} />,
      welcomeMessage:
        "Olá! Eu sou a Jaque, assistente virtual da Integrare. Como posso ajudar com seu planejamento de mídia social hoje?",
    },
  }

  const currentModule = moduleInfo["assistant"]

  // Processar comandos especiais
  const processSpecialCommands = (text: string) => {
    const command = text.trim().toLowerCase()

    if (command === "/ajuda") {
      return "Comandos disponíveis:\n/ajuda - Mostrar esta mensagem de ajuda\n/sobre - Sobre este assistente\n/hora - Mostrar hora atual\n/data - Mostrar data atual\n/dicas - Dicas de mídia social\n/plataformas - Listar plataformas suportadas"
    } else if (command === "/sobre") {
      return "Sou a Jaque, assistente virtual da Agência Integrare. Estou aqui para ajudar com informações sobre marketing digital, estratégias de mídia social e planejamento de conteúdo."
    } else if (command === "/hora") {
      const now = new Date()
      return `Hora atual: ${now.toLocaleTimeString()}`
    } else if (command === "/data") {
      const now = new Date()
      return `Data atual: ${now.toLocaleDateString("pt-BR")}`
    } else if (command === "/dicas") {
      return "Dicas para mídia social:\n1. Mantenha consistência visual\n2. Engaje com sua audiência\n3. Use hashtags estrategicamente\n4. Analise métricas regularmente\n5. Planeje conteúdo com antecedência"
    } else if (command === "/plataformas") {
      return "Plataformas suportadas: Instagram, Facebook, LinkedIn, Twitter, TikTok, YouTube, Pinterest"
    }

    return null // Não é um comando especial
  }

  // Função para gerar resposta local baseada no texto do usuário
  const generateLocalResponse = (userText: string) => {
    const text = userText.toLowerCase()

    // Verificar palavras-chave no texto do usuário
    for (const [keyword, response] of Object.entries(localResponses)) {
      if (text.includes(keyword.toLowerCase())) {
        return response
      }
    }

    // Se nenhuma palavra-chave for encontrada, usar resposta padrão
    return localResponses.default
  }

  // Função para simular envio de mensagem para API (agora local)
  const sendMessage = async (userMessage: Message) => {
    try {
      setIsLoading(true)

      // Simular tempo de resposta
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Gerar resposta local
      const responseText = generateLocalResponse(userMessage.text)

      // Adicionar resposta do assistente
      const assistantMessage: Message = {
        id: Date.now().toString(),
        text: responseText,
        role: "assistant",
        timestamp: new Date(),
      }

      const updatedMessages = [...localMessages, userMessage, assistantMessage]
      setLocalMessages(updatedMessages)
      setParentMessages(updatedMessages)
    } catch (error: any) {
      console.error("Erro ao processar mensagem:", error)

      // Adicionar mensagem de erro
      const errorMessage: Message = {
        id: Date.now().toString(),
        text: `Desculpe, ocorreu um erro ao processar sua mensagem. Por favor, tente novamente mais tarde.`,
        role: "assistant",
        timestamp: new Date(),
        isError: true,
      }

      const updatedMessages = [...localMessages, userMessage, errorMessage]
      setLocalMessages(updatedMessages)
      setParentMessages(updatedMessages)
    } finally {
      setIsLoading(false)
    }
  }

  // Manipular o envio de mensagens
  const handleSend = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!inputValue.trim()) return

    // Criar mensagem do usuário
    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue.trim(),
      role: "user",
      timestamp: new Date(),
    }

    // Verificar se é um comando especial
    const specialResponse = processSpecialCommands(inputValue)

    if (specialResponse) {
      // É um comando especial, não enviar para a API
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: specialResponse,
        role: "assistant",
        timestamp: new Date(),
      }

      const updatedMessages = [...localMessages, userMessage, assistantMessage]
      setLocalMessages(updatedMessages)
      setParentMessages(updatedMessages)
    } else {
      // Adicionar mensagem do usuário imediatamente
      setLocalMessages((prev) => [...prev, userMessage])

      // Enviar para processamento local
      await sendMessage(userMessage)
    }

    // Limpar o input
    setInputValue("")
  }

  // Implementação alternativa simplificada para comandos
  const handleCommandClick = (command: string) => {
    setInputValue(command)
  }

  useEffect(() => {
    // Scroll to bottom when messages change
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [localMessages])

  useEffect(() => {
    // Focus input when component mounts
    if (!isMobile) {
      document.getElementById("chat-input")?.focus()
    }
  }, [isMobile])

  return (
    <div className="bg-white rounded-xl flex flex-col h-full w-full max-w-full overflow-hidden border border-gray-200 shadow-sm">
      <div className="p-4 md:p-6 flex-shrink-0 border-b border-gray-200">
        <AnimatePresence>
          <motion.div
            className="flex items-center justify-between mb-4"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-[#4b7bb5] flex items-center justify-center text-white">
                {currentModule.icon}
              </div>
              <h2 className="text-lg font-medium text-gray-800">{currentModule.name}</h2>
            </div>
            <div className="flex space-x-2 items-center">
              <span className="h-2 w-2 rounded-full bg-green-500"></span>
              <span className="text-xs text-gray-500">Ativo</span>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Command suggestions */}
        <div className="flex flex-wrap gap-2 mb-4">
          {["/ajuda", "/sobre", "/hora", "/data", "/dicas", "/plataformas"].map((cmd) => (
            <button
              key={cmd}
              className="px-3 py-1 text-xs rounded-full bg-[#edf2f7] text-[#4b7bb5] hover:bg-[#e2e8f0] transition-colors"
              onClick={() => handleCommandClick(cmd)}
            >
              {cmd}
            </button>
          ))}
        </div>
      </div>

      <div className="border-b border-gray-200 flex-grow overflow-y-auto scrollbar-hide bg-gray-50">
        <div className="p-4 md:p-6 space-y-6">
          {localMessages.length === 0 ? (
            <motion.div
              className="flex flex-col items-center justify-center h-full py-10 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="w-16 h-16 bg-[#4b7bb5] rounded-full mb-4 flex items-center justify-center text-white">
                {currentModule.icon}
              </div>
              <h3 className="text-xl font-medium mb-2 text-gray-800">Bem-vindo à Jaque</h3>
              <p className="text-gray-600 max-w-sm">{currentModule.welcomeMessage}</p>

              <div className="mt-6 grid grid-cols-2 gap-3">
                <div className="p-3 bg-white rounded-lg flex items-center shadow-sm border border-gray-200">
                  <HelpCircle size={18} className="mr-2 text-[#4b7bb5]" />
                  <span className="text-sm text-gray-700">Digite /ajuda para comandos</span>
                </div>
                <div className="p-3 bg-white rounded-lg flex items-center shadow-sm border border-gray-200">
                  <Info size={18} className="mr-2 text-[#4b7bb5]" />
                  <span className="text-sm text-gray-700">Digite /sobre para informações</span>
                </div>
                <div className="p-3 bg-white rounded-lg flex items-center shadow-sm border border-gray-200">
                  <Code size={18} className="mr-2 text-[#4b7bb5]" />
                  <span className="text-sm text-gray-700">Pergunte sobre marketing</span>
                </div>
                <div className="p-3 bg-white rounded-lg flex items-center shadow-sm border border-gray-200">
                  <Calendar size={18} className="mr-2 text-[#4b7bb5]" />
                  <span className="text-sm text-gray-700">Tente /dicas ou /plataformas</span>
                </div>
              </div>
            </motion.div>
          ) : (
            localMessages.map((message, index) => (
              <motion.div
                key={message.id}
                className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-lg ${
                    message.role === "user"
                      ? "bg-[#4b7bb5] text-white rounded-tr-none shadow-sm"
                      : message.isError
                        ? "bg-red-50 text-red-800 rounded-tl-none border border-red-200"
                        : "bg-white text-gray-800 rounded-tl-none shadow-sm border border-gray-200"
                  }`}
                >
                  {message.isError && (
                    <div className="flex items-center gap-2 mb-2 text-red-600">
                      <AlertTriangle size={16} />
                      <span className="text-sm font-medium">Erro</span>
                    </div>
                  )}
                  <p className="break-words whitespace-pre-line">{message.text}</p>
                  <div
                    className={`text-xs mt-1 text-right ${message.role === "user" ? "text-blue-100" : "text-gray-500"}`}
                  >
                    {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </div>
                </div>
              </motion.div>
            ))
          )}

          {/* Indicador de digitação */}
          {isLoading && (
            <motion.div
              className="flex justify-start"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="max-w-[80%] p-3 rounded-lg bg-white text-gray-800 rounded-tl-none shadow-sm border border-gray-200">
                <div className="flex items-center gap-2">
                  <Loader2 size={16} className="animate-spin text-[#4b7bb5]" />
                  <p className="text-gray-600">Jaque está digitando...</p>
                </div>
              </div>
            </motion.div>
          )}

          <div ref={messagesEndRef} className="h-4" />
        </div>
      </div>

      {/* Input field */}
      <div className="p-4 md:p-6 flex-shrink-0 bg-white">
        <form onSubmit={handleSend} className="relative">
          <input
            id="chat-input"
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Digite uma mensagem ou comando (tente /ajuda)..."
            className="w-full py-3 pl-4 pr-12 bg-white border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#4b7bb5] focus:border-transparent text-gray-800"
            disabled={isLoading}
          />
          <button
            type="submit"
            className={`absolute right-3 top-1/2 transform -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-full ${
              isLoading || !inputValue.trim() ? "bg-gray-300 text-gray-500" : "bg-[#4b7bb5] text-white"
            }`}
            disabled={isLoading || !inputValue.trim()}
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-gray-300 border-t-white rounded-full animate-spin"></div>
            ) : (
              <Send size={16} className="text-white" />
            )}
          </button>
        </form>
      </div>
    </div>
  )
}
