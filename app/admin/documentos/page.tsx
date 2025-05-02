import { DocumentMetadataManager } from "@/components/admin/document-metadata-manager"

export default function DocumentsPage() {
  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">Gerenciamento de Documentos</h1>
      <DocumentMetadataManager />
    </div>
  )
}
