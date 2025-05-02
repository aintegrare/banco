"use client"

import { useState } from "react"
import { FileUploader } from "@/components/admin/file-uploader"
import { FileList } from "@/components/admin/file-list"
import { PageHeader } from "@/components/layout/page-header"

export default function ArquivosPage() {
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  const handleUploadSuccess = () => {
    // Incrementar o contador para forçar a atualização da lista
    setRefreshTrigger((prev) => prev + 1)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <PageHeader title="Gerenciamento de Arquivos" description="Faça upload, visualize e gerencie seus arquivos." />

      <div className="mt-8 space-y-8">
        <FileUploader onUploadSuccess={handleUploadSuccess} />
        <FileList key={refreshTrigger} />
      </div>
    </div>
  )
}
