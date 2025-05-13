import Link from "next/link"

export default function FerramentasPage() {
  return (
    <div className="min-h-screen bg-[#f2f1ef]">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-[#4072b0] mb-6">Ferramentas de Diagnóstico</h1>

        <div className="grid md:grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-lg font-semibold text-[#4072b0] mb-2">Extrator de PDF</h3>
            <p className="text-gray-600 mb-4">
              Teste a extração de texto de documentos PDF para verificar se o processamento está funcionando
              corretamente.
            </p>
            <Link
              href="/admin/ferramentas/pdf-extractor"
              className="inline-flex items-center px-4 py-2 bg-[#4072b0] text-white rounded-md hover:bg-[#3d649e]"
            >
              Acessar Ferramenta
            </Link>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-lg font-semibold text-[#4072b0] mb-2">Diagnóstico de URL</h3>
            <p className="text-gray-600 mb-4">
              Verifique e corrija URLs de documentos e arquivos que possam conter prefixos incorretos.
            </p>
            <Link
              href="/admin/ferramentas/diagnostico-url"
              className="inline-flex items-center px-4 py-2 bg-[#4072b0] text-white rounded-md hover:bg-[#3d649e]"
            >
              Acessar Ferramenta
            </Link>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-lg font-semibold text-[#4072b0] mb-2">Verificação de Integridade</h3>
            <p className="text-gray-600 mb-4">
              Verifique se um documento está completo e acessível, analisando seu conteúdo e metadados.
            </p>
            <Link
              href="/admin/ferramentas/verificar-documento"
              className="inline-flex items-center px-4 py-2 bg-[#4072b0] text-white rounded-md hover:bg-[#3d649e]"
            >
              Acessar Ferramenta
            </Link>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-lg font-semibold text-[#4072b0] mb-2">Diagnóstico de Tarefas</h3>
            <p className="text-gray-600 mb-4">
              Verifique e corrija problemas de acesso às tarefas no banco de dados, incluindo estrutura da tabela e
              permissões.
            </p>
            <Link
              href="/admin/ferramentas/diagnostico-tarefas"
              className="inline-flex items-center px-4 py-2 bg-[#4072b0] text-white rounded-md hover:bg-[#3d649e]"
            >
              Acessar Ferramenta
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
