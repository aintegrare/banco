"use client"

import type React from "react"

import { useState } from "react"
import { X } from "lucide-react"

interface CreateProjectDialogProps {
  onClose: () => void
}

export function CreateProjectDialog({ onClose }: CreateProjectDialogProps) {
  const [projectName, setProjectName] = useState("")
  const [projectDescription, setProjectDescription] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!projectName.trim()) {
      setError("O nome do projeto é obrigatório")
      return
    }

    setIsSubmitting(true)
    setError(null)

    try {
      // Aqui faríamos a chamada à API para criar o projeto
      // Por enquanto, vamos simular
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Fechar o diálogo após sucesso
      onClose()

      // Recarregar a página para mostrar o novo projeto
      window.location.reload()
    } catch (err) {
      setError("Ocorreu um erro ao criar o projeto. Por favor, tente novamente.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center border-b border-gray-200 px-6 py-4">
          <h2 className="text-xl font-semibold text-gray-800">Novo Projeto</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="mb-4">
            <label htmlFor="project-name" className="block text-sm font-medium text-gray-700 mb-1">
              Nome do Projeto
            </label>
            <input
              type="text"
              id="project-name"
              value={projectName}
              onChange={(e) => {
                setProjectName(e.target.value)
                setError(null)
              }}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4b7bb5] focus:border-transparent"
              placeholder="Digite o nome do projeto"
              autoFocus
            />
          </div>

          <div className="mb-4">
            <label htmlFor="project-description" className="block text-sm font-medium text-gray-700 mb-1">
              Descrição (opcional)
            </label>
            <textarea
              id="project-description"
              value={projectDescription}
              onChange={(e) => setProjectDescription(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4b7bb5] focus:border-transparent"
              placeholder="Descreva o projeto brevemente"
              rows={3}
            />
          </div>

          {error && <p className="text-red-600 text-sm mb-4">{error}</p>}

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              disabled={isSubmitting}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-[#4b7bb5] text-white rounded-lg hover:bg-[#3d649e] transition-colors"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Criando..." : "Criar Projeto"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
