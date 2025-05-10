import { PageHeader } from "@/components/layout/page-header"
import { ClientForm } from "@/components/clients/client-form"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function NewClientPage() {
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-2">
        <Link href="/clientes" className="text-[#4b7bb5] hover:text-[#3d649e] flex items-center">
          <ArrowLeft className="mr-1 h-4 w-4" />
          Voltar para lista de clientes
        </Link>
      </div>

      <PageHeader title="Novo Cliente" description="Adicione um novo cliente ao sistema" />

      <div className="mt-6">
        <ClientForm />
      </div>
    </div>
  )
}
