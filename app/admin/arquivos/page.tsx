import { AdminHeader } from "@/components/admin/admin-header"
import FilesClient from "./client"

export default function FilesPage() {
  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <AdminHeader
        title="Gerenciador de Arquivos"
        description="Gerencie todos os seus arquivos e pastas em um só lugar"
        icon="files"
      />
      <div className="container mx-auto px-4 py-6">
        <FilesClient />
      </div>
    </div>
  )
}
