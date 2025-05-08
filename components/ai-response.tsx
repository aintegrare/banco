"use client"

import { useState } from "react"
import { Copy, Check } from "lucide-react"

export function AIResponse({ response }: { response: string }) {
  const [copied, setCopied] = useState(false)

  if (!response) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Nenhuma resposta disponível.</p>
      </div>
    )
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(response)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // Função para formatar o texto com quebras de linha e links
  const formatText = (text: string) => {
    // Dividir por quebras de linha
    const paragraphs = text.split("\n\n")

    return paragraphs.map((paragraph, index) => {
      // Verificar se é uma lista
      if (paragraph.trim().startsWith("- ") || paragraph.trim().startsWith("* ")) {
        const listItems = paragraph.split("\n")
        return (
          <ul key={index} className="list-disc pl-5 my-3">
            {listItems.map((item, itemIndex) => (
              <li key={itemIndex} className="mb-1">
                {item.replace(/^[-*]\s/, "")}
              </li>
            ))}
          </ul>
        )
      }

      // Verificar se é um título
      if (paragraph.startsWith("# ")) {
        return (
          <h2 key={index} className="text-xl font-bold my-4 text-[#4b7bb5]">
            {paragraph.replace(/^#\s/, "")}
          </h2>
        )
      }

      if (paragraph.startsWith("## ")) {
        return (
          <h3 key={index} className="text-lg font-bold my-3 text-[#4b7bb5]">
            {paragraph.replace(/^##\s/, "")}
          </h3>
        )
      }

      // Parágrafo normal
      return (
        <p key={index} className="my-3">
          {paragraph}
        </p>
      )
    })
  }

  return (
    <div className="relative">
      <div className="prose prose-blue max-w-none">{formatText(response)}</div>

      <button
        onClick={copyToClipboard}
        className="absolute top-0 right-0 p-2 text-gray-500 hover:text-[#4b7bb5] transition-colors"
        title="Copiar resposta"
      >
        {copied ? <Check className="h-5 w-5 text-green-500" /> : <Copy className="h-5 w-5" />}
      </button>
    </div>
  )
}
