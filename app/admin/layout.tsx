"use client"

import type React from "react"
import { OfflineIndicator } from "@/components/offline-indicator"
import { useState, useEffect } from "react"
import { ExportImportDialog } from "@/components/export-import-dialog"
import { Download, Upload } from "lucide-react"
import { getSupabaseClient } from "@/lib/supabase/client"
import { useRouter, usePathname } from "next/navigation"
import { env } from "@/lib/env"
import { DemoModeToggle } from "@/components/demo-mode-toggle"
import { AppDock } from "@/components/layout/app-dock"

interface AdminLayoutProps {
  children: React.ReactNode
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [showExportImportDialog, setShowExportImportDialog] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  // Verificar se o usuário está autenticado
  useEffect(() => {
    const checkAuth = async () => {
      try {
        setIsLoading(true)

        // Verificar se estamos em modo de demonstração
        const demoMode = localStorage.getItem("demoMode") === "true"

        // Se estamos em modo de demonstração, não precisamos verificar autenticação
        if (demoMode) {
          console.log("Modo de demonstração ativo, ignorando verificação de autenticação")
          setIsAuthenticated(true)
          setIsLoading(false)
          return
        }

        // Verificar se as variáveis do Supabase estão configuradas
        if (!env.isSupabaseConfigured()) {
          console.warn("Configuração do Supabase não encontrada, ativando modo de demonstração")
          localStorage.setItem("demoMode", "true")
          setIsAuthenticated(true)
          setIsLoading(false)
          return
        }

        // Tentar obter a sessão do Supabase
        const supabase = getSupabaseClient()
        const {
          data: { session },
        } = await supabase.auth.getSession()

        // Se não estiver na página de login e não estiver autenticado, redirecionar
        if (!session && !pathname.includes("/admin/login")) {
          router.push("/admin/login")
        } else {
          setIsAuthenticated(!!session)
        }
      } catch (error) {
        console.error("Erro ao verificar autenticação:", error)
        // Em caso de erro, ativar modo de demonstração
        localStorage.setItem("demoMode", "true")
        setIsAuthenticated(true)
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [pathname, router])

  // Não mostrar nada enquanto verifica autenticação
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#4b7bb5]"></div>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-gray-50 flex-col">
      {/* Main Content */}
      <div className="flex-1 p-4">
        {children}
        <OfflineIndicator />
        {isAuthenticated && !pathname.includes("/admin/login") && <DemoModeToggle />}
      </div>

      {/* App Dock - só mostrar se autenticado */}
      {isAuthenticated && !pathname.includes("/admin/login") && <AppDock />}

      {/* Floating Action Button for Export/Import - só mostrar se autenticado */}
      {isAuthenticated && !pathname.includes("/admin/login") && (
        <button
          onClick={() => setShowExportImportDialog(true)}
          className="fixed bottom-6 right-6 p-3 bg-[#4b7bb5] text-white rounded-full shadow-lg flex items-center justify-center z-40"
          aria-label="Exportar ou Importar"
        >
          <div className="flex items-center gap-1">
            <Download className="h-5 w-5" />
            <Upload className="h-5 w-5" />
          </div>
        </button>
      )}

      <ExportImportDialog open={showExportImportDialog} onOpenChange={setShowExportImportDialog} />
    </div>
  )
}
