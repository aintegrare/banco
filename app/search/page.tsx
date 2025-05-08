import { SearchInterface } from "@/components/search-interface"
import { PageHeader } from "@/components/layout/page-header"

export default function SearchPage() {
  return (
    <div className="container mx-auto px-4 py-6">
      <PageHeader
        title="Busca Inteligente"
        description="Encontre informações em documentos e obtenha respostas baseadas em IA"
      />

      <div className="mt-6">
        <SearchInterface />
      </div>
    </div>
  )
}
