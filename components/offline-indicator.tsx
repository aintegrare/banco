"use client"

import { useEffect, useState } from "react"
import { Wifi, WifiOff } from "lucide-react"
import { useOfflineSync } from "@/lib/offline-sync"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface OfflineIndicatorProps {
  className?: string
  showPendingChanges?: boolean
}

export function OfflineIndicator({ className = "", showPendingChanges = true }: OfflineIndicatorProps) {
  const { isOnline, pendingChanges, isSyncing, sync } = useOfflineSync()
  const [showTooltip, setShowTooltip] = useState(false)

  // Mostrar tooltip por 3 segundos quando o status de conexão mudar
  useEffect(() => {
    setShowTooltip(true)
    const timer = setTimeout(() => setShowTooltip(false), 3000)
    return () => clearTimeout(timer)
  }, [isOnline])

  return (
    <TooltipProvider>
      <Tooltip open={showTooltip} onOpenChange={setShowTooltip}>
        <TooltipTrigger asChild>
          <div
            className={`flex items-center gap-2 cursor-pointer ${className}`}
            onClick={() => (isOnline && pendingChanges > 0 ? sync() : null)}
          >
            {isOnline ? <Wifi className="h-4 w-4 text-green-500" /> : <WifiOff className="h-4 w-4 text-red-500" />}

            {showPendingChanges && pendingChanges > 0 && (
              <Badge variant="outline" className="text-xs py-0 h-5">
                {isSyncing ? "Sincronizando..." : `${pendingChanges} pendente${pendingChanges !== 1 ? "s" : ""}`}
              </Badge>
            )}
          </div>
        </TooltipTrigger>
        <TooltipContent side="bottom">
          {isOnline
            ? pendingChanges > 0
              ? "Online - Clique para sincronizar alterações pendentes"
              : "Online - Todas as alterações estão sincronizadas"
            : "Offline - As alterações serão sincronizadas quando a conexão for restaurada"}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
