"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Send, Loader2, Download, Trash2, ArrowLeft, Clock, MessageSquare } from "lucide-react"
import { useChat } from "@/hooks/use-chat"
import { ChatAvatar } from "@/components/chat/chat-avatar"
import { motion, AnimatePresence } from "framer-motion"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"

export default function ChatPage() {
  const [input, setInput] = useState("")
  const [showSidebar, setShowSidebar] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { messages, isLoading, error, sendMessage, clearMessages } = useChat()
  const [showClearConfirm, setShowClearConfirm] = useState(false)
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [isExporting, setIsExporting] = useState(false)

  // Agrupar mensagens por data
  const messagesByDate = messages.reduce<Record<string, typeof messages>>((acc, message) => {
    const date = format(message.timestamp, "yyyy-MM-dd")
    if (!acc[date]) {
      acc[date] = []
    }
    acc[date].push(message)
    return acc
  }, {})

  // Obter datas únicas ordenadas (mais recentes primeiro)
  const uniqueDates = Object.keys(messagesByDate).sort((a, b) => new Date(b).getTime() - new Date(a).getTime())

  // Rolar para a mensagem mais recente
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages])

  // Adicionar mensagem de boas-vindas quando não há mensagens
  useEffect(() => {
    if (messages.length === 0) {
      sendMessage("Olá! Eu sou a Jaque, assistente virtual da Integrare. Como posso ajudar você hoje?")
    }
  }, [messages.length, sendMessage])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!input.trim() || isLoading) return

    await sendMessage(input.trim())
    setInput("")
  }

  const handleExportChat = async () => {
    if (isExporting) return
    setIsExporting(true)

    try {
      // Filtrar mensagens pela data selecionada, se houver
      const messagesToExport = selectedDate ? messagesByDate[selectedDate] : messages

      // Formatar mensagens para exportação
      const exportContent = messagesToExport
        .map((msg) => {
          const time = format(msg.timestamp, "HH:mm")
          const sender = msg.role === "user" ? "Você" : "Jaque"
          return `[${time}] ${sender}: ${msg.content}`
        })
        .join("\n\n")

      const filename = `chat-integrare-${selectedDate || format(new Date(), "yyyy-MM-dd")}.txt`

      // Criar um link temporário para download usando data URI
      const link = document.createElement("a")
      link.setAttribute("href", `data:text/plain;charset=utf-8,${encodeURIComponent(exportContent)}`)
      link.setAttribute("download", filename)
      link.style.display = "none"
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } catch (error) {
      console.error("Erro ao exportar chat:", error)
    } finally {
      setIsExporting(false)
    }
  }

  // Filtrar mensagens pela data selecionada ou mostrar todas
  const displayMessages = selectedDate ? messagesByDate[selectedDate] : messages

  return (
    <div className="flex h-[calc(100vh-80px)] bg-gray-50">
      {/* Sidebar com histórico */}
      <AnimatePresence initial={false}>
        {showSidebar && (
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 300, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white border-r border-gray-200 h-full overflow-hidden"
          >
            <div className="p-4 border-b border-gray-200 bg-[#4b7bb5] text-white">
              <h2 className="text-lg font-semibold flex items-center">
                <Clock size={18} className="mr-2" />
                Histórico de Conversas
              </h2>
            </div>

            <div className="p-4 overflow-y-auto h-[calc(100%-64px)]">
              {uniqueDates.length > 0 ? (
                uniqueDates.map((date) => (
                  <div key={date} className="mb-4">
                    <button
                      onClick={() => setSelectedDate(date === selectedDate ? null : date)}
                      className={`w-full text-left p-3 rounded-lg transition-colors ${
                        date === selectedDate
                          ? "bg-[#4b7bb5] text-white"
                          : "bg-white border border-gray-200 hover:bg-gray-50"
                      }`}
                    >
                      <div className="font-medium">{format(new Date(date), "EEEE, d 'de' MMMM", { locale: ptBR })}</div>
                      <div className="text-xs mt-1 opacity-80">{messagesByDate[date].length} mensagens</div>
                    </button>
                  </div>
                ))
              ) : (
                <div className="text-center text-gray-500 mt-8">
                  <MessageSquare size={40} className="mx-auto mb-2 opacity-30" />
                  <p>Nenhuma conversa encontrada</p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Área principal do chat */}
      <div className="flex-1 flex flex-col h-full">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 p-4 flex items-center justify-between">
          <div className="flex items-center">
            <button
              onClick={() => setShowSidebar(!showSidebar)}
              className="mr-3 text-gray-600 hover:text-gray-900"
              aria-label={showSidebar ? "Ocultar histórico" : "Mostrar histórico"}
            >
              <ArrowLeft size={20} className={`transition-transform ${showSidebar ? "" : "rotate-180"}`} />
            </button>
            <ChatAvatar size="lg" />
            <div className="ml-3">
              <h1 className="text-xl font-semibold text-gray-900">Jaque</h1>
              <p className="text-sm text-gray-500">Assistente Virtual da Integrare</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleExportChat}
              className="flex items-center px-3 py-2 text-sm bg-white border border-gray-300 rounded-md hover:bg-gray-50 text-gray-700"
              disabled={messages.length === 0 || isExporting}
              title="Exportar conversa"
            >
              <Download size={16} className="mr-1" />
              <span className="hidden sm:inline">{isExporting ? "Exportando..." : "Exportar"}</span>
            </button>
            <button
              onClick={() => setShowClearConfirm(true)}
              className="flex items-center px-3 py-2 text-sm bg-white border border-gray-300 rounded-md hover:bg-gray-50 text-gray-700"
              disabled={messages.length === 0}
              title="Limpar conversa"
            >
              <Trash2 size={16} className="mr-1" />
              <span className="hidden sm:inline">Limpar</span>
            </button>
          </div>
        </div>

        {/* Mensagens */}
        <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
          {selectedDate && (
            <div className="sticky top-0 z-10 mb-4">
              <div className="bg-[#4b7bb5]/10 text-[#4b7bb5] px-4 py-2 rounded-md text-sm font-medium flex items-center justify-between">
                <span>
                  Mostrando mensagens de {format(new Date(selectedDate), "d 'de' MMMM, yyyy", { locale: ptBR })}
                </span>
                <button
                  onClick={() => setSelectedDate(null)}
                  className="text-[#4b7bb5] hover:text-[#3d649e] font-medium"
                >
                  Ver todas
                </button>
              </div>
            </div>
          )}

          {displayMessages.length === 0 ? (
            <div className="h-full flex items-center justify-center">
              <div className="text-center text-gray-500">
                <MessageSquare size={48} className="mx-auto mb-3 opacity-30" />
                <p className="text-lg">Nenhuma mensagem para exibir</p>
                <p className="text-sm mt-1">Comece uma conversa com a Jaque</p>
              </div>
            </div>
          ) : (
            displayMessages.map((message, index) => (
              <div
                key={index}
                className={`mb-4 ${message.role === "user" ? "flex justify-end" : "flex justify-start"}`}
              >
                {message.role === "assistant" && (
                  <div className="self-end mb-1 mr-2">
                    <ChatAvatar size="sm" />
                  </div>
                )}
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    message.role === "user" ? "bg-[#4b7bb5] text-white" : "bg-white border border-gray-200 shadow-sm"
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  <p className="text-xs mt-1 opacity-70">{format(message.timestamp, "HH:mm")}</p>
                </div>
              </div>
            ))
          )}

          {isLoading && (
            <div className="flex justify-start mb-4">
              <div className="self-end mb-1 mr-2">
                <ChatAvatar size="sm" />
              </div>
              <div className="max-w-[80%] rounded-lg p-3 bg-white border border-gray-200 shadow-sm">
                <div className="flex items-center">
                  <Loader2 className="h-4 w-4 animate-spin text-[#4b7bb5]" />
                  <span className="ml-2 text-sm text-gray-500">Digitando...</span>
                </div>
              </div>
            </div>
          )}

          {error && (
            <div className="flex justify-center mb-4">
              <div className="max-w-[90%] rounded-lg p-3 bg-red-50 border border-red-200 text-red-600 text-sm">
                {error}
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input de mensagem */}
        <div className="bg-white border-t border-gray-200 p-4">
          <form onSubmit={handleSubmit} className="flex items-center">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Digite sua mensagem para a Jaque..."
              className="flex-1 border border-gray-300 rounded-l-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#4b7bb5] focus:border-transparent"
              disabled={isLoading}
            />
            <button
              type="submit"
              className="bg-[#4b7bb5] text-white px-6 py-3 rounded-r-lg hover:bg-[#3d649e] disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              disabled={isLoading || !input.trim()}
            >
              <Send size={18} className="mr-2" />
              Enviar
            </button>
          </form>
        </div>
      </div>

      {/* Modal de confirmação para limpar chat */}
      {showClearConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Limpar conversa</h3>
            <p className="text-gray-600 mb-4">
              Tem certeza que deseja limpar todo o histórico de conversa? Esta ação não pode ser desfeita.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowClearConfirm(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  clearMessages()
                  setShowClearConfirm(false)
                  setSelectedDate(null)
                }}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Limpar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
