import { Suspense } from "react"
import { notFound } from "next/navigation"
import SharedFolderViewer from "@/components/admin/shared-folder-viewer"

interface SharedFolderPageProps {
  params: {
    token: string
  }
  searchParams: {
    path?: string
  }
}

export default function SharedFolderPage({ params, searchParams }: SharedFolderPageProps) {
  const { token } = params
  const path = searchParams.path || ""

  if (!token) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-[#4b7bb5] mb-6">Pasta Compartilhada</h1>

        <Suspense fallback={<div className="p-8 text-center">Carregando arquivos...</div>}>
          <SharedFolderViewer token={token} initialPath={path} />
        </Suspense>
      </div>
    </div>
  )
}
