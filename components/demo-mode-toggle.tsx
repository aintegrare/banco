"use client"

import { useState } from "react"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Beaker, Settings } from "lucide-react"
import { useDemoMode, type DemoModeConfig } from "@/lib/demo-mode"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"

interface DemoModeToggleProps {
  variant?: "switch" | "button" | "badge"
  showSettings?: boolean
  className?: string
}

export function DemoModeToggle({ variant = "switch", showSettings = true, className = "" }: DemoModeToggleProps) {
  const { isEnabled, enable, disable } = useDemoMode()
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  // Configurações do modo de demonstração
  const [config, setConfig] = useState<Partial<DemoModeConfig>>({
    restrictions: {
      allowEditing: true,
      allowDeleting: false,
      allowCreating: true,
      allowExporting: true,
      maxItems: 10,
    },
  })

  // Alternar modo de demonstração
  const toggleDemoMode = (enabled: boolean) => {
    if (enabled) {
      enable(config)
    } else {
      disable()
    }
  }

  // Atualizar configuração
  const updateConfig = (key: string, value: any) => {
    setConfig((prev) => ({
      ...prev,
      restrictions: {
        ...prev.restrictions,
        [key]: value,
      },
    }))
  }

  // Renderizar com base na variante
  const renderToggle = () => {
    switch (variant) {
      case "switch":
        return (
          <div className={`flex items-center space-x-2 ${className}`}>
            <Switch id="demo-mode" checked={isEnabled} onCheckedChange={toggleDemoMode} />
            <Label htmlFor="demo-mode" className="cursor-pointer">
              Modo de Demonstração
            </Label>

            {showSettings && isEnabled && (
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setIsDialogOpen(true)}>
                <Settings className="h-4 w-4" />
              </Button>
            )}
          </div>
        )

      case "button":
        return (
          <div className={`flex items-center space-x-2 ${className}`}>
            <Button
              variant={isEnabled ? "default" : "outline"}
              size="sm"
              onClick={() => toggleDemoMode(!isEnabled)}
              className={isEnabled ? "bg-amber-600 hover:bg-amber-700" : ""}
            >
              <Beaker className="h-4 w-4 mr-2" />
              {isEnabled ? "Desativar Modo Demo" : "Ativar Modo Demo"}
            </Button>

            {showSettings && isEnabled && (
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setIsDialogOpen(true)}>
                <Settings className="h-4 w-4" />
              </Button>
            )}
          </div>
        )

      case "badge":
        return (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Badge
                  className={`cursor-pointer ${isEnabled ? "bg-amber-100 text-amber-800 hover:bg-amber-200" : "bg-gray-100 text-gray-800 hover:bg-gray-200"} ${className}`}
                  onClick={() => toggleDemoMode(!isEnabled)}
                >
                  <Beaker className="h-3 w-3 mr-1" />
                  Demo
                </Badge>
              </TooltipTrigger>
              <TooltipContent>
                {isEnabled ? "Modo de demonstração ativado" : "Ativar modo de demonstração"}
              </TooltipContent>
            </Tooltip>

            {showSettings && isEnabled && (
              <Button variant="ghost" size="icon" className="h-6 w-6 ml-1" onClick={() => setIsDialogOpen(true)}>
                <Settings className="h-3 w-3" />
              </Button>
            )}
          </TooltipProvider>
        )
    }
  }

  return (
    <>
      {renderToggle()}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Configurações do Modo de Demonstração</DialogTitle>
            <DialogDescription>Personalize as restrições e comportamentos do modo de demonstração.</DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Permissões</h3>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="allow-creating"
                  checked={config.restrictions?.allowCreating}
                  onCheckedChange={(checked) => updateConfig("allowCreating", checked)}
                />
                <label
                  htmlFor="allow-creating"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Permitir criação de novos itens
                </label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="allow-editing"
                  checked={config.restrictions?.allowEditing}
                  onCheckedChange={(checked) => updateConfig("allowEditing", checked)}
                />
                <label
                  htmlFor="allow-editing"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Permitir edição de itens
                </label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="allow-deleting"
                  checked={config.restrictions?.allowDeleting}
                  onCheckedChange={(checked) => updateConfig("allowDeleting", checked)}
                />
                <label
                  htmlFor="allow-deleting"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Permitir exclusão de itens
                </label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="allow-exporting"
                  checked={config.restrictions?.allowExporting}
                  onCheckedChange={(checked) => updateConfig("allowExporting", checked)}
                />
                <label
                  htmlFor="allow-exporting"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Permitir exportação de dados
                </label>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-medium">Limites</h3>

              <div className="grid grid-cols-2 items-center gap-4">
                <Label htmlFor="max-items">Máximo de itens por coleção</Label>
                <input
                  id="max-items"
                  type="number"
                  min="1"
                  max="100"
                  value={config.restrictions?.maxItems || 10}
                  onChange={(e) => updateConfig("maxItems", Number.parseInt(e.target.value))}
                  className="col-span-1 h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancelar
            </Button>
            <Button
              onClick={() => {
                if (isEnabled) {
                  // Atualizar configuração se já estiver ativado
                  enable(config)
                }
                setIsDialogOpen(false)
              }}
            >
              Salvar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
