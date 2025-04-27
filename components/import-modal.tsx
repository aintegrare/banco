"use client"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ImportContacts } from "@/components/import-contacts"

interface ImportModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

export function ImportModal({ open, onOpenChange, onSuccess }: ImportModalProps) {
  const handleSuccess = () => {
    if (onSuccess) {
      onSuccess()
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-primary-700">Importar Contatos</DialogTitle>
          <DialogDescription>Importe seus contatos a partir de arquivos CSV ou XLSX.</DialogDescription>
        </DialogHeader>
        <ImportContacts
          onSuccess={() => {
            handleSuccess()
            // Fechar o modal após um breve atraso para mostrar a mensagem de sucesso
            setTimeout(() => onOpenChange(false), 2000)
          }}
        />
      </DialogContent>
    </Dialog>
  )
}
