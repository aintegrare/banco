import { DocumentProcessor } from "@/components/admin/document-processor"
import { DocumentList } from "@/components/admin/document-list"
import { DocumentDiagnostic } from "@/components/admin/document-diagnostic"
import Link from "next/link"
import { FileText, Upload, Settings, Search } from "lucide-react"

export default function AdminPage() {
  return (
    <div className="min-h-screen bg-[#f2f1ef]">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-[#4072b0] mb-6">Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100 mr-4">
                <FileText className="h-6 w-6 text-[#4b7bb5]" />
              </div>
              <div>
                <p className="text-gray-500 text-sm">Documentos</p>
                <p className="text-2xl font-bold text-gray-800">12</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100 mr-4">
                <Search className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-gray-500 text-sm">Buscas</p>
                <p className="text-2xl font-bold text-gray-800">48</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-purple-100 mr-4">
                <Upload className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-gray-500 text-sm">Uploads</p>
                <p className="text-2xl font-bold text-gray-800">5</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-yellow-100 mr-4">
                <Settings className="h-6 w-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-gray-500 text-sm">Configurações</p>
                <p className="text-2xl font-bold text-gray-800">Ativas</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-[#4072b0]">Ações Rápidas</h2>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Link
                href="/admin/arquivos"
                className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
              >
                <Upload className="h-8 w-8 text-[#4b7bb5] mb-2" />
                <span className="text-sm text-gray-600">Upload de Arquivos</span>
              </Link>
              <Link
                href="/admin/configuracoes"
                className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
              >
                <Settings className="h-8 w-8 text-[#4b7bb5] mb-2" />
                <span className="text-sm text-gray-600">Configurações</span>
              </Link>
              <Link
                href="/"
                className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
              >
                <Search className="h-8 w-8 text-[#4b7bb5] mb-2" />
                <span className="text-sm text-gray-600">Interface de Busca</span>
              </Link>
              <div className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                <FileText className="h-8 w-8 text-[#4b7bb5] mb-2" />
                <span className="text-sm text-gray-600">Ver Estatísticas</span>
              </div>
            </div>
          </div>

          <DocumentProcessor />
        </div>

        <div className="mb-6">
          <DocumentDiagnostic />
        </div>

        <DocumentList />
      </div>
    </div>
  )
}
