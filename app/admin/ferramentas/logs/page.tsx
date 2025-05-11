import { LogViewer } from "@/components/admin/log-viewer"

export default function LogsPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Logs do Sistema</h1>
      <p className="mb-6 text-gray-600">
        Esta página exibe os logs do sistema, permitindo monitorar operações e diagnosticar problemas. Os logs são
        armazenados apenas na memória e são perdidos quando a página é recarregada.
      </p>

      <LogViewer />
    </div>
  )
}
