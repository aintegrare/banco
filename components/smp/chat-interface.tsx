"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Textarea } from "@/components/ui/textarea"
import {
  Send,
  Paperclip,
  ImageIcon,
  Mic,
  Sparkles,
  MoreHorizontal,
  ThumbsUp,
  MessageCircle,
  RefreshCw,
  Save,
  Copy,
  Trash2,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface Message {
  id: string
  text: string
  role: "user" | "assistant"
  timestamp: Date
}

interface ChatInterfaceProps {
  messages: Message[]
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>
  selectedModule: string
}

export default function ChatInterface({
  messages: initialMessages = [],
  setMessages,
  selectedModule,
}: ChatInterfaceProps) {
  const [input, setInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [messages, setLocalMessages] = useState<Message[]>(initialMessages)

  // Sincronizar mensagens locais com as mensagens do componente pai
  useEffect(() => {
    setLocalMessages(initialMessages)
  }, [initialMessages])

  // Sincronizar mensagens locais com o componente pai
  useEffect(() => {
    setMessages(messages)
  }, [messages, setMessages])

  // Rolar para a última mensagem quando novas mensagens são adicionadas
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Função para enviar mensagem
  const handleSendMessage = () => {
    if (input.trim() === "") return

    // Adicionar mensagem do usuário
    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      role: "user",
      timestamp: new Date(),
    }

    setLocalMessages((prev) => [...prev, userMessage])
    setInput("")

    // Simular resposta do assistente
    setIsTyping(true)
    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: getAssistantResponse(input),
        role: "assistant",
        timestamp: new Date(),
      }
      setLocalMessages((prev) => [...prev, assistantMessage])
      setIsTyping(false)
    }, 1500)
  }

  // Função para gerar resposta do assistente (simulação)
  const getAssistantResponse = (userInput: string): string => {
    const responses = [
      "Baseado na sua estratégia de mídia social, recomendo focar em conteúdo visual para aumentar o engajamento.",
      "Analisando suas métricas recentes, vejo que os posts com hashtags específicas do setor têm melhor desempenho.",
      "Para aumentar seu alcance orgânico, considere criar mais conteúdo em formato de carrossel no Instagram.",
      "Sua audiência parece responder melhor a posts publicados entre 18h e 20h. Recomendo ajustar seu calendário de publicações.",
      "Baseado nas tendências atuais, recomendo incorporar mais conteúdo em vídeo curto na sua estratégia.",
      "Analisando seus concorrentes, vejo uma oportunidade para destacar os valores da sua marca através de storytelling.",
      "Para melhorar a taxa de conversão, sugiro adicionar chamadas para ação mais claras em seus posts.",
      "Seus seguidores parecem engajar mais com conteúdo educativo. Considere criar uma série de posts informativos sobre seu setor.",
    ]

    return responses[Math.floor(Math.random() * responses.length)]
  }

  // Formatar data
  const formatTime = (date: Date): string => {
    return new Intl.DateTimeFormat("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    }).format(date)
  }

  return (
    <div className="h-full flex flex-col flex-1 bg-white rounded-md">
      <div className="p-3 border-b bg-[#4b7bb5] text-white flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Avatar className="h-8 w-8">
            <AvatarImage src="/abstract-ai-network.png" alt="AI" />
            <AvatarFallback>AI</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="text-sm font-medium">Assistente de Mídia Social</h3>
            <p className="text-xs opacity-80">Powered by AI</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="h-8 w-8 text-white hover:bg-[#3d649e]">
            <RefreshCw className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-white hover:bg-[#3d649e]">
            <Save className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-white hover:bg-[#3d649e]">
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {/* Mensagem de boas-vindas */}
          {messages.length === 0 && (
            <div className="flex gap-3">
              <Avatar className="h-8 w-8">
                <AvatarImage src="/abstract-ai-network.png" alt="AI" />
                <AvatarFallback>AI</AvatarFallback>
              </Avatar>
              <Card className="max-w-[80%]">
                <CardContent className="p-3">
                  <p className="text-sm">
                    Olá! Sou seu assistente de mídia social. Como posso ajudar com sua estratégia hoje?
                  </p>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-xs text-gray-500">{formatTime(new Date())}</span>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" className="h-6 w-6">
                        <Copy className="h-3 w-3" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-6 w-6">
                        <ThumbsUp className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Mensagens da conversa */}
          {messages.map((message) => (
            <div key={message.id} className={`flex gap-3 ${message.role === "user" ? "justify-end" : ""}`}>
              {message.role === "assistant" && (
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/abstract-ai-network.png" alt="AI" />
                  <AvatarFallback>AI</AvatarFallback>
                </Avatar>
              )}

              <Card className={`max-w-[80%] ${message.role === "user" ? "bg-[#4b7bb5]" : ""}`}>
                <CardContent className="p-3">
                  <p className={`text-sm ${message.role === "user" ? "text-white" : ""}`}>{message.text}</p>
                  <div className="flex justify-between items-center mt-2">
                    <span className={`text-xs ${message.role === "user" ? "text-white/70" : "text-gray-500"}`}>
                      {formatTime(message.timestamp)}
                    </span>
                    {message.role === "assistant" && (
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon" className="h-6 w-6">
                          <Copy className="h-3 w-3" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-6 w-6">
                          <ThumbsUp className="h-3 w-3" />
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {message.role === "user" && (
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/abstract-geometric-shapes.png" alt="User" />
                  <AvatarFallback>U</AvatarFallback>
                </Avatar>
              )}
            </div>
          ))}

          {/* Indicador de digitação */}
          {isTyping && (
            <div className="flex gap-3">
              <Avatar className="h-8 w-8">
                <AvatarImage src="/abstract-ai-network.png" alt="AI" />
                <AvatarFallback>AI</AvatarFallback>
              </Avatar>
              <Card className="max-w-[80%]">
                <CardContent className="p-3">
                  <div className="flex space-x-1">
                    <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce delay-100"></div>
                    <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce delay-200"></div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      <div className="p-3 border-t">
        <div className="flex gap-2">
          <Textarea
            placeholder="Digite sua mensagem..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault()
                handleSendMessage()
              }
            }}
            className="min-h-[60px] resize-none"
          />
          <div className="flex flex-col justify-between">
            <div className="flex gap-1">
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Paperclip className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <ImageIcon className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Mic className="h-4 w-4" />
              </Button>
            </div>
            <Button
              onClick={handleSendMessage}
              className="bg-[#4b7bb5] hover:bg-[#3d649e]"
              disabled={input.trim() === ""}
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="flex justify-between items-center mt-2">
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="sm" className="h-7 px-2 text-xs flex items-center gap-1">
              <Sparkles className="h-3 w-3" />
              Sugerir ideias
            </Button>
            <Button variant="ghost" size="sm" className="h-7 px-2 text-xs flex items-center gap-1">
              <MessageCircle className="h-3 w-3" />
              Analisar conteúdo
            </Button>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-7 w-7">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Opções</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Salvar conversa</DropdownMenuItem>
              <DropdownMenuItem>Exportar como PDF</DropdownMenuItem>
              <DropdownMenuItem>Compartilhar</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-red-600">Limpar conversa</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  )
}
