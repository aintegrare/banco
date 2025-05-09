"use client"

import { useState } from "react"
import { FolderTasks } from "./folder-tasks"
import { Button } from "@/components/ui/button"
import { X, FolderOpen } from "lucide-react"

interface FolderTasksPanelProps {
  folderPath: string
  onClose: () => void
}

export function FolderTasksPanel({ folderPath, onClose }: FolderTasksPanelProps) {
  const [taskCount, setTaskCount] = useState<number>(0)

  // Extrair o nome da pasta do caminho completo
  const folderName = folderPath.split("/").filter(Boolean).pop() || folderPath

  return (
    <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden max-w-2xl w-full">
      <div className="p-3 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
        <h3 className="font-medium text-[#4072b0] flex items-center">
          <FolderOpen className="h-5 w-5 mr-2 text-[#4b7bb5]" />
          <span>
            Tarefas da Pasta: <span className="text-gray-700">{folderName}</span>
          </span>
        </h3>
        <Button variant="ghost" size="sm" onClick={onClose} className="h-8 w-8 p-0">
          <X className="h-4 w-4" />
        </Button>
      </div>
      <div className="p-4">
        <FolderTasks folderPath={folderPath} onTaskCountChange={setTaskCount} />
      </div>
    </div>
  )
}
