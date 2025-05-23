"use client"

import { useState } from "react"
import { useSimpleTasks } from "@/hooks/use-simple-tasks"

export function KanbanDebug({ projectId }: { projectId?: number }) {
  const [isVisible, setIsVisible] = useState(false)
  const { tasks, isLoading, error, tasksByStatus } = useSimpleTasks(projectId)

  if (!isVisible) {
    return (
      <button
        onClick={() => setIsVisible(true)}
        className="fixed bottom-4 left-4 bg-green-600 text-white px-3 py-2 rounded shadow z-50 text-sm"
      >
        🐛 Debug Kanban
      </button>
    )
  }

  const organized = tasksByStatus()

  return (
    <div className="fixed bottom-4 left-4 bg-white border-2 border-green-500 rounded-lg p-4 max-w-sm max-h-96 overflow-auto shadow-lg z-50">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-green-600">🐛 Kanban Debug</h3>
        <button onClick={() => setIsVisible(false)} className="text-gray-500 hover:text-gray-700">
          ✕
        </button>
      </div>

      <div className="space-y-3 text-sm">
        <div>
          <strong>Estado:</strong>
          <ul className="text-xs list-disc list-inside">
            <li>Loading: {isLoading ? "Sim" : "Não"}</li>
            <li>Error: {error || "Nenhum"}</li>
            <li>Total: {tasks.length}</li>
            <li>Projeto: {projectId || "Todos"}</li>
          </ul>
        </div>

        <div>
          <strong>Por Status:</strong>
          <ul className="text-xs space-y-1">
            {Object.entries(organized).map(([status, statusTasks]) => (
              <li key={status}>
                {status}: {statusTasks.length}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <strong>Primeiras 3 Tarefas:</strong>
          <ul className="text-xs space-y-1">
            {tasks.slice(0, 3).map((task) => (
              <li key={task.id} className="font-mono">
                #{task.id}: {task.title.substring(0, 20)}...
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
