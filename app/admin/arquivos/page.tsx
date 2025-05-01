import { FileUploader } from "@/components/admin/file-uploader"
import { FileList } from "@/components/admin/file-list"

export default function ArquivosPage() {
  return (
    <div className="min-h-screen bg-[#f2f1ef]">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-[#4072b0] mb-6">Gerenciamento de Arquivos</h1>

        <div className="mb-6">
          <p className="text-gray-600 mb-4">
            Faça upload de documentos para serem processados e indexados pelo sistema de busca. Os arquivos são
            armazenados no Bunny.net e podem ser acessados a qualquer momento.
          </p>
        </div>

        <div className="grid md:grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <FileUploader />
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-bold text-[#4072b0] mb-4">Informações de Armazenamento</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-700">Tipos de Arquivos Suportados</h3>
                  <ul className="mt-1 text-sm text-gray-600 list-disc list-inside">
                    <li>PDF - Documentos e eBooks</li>
                    <li>DOC/DOCX - Documentos do Microsoft Word</li>
                    <li>TXT - Arquivos de texto simples</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-700">Limites</h3>
                  <ul className="mt-1 text-sm text-gray-600 list-disc list-inside">
                    <li>Tamanho máximo por arquivo: 10MB</li>
                    <li>Processamento de texto: até 100.000 caracteres por documento</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        <FileList />
      </div>
    </div>
  )
}
