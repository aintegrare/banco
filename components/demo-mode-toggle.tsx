"use client"

import { useState } from "react"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { useDemoMode } from "@/lib/demo-mode"
import { useToast } from "@/components/ui/use-toast"
import { AlertCircle } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

export function DemoModeToggle() {
  const { demoMode, toggleDemoMode } = useDemoMode()
  const { toast } = useToast()
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [pendingAction, setPendingAction] = useState<"enable" | "disable" | null>(null)

  const handleToggle = () => {
    if (demoMode) {
      // Confirmar antes de desativar
      setPendingAction("disable")
      setShowConfirmDialog(true)
    } else {
      // Confirmar antes de ativar
      setPendingAction("enable")
      setShowConfirmDialog(true)
    }
  }

  const confirmAction = () => {
    toggleDemoMode()

    toast({
      title: demoMode ? "Modo de demonstração desativado" : "Modo de demonstração ativado",
      description: demoMode
        ? "Os dados de demonstração foram removidos."
        : "Dados de demonstração foram carregados. Estes dados são apenas para fins de demonstração.",
      duration: 5000,
    })

    setShowConfirmDialog(false)
    setPendingAction(null)
  }

  return (
    <>
      <div className="flex items-center space-x-2">
        <Switch id="demo-mode" checked={demoMode} onCheckedChange={handleToggle} />
        <Label htmlFor="demo-mode" className="cursor-pointer">
          Modo de Demonstração
        </Label>
        {demoMode && <span className="text-xs bg-amber-100 text-amber-800 px-2 py-1 rounded-full">Ativo</span>}
      </div>

      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-amber-500" />
              {pendingAction === "enable" ? "Ativar modo de demonstração?" : "Desativar modo de demonstração?"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {pendingAction === "enable"
                ? "Isso carregará dados fictícios para demonstração. Estes dados são apenas para fins de visualização e teste."
                : "Isso removerá todos os dados de demonstração. Você tem certeza que deseja continuar?"}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmAction}>
              {pendingAction === "enable" ? "Ativar" : "Desativar"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
