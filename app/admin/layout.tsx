"use client"

import type React from "react"
import { OfflineIndicator } from "@/components/offline-indicator"
import { useState } from "react"
import { ExportImportDialog } from "@/components/export-import-dialog"
import { Download, Upload } from "lucide-react"

interface AdminLayoutProps {
  children: React.ReactNode
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [showExportImportDialog, setShowExportImportDialog] = useState(false)

  return (
    <div className="flex h-screen bg-gray-50 flex-col">
      {/* Main Content */}
      <div className="flex-1 p-4">
        {children}
        <OfflineIndicator />
      </div>

      {/* Floating Action Button for Export/Import */}
      <button
        onClick={() => setShowExportImportDialog(true)}
        className="fixed bottom-6 right-6 p-3 bg-[#4b7bb5] text-white rounded-full shadow-lg flex items-center justify-center"
        aria-label="Exportar ou Importar"
      >
        <div className="flex items-center gap-1">
          <Download className="h-5 w-5" />
          <Upload className="h-5 w-5" />
        </div>
      </button>

      <ExportImportDialog open={showExportImportDialog} onOpenChange={setShowExportImportDialog} />
    </div>
  )
}
