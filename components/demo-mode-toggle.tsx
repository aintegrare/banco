"use client"

import { useState, useEffect } from "react"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { AlertCircle } from "lucide-react"
import { isDemoMode, enableDemoMode, disableDemoMode } from "@/lib/demo-mode"

export function DemoModeToggle() {
  const [demoMode, setDemoMode] = useState(false)

  useEffect(() => {
    setDemoMode(isDemoMode())
  }, [])

  const handleToggle = (checked: boolean) => {
    if (checked) {
      enableDemoMode()
    } else {
      disableDemoMode()
    }
    setDemoMode(checked)
  }

  return (
    <div className="fixed bottom-6 left-6 p-3 bg-white/90 backdrop-blur-sm rounded-lg shadow-md border border-gray-200 z-40 flex items-center gap-2">
      <AlertCircle className="h-4 w-4 text-yellow-500" />
      <div className="flex flex-col">
        <Label htmlFor="demo-mode" className="text-xs font-medium">
          Modo de Demonstração
        </Label>
        <span className="text-xs text-gray-500">{demoMode ? "Ativado" : "Desativado"}</span>
      </div>
      <Switch id="demo-mode" checked={demoMode} onCheckedChange={handleToggle} />
    </div>
  )
}
