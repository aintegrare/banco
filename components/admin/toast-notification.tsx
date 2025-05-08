"use client"

import { useState, useEffect } from "react"
import { X, CheckCircle, AlertCircle } from "lucide-react"

interface ToastNotificationProps {
  message: string
  type: "success" | "error"
  onClose: () => void
  duration?: number
}

export function ToastNotification({ message, type, onClose, duration = 3000 }: ToastNotificationProps) {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false)
      setTimeout(onClose, 300) // Aguardar a animação de saída
    }, duration)

    return () => clearTimeout(timer)
  }, [duration, onClose])

  return (
    <div
      className={`fixed bottom-4 right-4 z-50 flex items-center p-4 rounded-lg shadow-lg transition-all duration-300 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
      } ${type === "success" ? "bg-green-50 border border-green-200" : "bg-red-50 border border-red-200"}`}
    >
      {type === "success" ? (
        <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
      ) : (
        <AlertCircle className="h-5 w-5 text-red-500 mr-3 flex-shrink-0" />
      )}
      <div className="text-sm font-medium mr-3">{message}</div>
      <button
        onClick={() => {
          setIsVisible(false)
          setTimeout(onClose, 300)
        }}
        className="ml-auto -mx-1.5 -my-1.5 p-1.5 rounded-lg hover:bg-gray-100 focus:outline-none"
      >
        <X className="h-4 w-4 text-gray-400" />
      </button>
    </div>
  )
}
