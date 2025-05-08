"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { MessageSquare, X, Send, Loader2, ChevronDown, ChevronUp, Trash2 } from "lucide-react"
import { AnimatePresence, motion } from "framer-motion"
import { useChat } from "@/hooks/use-chat"
import { ChatAvatar } from "./chat-avatar"
import Link from "next/link"

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [input, setInput] = useState("")
  const [isMinimized, setIsMinimized] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { messages, isLoading, error, sendMessage, clearMessages } = useChat()

  // Adicionar mensagem de boas-vindas quando o chat é aberto pela primeira vez
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      sendMessage("Olá! Eu sou a Jaque, assistente virtual da Integrare. Como posso ajudar você hoje?")
    }
  }, [isOpen, messages.length, sendMessage])

  // Rolar para a mensagem mais recente
  useEffect(() => {
    if (messagesEndRef.current && isOpen && !isMinimized) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages, isOpen, isMinimized])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!input.trim() || isLoading) return

    await sendMessage(input.trim())
    setInput("")
  }

  const toggleChat = () => {
    setIsOpen(!isOpen)
    if (!isOpen) {
      setIsMinimized(false)
    }
  }

  const toggleMinimize = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsMinimized(!isMinimized)
  }

  const handleClearChat = (e: React.MouseEvent) => {
    e.stopPropagation()
    clearMessages()
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Chat button */}
      <button
        onClick={toggleChat}
        className="flex items-center justify-center w-14 h-14 rounded-full bg-[#4b7bb5] text-white shadow-lg hover:bg-[#3d649e] transition-colors"
        aria-label={isOpen ? "Fechar chat" : "Abrir chat"}
      >
        {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
      </button>

      {/* Chat window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute bottom-20 right-0 w-80 sm:w-96 bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden"
          >
            {/* Chat header */}
            <div className="bg-[#4b7bb5] text-white p-4 flex items-center justify-between">
              <div className="flex items-center">
                <ChatAvatar size="md" />
                <div className="ml-3">
                  <h3 className="font-medium">Jaque</h3>
                  <p className="text-xs opacity-80">Assistente Integrare</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Link
                  href="/admin/chat"
                  className="text-white/80 hover:text-white"
                  aria-label="Abrir chat completo"
                  title="Abrir chat completo"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                    <polyline points="15 3 21 3 21 9"></polyline>
                    <line x1="10" y1="14" x2="21" y2="3"></line>
                  </svg>
                </Link>
                <button
                  onClick={handleClearChat}
                  className="text-white/80 hover:text-white"
                  aria-label="Limpar conversa"
                  title="Limpar conversa"
                >
                  <Trash2 size={18} />
                </button>
                <button
                  onClick={toggleMinimize}
                  className="text-white/80 hover:text-white"
                  aria-label={isMinimized ? "Expandir chat" : "Minimizar chat"}
                >
                  {isMinimized ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </button>
              </div>
            </div>

            {/* Chat messages */}
            {!isMinimized && (
              <div className="h-80 overflow-y-auto p-4 bg-gray-50">
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`mb-4 ${message.role === "user" ? "flex justify-end" : "flex justify-start"}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg p-3 ${
                        message.role === "user" ? "bg-[#4b7bb5] text-white" : "bg-white border border-gray-200"
                      }`}
                    >
                      <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                      <p className="text-xs mt-1 opacity-70">
                        {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </p>
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start mb-4">
                    <div className="max-w-[80%] rounded-lg p-3 bg-white border border-gray-200">
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
            )}

            {/* Chat input */}
            {!isMinimized && (
              <form onSubmit={handleSubmit} className="border-t border-gray-200 p-3 flex">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Digite sua mensagem..."
                  className="flex-1 border border-gray-300 rounded-l-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#4b7bb5] focus:border-transparent"
                  disabled={isLoading}
                />
                <button
                  type="submit"
                  className="bg-[#4b7bb5] text-white px-4 rounded-r-md hover:bg-[#3d649e] disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isLoading || !input.trim()}
                >
                  <Send size={18} />
                </button>
              </form>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
