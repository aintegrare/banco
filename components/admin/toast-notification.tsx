"use client"

import { useState, useEffect } from "react"
import { X, CheckCircle, AlertCircle, Info, Loader2 } from "lucide-react"

export type NotificationType = "success" | "error" | "info" | "warning" | "loading"

interface ToastNotificationProps {
  message: string
  type: NotificationType
  onClose: () => void
  duration?: number
  details?: string | null
  actionLabel?: string
  onAction?: () => void
}

export function ToastNotification({
  message,
  type,
  onClose,
  duration = 5000,
  details = null,
  actionLabel,
  onAction,
}: ToastNotificationProps) {
  const [isVisible, setIsVisible] = useState(true)
  const [showDetails, setShowDetails] = useState(false)

  useEffect(() => {
    // Não configurar timer para notificações de carregamento ou se a duração for 0
    if (type === "loading" || duration === 0) return

    const timer = setTimeout(() => {
      setIsVisible(false)
      setTimeout(onClose, 300) // Aguardar a animação de saída
    }, duration)

    return () => clearTimeout(timer)
  }, [duration, onClose, type])

  const getBackgroundColor = () => {
    switch (type) {
      case "success":
        return "bg-green-50 border border-green-200"
      case "error":
        return "bg-red-50 border border-red-200"
      case "warning":
        return "bg-amber-50 border border-amber-200"
      case "loading":
        return "bg-blue-50 border border-blue-200"
      default:
        return "bg-blue-50 border border-blue-200"
    }
  }

  const getIcon = () => {
    switch (type) {
      case "success":
        return <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
      case "error":
        return <AlertCircle className="h-5 w-5 text-red-500 mr-3 flex-shrink-0" />
      case "warning":
        return <AlertCircle className="h-5 w-5 text-amber-500 mr-3 flex-shrink-0" />
      case "loading":
        return <Loader2 className="h-5 w-5 text-blue-500 mr-3 flex-shrink-0 animate-spin" />
      default:
        return <Info className="h-5 w-5 text-blue-500 mr-3 flex-shrink-0" />
    }
  }

  return (
    <div
      className={`fixed bottom-4 right-4 z-50 transition-all duration-300 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
      } ${getBackgroundColor()} shadow-lg rounded-lg max-w-md`}
    >
      <div className="p-4">
        <div className="flex items-start">
          {getIcon()}
          <div className="flex-1">
            <div className="text-sm font-medium">{message}</div>

            {details && (
              <div className="mt-1">
                <button
                  onClick={() => setShowDetails(!showDetails)}
                  className="text-xs underline hover:text-opacity-80"
                >
                  {showDetails ? "Ocultar detalhes" : "Mostrar detalhes"}
                </button>

                {showDetails && (
                  <div className="mt-2 text-xs p-2 bg-white bg-opacity-50 rounded border border-current border-opacity-20 whitespace-pre-wrap">
                    {details}
                  </div>
                )}
              </div>
            )}

            {actionLabel && onAction && (
              <button
                onClick={onAction}
                className="mt-2 text-xs px-3 py-1 rounded bg-white hover:bg-opacity-80 transition-colors"
              >
                {actionLabel}
              </button>
            )}
          </div>

          <button
            onClick={() => {
              setIsVisible(false)
              setTimeout(onClose, 300)
            }}
            className="ml-3 -my-1 p-1.5 rounded-lg hover:bg-white hover:bg-opacity-20 focus:outline-none"
            aria-label="Fechar"
          >
            <X className="h-4 w-4 text-gray-500" />
          </button>
        </div>
      </div>
    </div>
  )
}
