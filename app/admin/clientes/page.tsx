import { PageHeader } from "@/components/layout/page-header"

export default function ClientesPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <PageHeader title="Clientes" description="Gerencie seus clientes e suas informações" />

      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Cliente 1 */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Empresa ABC</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Tecnologia</p>
          <div className="mt-4 flex justify-between items-center">
            <span className="text-sm font-medium text-blue-600 dark:text-blue-400">5 projetos</span>
            <a
              href="/admin/clientes/1"
              className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline"
            >
              Ver detalhes
            </a>
          </div>
        </div>

        {/* Cliente 2 */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Empresa XYZ</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Varejo</p>
          <div className="mt-4 flex justify-between items-center">
            <span className="text-sm font-medium text-blue-600 dark:text-blue-400">3 projetos</span>
            <a
              href="/admin/clientes/2"
              className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline"
            >
              Ver detalhes
            </a>
          </div>
        </div>

        {/* Cliente 3 */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Empresa 123</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Saúde</p>
          <div className="mt-4 flex justify-between items-center">
            <span className="text-sm font-medium text-blue-600 dark:text-blue-400">2 projetos</span>
            <a
              href="/admin/clientes/3"
              className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline"
            >
              Ver detalhes
            </a>
          </div>
        </div>
      </div>

      <div className="mt-8 flex justify-end">
        <a
          href="/admin/clientes/novo"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Novo Cliente
        </a>
      </div>
    </div>
  )
}
