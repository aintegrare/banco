"use client"

import { useState, useEffect } from "react"
import { X } from "lucide-react"

interface ToastProps {
  message: string
  type?: "success" | "error" | "info"
  duration?: number
  onClose?: () => void
}

export function Toast({ message, type = "success", duration = 3000, onClose }: ToastProps) {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false)
      if (onClose) onClose()
    }, duration)

    return () => clearTimeout(timer)
  }, [duration, onClose])

  if (!isVisible) return null

  const bgColor =
    type === "success"
      ? "bg-green-50 border-green-200 text-green-800"
      : type === "error"
        ? "bg-red-50 border-red-200 text-red-800"
        : "bg-blue-50 border-blue-200 text-blue-800"

  const iconColor = type === "success" ? "text-green-500" : type === "error" ? "text-red-500" : "text-blue-500"

  return (
    <div
      className={`fixed bottom-4 right-4 z-50 flex items-center p-4 rounded-lg shadow-lg border ${bgColor} animate-slideInUp max-w-md`}
      role="alert"
    >
      <div className="flex-1 mr-2">{message}</div>
      <button
        onClick={() => {
          setIsVisible(false)
          if (onClose) onClose()
        }}
        className="p-1 rounded-full hover:bg-white/20"
        aria-label="Fechar"
      >
        <X className={`h-4 w-4 ${iconColor}`} />
      </button>
    </div>
  )
}

export function useToast() {
  const [toast, setToast] = useState<{
    visible: boolean
    message: string
    type: "success" | "error" | "info"
  } | null>(null)

  const showToast = (message: string, type: "success" | "error" | "info" = "success") => {
    setToast({ visible: true, message, type })
  }

  const hideToast = () => {
    setToast(null)
  }

  return {
    toast,
    showToast,
    hideToast,
  }
}
