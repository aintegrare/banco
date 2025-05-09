"use client"

import { ClipboardList, AlertCircle } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface FolderTaskBadgeProps {
  count: number
  overdueCount?: number
  onClick?: () => void
}

export function FolderTaskBadge({ count, overdueCount = 0, onClick }: FolderTaskBadgeProps) {
  if (count <= 0) return null

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            onClick={(e) => {
              e.stopPropagation() // Impedir propagação para evitar navegação para a pasta
              if (onClick) onClick()
            }}
            className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${
              overdueCount > 0 ? "bg-red-500 text-white" : "bg-[#4b7bb5] text-white"
            } ml-2 shadow-sm hover:bg-[#3d649e] transition-colors cursor-pointer`}
          >
            {overdueCount > 0 ? (
              <AlertCircle className="h-3.5 w-3.5 mr-1" />
            ) : (
              <ClipboardList className="h-3.5 w-3.5 mr-1" />
            )}
            {count}
          </button>
        </TooltipTrigger>
        <TooltipContent>
          <div className="text-sm">
            <p>
              {count} tarefa{count !== 1 ? "s" : ""} pendente{count !== 1 ? "s" : ""}
            </p>
            {overdueCount > 0 && (
              <p className="text-red-500 font-semibold mt-1">
                {overdueCount} tarefa{overdueCount !== 1 ? "s" : ""} vencida{overdueCount !== 1 ? "s" : ""}
              </p>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
