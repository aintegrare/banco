"use client"

import type React from "react"

// app/admin/layout.tsx

import { OfflineIndicator } from "@/components/offline-indicator"
import { DemoModeToggle } from "@/components/demo-mode-toggle"
import { useState } from "react"
import { ExportImportDialog } from "@/components/export-import-dialog"
import { Download, Upload } from "lucide-react"

interface AdminLayoutProps {
  children: React.ReactNode
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [showExportImportDialog, setShowExportImportDialog] = useState(false)

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200">
        <div className="h-full px-3 py-4 overflow-y-auto bg-white">
          <ul className="space-y-2 font-medium">
            <li>
              <a href="#" className="flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100 group">
                <svg
                  className="w-5 h-5 text-gray-500 group-hover:text-gray-900"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="m19.707 9.293-2-2-7-7a1 1 0 0 0-1.414 0l-7 7-2 2a1 1 0 0 0 1.414 1.414L2 10.414V18a2 2 0 0 0 2 2h3a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1h3a2 2 0 0 0 2-2v-7.586l.293.293a1 1 0 0 0 1.414-1.414Z" />
                </svg>
                <span className="ms-3">Dashboard</span>
              </a>
            </li>
            <li>
              <a href="#" className="flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100 group">
                <svg
                  className="flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 group-hover:text-gray-900"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 20 18"
                >
                  <path d="M14 2a3.963 3.963 0 0 0-1.406.289 4.019 4.019 0 0 0-1.057.852L5 7h8a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a1 1 0 0 0-2 0v10a4 4 0 0 0 4 4h10a4 4 0 0 0 4-4V9a4 4 0 0 0-4-4Z" />
                </svg>
                <span className="ms-3">Products</span>
              </a>
            </li>
            <li>
              <a href="#" className="flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100 group">
                <svg
                  className="flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 group-hover:text-gray-900"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.5 3a2.5 2.5 0 0 0-2.5 2.5v3.5h5v-3.5a2.5 2.5 0 0 0-2.5-2.5ZM17.943 12.253a1 1 0 0 0-.422-1.11l-3.257-1.11a1 1 0 0 0-.554-.089H6.28a1 1 0 0 0-.554.089l-3.257 1.11a1 1 0 0 0-.422 1.11v3.494a1 1 0 0 0 .422 1.11l3.257 1.11a1 1 0 0 0 .554.089h7.44a1 1 0 0 0 .554-.089l3.257-1.11a1 1 0 0 0 .422-1.11V12.253ZM12 15a1 1 0 0 1-2 0v-3a1 1 0 0 1 2 0v3Z" />
                </svg>
                <span className="ms-3">Billing</span>
              </a>
            </li>
            <li>
              <a href="#" className="flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100 group">
                <svg
                  className="flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 group-hover:text-gray-900"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M10 .5a9.5 9.5 0 0 0-9.5 9.5v8a1 1 0 0 0 1 1h17a1 1 0 0 0 1-1v-8A9.5 9.5 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h4a1 1 0 0 1 0 2h-1v3h1a1 1 0 0 1 0 2Z" />
                </svg>
                <span className="ms-3">Users</span>
              </a>
            </li>
          </ul>
          <div className="px-3 py-2">
            <div className="space-y-1">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Ferramentas</h3>
              <button
                onClick={() => setShowExportImportDialog(true)}
                className="flex items-center gap-2 w-full text-sm px-3 py-2 rounded-md hover:bg-gray-100"
              >
                <div className="flex items-center gap-2">
                  <Download className="h-4 w-4" />
                  <Upload className="h-4 w-4" />
                </div>
                <span>Exportar/Importar</span>
              </button>
              <div className="px-3 py-2">
                <DemoModeToggle />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-4">
        {children}
        <OfflineIndicator />
      </div>
      <ExportImportDialog open={showExportImportDialog} onOpenChange={setShowExportImportDialog} />
    </div>
  )
}
