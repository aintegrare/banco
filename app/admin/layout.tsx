import type React from "react"
import { AppDock } from "@/components/layout/app-dock"
// Importar o NotificationProvider
import { NotificationProvider } from "@/components/admin/notification-manager"
import { inter } from "@/app/ui/fonts"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  // Verificar se estamos na página de login
  const isLoginPage = typeof window !== "undefined" && window.location.pathname.includes("/admin/login")

  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <NotificationProvider>
          <div className="min-h-screen flex flex-col">
            <main className="flex-grow pb-16">{children}</main>
            {/* Só mostrar o AppDock se não estivermos na página de login */}
            {!isLoginPage && <AppDock />}
          </div>
        </NotificationProvider>
      </body>
    </html>
  )
}
