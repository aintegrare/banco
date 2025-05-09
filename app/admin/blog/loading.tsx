import { PageHeader } from "@/components/layout/page-header"

export default function AdminBlogLoading() {
  return (
    <div className="min-h-screen bg-[#f2f1ef]">
      <PageHeader title="Gerenciamento do Blog" description="Carregando o painel de gerenciamento do blog..." />
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-sm p-6 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4b7bb5] mx-auto"></div>
          <p className="mt-4 text-[#4b7bb5]">Carregando o painel de gerenciamento do blog...</p>
        </div>
      </div>
    </div>
  )
}
