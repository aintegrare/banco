"use client"

import { useState } from "react"
import { FileUploader } from "@/components/admin/file-uploader"
import { FileList } from "@/components/admin/file-list"
import { PageHeader } from "@/components/layout/page-header"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card } from "@/components/ui/card"

export default function ArquivosPage() {
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  const handleUploadSuccess = () => {
    // Incrementar o contador para forçar a atualização da lista
    setRefreshTrigger((prev) => prev + 1)
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <PageHeader title="Gerenciamento de Arquivos" description="Faça upload, visualize e gerencie seus arquivos." />

      <Tabs defaultValue="explorer" className="mt-6">
        <TabsList className="mb-4">
          <TabsTrigger value="explorer">Explorador de Arquivos</TabsTrigger>
          <TabsTrigger value="upload">Upload de Arquivos</TabsTrigger>
        </TabsList>

        <TabsContent value="explorer" className="mt-0">
          <FileList key={refreshTrigger} />
        </TabsContent>

        <TabsContent value="upload" className="mt-0">
          <Card className="p-4">
            <FileUploader onUploadSuccess={handleUploadSuccess} />
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
