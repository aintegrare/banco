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
  const [useFallback, setUseFallback] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Atualizar as informações do módulo
  const moduleInfo = {
    assistant: {
      name: "Jaque - Assistente",
      icon: <Bot size={20} />,
      welcomeMessage: "Olá! Eu sou a Jaque, assistente virtual da Integrare. Como posso ajudar você hoje?",
    },
  }

  const currentModule = moduleInfo["assistant"]

  // Processar comandos especiais
  const processSpecialCommands = (text: string) => {
    const command = text.trim().toLowerCase()

    if (command === "/ajuda") {
      return "Comandos disponíveis:\n/ajuda - Mostrar esta mensagem de ajuda\n/sobre - Sobre este assistente\n/hora - Mostrar hora atual\n/data - Mostrar data atual\n/clima - Mostrar clima (demonstração)\n/teste - Testar o sistema\n/fallback - Alternar modo de fallback"
    } else if (command === "/sobre") {
      return "Sou a Jaque, assistente virtual da Agência Integrare. Estou aqui para ajudar com informações sobre marketing digital, estratégias de mídia social e desenvolvimento web."
    } else if (command === "/hora") {
      const now = new Date()
      return `Hora atual: ${now.toLocaleTimeString()}`
    } else if (command === "/data") {
      const now = new Date()
      return `Data atual: ${now.toLocaleDateString("pt-BR")}`
    } else if (command === "/clima") {
      return "Recurso de clima em breve. Esta é apenas uma resposta de demonstração."
    } else if (command === "/teste") {
      return "Teste realizado com sucesso! O sistema está funcionando corretamente."
    } else if (command === "/fallback") {
      setUseFallback(!useFallback)
      return `Modo de fallback ${useFallback ? "desativado" : "ativado"}. ${
        useFallback ? "Usando API principal." : "Usando respostas locais quando a API principal falhar."
      }`
    }

    return null // Não é um comando especial
  }

  // Função para enviar mensagem para a API
  const sendMessageToAPI = async (userMessage: Message) => {
    try {
      setIsLoading(true)

      // Preparar mensagens para enviar à API
      const apiMessages = localMessages.concat(userMessage).map((msg) => ({
        role: msg.role,
        content: msg.text,
      }))

      // Determinar qual API usar
      const apiEndpoint = useFallback ? "/api/chat-fallback" : "/api/chat-simple"

      // Fazer a requisição para a API
      const response = await fetch(apiEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: apiMessages,
        }),
      })

      // Verificar se a resposta é OK antes de tentar analisar como JSON
      if (!response.ok) {
        // Tentar obter detalhes do erro, mas com tratamento de erro caso não seja JSON
        let errorMessage = `Erro do servidor: ${response.status} ${response.statusText}`

        try {
          const errorData = await response.json()
          if (errorData && errorData.error) {
            errorMessage = errorData.error
          }
        } catch (jsonError) {
          // Se não conseguir analisar como JSON, usar o texto bruto
          try {
            const errorText = await response.text()
            errorMessage = errorText || errorMessage
          } catch (textError) {
            // Se nem conseguir obter o texto, manter a mensagem original
          }
        }

        // Se não estiver usando fallback, tentar com a API de fallback
        if (!useFallback) {
          console.log("API principal falhou, tentando fallback...")

          try {
            const fallbackResponse = await fetch("/api/chat-fallback", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                messages: apiMessages,
              }),
            })

            if (fallbackResponse.ok) {
              const fallbackData = await fallbackResponse.json()

              // Adicionar resposta do assistente do fallback
              const assistantMessage: Message = {
                id: Date.now().toString(),
                text: fallbackData.content || "Resposta de fallback",
                role: "assistant",
                timestamp: new Date(),
              }

              const updatedMessages = [...localMessages, userMessage, assistantMessage]
              setLocalMessages(updatedMessages)
              setParentMessages(updatedMessages)
              setIsLoading(false)
              return
            }
          } catch (fallbackError) {
            console.error("Erro na API de fallback:", fallbackError)
            // Continuar com o fluxo de erro normal
          }
        }

        throw new Error(errorMessage)
      }

      // Tentar analisar a resposta como JSON com tratamento de erro
      let data
      try {
        data = await response.json()
      } catch (jsonError) {
        console.error("Erro ao analisar JSON:", jsonError)

        // Tentar obter o texto bruto
        try {
          const textResponse = await response.text()
          console.log("Resposta em texto:", textResponse)
          throw new Error("Erro ao analisar resposta da API: formato JSON inválido")
        } catch (textError) {
          throw new Error("Erro ao analisar resposta da API: não foi possível obter o conteúdo")
        }
      }

      // Verificar se a resposta contém o conteúdo esperado
      if (!data || (!data.content && !data.text)) {
        throw new Error("Resposta da API em formato inesperado")
      }

      // Adicionar resposta do assistente
      const assistantMessage: Message = {
        id: Date.now().toString(),
        text: data.content || data.text,
        role: "assistant",
        timestamp: new Date(),
      }

      const updatedMessages = [...localMessages, userMessage, assistantMessage]
      setLocalMessages(updatedMessages)
      setParentMessages(updatedMessages)
    } catch (error: any) {
      console.error("Erro ao enviar mensagem:", error)

      // Adicionar mensagem de erro
      const errorMessage: Message = {
        id: Date.now().toString(),
        text: `Erro ao comunicar com a API: ${error.message || "Falha na comunicação com a API"}`,
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

      // Enviar para a API
      await sendMessageToAPI(userMessage)
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
              {useFallback && (
                <span className="text-xs bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">Modo Fallback</span>
              )}
            </div>
            <div className="flex space-x-2 items-center">
              <span className="h-2 w-2 rounded-full bg-green-500"></span>
              <span className="text-xs text-gray-500">Ativo</span>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Command suggestions */}
        <div className="flex flex-wrap gap-2 mb-4">
          {["/ajuda", "/sobre", "/hora", "/data", "/teste", "/fallback"].map((cmd) => (
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
                  <span className="text-sm text-gray-700">Tente /data ou /hora</span>
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
