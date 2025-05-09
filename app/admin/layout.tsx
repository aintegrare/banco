import type React from "react"
import { AppDock } from "@/components/layout/app-dock"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  // Verificar se estamos na página de login
  const isLoginPage = typeof window !== "undefined" && window.location.pathname.includes("/admin/login")

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow pb-16">{children}</main>
      {/* Só mostrar o AppDock se não estivermos na página de login */}
      {!isLoginPage && <AppDock />}
    </div>
  )
}
