import { PageHeader } from "@/components/layout/page-header"

export default function ClienteDetalhesPage({ params }: { params: { id: string } }) {
  return (
    <div className="container mx-auto px-4 py-8">
      <PageHeader
        title="Detalhes do Cliente"
        description="Visualize e edite as informações do cliente"
        backButton={{
          href: "/admin/clientes",
          label: "Voltar para Clientes",
        }}
      />

      <div className="mt-8 bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          {params.id === "1" ? "Empresa ABC" : params.id === "2" ? "Empresa XYZ" : "Empresa 123"}
        </h2>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Informações Básicas</h3>
            <div className="mt-4 space-y-3">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Setor</p>
                <p className="text-base text-gray-900 dark:text-gray-100">
                  {params.id === "1" ? "Tecnologia" : params.id === "2" ? "Varejo" : "Saúde"}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Contato Principal</p>
                <p className="text-base text-gray-900 dark:text-gray-100">contato@empresa.com</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Telefone</p>
                <p className="text-base text-gray-900 dark:text-gray-100">(11) 99999-9999</p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Projetos</h3>
            <div className="mt-4 space-y-3">
              <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-md">
                <p className="text-base font-medium text-gray-900 dark:text-gray-100">Projeto Website</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Em andamento</p>
              </div>
              <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-md">
                <p className="text-base font-medium text-gray-900 dark:text-gray-100">Projeto SEO</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Concluído</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Notas</h3>
          <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-md">
            <p className="text-base text-gray-900 dark:text-gray-100">
              Cliente desde janeiro de 2023. Tem interesse em expandir para marketing de conteúdo no próximo trimestre.
            </p>
          </div>
        </div>

        <div className="mt-8 flex justify-end space-x-4">
          <a
            href={`/admin/clientes/${params.id}/editar`}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Editar Cliente
          </a>
        </div>
      </div>
    </div>
  )
}
