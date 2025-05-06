"use client"

import { useState, useEffect } from "react"

interface Message {
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

export function useChat() {
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [retryCount, setRetryCount] = useState(0)

  // Carregar mensagens do localStorage ao iniciar
  useEffect(() => {
    const savedMessages = localStorage.getItem("chat-messages")
    if (savedMessages) {
      try {
        const parsedMessages = JSON.parse(savedMessages)
        // Converter strings de data de volta para objetos Date
        const messagesWithDates = parsedMessages.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp),
        }))
        setMessages(messagesWithDates)
      } catch (e) {
        console.error("Erro ao carregar mensagens do chat:", e)
      }
    }
  }, [])

  // Salvar mensagens no localStorage quando mudam
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem("chat-messages", JSON.stringify(messages))
    }
  }, [messages])

  const sendMessage = async (content: string) => {
    if (!content.trim()) return

    const userMessage: Message = {
      role: "user",
      content: content.trim(),
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setIsLoading(true)
    setError(null)

    try {
      // Adicionar mensagem temporária de "digitando..."
      const tempId = Date.now().toString()
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Digitando...",
          timestamp: new Date(),
          id: tempId,
        } as any,
      ])

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: userMessage.content,
          history: messages.map((msg) => ({
            role: msg.role,
            content: msg.content,
          })),
        }),
      })

      // Remover a mensagem temporária
      setMessages((prev) => prev.filter((msg: any) => msg.id !== tempId))

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error?.details || errorData.error || `Erro na API: ${response.status}`)
      }

      const data = await response.json()

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: data.response,
          timestamp: new Date(),
        },
      ])

      // Resetar contador de retry em caso de sucesso
      setRetryCount(0)
    } catch (err) {
      console.error("Erro ao enviar mensagem:", err)

      // Incrementar contador de retry
      setRetryCount((prev) => prev + 1)

      // Mensagem de erro personalizada baseada no número de tentativas
      if (retryCount >= 2) {
        setError(
          "Estamos enfrentando dificuldades técnicas. Por favor, tente novamente mais tarde ou entre em contato com o suporte.",
        )
      } else {
        setError(
          "Não foi possível obter uma resposta. O serviço pode estar temporariamente sobrecarregado. Por favor, tente novamente.",
        )
      }
    } finally {
      setIsLoading(false)
    }
  }

  const clearMessages = () => {
    setMessages([])
    localStorage.removeItem("chat-messages")
    setError(null)
    setRetryCount(0)
  }

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    clearMessages,
  }
}
