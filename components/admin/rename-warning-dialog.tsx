"use client"

import { useState } from "react"
import { AlertTriangle, X, Info } from "lucide-react"

interface RenameWarningDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  itemName: string
  isFolder: boolean
}

export function RenameWarningDialog({ isOpen, onClose, onConfirm, itemName, isFolder }: RenameWarningDialogProps) {
  const [isChecked, setIsChecked] = useState(false)

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fadeIn">
      <div className="bg-white rounded-lg max-w-md w-full overflow-hidden shadow-xl">
        <div className="p-4 bg-amber-50 border-b border-amber-100 flex items-start">
          <AlertTriangle className="h-6 w-6 text-amber-500 mr-3 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <h3 className="font-medium text-amber-800">Atenção ao renomear {isFolder ? "pasta" : "arquivo"}</h3>
            <p className="text-amber-700 text-sm mt-1">
              Você está prestes a renomear {isFolder ? "a pasta" : "o arquivo"} <strong>{itemName}</strong>
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 focus:outline-none"
            aria-label="Fechar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-5">
          {isFolder ? (
            <div className="space-y-4">
              <p className="text-gray-700">
                Renomear pastas é uma operação delicada que envolve copiar todos os arquivos para uma nova pasta e
                depois excluir a pasta original.
              </p>
              <div className="bg-blue-50 p-3 rounded-md border border-blue-100 flex">
                <Info className="h-5 w-5 text-blue-500 mr-2 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-blue-700">
                  <p className="font-medium">Recomendações:</p>
                  <ul className="list-disc pl-5 mt-1 space-y-1">
                    <li>Não feche a janela durante o processo</li>
                    <li>Evite renomear pastas com muitos arquivos</li>
                    <li>Considere fazer backup antes de renomear pastas importantes</li>
                  </ul>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-gray-700">
              Renomear arquivos é uma operação que cria uma cópia com o novo nome e depois exclui o arquivo original.
            </p>
          )}

          <div className="mt-5">
            <label className="flex items-start cursor-pointer">
              <input
                type="checkbox"
                checked={isChecked}
                onChange={(e) => setIsChecked(e.target.checked)}
                className="mt-1 h-4 w-4 text-[#4b7bb5] focus:ring-[#4b7bb5] border-gray-300 rounded"
              />
              <span className="ml-2 text-sm text-gray-700">
                Entendo os riscos e confirmo que desejo prosseguir com a renomeação
              </span>
            </label>
          </div>
        </div>

        <div className="p-4 bg-gray-50 flex justify-end space-x-3 border-t">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            disabled={!isChecked}
            className="px-4 py-2 bg-[#4b7bb5] border border-transparent rounded-md text-sm font-medium text-white hover:bg-[#3d649e] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#4b7bb5] disabled:opacity-50"
          >
            Confirmar renomeação
          </button>
        </div>
      </div>
    </div>
  )
}
