"use client"

import type React from "react"

import { useState } from "react"
import { X, FolderPlus } from "lucide-react"

interface CreateFolderDialogProps {
  onClose: () => void
  onCreateFolder: (folderName: string) => void
}

export function CreateFolderDialog({ onClose, onCreateFolder }: CreateFolderDialogProps) {
  const [folderName, setFolderName] = useState("")
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Validar nome da pasta
    if (!folderName.trim()) {
      setError("O nome da pasta não pode estar vazio")
      return
    }

    // Verificar caracteres inválidos
    if (/[<>:"/\\|?*]/.test(folderName)) {
      setError('O nome da pasta contém caracteres inválidos (< > : " / \\ | ? *)')
      return
    }

    onCreateFolder(folderName.trim())
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center border-b border-gray-200 px-6 py-4">
          <h2 className="text-xl font-semibold text-gray-800">Nova Pasta</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="mb-4">
            <label htmlFor="folder-name" className="block text-sm font-medium text-gray-700 mb-1">
              Nome da pasta
            </label>
            <input
              type="text"
              id="folder-name"
              value={folderName}
              onChange={(e) => {
                setFolderName(e.target.value)
                setError(null)
              }}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4b7bb5] focus:border-transparent"
              placeholder="Nova pasta"
              autoFocus
            />
            {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-[#4b7bb5] text-white rounded-lg hover:bg-[#3d649e] transition-colors flex items-center"
            >
              <FolderPlus size={18} className="mr-2" />
              <span>Criar</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
