"use client"

import { AlertTriangle } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

interface DeleteConfirmationDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  itemName: string
  isFolder: boolean
}

export function DeleteConfirmationDialog({
  isOpen,
  onClose,
  onConfirm,
  itemName,
  isFolder,
}: DeleteConfirmationDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center text-red-600">
            <AlertTriangle className="h-5 w-5 mr-2" />
            Confirmar exclusão
          </DialogTitle>
          <DialogDescription>
            Esta ação não pode ser desfeita.{" "}
            {isFolder ? "Todos os arquivos dentro desta pasta também serão excluídos." : ""}
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <p className="text-sm text-gray-700">
            Você tem certeza que deseja excluir{" "}
            <span className="font-medium">
              {isFolder ? "a pasta" : "o arquivo"} "{itemName}"
            </span>
            ?
          </p>
          {isFolder && (
            <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-md">
              <p className="text-sm text-amber-800 flex items-start">
                <AlertTriangle className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
                <span>
                  <strong>Atenção:</strong> Excluir uma pasta irá remover permanentemente todos os arquivos e subpastas
                  contidos nela.
                </span>
              </p>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button variant="destructive" onClick={onConfirm}>
            {isFolder ? "Excluir pasta" : "Excluir arquivo"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
