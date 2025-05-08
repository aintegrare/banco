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

interface RenameWarningDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  itemName: string
  isFolder: boolean
}

export function RenameWarningDialog({ isOpen, onClose, onConfirm, itemName, isFolder }: RenameWarningDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center text-amber-600">
            <AlertTriangle className="h-5 w-5 mr-2" />
            Atenção ao renomear {isFolder ? "pasta" : "arquivo"}
          </DialogTitle>
          <DialogDescription>
            {isFolder
              ? "Renomear uma pasta pode afetar links e referências a arquivos dentro dela. Tem certeza que deseja continuar?"
              : "Renomear este arquivo pode afetar links que apontam para ele. Tem certeza que deseja continuar?"}
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <p className="text-sm font-medium">
            Item: <span className="font-normal">{itemName}</span>
          </p>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button variant="default" onClick={onConfirm} className="bg-amber-600 hover:bg-amber-700">
            Sim, renomear
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
