import { FileExplorer } from "@/components/admin/file-explorer"
import { PageHeader } from "@/components/layout/page-header"

export default function ArquivosPage() {
  return (
    <div className="min-h-screen bg-[#f2f1ef] pb-20">
      <PageHeader
        title="Gerenciamento de Arquivos"
        description="Gerencie todos os documentos e arquivos do sistema"
        icon="file"
      />

      <div className="container mx-auto px-4 py-6">
        <FileExplorer />
      </div>
    </div>
  )
}
