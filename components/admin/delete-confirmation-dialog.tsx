"use client"

import { AlertTriangle, Folder, FileIcon } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
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
          <div className="flex items-center p-4 bg-red-50 rounded-md border border-red-100">
            <div className="mr-3 bg-white p-2 rounded-full">
              {isFolder ? (
                <Folder className="h-6 w-6 text-[#4b7bb5]" />
              ) : (
                <FileIcon className="h-6 w-6 text-gray-500" />
              )}
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">{itemName}</p>
              <p className="text-sm text-gray-500">{isFolder ? "Pasta e todo seu conteúdo" : "Arquivo"}</p>
            </div>
          </div>
          {isFolder && (
            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-100 rounded-md text-sm text-yellow-800">
              <p className="font-medium">Atenção!</p>
              <p>
                Você está prestes a excluir uma pasta. Esta ação excluirá permanentemente todos os arquivos e subpastas
                contidos nela.
              </p>
            </div>
          )}
        </div>
        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button variant="destructive" onClick={onConfirm} className="bg-red-600 hover:bg-red-700">
            {isFolder ? "Excluir pasta e todo conteúdo" : "Excluir arquivo"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
