"use client"

import { useState, useEffect } from "react"
import { WifiOff } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

export function OfflineIndicator() {
  const [isOffline, setIsOffline] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    // Verificar o estado inicial da conexão
    setIsOffline(!navigator.onLine)

    // Configurar os event listeners
    const handleOffline = () => {
      setIsOffline(true)
      toast({
        title: "Você está offline",
        description:
          "Trabalhando no modo offline. Suas alterações serão sincronizadas quando a conexão for restaurada.",
        duration: 5000,
      })
    }

    const handleOnline = () => {
      setIsOffline(false)
      toast({
        title: "Conexão restaurada",
        description: "Suas alterações estão sendo sincronizadas...",
        duration: 3000,
      })
    }

    window.addEventListener("offline", handleOffline)
    window.addEventListener("online", handleOnline)

    return () => {
      window.removeEventListener("offline", handleOffline)
      window.removeEventListener("online", handleOnline)
    }
  }, [toast])

  if (!isOffline) return null

  return (
    <div className="fixed bottom-4 right-4 z-50 bg-amber-100 text-amber-800 px-4 py-2 rounded-lg shadow-md flex items-center gap-2 border border-amber-200">
      <WifiOff size={16} />
      <span className="font-medium">Modo Offline</span>
    </div>
  )
}
