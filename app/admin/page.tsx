import { PageHeader } from "@/components/layout/page-header"

export default function AdminDashboard() {
  return (
    <div className="container mx-auto">
      <PageHeader title="Dashboard" description="Bem-vindo ao painel administrativo da Integrare" />

      <div className="grid grid-cols-1 gap-6 p-4 sm:p-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Conteúdo do dashboard */}
        <div className="rounded-lg border bg-white p-6 shadow-sm">
          <h2 className="text-lg font-medium text-[#4b7bb5]">Projetos Ativos</h2>
          <p className="mt-2 text-3xl font-bold">12</p>
        </div>

        <div className="rounded-lg border bg-white p-6 shadow-sm">
          <h2 className="text-lg font-medium text-[#4b7bb5]">Tarefas Pendentes</h2>
          <p className="mt-2 text-3xl font-bold">24</p>
        </div>

        <div className="rounded-lg border bg-white p-6 shadow-sm">
          <h2 className="text-lg font-medium text-[#4b7bb5]">Documentos</h2>
          <p className="mt-2 text-3xl font-bold">156</p>
        </div>
      </div>
    </div>
  )
}
