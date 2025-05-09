import type React from "react"
import { AppDock } from "@/components/layout/app-dock"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  // Layout simplificado para evitar problemas de renderização
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow pb-16">{children}</main>
      <AppDock />
    </div>
  )
}
