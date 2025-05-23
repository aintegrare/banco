"use client"

import { useState, useEffect } from "react"
import { CompleteKanbanSystem } from "@/components/tasks/complete-kanban-system"

export default function NewTasksPage() {
  const [selectedProjectId, setSelectedProjectId] = useState<number | undefined>()
  const [projects, setProjects] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const loadProjects = async () => {
    try {
      const response = await fetch("/api/projects")
      const result = await response.json()

      if (result.success && Array.isArray(result.data)) {
        setProjects(result.data)
      } else {
        setProjects([])
      }
    } catch (error) {
      console.error("❌ Erro ao carregar projetos:", error)
      setProjects([])
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadProjects()
  }, [])

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">📋 Sistema de Tarefas (Novo)</h1>

        {/* Filtro por projeto */}
        <div className="flex items-center gap-4 mb-4">
          <label className="text-sm font-medium text-gray-700">Projeto:</label>
          <select
            value={selectedProjectId || ""}
            onChange={(e) => setSelectedProjectId(e.target.value ? Number.parseInt(e.target.value) : undefined)}
            className="px-3 py-2 border border-gray-300 rounded-md"
            disabled={isLoading}
          >
            <option value="">Todos os projetos</option>
            {projects.map((project) => (
              <option key={project.id} value={project.id}>
                {project.name}
              </option>
            ))}
          </select>

          {selectedProjectId && (
            <button onClick={() => setSelectedProjectId(undefined)} className="text-sm text-red-500 hover:text-red-700">
              ❌ Limpar
            </button>
          )}
        </div>
      </div>

      {/* Sistema Kanban Completo */}
      <CompleteKanbanSystem projectId={selectedProjectId} />
    </div>
  )
}
