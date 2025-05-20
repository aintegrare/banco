"use client"

import { Suspense } from "react"
import dynamic from "next/dynamic"
import { Loader2 } from "lucide-react"

// Importar o componente FileExplorer dinamicamente com SSR desativado
const FileExplorerClient = dynamic(() => import("@/components/admin/file-explorer-client"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-64">
      <Loader2 className="h-8 w-8 text-[#4b7bb5] animate-spin" />
      <span className="ml-2 text-gray-600">Carregando gerenciador de arquivos...</span>
    </div>
  ),
})

export default function FilesClient() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 text-[#4b7bb5] animate-spin" />
          <span className="ml-2 text-gray-600">Carregando...</span>
        </div>
      }
    >
      <FileExplorerClient />
    </Suspense>
  )
}
