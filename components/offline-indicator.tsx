"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Wifi, WifiOff, RefreshCw } from "lucide-react"
import { useOfflineSync } from "@/lib/offline-sync"

interface OfflineIndicatorProps {
  variant?: "badge" | "button" | "icon"
  showCount?: boolean
  pendingChanges?: number
  onManualSync?: () => Promise<boolean>
  className?: string
}

export function OfflineIndicator({
  variant = "badge",
  showCount = true,
  pendingChanges,
  onManualSync,
  className = "",
}: OfflineIndicatorProps) {
  const { isOnline, pendingCount, isSyncing, synchronize } = useOfflineSync()
  const [syncing, setSyncing] = useState(false)

  // Usar pendingChanges do prop se fornecido, caso contrário usar do hook
  const pendingItems = pendingChanges !== undefined ? pendingChanges : pendingCount

  useEffect(() => {
    setSyncing(isSyncing)
  }, [isSyncing])

  // Função para sincronização manual
  const handleSync = async () => {
    if (syncing) return

    setSyncing(true)

    try {
      if (onManualSync) {
        await onManualSync()
      } else {
        await synchronize()
      }
    } finally {
      setSyncing(false)
    }
  }

  // Renderizar com base na variante
  const renderIndicator = () => {
    switch (variant) {
      case "badge":
        return (
          <div className={`flex items-center gap-1 ${className}`}>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Badge
                    className={`${
                      isOnline
                        ? "bg-green-100 text-green-800 hover:bg-green-200"
                        : "bg-red-100 text-red-800 hover:bg-red-200"
                    }`}
                  >
                    {isOnline ? <Wifi className="h-3 w-3 mr-1" /> : <WifiOff className="h-3 w-3 mr-1" />}
                    {isOnline ? "Online" : "Offline"}
                  </Badge>
                </TooltipTrigger>
                <TooltipContent>{isOnline ? "Conectado ao servidor" : "Trabalhando no modo offline"}</TooltipContent>
              </Tooltip>
            </TooltipProvider>

            {showCount && pendingItems > 0 && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Badge
                      className={`cursor-pointer bg-amber-100 text-amber-800 hover:bg-amber-200`}
                      onClick={handleSync}
                    >
                      {syncing ? (
                        <RefreshCw className="h-3 w-3 mr-1 animate-spin" />
                      ) : (
                        <RefreshCw className="h-3 w-3 mr-1" />
                      )}
                      {pendingItems}
                    </Badge>
                  </TooltipTrigger>
                  <TooltipContent>
                    {syncing
                      ? "Sincronizando alterações..."
                      : `${pendingItems} alteração(ões) pendente(s). Clique para sincronizar.`}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
        )

      case "button":
        return (
          <div className={`flex items-center gap-2 ${className}`}>
            <Button
              variant={isOnline ? "outline" : "destructive"}
              size="sm"
              className={isOnline ? "bg-green-50" : ""}
              disabled={true}
            >
              {isOnline ? <Wifi className="h-4 w-4 mr-2" /> : <WifiOff className="h-4 w-4 mr-2" />}
              {isOnline ? "Online" : "Offline"}
            </Button>

            {showCount && pendingItems > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleSync}
                disabled={syncing || !isOnline}
                className="bg-amber-50"
              >
                {syncing ? <RefreshCw className="h-4 w-4 mr-2 animate-spin" /> : <RefreshCw className="h-4 w-4 mr-2" />}
                Sincronizar ({pendingItems})
              </Button>
            )}
          </div>
        )

      case "icon":
        return (
          <div className={`flex items-center gap-1 ${className}`}>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className={`h-8 w-8 ${!isOnline ? "text-red-500 hover:text-red-600 hover:bg-red-50" : ""}`}
                    disabled={true}
                  >
                    {isOnline ? <Wifi className="h-4 w-4" /> : <WifiOff className="h-4 w-4" />}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>{isOnline ? "Conectado ao servidor" : "Trabalhando no modo offline"}</TooltipContent>
              </Tooltip>
            </TooltipProvider>

            {showCount && pendingItems > 0 && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 relative"
                      onClick={handleSync}
                      disabled={syncing || !isOnline}
                    >
                      <RefreshCw className={`h-4 w-4 ${syncing ? "animate-spin" : ""}`} />
                      <span className="absolute top-0 right-0 h-4 w-4 rounded-full bg-amber-500 text-[10px] text-white flex items-center justify-center">
                        {pendingItems > 9 ? "9+" : pendingItems}
                      </span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    {syncing
                      ? "Sincronizando alterações..."
                      : `${pendingItems} alteração(ões) pendente(s). Clique para sincronizar.`}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
        )
    }
  }

  return renderIndicator()
}
