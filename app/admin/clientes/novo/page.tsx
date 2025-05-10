import { PageHeader } from "@/components/layout/page-header"

export default function NovoClientePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <PageHeader
        title="Novo Cliente"
        description="Adicione um novo cliente ao sistema"
        backButton={{
          href: "/admin/clientes",
          label: "Voltar para Clientes",
        }}
      />

      <div className="mt-8 bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <form>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="nome" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Nome da Empresa
              </label>
              <input
                type="text"
                id="nome"
                name="nome"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>

            <div>
              <label htmlFor="setor" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Setor
              </label>
              <select
                id="setor"
                name="setor"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              >
                <option value="tecnologia">Tecnologia</option>
                <option value="saude">Saúde</option>
                <option value="educacao">Educação</option>
                <option value="varejo">Varejo</option>
                <option value="financas">Finanças</option>
                <option value="outro">Outro</option>
              </select>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Email de Contato
              </label>
              <input
                type="email"
                id="email"
                name="email"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>

            <div>
              <label htmlFor="telefone" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Telefone
              </label>
              <input
                type="tel"
                id="telefone"
                name="telefone"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>
          </div>

          <div className="mt-6">
            <label htmlFor="endereco" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Endereço
            </label>
            <input
              type="text"
              id="endereco"
              name="endereco"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>

          <div className="mt-6">
            <label htmlFor="notas" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Notas
            </label>
            <textarea
              id="notas"
              name="notas"
              rows={4}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            ></textarea>
          </div>

          <div className="mt-8 flex justify-end">
            <a
              href="/admin/clientes"
              className="px-4 py-2 mr-4 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors"
            >
              Cancelar
            </a>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Salvar Cliente
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
