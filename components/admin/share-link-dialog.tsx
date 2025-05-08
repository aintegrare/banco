"use client"

import { useState } from "react"
import { Copy, Check, X, Link, Share2 } from "lucide-react"

interface ShareLinkDialogProps {
  isOpen: boolean
  onClose: () => void
  fileUrl: string
  fileName: string
}

export function ShareLinkDialog({ isOpen, onClose, fileUrl, fileName }: ShareLinkDialogProps) {
  const [copied, setCopied] = useState(false)

  if (!isOpen) return null

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(fileUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Falha ao copiar texto: ", err)
    }
  }

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fadeIn"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div
        className="bg-white rounded-lg max-w-md w-full overflow-hidden shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 border-b flex justify-between items-center">
          <h3 className="font-medium flex items-center">
            <Share2 className="h-4 w-4 mr-2 text-[#4b7bb5]" />
            Compartilhar arquivo
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="p-4">
          <p className="text-sm text-gray-600 mb-3">
            Compartilhe <span className="font-medium">{fileName}</span> usando o link abaixo:
          </p>
          <div className="flex items-center">
            <div className="flex-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Link className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                value={fileUrl}
                readOnly
                className="block w-full pl-10 pr-12 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#4b7bb5] focus:border-[#4b7bb5] bg-gray-50 text-sm"
              />
              <button
                onClick={handleCopy}
                className={`absolute inset-y-0 right-0 pr-3 flex items-center ${
                  copied ? "text-green-500" : "text-gray-400 hover:text-[#4b7bb5]"
                }`}
                title={copied ? "Copiado!" : "Copiar link"}
              >
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </button>
            </div>
          </div>
        </div>
        <div className="p-4 bg-gray-50 flex justify-between items-center">
          <p className="text-xs text-gray-500">O link é público e pode ser acessado por qualquer pessoa.</p>
          <button
            onClick={handleCopy}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              copied
                ? "bg-green-100 text-green-800 border border-green-200"
                : "bg-[#4b7bb5] text-white hover:bg-[#3d649e]"
            }`}
          >
            {copied ? (
              <>
                <Check className="h-4 w-4 mr-1.5 inline" />
                Copiado!
              </>
            ) : (
              <>
                <Copy className="h-4 w-4 mr-1.5 inline" />
                Copiar link
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
